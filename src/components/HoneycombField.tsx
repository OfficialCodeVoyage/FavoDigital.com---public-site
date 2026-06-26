"use client";

/*
 * HoneycombField — "First Light over the Hive" immersive hero (spreading-hive).
 *
 * One fixed 100dvh screen. On load the hive CONSTRUCTS itself — cells pop in from
 * the centre outward with a light-sweep (the loading "wow"). At rest a few "ember"
 * cells breathe. You SEED heat by tapping or dragging across cells (and keyboard
 * Enter/Space); warmth then SPREADS to neighbours on its own, and moving the
 * cursor FANS it (accelerates the spread locally). Cross the ~26%-capped threshold
 * and First Light fires — the headline ignites and "in your favo⬡r." resolves with
 * the Seal. The cursor proximity glow (per-cell `--w`) shows where you're fanning.
 *
 * The folded SEO band is HiveBand; the opening veil is Preloader. Reduced motion is
 * fully honoured (no construction/auto-spread; seeding warms a small cluster).
 */

import { Fragment, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import styles from "./HoneycombField.module.css";
import { site } from "@/lib/site";
import { HexText } from "./HexGlyph";
import { Preloader } from "./Preloader";
import { HiveBand } from "./HiveBand";

interface CellRecord {
  el: HTMLButtonElement;
  cx: number;
  cy: number;
  w: number;
  warm: boolean;
  neighbors: CellRecord[];
}

const PROXIMITY_RADIUS = 230; // cursor glow reach
const LERP = 0.16; // per-frame approach → heat-memory wake
const RIPPLE_MS = 650;
const RIPPLE_REACH = 420;
const RIPPLE_BAND = 90;
const SPREAD_MS = 120; // spread-simulation tick
const BASE_SPREAD = 0.085; // per-frontier-cell chance to warm a neighbour each tick
const FAN_RADIUS = 210; // cursor "fan the flames" reach
const FAN_BOOST = 0.6; // added spread chance at the cursor
const BOOT_MIN = 450; // floor — let the seed-spark read before the hive builds
const BOOT_MAX = 900; // cap — never let a slow font load stall the splash

function cellSizeFor(width: number): number {
  if (width < 560) return 58;
  if (width < 900) return 70;
  if (width < 1280) return 84;
  return 96;
}

// ── First Light "bee flight" — timing ───────────────────────────────────────
// At threshold a single luminous mote arcs from the player's spark to the seal;
// its landing fires First Light + the bloom. One transient composited layer.
const BEE_MS = 1400; // flight duration to the seal
const BEE_FADE = 900; // mote lingers into the seal-press (matches sealPress delay)
const BEE_APEX = 0.24; // arc bow as a fraction of the flight span

export function HoneycombField() {
  const prefersReducedMotion = useReducedMotion();

  const stageRef = useRef<HTMLElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const meterFillRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLElement>(null);
  const beeLayerRef = useRef<HTMLDivElement>(null);

  // The live percent + fill are written imperatively (see updateMeter), so warming
  // never re-renders. `nearLight` flips once (at 85%) to swap the hint copy.
  const [nearLight, setNearLight] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [booted, setBooted] = useState(false);
  const [announce, setAnnounce] = useState("");

  const resetRef = useRef<() => void>(() => {});
  const reducedRef = useRef(prefersReducedMotion);
  useEffect(() => {
    reducedRef.current = prefersReducedMotion;
  }, [prefersReducedMotion]);
  const bootedRef = useRef(false);
  useEffect(() => {
    bootedRef.current = booted;
  }, [booted]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const stage = stageRef.current;
    const field = fieldRef.current;
    const meterFill = meterFillRef.current;
    if (!stage || !field || !meterFill) return;
    const beeLayer = beeLayerRef.current;

    const cells: CellRecord[] = [];
    const cellByEl = new Map<HTMLButtonElement, CellRecord>();
    const frontier = new Set<CellRecord>();
    let totalCells = 0;
    let warmedCount = 0;
    let threshold = 0;
    let isRevealed = false;
    let nearLatched = false;
    let cellSize = 96;
    let lastMilestone = 0;
    let lastWarm = { x: stage.clientWidth / 2, y: stage.clientHeight * 0.45 };
    // Bee-flight state — an rAF loop + one transient mote element.
    let beeRaf = 0;
    let beeLanded = false;
    let mote: HTMLDivElement | null = null;

    // Cursor + glow-loop state.
    let lastX = stage.clientWidth / 2;
    let lastY = stage.clientHeight * 0.42;
    let raf = 0;
    let running = false;
    let pointerSeen = false;
    let seeding = false;
    let ripple: { x: number; y: number; t0: number } | null = null;
    // Cached stage rect — avoids a forced layout read on every pointermove.
    let stageRect = stage.getBoundingClientRect();

    const timeouts = new Set<ReturnType<typeof setTimeout>>();
    const trackedTimeout = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        timeouts.delete(id);
        fn();
      }, ms);
      timeouts.add(id);
      return id;
    };
    const clearTrackedTimeouts = () => {
      timeouts.forEach((id) => clearTimeout(id));
      timeouts.clear();
    };

    const measureCenters = () => {
      const rect = stage.getBoundingClientRect();
      for (const o of cells) {
        const r = o.el.getBoundingClientRect();
        o.cx = r.left - rect.left + r.width / 2;
        o.cy = r.top - rect.top + r.height / 2;
      }
    };

    const updateMeter = () => {
      const next = threshold
        ? Math.min(100, Math.round((warmedCount / threshold) * 100))
        : 0;
      // Imperative writes — no per-cell re-render: composited bar (scaleX) + counter.
      meterFill.style.setProperty("--p", (next / 100).toFixed(3));
      if (pctRef.current) pctRef.current.textContent = String(next);
      if (next >= 85 && !nearLatched) {
        nearLatched = true;
        setNearLight(true);
      }
      // Throttle screen-reader output to milestones (not every percent).
      const milestone = Math.floor(next / 25) * 25;
      if (milestone > lastMilestone) {
        lastMilestone = milestone;
        if (milestone === 25) setAnnounce("A quarter of the hive is warm.");
        else if (milestone === 50) setAnnounce("Half the hive is warm.");
        else if (milestone === 75) setAnnounce("The hive is nearing first light.");
      }
    };

    // ── Cursor glow loop: lerp each dormant cell's --w toward proximity + ripple ──
    const tick = (now: number) => {
      raf = 0;
      const r2 = PROXIMITY_RADIUS * PROXIMITY_RADIUS;
      let active = false;
      let rippleAlive = false;
      if (ripple) {
        if (now - ripple.t0 <= RIPPLE_MS) rippleAlive = true;
        else ripple = null;
      }
      for (const o of cells) {
        if (o.warm) {
          if (o.w !== 0) {
            o.w = 0;
            o.el.style.setProperty("--w", "0");
          }
          continue;
        }
        let target = 0;
        const dx = o.cx - lastX;
        const dy = o.cy - lastY;
        const d2 = dx * dx + dy * dy;
        if (d2 < r2) {
          const t = 1 - Math.sqrt(d2) / PROXIMITY_RADIUS;
          target = t * t;
        }
        if (rippleAlive && ripple) {
          const prog = (now - ripple.t0) / RIPPLE_MS;
          const front = prog * RIPPLE_REACH;
          const rdx = o.cx - ripple.x;
          const rdy = o.cy - ripple.y;
          const rd = Math.sqrt(rdx * rdx + rdy * rdy);
          const band = Math.max(0, 1 - Math.abs(rd - front) / RIPPLE_BAND);
          const rv = band * (1 - prog) * 0.55;
          if (rv > target) target = rv;
        }
        let nv = o.w + (target - o.w) * LERP;
        if (Math.abs(nv - target) < 0.004) nv = target;
        if (Math.abs(nv - o.w) > 0.002) {
          o.w = nv;
          o.el.style.setProperty("--w", nv.toFixed(3));
        }
        if (nv > 0.002 || target > 0.002) active = true;
      }
      if (active || rippleAlive) raf = requestAnimationFrame(tick);
      else running = false;
    };
    const kick = () => {
      if (reducedRef.current || running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const warmCell = (rec: CellRecord, seed: boolean) => {
      // Once lit, cell presses no-op — only the reset re-activates the hive.
      if (rec.warm || isRevealed) return;
      rec.warm = true;
      warmedCount++;
      rec.el.classList.add(styles.warm);
      rec.el.style.setProperty("--w", "0");
      rec.el.setAttribute("aria-pressed", "true");
      rec.el.setAttribute("aria-label", "Hive cell — warm");
      lastWarm = { x: rec.cx, y: rec.cy };

      if (seed && !reducedRef.current) {
        rec.el.classList.add(styles.pulse);
        trackedTimeout(() => rec.el.classList.remove(styles.pulse), 480);
      }
      // Maintain the spread frontier.
      let hasDormant = false;
      for (const n of rec.neighbors) {
        if (!n.warm) {
          hasDormant = true;
          break;
        }
      }
      if (hasDormant) frontier.add(rec);

      updateMeter();

      // Reduced motion: no animated auto-spread — a seed warms its cluster at once.
      if (seed && reducedRef.current) {
        for (const n of rec.neighbors) warmCell(n, false);
      }
      if (warmedCount >= threshold && !isRevealed) doReveal();
    };

    // The spread simulation — warmth radiates from the frontier; the cursor fans it.
    const spreadTick = () => {
      if (isRevealed || reducedRef.current || frontier.size === 0) return;
      const picks: CellRecord[] = [];
      for (const c of frontier) {
        const dormant = c.neighbors.filter((n) => !n.warm);
        if (dormant.length === 0) {
          frontier.delete(c);
          continue;
        }
        let chance = BASE_SPREAD;
        if (pointerSeen) {
          const d = Math.hypot(c.cx - lastX, c.cy - lastY);
          if (d < FAN_RADIUS) chance += (1 - d / FAN_RADIUS) * FAN_BOOST;
        }
        if (Math.random() < chance) {
          picks.push(dormant[(Math.random() * dormant.length) | 0]);
        }
      }
      for (const p of picks) warmCell(p, false);
    };

    const FIRST_LIGHT_SAY = "First light — FavoDigital, launching 2026.";
    const doReveal = () => {
      isRevealed = true;
      // The bee flies first; its landing fires setRevealed + announce + the bloom.
      // Reduced motion skips the flight and reveals instantly (info-equivalent path).
      if (!reducedRef.current) {
        beeFlight();
        return;
      }
      setRevealed(true);
      setAnnounce(FIRST_LIGHT_SAY);
    };

    // First Light — a constant-velocity ignition front, distance-ordered from an
    // origin (default: last-warmed cell; the bee passes its landing point). Capped so
    // it never floods. Purely visual: no warmedCount / updateMeter / aria / --w write.
    const bloomCascade = (origin?: { x: number; y: number }) => {
      const { x, y } = origin ?? lastWarm;
      const remaining: { c: CellRecord; d: number }[] = [];
      for (const c of cells) {
        if (!c.warm) {
          remaining.push({ c, d: Math.hypot(c.cx - x, c.cy - y) });
        }
      }
      remaining.sort((a, b) => a.d - b.d);
      const cap = Math.min(remaining.length, Math.round(cells.length * 0.34));
      for (let j = 0; j < cap; j++) {
        const item = remaining[j];
        trackedTimeout(() => {
          if (!item.c.warm) {
            item.c.warm = true;
            item.c.el.classList.add(styles.warm);
          }
        }, Math.min(900, item.d / 2.2));
      }
    };

    // ── Bee flight — one transient composited mote arcs from the player's spark to
    // the seal; its landing IS First Light. No cell scan, no per-frame layout read
    // (the seal + lastWarm are measured once at launch). ───────────────────────────
    const landBee = (lx: number, ly: number) => {
      if (beeLanded) return;
      beeLanded = true;
      // Keep data-flying set across the reveal hand-off — .revealed hides the same
      // hint/meter, so there's no flicker; killBee clears it on reset/resize/unmount.
      if (mote) {
        mote.style.transform = "translate3d(" + lx + "px," + ly + "px,0)";
        mote.classList.add(styles.moteLand);
        const dying = mote;
        // Tracked so normal flow cleans it; killBee removes directly if a reset races.
        trackedTimeout(() => {
          dying.remove();
          if (mote === dying) mote = null;
        }, BEE_FADE);
      }
      setRevealed(true);
      setAnnounce(FIRST_LIGHT_SAY);
      if (!reducedRef.current) bloomCascade({ x: lx, y: ly }); // bloom FROM the landing
    };

    const beeFlight = () => {
      if (!beeLayer) {
        // No layer to fly in → reveal immediately (graceful; never strands the page).
        setRevealed(true);
        setAnnounce(FIRST_LIGHT_SAY);
        if (!reducedRef.current) bloomCascade();
        return;
      }
      beeLanded = false;

      const seal = stage.querySelector<HTMLElement>("." + styles.favorHex);
      const start = { x: lastWarm.x, y: lastWarm.y };
      let target = { x: stage.clientWidth * 0.16, y: stage.clientHeight * 0.82 };
      if (seal) {
        const r = seal.getBoundingClientRect();
        target = {
          x: r.left - stageRect.left + r.width / 2,
          // -8: .launch sits translateY(8px) until revealed, then rises — land where
          // the seal will SETTLE, not its hidden position.
          y: r.top - stageRect.top + r.height / 2 - 8,
        };
      }
      const span = Math.hypot(target.x - start.x, target.y - start.y);
      const topPad = Math.max(44, cellSize * 0.6);
      // Bow the arc up and over, clamped on-screen for short/mobile viewports.
      const ctrl = {
        x: (start.x + target.x) / 2,
        y: Math.max(topPad, Math.min(start.y, target.y) - BEE_APEX * span),
      };

      // Set the flight flag AFTER the layout reads above, so the [data-flying] style
      // changes aren't flushed by the seal getBoundingClientRect.
      stage.dataset.flying = "on";
      mote = document.createElement("div");
      mote.className = styles.mote;
      mote.setAttribute("aria-hidden", "true");
      beeLayer.appendChild(mote);

      const t0 = performance.now();
      let prevX = start.x;
      let prevY = start.y;
      const step = (now: number) => {
        const raw = Math.min(1, (now - t0) / BEE_MS);
        const t = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
        const mt = 1 - t;
        const x = mt * mt * start.x + 2 * mt * t * ctrl.x + t * t * target.x;
        const y = mt * mt * start.y + 2 * mt * t * ctrl.y + t * t * target.y;
        const ang = (Math.atan2(y - prevY, x - prevX) * 180) / Math.PI;
        prevX = x;
        prevY = y;
        if (mote) {
          // translate3d + rotate the whole layer = composite-only (no per-frame
          // repaint): the disc is radial-symmetric and the trail is a static child,
          // so rotating the layer orients the comet without re-rasterising the shadow.
          mote.style.transform =
            "translate3d(" + x + "px," + y + "px,0) rotate(" + ang + "deg)";
        }
        if (raw < 1) {
          beeRaf = requestAnimationFrame(step);
        } else {
          beeRaf = 0;
          landBee(target.x, target.y);
        }
      };
      beeRaf = requestAnimationFrame(step);
    };

    const killBee = () => {
      if (beeRaf) cancelAnimationFrame(beeRaf);
      beeRaf = 0;
      beeLanded = false;
      if (mote) {
        mote.remove();
        mote = null;
      }
      stage.removeAttribute("data-flying");
    };

    const onCellKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        const rec = cellByEl.get(e.currentTarget as HTMLButtonElement);
        if (rec) warmCell(rec, true);
      }
    };

    const seedAtPoint = (x: number, y: number) => {
      if (isRevealed) return; // hive's lit — ignore further cell presses
      const el = document.elementFromPoint(x, y) as HTMLButtonElement | null;
      let rec = el ? cellByEl.get(el) : undefined;
      // Hex clip-path also clips hit-testing, so a point in a hex corner/gap can
      // miss. Fall back to the nearest cell centre within ~one cell — forgiving
      // for taps/clicks (and reduced-motion users who don't drag).
      if (!rec) {
        const rect = stageRect;
        const px = x - rect.left;
        const py = y - rect.top;
        let bestD = cellSize * cellSize;
        for (const c of cells) {
          if (c.warm) continue;
          const dx = c.cx - px;
          const dy = c.cy - py;
          const d2 = dx * dx + dy * dy;
          if (d2 < bestD) {
            bestD = d2;
            rec = c;
          }
        }
      }
      if (rec && !rec.warm) warmCell(rec, true);
    };

    const onPointerDown = (e: PointerEvent) => {
      seeding = true;
      seedAtPoint(e.clientX, e.clientY);
    };
    const onPointerUp = () => {
      seeding = false;
    };
    const onPointerMove = (e: PointerEvent) => {
      lastX = e.clientX - stageRect.left;
      lastY = e.clientY - stageRect.top;
      // Once lit, freeze the cursor glow (no gameplay purpose left) and stop the
      // proximity loop — so the static legibility scrim isn't re-composited every
      // frame as the glow tracks beneath it. Reset re-arms this.
      if (isRevealed) return;
      stage.style.setProperty("--gx", lastX + "px");
      stage.style.setProperty("--gy", lastY + "px");
      if (!reducedRef.current) {
        if (!pointerSeen) {
          pointerSeen = true;
          ripple = { x: lastX, y: lastY, t0: performance.now() };
        }
        kick();
      }
      if (seeding) seedAtPoint(e.clientX, e.clientY);
    };

    const pickEmbers = () => {
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      const candidates = cells.filter(
        (c) => c.cy < H * 0.42 || (c.cx > W * 0.62 && c.cy < H * 0.62),
      );
      if (!candidates.length) return;
      const step = Math.max(1, Math.floor(candidates.length / 5));
      let placed = 0;
      for (let i = 0; i < candidates.length && placed < 5; i += step) {
        const c = candidates[i];
        c.el.classList.add(styles.ember);
        c.el.style.animationDelay = `-${(placed * 1.7).toFixed(1)}s`;
        c.el.style.animationDuration = `${(4.6 + placed * 0.5).toFixed(1)}s`;
        placed++;
      }
    };

    const buildField = () => {
      for (const o of cells) {
        o.el.removeEventListener("keydown", onCellKey as EventListener);
      }
      cells.length = 0;
      cellByEl.clear();
      frontier.clear();
      warmedCount = 0;
      lastMilestone = 0;
      field.replaceChildren();

      cellSize = cellSizeFor(stage.clientWidth);
      const gap = Math.max(4, cellSize * 0.085);
      stage.style.setProperty("--cell", cellSize + "px");
      stage.style.setProperty("--gap", gap + "px");

      const W = stage.clientWidth * 1.16;
      const H = stage.clientHeight * 1.16;
      const stepX = cellSize + gap;
      const stepY = cellSize * 1.1547 * 0.725;
      const cols = Math.ceil(W / stepX) + 2;
      const rows = Math.ceil(H / stepY) + 2;
      const settled = bootedRef.current || reducedRef.current;

      const frag = document.createDocumentFragment();
      for (let r = 0; r < rows; r++) {
        const row = document.createElement("div");
        row.className = styles.hexRow + (r % 2 ? " " + styles.odd : "");
        for (let c = 0; c < cols; c++) {
          const b = document.createElement("button");
          b.className = styles.cell;
          b.type = "button";
          b.setAttribute("aria-label", "Hive cell");
          b.style.setProperty("--w", "0");
          if (settled) {
            b.style.opacity = "1"; // skip the construction on rebuilds
            b.style.animation = "none";
          }
          row.appendChild(b);
        }
        frag.appendChild(row);
      }
      field.appendChild(frag);

      requestAnimationFrame(() => {
        const rect = stage.getBoundingClientRect();
        stageRect = rect;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const maxD = Math.hypot(cx, cy) || 1;
        const nodes = field.querySelectorAll<HTMLButtonElement>(
          "." + styles.cell,
        );
        // Pass 1 — read every rect + build records (no interleaved style writes).
        for (const node of nodes) {
          const r = node.getBoundingClientRect();
          const ccx = r.left - rect.left + r.width / 2;
          const ccy = r.top - rect.top + r.height / 2;
          const rec: CellRecord = {
            el: node,
            cx: ccx,
            cy: ccy,
            w: 0,
            warm: false,
            neighbors: [],
          };
          cells.push(rec);
          cellByEl.set(node, rec);
          node.addEventListener("keydown", onCellKey as EventListener);
        }
        // Pass 2 — write entrance delays in one batch (avoids read→write→read thrash).
        for (const rec of cells) {
          rec.el.style.setProperty(
            "--ed",
            Math.round((Math.hypot(rec.cx - cx, rec.cy - cy) / maxD) * 700) + "ms",
          );
        }
        // Precompute hex neighbours by geometry (no fragile index math).
        const nr = (cellSize + gap) * 1.28;
        const nr2 = nr * nr;
        for (let i = 0; i < cells.length; i++) {
          const a = cells[i];
          for (let j = 0; j < cells.length; j++) {
            if (i === j) continue;
            const b = cells[j];
            const dx = a.cx - b.cx;
            const dy = a.cy - b.cy;
            if (dx * dx + dy * dy <= nr2) a.neighbors.push(b);
          }
        }
        totalCells = cells.length;
        threshold = Math.max(12, Math.min(Math.round(totalCells * 0.26), 40));
        updateMeter();
        if (!reducedRef.current) pickEmbers();
      });
    };

    const resetHive = () => {
      isRevealed = false;
      warmedCount = 0;
      lastMilestone = 0;
      nearLatched = false;
      frontier.clear();
      killBee(); // cancels the flight rAF + removes the mote (clearTrackedTimeouts can't)
      setRevealed(false);
      setNearLight(false);
      setAnnounce("The hive has cooled.");
      clearTrackedTimeouts();
      for (const o of cells) {
        o.warm = false;
        o.w = 0;
        o.el.classList.remove(styles.warm, styles.pulse);
        o.el.style.setProperty("--w", "0");
        o.el.removeAttribute("aria-pressed");
        o.el.setAttribute("aria-label", "Hive cell");
      }
      updateMeter();
    };
    resetRef.current = resetHive;

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        buildField();
        isRevealed = false;
        killBee();
        // Un-latch the near-light hint so a post-reveal resize can't leave it stuck.
        nearLatched = false;
        setNearLight(false);
        setRevealed(false);
      }, 220);
    };
    const onScroll = () => {
      stageRect = stage.getBoundingClientRect();
      measureCenters();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Drop the entrance light-sweep from the layer tree once it has played — its
    // blend+filter would otherwise keep an invisible composited layer all session.
    const sweepEl = stage.querySelector<HTMLElement>("." + styles.buildSweep);
    sweepEl?.addEventListener(
      "animationend",
      () => {
        sweepEl.style.display = "none";
      },
      { once: true },
    );

    buildField();
    const spreadId = setInterval(spreadTick, SPREAD_MS);

    // Lift the seed → build the hive once fonts are ready (so the Fraunces
    // wordmark/headline don't reflow mid-entrance), floored so the seed-spark
    // reads and capped so a slow/cached font load can't stall the splash.
    if (reducedRef.current) {
      trackedTimeout(() => setBooted(true), 0);
    } else {
      const start = performance.now();
      let lifted = false;
      const lift = () => {
        if (lifted || !mountedRef.current) return;
        lifted = true;
        const waited = performance.now() - start;
        trackedTimeout(() => setBooted(true), Math.max(0, BOOT_MIN - waited));
      };
      trackedTimeout(lift, BOOT_MAX);
      const fontsReady =
        typeof document !== "undefined" && "fonts" in document
          ? document.fonts.ready
          : Promise.resolve();
      fontsReady.then(() =>
        requestAnimationFrame(() => requestAnimationFrame(lift)),
      );
    }

    return () => {
      mountedRef.current = false;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      if (resizeTimer) clearTimeout(resizeTimer);
      if (raf) cancelAnimationFrame(raf);
      killBee();
      clearInterval(spreadId);
      clearTrackedTimeouts();
      for (const o of cells) {
        o.el.removeEventListener("keydown", onCellKey as EventListener);
      }
      resetRef.current = () => {};
    };
    // Built once; the effect manages its own resize/reduced-motion via refs.
  }, []);

  const stageClassName = [
    styles.stage,
    booted ? styles.entered : "",
    revealed ? styles.revealed : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      ref={stageRef}
      className={stageClassName}
      aria-label="FavoDigital — warm the hive to reveal the launch"
    >
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.cursorGlow} aria-hidden="true" />
      <div className={styles.buildSweep} aria-hidden="true" />
      <div className={styles.fieldWrap} aria-hidden="true">
        <div ref={fieldRef} className={styles.field} />
      </div>
      <div className={styles.vignette} aria-hidden="true" />

      <div className={styles.ui}>
        <header className={styles.topbar}>
          <div className={styles.wordmark}>
            <HexText
              text={site.ui.wordmark}
              hexClassName={styles.wordmarkHex}
              plain={site.name}
            />
          </div>
          <div className={styles.status}>
            <span className={styles.statusLine}>
              <span className={styles.dot} aria-hidden="true" />
              {site.ui.statusPrimary}
            </span>
            <span className={styles.statusLine}>{site.ui.statusSecondary}</span>
            <span className={styles.statusCompact}>
              <span className={styles.dot} aria-hidden="true" />
              {site.ui.statusCompact}
            </span>
          </div>
        </header>

        <div className={styles.hero}>
          <p className={styles.eyebrow}>{site.ui.eyebrow}</p>
          <h1 className={styles.title}>
            <span className={styles.titleLine}>
              <span className={`${styles.titleInner} ${styles.ignite}`}>
                {site.ui.heroLine1}
              </span>
            </span>
            <span className={styles.titleLine}>
              <span
                className={`${styles.titleInner} ${styles.ignite} ${styles.ital}`}
              >
                {site.ui.heroLine2}
              </span>
            </span>
          </h1>
          <p className={styles.subhead}>
            {site.ui.subhead.map((seg, i) => (
              <Fragment key={i}>{seg.em ? <b>{seg.t}</b> : seg.t}</Fragment>
            ))}
          </p>

          <div className={styles.exchange}>
            <div className={styles.invite}>
              <div className={styles.hintWrap}>
                <span className={styles.hint}>
                  <span className={styles.spark} aria-hidden="true" />
                  {nearLight ? site.ui.nearHint : site.ui.ctaHint}
                </span>
                <span className={styles.subhint}>{site.ui.ctaSubHint}</span>
              </div>
              <div className={styles.meter}>
                <div className={styles.track}>
                  <div ref={meterFillRef} className={styles.fill} />
                </div>
                <span className={styles.pct}>
                  <b ref={pctRef}>0</b>%&nbsp;{site.ui.meterSuffix}
                </span>
              </div>
            </div>

            <div className={styles.launch} aria-hidden={!revealed}>
              <div className={styles.row}>
                <span className={styles.favor}>
                  <HexText
                    text={site.revealLine}
                    hexClassName={styles.favorHex}
                    plain="in your favor."
                  />
                </span>
                <span className={styles.stamp}>{site.ui.revealStamp}</span>
              </div>
              <button
                className={styles.reset}
                type="button"
                aria-label="Cool the hive and start over"
                tabIndex={revealed ? 0 : -1}
                onClick={() => resetRef.current()}
              >
                {site.ui.resetLabel}
              </button>
            </div>
          </div>
        </div>

        <HiveBand entered={booted} />
      </div>

      {/* Bee-flight mote layer — empty until First Light; above the UI (z5) so the
          mote reads over the scrim + headline; decorative + inert. */}
      <div ref={beeLayerRef} className={styles.beeLayer} aria-hidden="true" />

      {/* Polite, milestone-only announcements for screen readers. */}
      <span className="sr-only" role="status" aria-live="polite">
        {announce}
      </span>

      <Preloader hidden={booted} />
    </section>
  );
}
