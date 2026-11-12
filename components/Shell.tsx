"use client";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, fineMotion, onIntroDone, scrollToId, WIDE } from "@/lib/motion";

type L = Lenis & { scroll: number; limit: number };

/**
 * Global behaviours: edit mode, Lenis smooth scroll wired to ScrollTrigger, run-aware anchors,
 * the custom scrollbar, the endless loop back to the top, and the ring cursor.
 *
 * Cursor modes come from the nearest [data-cursor] ancestor:
 *   snap      ring wraps the element (or [data-cursor-snap-to] inside it)
 *   dissolve  ring flies onto the target ring and fades into it
 *   grow      ring grows
 *   hold      ring + "( Hold an image )" label
 *   hide      no ring
 * [data-cursor-label] adds a label beside the ring. [data-ink="dark"] areas switch it to umber.
 */
export default function Shell() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Every visit starts at the hero, like the intro expects.
    if (!location.hash) {
      history.scrollRestoration = "manual";
      scrollTo(0, 0);
    }
    if (new URLSearchParams(location.search).has("edit")) {
      document.documentElement.classList.add("edit");
      ScrollTrigger.refresh();
    }
  }, []);

  // Smooth scroll, scrollbar, endless loop
  useEffect(() => {
    const thumb = bar.current!;
    const paint = (y: number, max: number) => (thumb.style.transform = `translateY(${(y / Math.max(1, max)) * (innerHeight - 40)}px)`);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const on = () => paint(scrollY, document.documentElement.scrollHeight - innerHeight);
      addEventListener("scroll", on, { passive: true });
      return () => removeEventListener("scroll", on);
    }
    const lenis = new Lenis({ lerp: 0.085 }) as L;
    (window as unknown as { lenis?: L }).lenis = lenis;
    lenis.stop();
    const off = onIntroDone(() => lenis.start());
    const loops = matchMedia(WIDE).matches;
    let wrapping = false;
    lenis.on("scroll", () => {
      ScrollTrigger.update();
      paint(lenis.scroll, lenis.limit);
      // The page ends on a copy of the hero; reaching it jumps seamlessly back to the real one.
      if (loops && !wrapping && lenis.limit > 0 && lenis.scroll >= lenis.limit - 1 && document.getElementById("loop-tail")) {
        wrapping = true;
        lenis.scrollTo(0, { immediate: true, force: true });
        requestAnimationFrame(() => (wrapping = false));
      }
    });
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      off();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // In-page anchors, aware of sideways runs.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a || a.hash.length < 2) return;
      e.preventDefault();
      scrollToId(a.hash.slice(1));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Ring cursor
  useEffect(() => {
    if (!fineMotion()) return;
    const el = ring.current!;
    const lab = label.current!;
    const root = el.parentElement!;
    document.documentElement.classList.add("has-cursor");
    const p = { x: -100, y: -100 };
    const c = { x: -100, y: -100, w: 28, h: 28 };
    let target: HTMLElement | null = null;
    let seen = false;
    let frame = 0;

    const read = (t: Element | null) => {
      target = t?.closest<HTMLElement>("[data-cursor]") ?? null;
      root.classList.toggle("is-dark", !!t?.closest('[data-ink="dark"]') && !t?.closest('[data-ink="light"]'));
      const text = target?.dataset.cursorLabel || (target?.dataset.cursor === "hold" ? "( Hold an image )" : "");
      if (lab.textContent !== text) lab.textContent = text;
    };
    const onMove = (e: PointerEvent) => {
      p.x = e.clientX;
      p.y = e.clientY;
      if (!seen) {
        seen = true;
        c.x = p.x;
        c.y = p.y;
      }
      read(e.target as Element);
    };
    const tick = () => {
      if (!seen) return;
      // Re-read what is under the pointer while scrolling (sections move under a still mouse).
      if (++frame % 8 === 0) read(document.elementFromPoint(p.x, p.y));
      const mode = target?.dataset.cursor || "default";
      let x = p.x, y = p.y, w = 28, h = 28, radius = "999px", alpha = 1;
      if (mode === "snap" || mode === "dissolve") {
        const sel = target!.dataset.cursorSnapTo;
        const box = ((sel && target!.querySelector(sel)) || target!).getBoundingClientRect();
        const round = mode === "dissolve" || target!.dataset.round !== undefined;
        const pad = round ? 0 : 6;
        w = box.width + pad * 2; h = box.height + pad * 2;
        x = box.left + box.width / 2; y = box.top + box.height / 2;
        radius = round ? "999px" : "0px";
        if (mode === "dissolve") alpha = 0;
      } else if (mode === "grow") { w = h = 64; }
      else if (mode === "hold") { w = h = 44; }
      else if (mode === "hide") alpha = 0;
      const k = mode === "default" || mode === "grow" || mode === "hold" ? 0.2 : 0.16;
      c.x += (x - c.x) * k;
      c.y += (y - c.y) * k;
      c.w += (w - c.w) * 0.16;
      c.h += (h - c.h) * 0.16;
      el.style.width = `${c.w}px`;
      el.style.height = `${c.h}px`;
      el.style.borderRadius = radius;
      el.style.opacity = String(alpha);
      el.style.transform = `translate3d(${c.x - c.w / 2}px, ${c.y - c.h / 2}px, 0)`;
      lab.style.opacity = lab.textContent ? "1" : "0";
      lab.style.transform = `translate3d(${c.x + c.w / 2 + 12}px, ${c.y - 10}px, 0)`;
    };
    addEventListener("pointermove", onMove, { passive: true });
    gsap.ticker.add(tick);
    return () => {
      removeEventListener("pointermove", onMove);
      gsap.ticker.remove(tick);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div className="cursor" aria-hidden>
        <div ref={ring} className="cursor-ring" />
        <span ref={label} className="cursor-label t-ui" />
      </div>
      <div className="scrollbar hidden lg:block" aria-hidden>
        <span ref={bar} />
      </div>
    </>
  );
}
