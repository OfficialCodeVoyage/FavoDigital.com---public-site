import { HoneycombField } from "@/components/HoneycombField";

/**
 * Coming-soon homepage — a single, fixed, no-scroll screen.
 *
 * The whole experience is the immersive honeycomb hero. It owns the page's only
 * <h1>, the wordmark, the interactive "warm the hive" field + launch reveal, and
 * the folded SEO band (services, locality, contact) — all server-rendered for
 * indexability. There is no second scrolling section; the page never scrolls.
 *
 * All copy is read from `site` (src/lib/site.ts) — no hardcoded strings.
 */
export default function Home() {
  return (
    <main className="h-dvh overflow-hidden">
      <HoneycombField />
    </main>
  );
}
