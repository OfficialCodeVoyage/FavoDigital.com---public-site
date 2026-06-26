import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * SSR-safe `prefers-reduced-motion` hook.
 *
 * Subscribes to the media query via `useSyncExternalStore` — correct value on the
 * first client render (no flash), no `setState`-in-effect. Replaces motion/react's
 * `useReducedMotion` so the whole `motion` package isn't shipped to the client for
 * what is, in this app, a single boolean.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}
