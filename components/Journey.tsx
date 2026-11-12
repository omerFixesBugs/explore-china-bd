"use client";
import { useEffect, useRef } from "react";
import { site } from "@/content/site";
import { Panel } from "./Run";
import { Secondary, Words } from "./Buttons";
import { Wordmark } from "./Hero";
import { createSurface } from "@/lib/surface";
import { fineMotion, gsap, isEdit } from "@/lib/motion";

/* eslint-disable @next/next/no-img-element */

const left = (id: string) => document.getElementById(id)?.getBoundingClientRect().left ?? 1e5;

/**
 * One screen-fixed WebGL backdrop behind the gallery, invitation, red statement and poem (transparent while it runs).
 * Each burn is tied to the left edge of the panel that is arriving, exactly like the hero → intro: the previous panel
 * holds still, the next one is pulled in, and its smoke (paper burn, embers, white fog) eats the previous one.
 * Until it is ready, and on touch / reduced motion, the panels keep their own plain backgrounds.
 */
export function Backdrop() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fineMotion() || isEdit()) return;
    const h = host.current!;
    const root = document.documentElement;
    let s: ReturnType<typeof createSurface> = null;
    const watched = ["life", "contact", "red", "poem"].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const seen = new Set<Element>();
    const start = () => {
      if (s || !document.getElementById("journey")?.classList.contains("is-row")) return;
      s = createSurface(
        h,
        {
          mode: "ground",
          images: [site.bleed.image],
          scale: 0.6,
          strength: 0.05,
          backdrop: {
            edges: () => [left("contact"), left("red"), left("poem")],
            red: () => {
              const r = document.getElementById("red")?.getBoundingClientRect();
              return r ? [r.left, r.width] : [1e5, 1];
            },
          },
        },
        () => ({}),
        () => (ready = true),
      );
    };
    // Only show once the run is pinned (its top at the screen top): while the run is still rising over the
    // service stack, a full-screen backdrop would hide the card underneath.
    let ready = false;
    const gate = () => {
      const run = document.getElementById("journey");
      const on = ready && !!s && !!run && run.getBoundingClientRect().top <= 1;
      h.style.visibility = on ? "visible" : "hidden";
      root.classList.toggle("has-backdrop", on);
    };
    gsap.ticker.add(gate);
    const stop = () => {
      s?.destroy();
      s = null;
      ready = false;
      root.classList.remove("has-backdrop");
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
        if (seen.size) start();
        else stop();
      },
      { rootMargin: "0px 60%" },
    );
    watched.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      gsap.ticker.remove(gate);
      stop();
    };
  }, []);

  return <div ref={host} aria-hidden className="pointer-events-none fixed inset-0" style={{ zIndex: 9 }} />;
}

/** Invitation: holds still (its words blur away) while the red statement burns in over it. */
export function Invitation() {
  const t = site.invitation;
  return (
    <Panel id="contact" fx={["stay"]} fadeAt={0.37} className="bd-clear relative min-h-svh overflow-hidden bg-ground px-6 py-28 text-paper row:w-[150vw] row:min-h-0 row:p-0">
      <div data-stay-fade className="relative row:absolute row:inset-y-0 row:left-0 row:w-screen">
        <Wordmark className="!top-[2vh] !px-[1.2vw]" />
        <div className="relative pt-[22vw] row:absolute row:left-[30vw] row:top-[calc(var(--line)-44px)] row:flex row:gap-[3vw] row:pt-0">
          <p className="t-label shrink-0 text-sand row:pt-2">{t.label}</p>
          <div className="mt-4 row:mt-0">
            <p className="t-statement max-w-[30rem] text-sand row:w-[30vw]"><Words text={t.text} /></p>
            <div className="mt-6 text-sand"><Secondary href={t.cta.href} label={t.cta.label} arrow /></div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

/** Red statement: burns in over the invitation, then holds while the poem's white fog rolls in. */
export function RedStatement() {
  const b = site.bleed;
  return (
    <Panel id="red" fx={["stay"]} fadeAt={0.32} className="relative min-h-[80svh] overflow-hidden text-paper row:w-[140vw] row:min-h-0">
      <div className="bd-hide absolute inset-0 bg-accent">
        <img src={b.image} alt="" loading="lazy" className="h-full w-full object-cover mix-blend-multiply grayscale" />
      </div>
      <div data-stay-fade className="relative px-6 py-28 text-center row:absolute row:inset-y-0 row:left-0 row:w-screen row:p-0">
        <div className="row:absolute row:inset-x-0 row:bottom-[calc(100%-var(--line)+28px)]">
          <p className="t-label text-paper/85"><Words text={b.label} /></p>
          <h2 className="t-display mt-4">{b.statement.map((l, i) => <span key={i} className="block"><Words text={l} /></span>)}</h2>
        </div>
      </div>
    </Panel>
  );
}
