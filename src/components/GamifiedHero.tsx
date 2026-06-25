import { site } from "@/lib/site";

/*
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  PLACEHOLDER — the gamified coming-soon centerpiece lands here.       │
 * │  This is intentionally a static holding visual. The interactive       │
 * │  "favo" (honeycomb) game/experience is the subject of the design pass │
 * │  and will replace the body of this component. Keep the public API     │
 * │  (a self-contained hero block) stable so page.tsx doesn't change.     │
 * └─────────────────────────────────────────────────────────────────────┘
 */
export function GamifiedHero() {
  return (
    <div className="relative isolate overflow-hidden rounded-2xl border border-ink-border bg-ink-700/60 p-8 sm:p-12">
      {/* dev-only marker so it's obvious this is a stub in preview builds */}
      <span className="absolute right-4 top-4 rounded-full border border-honey/30 bg-honey/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-honey">
        Game · coming
      </span>

      <div className="favo-rise flex flex-col items-start gap-6">
        <Honeycomb />
        <p className="max-w-md text-balance text-sm leading-relaxed text-muted">
          An interactive build is in the works — a small game woven into the
          launch. Drop by soon to play your way in.
        </p>
      </div>
    </div>
  );
}

/** Static honeycomb cluster — placeholder art for the interactive piece. */
function Honeycomb() {
  return (
    <svg
      width="120"
      height="116"
      viewBox="0 0 120 116"
      fill="none"
      aria-hidden="true"
      className="text-honey"
    >
      {[
        { x: 30, y: 4, on: true },
        { x: 70, y: 4, on: false },
        { x: 10, y: 38, on: false },
        { x: 50, y: 38, on: true },
        { x: 90, y: 38, on: false },
        { x: 30, y: 72, on: false },
        { x: 70, y: 72, on: true },
      ].map((c, i) => (
        <path
          key={i}
          d={`M${c.x + 14} ${c.y}L${c.x + 28} ${c.y + 8}V${c.y + 24}L${c.x + 14} ${c.y + 32}L${c.x} ${c.y + 24}V${c.y + 8}z`}
          stroke="currentColor"
          strokeWidth="1.5"
          fill={c.on ? "currentColor" : "transparent"}
          fillOpacity={c.on ? 0.18 : 0}
        />
      ))}
      <title>{site.name} honeycomb</title>
    </svg>
  );
}
