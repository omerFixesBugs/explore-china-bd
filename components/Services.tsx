"use client";
import { Fragment, useRef } from "react";
import { site } from "@/content/site";
import { gsap, SplitText, useGSAP, MOTION, isEdit } from "@/lib/motion";
import Surface from "./Surface";
import { Panel } from "./Run";

/* eslint-disable @next/next/no-img-element */

type Item = (typeof site.services)[number];

const total = site.services.length;
const nn = (n: number) => String(n).padStart(2, "0");

/**
 * One red card, one screen tall. The photo layer stays put; the content layer (title, statement, link card) is taller
 * than the screen and is scrolled up over the photo while the card is held — the reference's text parallax.
 */
function Card({ s, i, inRun = false }: { s: Item; i: number; inRun?: boolean }) {
  return (
    <>
      <div data-blur data-parallax={inRun ? "0.85" : undefined} className={`absolute inset-y-0 right-0 ${inRun ? "-left-[12vw]" : "left-0"}`}>
        <Surface opts={{ mode: "ground", ground: "#0e8c80", images: [s.image], tone: "duo", glow: "#f2b65a" }}>
          <div className="duo absolute inset-0">
            <img src={s.image} alt="" loading="lazy" className="h-full w-full object-cover" />
          </div>
        </Surface>
      </div>

      <div data-content data-shift={inRun ? "0.35" : undefined} className="relative flex flex-col gap-10 lg:absolute lg:inset-x-0 lg:top-0 lg:block lg:h-[160vh] mo:absolute mo:inset-x-0 mo:top-0 mo:block mo:h-[160svh]">
        <svg aria-hidden viewBox="0 0 100 100" className="pointer-events-none absolute left-[14vw] top-[72vh] hidden h-[66vw] w-[66vw] lg:block mo:block mo:left-[-10vw] mo:top-[46svh] mo:h-[120vw] mo:w-[120vw]">
          <circle data-ring cx="50" cy="50" r="49.9" pathLength={1} className={`fill-none stroke-paper/45 [vector-effect:non-scaling-stroke] ${inRun ? "" : "[stroke-dasharray:1]"}`} />
        </svg>

        <h2 data-title className="t-display relative text-center lg:absolute lg:inset-x-[6vw] lg:top-[24vh] mo:absolute mo:inset-x-6 mo:top-[22svh]">{s.title}</h2>

        <div className="relative lg:absolute lg:left-[58vw] lg:top-[62vh] lg:w-[30vw] mo:absolute mo:inset-x-6 mo:top-[60svh] mo:max-w-[36rem]">
          <p className="t-label mb-4 text-paper/70">Services · {nn(i + 1)}/{nn(total)}</p>
          <p data-card-lines className="t-statement">{s.text[0]}</p>
          <p data-card-lines className="t-statement mt-8 lg:ml-[7vw] mo:ml-10">{s.text[1]}</p>
        </div>

        <div className="relative lg:absolute lg:left-[6vw] lg:top-[calc(55vh+var(--line)-36px)] mo:absolute mo:left-6 mo:top-[122svh]">
          <p className="t-label mb-2 text-paper/80">{s.course.label}</p>
          <a href="#contact" data-cursor="snap" className="group flex w-[19rem] items-stretch bg-paper/90 text-ground backdrop-blur-sm">
            <span className="block h-[72px] w-[110px] shrink-0 overflow-hidden">
              <img src={s.image} alt="" loading="lazy" className="h-full w-full object-cover grayscale transition-[filter,transform] duration-700 ease-out group-hover:scale-110 group-hover:grayscale-0" />
            </span>
            <span className="flex flex-1 items-center justify-between px-4">
              <span className="t-label">Ask about<span className="block">{s.course.name}</span></span>
              <span aria-hidden className="transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
            </span>
          </a>
        </div>
      </div>
      <div data-shade aria-hidden className="pointer-events-none absolute inset-0 bg-black opacity-0" />
    </>
  );
}

/**
 * The last service card opens the second sideways run (as the reference's "Change the world"): it swings in over the
 * stack and pins; as the gallery comes in from the right with a clean edge, the photo holds still behind the moving
 * card (window parallax) while the text slides off to the left a little faster than the card.
 */
export function LastService() {
  const i = total - 1;
  return (
    <Panel id="services-last" className="relative min-h-svh overflow-hidden px-6 py-28 text-paper row:w-screen row:min-h-0 row:p-0 mo:h-[175svh] mo:p-0">
      <Card s={site.services[i]} i={i} inRun />
    </Panel>
  );
}

