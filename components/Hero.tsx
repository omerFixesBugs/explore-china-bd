"use client";
import { useRef, useState } from "react";
import { site } from "@/content/site";
import { Panel } from "./Run";
import Surface from "./Surface";

export const SMOKE_HERO: [string, string, string] = ["#04141c", "#0b5a5e", "#20b3a2"];
export const SMOKE_WARM: [string, string, string] = ["#0c3d4c", "#138a84", "#f2b65a"];
import { gsap, useGSAP, onIntroDone, WIDE, MOTION, isEdit } from "@/lib/motion";

const DUR = 6;

/** The three overlapping rings on the line. Shared with the loop tail so the wrap is seamless. */
export function HeroRings({ active = -1, hover = -1, auto = false, cycle = 0, onPick, onHover, onDone, interactive = true }: {
  active?: number; hover?: number; auto?: boolean; cycle?: number; interactive?: boolean;
  onPick?: (i: number) => void; onHover?: (i: number) => void; onDone?: (i: number) => void;
}) {
  const steps = site.hero.steps;
  return (
    <div className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center lg:flex-row" style={{ top: "var(--line)" }} role={interactive ? "tablist" : undefined} aria-label={interactive ? "Highlights" : undefined}>
      {steps.map((s, i) => {
        const on = i === (hover >= 0 ? hover : active);
        // Phones and portrait tablets: stacked down the middle (the middle ring on the line), as in the reference.
        // --len: the ring's on-screen circumference, for the timer trace (its stroke never scales, so dashes are screen px).
        const cls = `relative grid aspect-square w-[164px] place-items-center [--len:calc(164px*3.1416+2px)] lg:w-[19.45vw] lg:[--len:calc(19.45vw*3.1416+2px)] ${i ? "-mt-[21px] lg:-ml-[2.1vw] lg:mt-0" : ""}`;
        const body = (
          <>
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90 overflow-visible" aria-hidden>
              <circle data-ring-draw cx="50" cy="50" r="49.8" className={`fill-none stroke-paper [vector-effect:non-scaling-stroke] transition-[stroke-opacity] duration-700 ${on && hover >= 0 ? "[stroke-opacity:1]" : "[stroke-opacity:0.35]"}`} />
              {interactive && (
                <circle
                  key={`${i}-${cycle}-${active}`}
                  cx="50" cy="50" r="49.8"
                  className={`trace fill-none stroke-paper [vector-effect:non-scaling-stroke] ${i === active && auto ? "tracing" : "opacity-0"}`}
                  style={{ ["--dur" as string]: `${DUR}s` }}
                  onAnimationEnd={() => onDone?.(i)}
                />
              )}
            </svg>
            {/* "+" on the line; becomes "—" when active */}
            <svg data-magnet data-ring-in viewBox="0 0 24 24" className="absolute inset-0 m-auto h-5 w-5 text-paper" stroke="currentColor" strokeWidth="1" aria-hidden>
              <path d="M0 12h24" />
              <path d="M12 0v24" className={`transition-transform duration-700 ease-out ${on && interactive ? "scale-y-0" : ""}`} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            </svg>
            <span data-ring-in className={`t-ui absolute left-1/2 top-[calc(50%+24px)] -translate-x-1/2 whitespace-nowrap lg:top-[calc(50%+28px)] transition-opacity duration-700 ${on ? "opacity-100" : "opacity-80"}`}>{s.label}</span>
          </>
        );
        return interactive ? (
          <button
            key={s.label}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onPick?.(i)}
            onMouseEnter={() => onHover?.(i)}
            onMouseLeave={() => onHover?.(-1)}
            onFocus={() => onHover?.(i)}
            onBlur={() => onHover?.(-1)}
            data-cursor="dissolve"
            data-cursor-snap-to="svg"
            data-touch
            className={cls}
          >
            {body}
          </button>
        ) : (
          <div key={s.label} className={cls}>{body}</div>
        );
      })}
    </div>
  );
}

/** Where the intro panel starts on screen, while the first run is sideways. */
const introEdge = () => {
  const el = document.getElementById("intro");
  if (!el) return null;
  const r = el.getBoundingClientRect();
  // Sideways: its left edge. Stacked: its top edge, while it rises over the (sticky) hero.
  return el.closest(".run.is-row") ? r.left : r.top < innerHeight ? r.top : null;
};

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <p aria-hidden className={`t-wordmark pointer-events-none absolute inset-x-0 top-[2.2vh] select-none overflow-hidden px-[1.2vw] text-jade ${className}`}>
      {site.wordmark.split("").map((ch, i) => (
        <span key={i} data-letter className="inline-block whitespace-pre">{ch}</span>
      ))}
    </p>
  );
}

