"use client";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { Secondary } from "./Buttons";
import Surface from "./Surface";
import { Mark } from "./Logo";
import { HeroRings, Wordmark, SMOKE_HERO, SMOKE_WARM } from "./Hero";
import { gsap, useGSAP } from "@/lib/motion";

export function Faq() {
  const f = site.faq;
  return (
    <section id="faq" data-ink="dark" className="bg-paper px-6 py-28 text-ground md:px-[8vw] md:py-40">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-[6vw]">
        <div>
          <p className="t-label text-sand">FAQ</p>
          <h2 className="t-display mt-6 lg:sticky lg:top-32">
            {f.title.map((l, i) => <span key={i} className={`block ${i === f.title.length - 1 ? "text-accent" : ""}`}>{l}</span>)}
          </h2>
        </div>
        <div className="border-t border-ground/20">
          {f.items.map((it, i) => (
            // `name` makes the native accordion single-open.
            <details key={it.q} name="faq" className="group border-b border-ground/20" open={i === 0}>
              <summary data-cursor="snap" className="t-statement flex cursor-pointer items-center justify-between gap-6 py-7 transition-colors duration-500 hover:text-accent">
                <span>{it.q}</span>
                <span aria-hidden className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-current/25 group-open:border-accent group-open:text-accent">
                  <svg viewBox="0 0 12 12" className="h-3 w-3" stroke="currentColor"><path d="M0 6h12" /><path className="plus-v" d="M6 0v12" /></svg>
                </span>
              </summary>
              <p className="answer t-verse max-w-[40rem] pb-9 text-ground/70">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Footer: warm smoke drifting out of an ivory mist, a large ring, the closing line and a white orb that opens the breathing moment. */
export function Footer() {
  const f = site.footer;
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(ref.current, { "--fog": 1 }, { "--fog": 0, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 10%", scrub: true } });
    gsap.from(ref.current!.querySelectorAll("[data-foot-in]"), { autoAlpha: 0, filter: "blur(10px)", duration: 1.4, stagger: 0.1, ease: "power2.out", scrollTrigger: { trigger: ref.current, start: "top 40%" } });
  }, { scope: ref });

  return (
    <footer ref={ref} className="relative h-svh min-h-[640px] overflow-hidden text-paper" style={{ ["--fog" as string]: 0 }}>
      <Surface opts={{ mode: "smoke", palette: SMOKE_WARM, glow: "#ffd2b8" }}>
        <div className="smoke-fallback absolute inset-0" />
      </Surface>
      <span aria-hidden className="absolute inset-x-0 h-px bg-paper/30" style={{ top: "var(--line)" }} />
      <svg aria-hidden viewBox="0 0 100 100" className="pointer-events-none absolute left-1/2 h-[min(84vh,92vw)] w-[min(84vh,92vw)] -translate-x-1/2 -translate-y-1/2" style={{ top: "calc(var(--line) - 6vh)" }}>
        <circle cx="50" cy="50" r="49.9" className="ring" style={{ strokeOpacity: 0.35 }} />
      </svg>

      <div className="t-small absolute left-5 top-5 flex flex-col items-start gap-1">
        <span className="text-paper/70">Social</span>
        {f.social.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer" data-cursor="snap" className="group flex items-center gap-1">
            <span className="roll"><span>{s.label} ↗</span><span aria-hidden>{s.label} ↗</span></span>
          </a>
        ))}
      </div>
      <div className="t-small absolute right-5 top-5 flex flex-col items-end gap-1">
        {f.legal.map((s) => (
          <a key={s.label} href={s.href} data-cursor="snap">
            <span className="roll"><span>{s.label}</span><span aria-hidden>{s.label}</span></span>
          </a>
        ))}
      </div>

      <div className="absolute inset-x-0 text-center" style={{ bottom: "calc(100% - var(--line) + 70px)" }}>
        <h2 data-foot-in className="t-tagline">{f.heading.map((l, i) => <span key={i} className="block">{l}</span>)}</h2>
        <p data-foot-in className="t-small mt-4 normal-case text-paper/80">{f.sub}</p>
      </div>
      <button
        data-foot-in
        type="button"
        aria-label="Take a breath"
        data-cursor="dissolve"
        onClick={() => window.dispatchEvent(new Event("breath:open"))}
        className="group absolute left-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper text-accent transition-transform duration-500 ease-out hover:scale-110"
        style={{ top: "var(--line)" }}
      >
        <svg viewBox="0 0 12 12" className="h-3 w-3 transition-transform duration-700 ease-out group-hover:rotate-90" stroke="currentColor" aria-hidden><path d="M0 6h12M6 0v12" /></svg>
      </button>

      <div className="t-small absolute inset-x-0 bottom-16 text-center md:bottom-5">
        <p className="flex items-center justify-center gap-2">{f.credit[0]} <Mark className="h-4 w-4" /> {f.credit[1]}</p>
        <p className="mt-1 text-paper/70">{site.name} © {site.year}</p>
      </div>
    </footer>
  );
}

/** A copy of the hero after the footer. Reaching it jumps back to the real hero (see Shell), so the page loops. */
export function LoopTail() {
  return (
    <div id="loop-tail" aria-hidden inert className="loop-tail relative h-svh overflow-hidden bg-deep text-paper">
      <Surface opts={{ mode: "smoke", palette: SMOKE_HERO, glow: "#ff6a3d" }}>
        <div className="smoke-fallback absolute inset-0" />
      </Surface>
      <span className="absolute inset-x-0 h-px bg-paper/25" style={{ top: "var(--line)" }} />
      <Wordmark />
      <HeroRings interactive={false} />
      <p className="t-tagline absolute inset-x-0 bottom-5 text-center text-sand">
        {site.hero.tagline.map((l, i) => <span key={i} className="block">{l}</span>)}
      </p>
    </div>
  );
}

/** A guided breath: the rings swell and settle, a count runs, then a gentle invitation. */
export function Breath() {
  const b = site.breath;
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");
  const [count, setCount] = useState(4);
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const on = () => {
      setPhase("in");
      setCount(4);
      setOpen(true);
    };
    addEventListener("breath:open", on);
    return () => removeEventListener("breath:open", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const l = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    l?.stop();
    close.current?.focus();
    let t = 0;
    const id = setInterval(() => {
      t++;
      const cycle = Math.floor(t / 4);
      if (cycle >= 6) return setPhase("done"), clearInterval(id);
      setPhase(cycle % 2 ? "out" : "in");
      setCount(4 - (t % 4));
    }, 1000);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", esc);
    gsap.fromTo(ref.current, { clipPath: "circle(0% at 50% 60%)" }, { clipPath: "circle(150% at 50% 60%)", duration: 1.2, ease: "power3.inOut" });
    return () => {
      clearInterval(id);
      removeEventListener("keydown", esc);
      l?.start();
    };
  }, [open]);

  if (!open) return null;
  const scale = phase === "in" ? 1.12 : 0.92;
  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label="Take a breath" className="fixed inset-0 z-[97] overflow-hidden text-paper" style={{ background: "linear-gradient(180deg, #efe2db 0%, #e8705a 42%, #e2331c 75%, #c41d12 100%)" }}>
      <span aria-hidden className="absolute inset-x-0 h-px bg-paper/40" style={{ top: "var(--line)" }} />
      <div aria-hidden className="absolute left-1/2 h-[min(56vh,80vw)] w-[min(56vh,80vw)] -translate-x-1/2 -translate-y-1/2" style={{ top: "var(--line)" }}>
        <span className="absolute inset-0 rounded-full border border-paper/50 transition-transform duration-[4000ms] ease-in-out" style={{ transform: `scale(${scale})` }} />
        <span className="absolute inset-[-2%] rounded-full border border-paper/30 transition-transform duration-[4000ms] ease-in-out" style={{ transform: `scale(${scale * 1.02})` }} />
        {phase !== "done" && [0, 1].map((k) => (
          <span key={k} className="absolute inset-[30%] rounded-full border border-paper/50" style={{ animation: `ripple 4s ${k * 2}s ease-out infinite` }} />
        ))}
      </div>
      <button ref={close} type="button" aria-label="Close" data-cursor="dissolve" onClick={() => setOpen(false)} className="group absolute left-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper text-accent" style={{ top: "var(--line)" }}>
        <svg viewBox="0 0 12 12" className="h-3 w-3 transition-transform duration-500 group-hover:rotate-90" stroke="currentColor" aria-hidden><path d="M1 1l10 10M11 1L1 11" /></svg>
      </button>
      <div className="absolute inset-x-0 text-center" style={{ top: "calc(var(--line) + 44px)" }} aria-live="polite">
        {phase === "done" ? (
          <div className="mx-auto max-w-md px-6">
            <p className="t-tagline">{b.done}</p>
            <p className="t-small mt-3 normal-case text-paper/85">{b.note}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Secondary href={site.whatsapp} label="WhatsApp" />
              <Secondary href={`tel:${site.phone.replace(/\s/g, "")}`} label="Call us" />
            </div>
          </div>
        ) : (
          <>
            <p className="t-tagline">{phase === "in" ? b.inhale : b.exhale}</p>
            <p className="t-tagline">{String(count).padStart(2, "0")}</p>
          </>
        )}
      </div>
    </div>
  );
}