/**
 * Value stack, as in the reference: each red card swings in from its top-left corner over the previous one and pins
 * at the top; while it is held its text scrolls up over the still photo (parallax); only then does the next card come,
 * darkening and blurring the one beneath. The last card lives in the next run.
 */
export default function Services() {
  const ref = useRef<HTMLElement>(null);
  const items = site.services.slice(0, -1);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    // Desktop as before; phones and tablets too (their stacked `mo:` layout), except in edit mode.
    mm.add({ lg: "(min-width: 1024px)", motion: MOTION }, (ctx) => {
      const { lg, motion } = ctx.conditions as { lg: boolean; motion: boolean };
      if (!motion || (!lg && isEdit())) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
      const travels = gsap.utils.toArray<HTMLElement>("[data-travel]");
      const run = document.getElementById("journey");
      const last = document.getElementById("services-last");
      if (last && run) {
        gsap.fromTo(last, { rotate: 6, transformOrigin: "0% 0%" }, { rotate: 0, ease: "none", scrollTrigger: { trigger: run, start: "top bottom", end: "top 15%", scrub: true } });
        gsap.from(last.querySelector("[data-title]"), { autoAlpha: 0, filter: "blur(14px)", duration: 1.4, ease: "power2.out", scrollTrigger: { trigger: run, start: "top 60%" } });
        last.querySelectorAll<HTMLElement>("[data-card-lines]").forEach((p) => {
          const split = SplitText.create(p, { type: "lines", mask: "lines" });
          gsap.from(split.lines, { yPercent: 105, duration: 1.2, stagger: 0.09, ease: "power3.out", scrollTrigger: { trigger: run, start: "top 40%" } });
        });
      }
      cards.forEach((card, i) => {
        gsap.fromTo(card, { rotate: 6, transformOrigin: "0% 0%" }, { rotate: 0, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "top 15%", scrub: true } });
        gsap.fromTo(card.querySelector("[data-ring]"), { strokeDashoffset: 1, rotate: -100, transformOrigin: "50% 50%" }, { strokeDashoffset: 0, rotate: 0, ease: "none", scrollTrigger: { trigger: travels[i], start: "top bottom", end: "bottom bottom", scrub: true } });
        // Held at the top: the text scrolls up over the still photo before the next card may come.
        gsap.fromTo(card.querySelector("[data-content]"), { y: 0 }, { y: "-55vh", ease: "none", scrollTrigger: { trigger: travels[i], start: "top bottom", end: "bottom bottom", scrub: true } });
        gsap.from(card.querySelector("[data-title]"), { autoAlpha: 0, filter: "blur(14px)", duration: 1.4, ease: "power2.out", scrollTrigger: { trigger: card, start: "top 60%" } });
        card.querySelectorAll<HTMLElement>("[data-card-lines]").forEach((p) => {
          const split = SplitText.create(p, { type: "lines", mask: "lines" });
          gsap.from(split.lines, { yPercent: 105, duration: 1.2, stagger: 0.09, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 30%" } });
        });
        // Covered by the next card, or by the run that opens with the last one.
        const next = cards[i + 1] ?? run;
        if (next)
          gsap.timeline({ scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true } })
            .fromTo(card.querySelector("[data-shade]"), { opacity: 0 }, { opacity: 0.7, ease: "none" }, 0)
            .fromTo(card.querySelector("[data-blur]"), { filter: "blur(0px)" }, { filter: "blur(10px)", ease: "none" }, 0);
      });
    });
  }, { scope: ref });

  return (
    <section ref={ref} id="services" aria-label="Services" className="relative overflow-x-clip bg-ground">
      {items.map((s, i) => (
        <Fragment key={s.title}>
          <article
            data-card
            className="relative flex min-h-svh flex-col gap-10 overflow-hidden px-6 py-28 text-paper lg:sticky lg:top-0 lg:block lg:h-screen lg:min-h-0 lg:p-0 mo:sticky mo:top-0 mo:block mo:h-svh mo:min-h-0 mo:p-0"
            style={{ zIndex: i + 1 }}
          >
            <Card s={s} i={i} />
          </article>
          {/* Scroll room while this card is held and its text travels; the next card only comes after it. */}
          <div data-travel aria-hidden className="hidden h-[110vh] lg:block mo:block" />
        </Fragment>
      ))}
      {/* Keeps the last card pinned for one more screen while the next run rises over it. */}
      <div aria-hidden className="stack-tail" />
    </section>
  );
}
