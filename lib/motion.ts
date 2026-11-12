"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export const EASE = "expo.out"; // close to out-soft for GSAP tweens; CSS uses the exact cubic-bezier
gsap.defaults({ ease: EASE, duration: 0.9 });

// Same query as the Tailwind `row:` variant.
export const WIDE = "(min-width: 1024px) and (prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)";
export const MOTION = "(prefers-reduced-motion: no-preference)";

export const isEdit = () => typeof location !== "undefined" && new URLSearchParams(location.search).has("edit");
export const fineMotion = () =>
  typeof window !== "undefined" && matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches;

/** Fires once the intro loader has opened (or immediately if it was skipped). */
export function onIntroDone(fn: () => void) {
  const w = window as unknown as { __introDone?: boolean };
  if (w.__introDone) return fn(), () => {};
  window.addEventListener("intro:done", fn, { once: true });
  return () => window.removeEventListener("intro:done", fn);
}
export function introDone() {
  (window as unknown as { __introDone?: boolean }).__introDone = true;
  window.dispatchEvent(new Event("intro:done"));
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

/** Scroll to an element by id, mapping panels inside a pinned sideways run to their scroll position. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { lenis?: { scrollTo: (y: number | HTMLElement, o?: object) => void } }).lenis;
  const run = el.closest<HTMLElement & { _st?: ScrollTrigger }>(".run");
  let y: number = el.getBoundingClientRect().top + scrollY;
  if (run?._st && run.classList.contains("is-row")) {
    const track = run.querySelector<HTMLElement>("[data-track]")!;
    let left = 0;
    for (let n: HTMLElement | null = el; n && n !== track; n = n.offsetParent as HTMLElement | null) left += n.offsetLeft;
    y = run._st.start + left;
  }
  if (lenis) lenis.scrollTo(y, { duration: 1.6 });
  else scrollTo({ top: y, behavior: matchMedia(MOTION).matches ? "smooth" : "auto" });
}