/** Hero: red smoke, a giant wordmark, three rings that take turns (hover floods the screen with that ring's photo), a tagline. */
export default function Hero() {
  const { steps, tagline } = site.hero;
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(-1);
  const [cycle, setCycle] = useState(0);
  const [auto, setAuto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const shown = hover >= 0 ? hover : active;

  useGSAP(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Resolve now: the intro callback may run inside another component's GSAP context.
    const letters = ref.current!.querySelectorAll("[data-letter]");
    const draws = gsap.utils.toArray<SVGCircleElement>(ref.current!.querySelectorAll("[data-ring-draw]"));
    // The rings keep a 1px line at any size (non-scaling stroke), so their dashes are measured in screen px:
    // use each ring's on-screen circumference rather than pathLength.
    const len = (c: SVGCircleElement) => c.getBoundingClientRect().width * Math.PI + 2;
    const ringIns = ref.current!.querySelectorAll("[data-ring-in]");
    const lines = ref.current!.querySelectorAll("[data-tag-line]");
    gsap.set(letters, { autoAlpha: 0, filter: "blur(30px)" });
    draws.forEach((c) => gsap.set(c, { strokeDasharray: len(c), strokeDashoffset: len(c) }));
    gsap.set(ringIns, { autoAlpha: 0, filter: "blur(8px)" });
    gsap.set(lines, { yPercent: 110 });
    // As in the reference: the wordmark settles, the tagline rises line by line, then each ring draws itself in turn
    // and its "+" and label sharpen in; only then does the ring timer start.
    return onIntroDone(() => {
      gsap.to(letters, { autoAlpha: 1, filter: "blur(0px)", duration: 1.8, stagger: { each: 0.08, from: "random" }, ease: "power2.out", delay: 0.85 });
      gsap.timeline({ delay: 1.5, onComplete: () => setAuto(true) })
        .to(lines, { yPercent: 0, duration: 1.1, stagger: 0.14, ease: "power3.out" }, 0)
        .to(draws, { strokeDashoffset: 0, duration: 1.5, stagger: 0.3, ease: "power2.inOut", onComplete: () => gsap.set(draws, { clearProps: "strokeDasharray,strokeDashoffset" }) }, 0.45)
        .to(ringIns, { autoAlpha: 1, filter: "blur(0px)", duration: 0.9, stagger: 0.15, ease: "power2.out" }, 1.25);
    });
  }, { scope: ref });

  // Stacked: while the intro rises over the sticky hero, the hero's words blur away ahead of the burn.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(`not all and ${WIDE.replace(" and (prefers-reduced-motion: no-preference)", "")}`, () => {
      if (isEdit() || !matchMedia(MOTION).matches) return;
      gsap.to(ref.current!.querySelector("[data-stay-fade]"), { autoAlpha: 0, filter: "blur(14px)", ease: "none", scrollTrigger: { trigger: document.getElementById("intro"), start: "top 85%", end: "top 30%", scrub: true } });
    });
  }, { scope: ref });

  return (
        // The panel runs 60vw past its content so the intro's smoke front starts off-screen and only sweeps in on scroll.
    <Panel id="top" fx={["stay"]} className="row:w-[160vw] h-svh overflow-hidden bg-deep text-paper mo:sticky mo:top-0">
      <div ref={ref} className="absolute inset-0">
        <Surface
          opts={{ mode: "smoke", palette: SMOKE_HERO, images: steps.map((x) => x.image), tone: "lum", glow: "#f2b65a", ground: "#0a161e", burnFrom: introEdge }}
          state={{ w: [0, 1, 2].map((i) => (i === shown ? (hover >= 0 ? 1 : 0.16) : 0)) as [number, number, number], color: hover >= 0 ? 1 : 0 }}
        >
          <div className="smoke-fallback absolute inset-0" />
          {steps.map((s, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={s.image}
              src={s.image}
              alt=""
              fetchPriority={i === 0 ? "high" : "low"}
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-[opacity,transform] duration-[1200ms] ease-out"
              style={i === shown ? (hover >= 0 ? { opacity: 1, transform: "scale(1)" } : { opacity: 0.14, transform: "scale(1.04)", mixBlendMode: "luminosity" }) : { transform: "scale(1.08)" }}
            />
          ))}
        </Surface>
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className={`absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 transition-opacity duration-1000 ${hover >= 0 ? "opacity-100" : "opacity-50"}`} />
        </div>

        <div data-stay-fade className="absolute inset-y-0 left-0 w-full row:w-screen">
        <h1 className="sr-only">{site.name}: study and visas for China</h1>
        <Wordmark />

        <HeroRings
          active={active} hover={hover} auto={auto && hover < 0} cycle={cycle}
          onPick={(i) => { setActive(i); setCycle((c) => c + 1); }}
          onHover={setHover}
          onDone={(i) => { setActive((i + 1) % steps.length); setCycle((c) => c + 1); }}
        />

        <p className="t-tagline absolute inset-x-0 bottom-16 text-center text-sand md:bottom-5">
          {tagline.map((l, i) => (
            <span key={i} className="block overflow-hidden"><span data-tag-line className="block">{l}</span></span>
          ))}
        </p>
        </div>
      </div>
    </Panel>
  );
}
