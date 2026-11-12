"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createSurface, type SurfaceOpts, type SurfaceState } from "@/lib/surface";
import { fineMotion, isEdit } from "@/lib/motion";

/**
 * A section's background drawn in WebGL that the pointer stirs like water (see lib/surface).
 * `children` is the static fallback (image or colour): shown until the canvas is ready, and always on touch,
 * reduced motion and edit mode. With `opts.leadVw`, the surface reaches that far left over the previous panel
 * with a soft smoky edge — only while its sideways run is active.
 */
export default function Surface({ opts, state, className = "", children }: { opts: SurfaceOpts; state?: SurfaceState; className?: string; children?: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const live = useRef<SurfaceState>(state || {});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    live.current = state || {};
  });

  useEffect(() => {
    if (!fineMotion() || isEdit()) return;
    const el = wrap.current!;
    const h = host.current!;
    let s: ReturnType<typeof createSurface> = null;
    const start = () => {
      if (s) return;
      const row = !!el.closest(".run.is-row");
      const lead = row ? opts.leadVw || 0 : 0;
      h.style.left = lead ? `-${lead}vw` : "0";
      h.style.width = lead ? `calc(100% + ${lead}vw)` : "100%";
      s = createSurface(h, { ...opts, leadVw: lead }, () => live.current, () => setReady(true));
    };
    const stop = () => {
      s?.destroy();
      s = null;
      setReady(false);
    };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: "25% 60%" });
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
    // Options are static per section.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={wrap} aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}>{children}</div>
      <div ref={host} className="absolute inset-y-0 left-0 w-full" />
    </div>
  );
}
