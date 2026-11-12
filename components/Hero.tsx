"use client";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { Panel } from "./Run";
import Surface from "./Surface";

export const SMOKE_HERO: [string, string, string] = ["#1c0905", "#8a1c11", "#f0451f"];
export const SMOKE_WARM: [string, string, string] = ["#6e140c", "#cf2416", "#ff6b3d"];
import { gsap, useGSAP, onIntroDone } from "@/lib/motion";

const DUR = 6;

/** The three overlapping rings on the line. Shared with the loop tail so the wrap is seamless. */
export function HeroRings({ active = -1, hover = -1, auto = false, cycle = 0, onPick, onHover, onDone, interactive = true }: {
  active?: number; hover?: number; auto?: boolean; cycle?: number; interactive?: boolean;
  onPick?: (i: number) => void; onHover?: (i: number) => void; onDone?: (i: number) => void;
}) {
  const steps = site.hero.steps;
  return (
    <div className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2" style={{ top: "var(--line)" }} role={interactive ? "tablist" : undefined} aria-label={interactive ? "Highlights" : undefined}>
      {steps.map((s, i) => {
        const on = i === (hover >= 0 ? hover : active);
        const cls = `relative grid aspect-square w-[34vw] place-items-center md:w-[19.45vw] ${i ? "-ml-[4vw] md:-ml-[2.1vw]" : ""}`;
        const body = (
          <>
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90 overflow-visible" aria-hidden>
              <circle cx="50" cy="50" r="49.8" className={`fill-none stroke-paper [vector-effect:non-scaling-stroke] transition-[stroke-opacity] duration-700 ${on && hover >= 0 ? "[stroke-opacity:1]" : "[stroke-opacity:0.35]"}`} />
              {interactive && (
                <circle
                  key={`${i}-${cycle}-${active}`}
                  cx="50" cy="50" r="49.8" pathLength={1}
                  className={`trace fill-none stroke-paper [vector-effect:non-scaling-stroke] ${i === active && auto ? "tracing" : "opacity-0"}`}
                  style={{ ["--dur" as string]: `${DUR}s` }}
                  onAnimationEnd={() => onDone?.(i)}
                />
              )}
            </svg>
            {/* "+" on the line; becomes "—" when active */}
            <svg viewBox="0 0 24 24" className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-paper" stroke="currentColor" strokeWidth="1" aria-hidden>
              <path d="M0 12h24" />
              <path d="M12 0v24" className={`transition-transform duration-700 ease-out ${on && interactive ? "scale-y-0" : ""}`} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            </svg>
            <span className={`t-ui absolute left-1/2 top-[calc(50%+28px)] -translate-x-1/2 transition-opacity duration-700 ${on ? "opacity-100" : "opacity-80"}`}>{s.label}</span>
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
            data-hero-in
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
  return el?.closest(".run.is-row") ? el.getBoundingClientRect().left : null;
};

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <p aria-hidden className={`t-wordmark pointer-events-none absolute inset-x-0 top-[2.2vh] select-none overflow-hidden px-[1.2vw] text-lacquer ${className}`}>
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

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return onIntroDone(() => setAuto(true));
  }, []);

  useGSAP(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Resolve now: the intro callback may run inside another component's GSAP context.
    const letters = ref.current!.querySelectorAll("[data-letter]");
    const ins = ref.current!.querySelectorAll("[data-hero-in]");
    gsap.set(letters, { autoAlpha: 0, filter: "blur(30px)" });
    gsap.set(ins, { autoAlpha: 0, filter: "blur(12px)" });
    return onIntroDone(() => {
      gsap.to(letters, { autoAlpha: 1, filter: "blur(0px)", duration: 1.8, stagger: { each: 0.08, from: "random" }, ease: "power2.out", delay: 0.85 });
      gsap.to(ins, { autoAlpha: 1, filter: "blur(0px)", duration: 1.4, stagger: 0.12, delay: 1.1, ease: "power2.out" });
    });
  }, { scope: ref });

  return (
        // The panel runs 60vw past its content so the intro's smoke front starts off-screen and only sweeps in on scroll.
    <Panel id="top" fx={["stay"]} className="row:w-[160vw] h-svh overflow-hidden bg-deep text-paper">
      <div ref={ref} className="absolute inset-0">
        <Surface
          opts={{ mode: "smoke", palette: SMOKE_HERO, images: steps.map((x) => x.image), tone: "lum", glow: "#ff6a3d", ground: "#1a1109", burnFrom: introEdge }}
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

        <p data-hero-in className="t-tagline absolute inset-x-0 bottom-16 text-center text-sand md:bottom-5">
          {tagline.map((l, i) => (
            <span key={i} className="block">{l}</span>
          ))}
        </p>
        </div>
      </div>
    </Panel>
  );
}
