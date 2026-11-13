"use client";
import { useRef, type ReactNode, type CSSProperties } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, WIDE, MOTION, isEdit } from "@/lib/motion";

type Fx = "stay" | "drift" | "reveal" | "arrive" | "fill" | "light" | "hold";

/** A panel inside a sideways run. On wide screens it is a full-height column; otherwise it stacks. */
export function Panel({ fx = [], id, ink, fadeAt, className = "", style, children }: { fx?: Fx[]; id?: string; ink?: "dark" | "light"; fadeAt?: number; className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <div id={id} data-panel data-fx={fx.join(" ")} data-ink={ink} data-fade-at={fadeAt} style={style} className={`relative row:h-screen row:shrink-0 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Sideways run: pins on wide screens (motion allowed, not editing) and scrolls its track horizontally.
 * Panel effects (data-fx) and inner hooks (data-drift, data-arrive, data-fill, data-light, data-stage) work in both modes;
 * in stacked mode they fall back to vertical triggers, or to nothing under reduced motion.
 */
export default function Run({ id, className = "", line = true, children }: { id?: string; className?: string; line?: boolean; children: ReactNode }) {
  const ref = useRef<HTMLElement & { _st?: ScrollTrigger }>(null);

  useGSAP(() => {
    const root = ref.current!;
    const track = root.querySelector<HTMLElement>("[data-track]")!;
    const mm = gsap.matchMedia();

    mm.add({ wide: WIDE, motion: MOTION }, (ctx) => {
      const { wide, motion } = ctx.conditions as { wide: boolean; motion: boolean };
      if (!wide || isEdit()) return fx(root, null, motion);
      root.classList.add("is-row");
      const dist = () => track.scrollWidth - innerWidth;
      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: { trigger: root, pin: true, scrub: true, start: "top top", end: () => `+=${dist()}`, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      root._st = tween.scrollTrigger;
      fx(root, tween, true);
      return () => {
        root.classList.remove("is-row");
        root._st = undefined;
      };
    });
  }, { scope: ref });

  return (
    <section ref={ref} id={id} className={`run relative overflow-clip ${className}`}>
      <div data-track className="relative row:flex row:h-screen row:w-max row:flex-nowrap">
        {line && <div aria-hidden className="pointer-events-none absolute left-0 z-20 hidden h-px w-full bg-current opacity-25 row:block" style={{ top: "var(--line)" }} />}
        {children}
      </div>
    </section>
  );
}

function fx(root: HTMLElement, ca: gsap.core.Tween | null, motion: boolean) {
  const H = !!ca;
  const q = (s: string, el: Element = root) => gsap.utils.toArray<HTMLElement>(el.querySelectorAll(s));
  const st = (trigger: Element, o: ScrollTrigger.Vars): ScrollTrigger.Vars => ({ trigger, ...(ca ? { containerAnimation: ca } : {}), ...o });
  const panelOf = (el: HTMLElement) => el.closest<HTMLElement>("[data-panel]") ?? el;

  // light: lit while crossing the middle of the screen. A state, so it also runs under reduced motion.
  [...q('[data-fx~="light"]'), ...q("[data-light]")].forEach((el) =>
    ScrollTrigger.create(st(el, H ? { start: "left 58%", end: "right 42%", toggleClass: "is-lit" } : { start: "top 60%", end: "bottom 40%", toggleClass: "is-lit" })),
  );

  // Panels that play their own scroll-linked animation (gallery) listen for this.
  q("[data-onrun]").forEach((el) => el.dispatchEvent(new CustomEvent("run", { detail: { ca, motion } })));

  if (!motion) return;

  // words: blur in one by one
  q("[data-words]").forEach((el) =>
    gsap.from(el.querySelectorAll("[data-word]"), {
      autoAlpha: 0, filter: "blur(8px)", duration: 0.9, stagger: 0.045, ease: "power2.out",
      scrollTrigger: st(el, H ? { start: "left 75%" } : { start: "top 85%" }),
    }),
  );

  // lines: each line rises out of its own mask
  q("[data-lines]").forEach((el) => {
    const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line" });
    gsap.from(split.lines, { yPercent: 105, duration: 1.1, stagger: 0.08, ease: "power3.out", scrollTrigger: st(el, H ? { start: "left 80%" } : { start: "top 85%" }) });
  });

  // blur-in: photos sharpen as they arrive
  q("[data-blur-in]").forEach((el) =>
    gsap.fromTo(el, { filter: "blur(24px)" }, {
      filter: "blur(0px)", ease: "none",
      scrollTrigger: st(el, H ? { start: "left right", end: "left 60%", scrub: true } : { start: "top bottom", end: "top 60%", scrub: true }),
    }),
  );

  // iris: a round photo opens from its centre as it arrives; draw: a ring traces itself.
  q("[data-iris]").forEach((el) => {
    const t = st(el.closest("figure") ?? panelOf(el), H ? { start: "left 95%", end: "left 30%", scrub: true } : { start: "top 85%", end: "center 55%", scrub: true });
    gsap.fromTo(el, { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(50% at 50% 50%)", ease: "none", scrollTrigger: t });
    const img = el.querySelector("img");
    if (img) gsap.fromTo(img, { scale: 1.45 }, { scale: 1.1, ease: "none", scrollTrigger: { ...t } });
  });
  q("[data-draw]").forEach((el) =>
    gsap.fromTo(el, { strokeDasharray: 1, strokeDashoffset: 1 }, {
      strokeDashoffset: 0, ease: "none",
      scrollTrigger: st(el.closest("figure") ?? panelOf(el), H ? { start: "left right", end: "left 35%", scrub: true } : { start: "top 90%", end: "center 55%", scrub: true }),
    }),
  );

  q("[data-arrive-group]").concat(q('[data-fx~="arrive"]')).forEach((g) => {
    const kids = q("[data-arrive]", g);
    if (!kids.length) return;
    gsap.from(kids, {
      y: 60, autoAlpha: 0, filter: "blur(12px)", duration: 1.2, stagger: 0.12,
      scrollTrigger: st(g, H ? { start: "left 70%" } : { start: "top 80%" }),
    });
  });

  q("[data-fill]").forEach((el) =>
    gsap.fromTo(el, { scaleX: 0 }, {
      scaleX: 1, ease: "none", transformOrigin: "left center",
      scrollTrigger: st(panelOf(el), H ? { start: "left right", end: "right right", scrub: true } : { start: "top 80%", end: "bottom 60%", scrub: true }),
    }),
  );

  q("[data-drift]").forEach((el) => {
    const f = parseFloat(el.dataset.drift || "0.12") * 100;
    gsap.fromTo(el, H ? { xPercent: -f } : { yPercent: -f / 2 }, {
      ...(H ? { xPercent: f } : { yPercent: f / 2 }), ease: "none",
      scrollTrigger: st(panelOf(el), H ? { start: "left right", end: "right left", scrub: true } : { start: "top bottom", end: "bottom top", scrub: true }),
    });
  });

  // Stacked: a hold panel pins for a screen and a half instead; its photo grows ([data-grow]) and its text rises in ([data-pass]).
  if (!H) {
    q('[data-fx~="hold"]').forEach((p) => {
      const grow = q("[data-grow]", p), pass = q("[data-pass]", p);
      if (!grow.length && !pass.length) return;
      const ht = gsap.timeline({ scrollTrigger: { trigger: p, start: "top top", end: "+=150%", pin: true, scrub: true, invalidateOnRefresh: true } });
      grow.forEach((el) => {
        ht.fromTo(el, { scale: parseFloat(el.dataset.grow || "0.3") }, { scale: 1, ease: "power2.inOut", duration: 0.6 }, 0);
        const img = el.querySelector("img");
        if (img) ht.fromTo(img, { scale: 1.35 }, { scale: 1, ease: "power2.inOut", duration: 0.6 }, 0);
      });
      pass.forEach((el) => ht.fromTo(el, { y: () => innerHeight * 0.3, autoAlpha: 0, filter: "blur(10px)" }, { y: 0, autoAlpha: 1, filter: "blur(0px)", ease: "power2.out", duration: 0.4 }, 0.5));
    });
    return;
  }

  // stay: nearly stops while the next panel slides over it like a curtain.
  // [data-stay-fade] content blurs away as the next panel takes over; [data-fade-at] (0..1 of the panel's width) sets when.
  q('[data-fx~="stay"]:not([data-fx~="hold"])').forEach((p) => {
    const tl = gsap.timeline({ scrollTrigger: st(p, { start: "left left", end: "right left", scrub: true, invalidateOnRefresh: true }) });
    tl.to(p, { x: () => p.offsetWidth * 0.86, ease: "none", duration: 1 }, 0);
    const shade = p.querySelector("[data-shade]");
    if (shade) tl.fromTo(shade, { opacity: 0 }, { opacity: 0.7, ease: "none", duration: 1 }, 0);
    const fade = p.querySelectorAll("[data-stay-fade]");
    if (fade.length) tl.to(fade, { autoAlpha: 0, filter: "blur(14px)", ease: "power1.in", duration: 0.32 }, parseFloat(p.dataset.fadeAt || "0.22"));
  });

  // parallax: a layer that holds (almost) still on screen while its panel slides out, so the panel reads as a window.
  // In a hold panel this starts once the hold is over.
  q("[data-parallax]").forEach((el) => {
    const p = el.closest<HTMLElement>("[data-panel]")!;
    const k = parseFloat(el.dataset.parallax || "0.85");
    const held = p.matches('[data-fx~="hold"]');
    gsap.to(el, { x: () => (held ? innerWidth : p.offsetWidth) * k, ease: "none", scrollTrigger: st(p, { start: held ? "right right" : "left left", end: "right left", scrub: true, invalidateOnRefresh: true }) });
  });

  // shift: content that slides left faster than its panel (by this fraction of the screen) as the panel leaves.
  q("[data-shift]").forEach((el) => {
    const p = el.closest<HTMLElement>("[data-panel]")!;
    gsap.to(el, { x: () => -innerWidth * parseFloat(el.dataset.shift || "0.3"), ease: "none", scrollTrigger: st(p, { start: "left left", end: "right left", scrub: true, invalidateOnRefresh: true }) });
  });

  // hold-y: content that scrolls vertically (text parallax) while a hold panel keeps the run still.
  q("[data-hold-y]").forEach((el) => {
    const p = el.closest<HTMLElement>("[data-panel]")!;
    gsap.fromTo(el, { y: 0 }, { y: el.dataset.holdY, ease: "none", scrollTrigger: st(p, { start: "left left", end: "right right", scrub: true, invalidateOnRefresh: true }) });
  });

  // reveal: clips open from its right edge.
  q('[data-fx~="reveal"]').forEach((p) =>
    gsap.fromTo(p, { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: st(p, { start: "left right", end: "left left", scrub: true }) }),
  );

  // hold: the panel is wider than the screen; its stage counter-moves so the run appears paused.
  q('[data-fx~="hold"]').forEach((p) => {
    const stage = p.querySelector("[data-stage]");
    if (!stage) return;
    gsap.to(stage, { x: () => p.offsetWidth - innerWidth, ease: "none", scrollTrigger: st(p, { start: "left left", end: "right right", scrub: true, invalidateOnRefresh: true }) });
    // During the hold: [data-grow] scales up from its value to full size (first half), then [data-pass] crosses the screen right → left.
    const grow = q("[data-grow]", stage), pass = q("[data-pass]", stage);
    if (grow.length || pass.length) {
      const ht = gsap.timeline({ scrollTrigger: st(p, { start: "left left", end: "right right", scrub: true, invalidateOnRefresh: true }) });
      grow.forEach((el) => {
        ht.fromTo(el, { scale: parseFloat(el.dataset.grow || "0.3") }, { scale: 1, ease: "power2.inOut", duration: 0.55 }, 0);
        const img = el.querySelector("img");
        if (img) ht.fromTo(img, { scale: 1.35 }, { scale: 1, ease: "power2.inOut", duration: 0.55 }, 0);
      });
      pass.forEach((el) => ht.fromTo(el, { x: () => innerWidth * 0.7 }, { x: () => -innerWidth * 0.95, ease: "none", duration: 0.6 }, 0.4));
    }
    // hold + stay: after the hold the stage keeps (almost) still while the next panel burns in over it.
    if (p.matches('[data-fx~="stay"]')) {
      const tl = gsap.timeline({ scrollTrigger: st(p, { start: "right right", end: "right left", scrub: true, invalidateOnRefresh: true }) });
      tl.fromTo(stage, { x: () => p.offsetWidth - innerWidth }, { x: () => p.offsetWidth - innerWidth + innerWidth * 0.86, ease: "none", immediateRender: false, duration: 1 }, 0);
      const fade = stage.querySelectorAll("[data-stay-fade]");
      if (fade.length) tl.to(fade, { autoAlpha: 0, filter: "blur(14px)", ease: "power1.in", duration: 0.32 }, 0.2);
      // [data-burn-mask]: the arriving panel's smoke front eats the held content (its edge crosses the screen right → left).
      const burn = stage.querySelectorAll<HTMLElement>("[data-burn-mask]");
      if (burn.length) {
        // Opaque well ahead of the front, gone just before it (front moves from the right edge to the left).
        const cut = { v: 100 };
        const paint = () => burn.forEach((b) => {
          const m = cut.v > 99 ? "" : `linear-gradient(90deg, #000 ${cut.v - 42}vw, transparent ${cut.v - 8}vw)`;
          b.style.maskImage = m;
          b.style.webkitMaskImage = m;
        });
        tl.to(cut, { v: 14, ease: "none", duration: 1, onUpdate: paint }, 0);
      }
    }
  });
}
