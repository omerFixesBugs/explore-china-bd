"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createSurface, type SurfaceOpts, type SurfaceState } from "@/lib/surface";
import { motionOK, isEdit } from "@/lib/motion";

/**
 * A section's background drawn in WebGL that the pointer stirs like water (see lib/surface).
 * `children` is the static fallback (image or colour): shown until the canvas is ready, and always under
 * reduced motion and in edit mode. Mouse or finger stirs it. With `opts.leadVw`, the surface reaches that far left over
 * the previous panel with a soft smoky edge while its sideways run is active; with `opts.leadVh` it reaches up over the
 * previous section in the stacked layout. Outside a sideways run the surface works vertically (burns run top → bottom).
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
    if (!motionOK() || isEdit()) return;
    const el = wrap.current!;
    const h = host.current!;
    let s: ReturnType<typeof createSurface> = null;
    const start = () => {
      if (s) return;
      const row = !!el.closest(".run.is-row");
      const lead = row ? opts.leadVw || 0 : 0;
      const up = row ? 0 : opts.leadVh || 0;
      h.style.left = lead ? `-${lead}vw` : "0";
      h.style.width = lead ? `calc(100% + ${lead}vw)` : "100%";
      h.style.top = up ? `-${up}vh` : "0";
      h.style.height = up ? `calc(100% + ${up}vh)` : "100%";
      s = createSurface(h, { ...opts, leadVw: lead, leadVh: up, vertical: !row }, () => live.current, () => setReady(true));
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
      <div ref={host} className="absolute left-0 top-0 h-full w-full" />
    </div>
  );
}
