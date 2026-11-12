"use client";
import { useRef, useState } from "react";
import { site } from "@/content/site";
import { Panel } from "./Run";
import { gsap, useGSAP } from "@/lib/motion";

/* eslint-disable @next/next/no-img-element */

// How much of the middle photo's growth each neighbour takes, by distance from the middle.
const SHARE = [1, 0.55, 0.38, 0.28, 0.22];

/**
 * Life in China (as the reference's Body / Breath). Entering: the middle photo arrives alone and large, then the rest
 * fan out from behind it into a row on the line. Holding: one continuous push in on the middle photo until it fills
 * the screen height, the others carried off. Leaving: the photo holds while the next panel's smoke eats it.
 * Press and hold a photo to bring it forward; hovering names it in the caption.
 */
export default function Gallery() {
  const g = site.gallery;
  const mid = Math.floor(g.items.length / 2);
  const ref = useRef<HTMLDivElement>(null);
  const [name, setName] = useState(g.caption);

  useGSAP((_, cs) => {
    const el = ref.current!;
    const row = el.querySelector<HTMLElement>("[data-row]")!;
    const onRun = (e: Event) => {
      const { ca, motion } = (e as CustomEvent<{ ca: gsap.core.Tween | null; motion: boolean }>).detail;
      if (!ca || !motion) return;
      const items = gsap.utils.toArray<HTMLElement>("[data-g]", el);
      const W = () => items[0].offsetWidth;
      const H = () => items[0].offsetHeight;
      const gap = () => items[1].offsetLeft - items[0].offsetLeft;
      const S = () => innerHeight / H();
      // k: how far into the push (0 = the row as laid out, 1 = middle photo at full screen height).
      const scale = (d: number, k: number) => 1 + (S() - 1) * (SHARE[d] ?? 0.2) * k;
      // Centre of item i (relative to the middle) at push k. Behind the middle photo the others are tucked in deep:
      // each shows only a sliver (TUCK of its width) beyond the one in front, equally on both sides.
      const TUCK = 0.3;
      const target = (i: number, k: number) => {
        const d = Math.abs(i - mid), sign = Math.sign(i - mid);
        if (!d) return 0;
        let edge = (W() * scale(0, k)) / 2;
        let centre = 0;
        for (let j = 1; j <= d; j++) {
          const w = W() * scale(j, k);
          centre = edge + w * (TUCK - 0.5);
          edge += w * TUCK;
        }
        const t = Math.min(1, k * 2.4); // blend from the laid-out row
        return sign * centre * t + (i - mid) * gap() * (1 - t);
      };
      const lift = () => innerHeight / 2 - (row.offsetTop + row.offsetHeight - H() / 2);

      items.forEach((it, i) => gsap.set(it, { zIndex: 20 - Math.abs(i - mid) }));
      // Place every photo at push k (0 = the row on the line, 1 = middle photo at full screen height).
      const placeAt = (k: number) =>
        items.forEach((it, i) => gsap.set(it, { x: target(i, k) - (i - mid) * gap(), y: lift() * k, scale: scale(Math.abs(i - mid), k), rotate: 0 }));
      placeAt(0.55);


      // The group slides in big (middle photo large, the rest tucked behind it). Once the panel has arrived and the run
      // holds: it settles into the row on the line, rests, then pushes in again until the middle photo fills the screen.
      const push = { k: 0.55 };
      const place = () => placeAt(push.k);
      gsap.timeline({ scrollTrigger: { trigger: el, containerAnimation: ca, start: "left left", end: "right right", scrub: true, invalidateOnRefresh: true } })
        .fromTo(push, { k: 0.55 }, { k: 0, ease: "power2.inOut", duration: 0.32, immediateRender: false, onUpdate: place })
        .to({}, { duration: 0.16 })
        .to(push, { k: 1, ease: "power2.inOut", duration: 0.42, onUpdate: place })
        .to({}, { duration: 0.1 });
    };
    el.addEventListener("run", onRun);

    const lean = gsap.quickTo(row, "rotateY", { duration: 1.2 });
    const move = cs!((e: PointerEvent) => lean(((e.clientX - innerWidth / 2) / innerWidth) * 8));
    el.addEventListener("pointermove", move);
    return () => {
      el.removeEventListener("run", onRun);
      el.removeEventListener("pointermove", move);
    };
  }, { scope: ref });

  // Press and hold: bring one photo forward (scales an inner layer so it never fights the scroll zoom).
  const hold = (fig: HTMLElement | null) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.utils.toArray<HTMLElement>("[data-g]", ref.current).forEach((f) => {
      gsap.to(f.querySelector("[data-hold]"), { scale: f === fig ? 1.25 : 1, duration: 0.9, ease: "expo.out" });
      gsap.to(f, { opacity: !fig || f === fig ? 1 : 0.35, duration: 0.6, ease: "power2.out" });
    });
  };

  return (
    <Panel id="life" fx={["hold", "stay"]} ink="dark" className="bd-clear row:w-[320vw] bg-paper px-6 py-28 text-ground row:p-0">
      <div ref={ref} data-onrun className="h-full">
        <div data-stage className="relative overflow-hidden row:h-screen row:w-screen">
          <div data-burn-mask className="contents row:absolute row:inset-0 row:block">
          <div className="relative z-30 flex items-baseline justify-between gap-4 row:absolute row:inset-x-5 row:top-[6vh]">
            <h2 className="t-statement text-sand">{g.left}</h2>
            <p className="t-ui hidden text-sand md:block" aria-live="polite">{name}</p>
            <p className="t-statement text-sand" aria-hidden>{g.right}</p>
          </div>
          <div
            data-row
            onPointerUp={() => hold(null)}
            onPointerLeave={() => hold(null)}
            className="mt-10 grid grid-cols-2 gap-4 [perspective:1400px] sm:grid-cols-3 row:absolute row:left-1/2 row:mt-0 row:flex row:-translate-x-1/2 row:items-end row:gap-5"
            style={{ bottom: "calc(100% - var(--line))" }}
          >
            {g.items.map((it, i) => (
              <figure
                key={it.name}
                data-g
                data-cursor="hold"
                tabIndex={0}
                onPointerDown={(e) => hold(e.currentTarget)}
                onMouseEnter={() => setName(it.name)}
                onMouseLeave={() => setName(g.caption)}
                onFocus={() => setName(it.name)}
                className="relative aspect-[3/4] row:aspect-auto row:h-[22vh] row:w-[10vw] row:shrink-0"
              >
                <div data-hold className={`absolute inset-0 overflow-hidden bg-ground ${i === mid ? "mono" : ""}`}>
                  <img src={it.image} alt={it.name} loading="lazy" draggable={false} className={`h-full w-full select-none object-cover ${i === mid ? "" : "[filter:sepia(.18)_saturate(1.05)]"}`} />
                </div>
              </figure>
            ))}
          </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
