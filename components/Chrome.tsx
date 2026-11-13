"use client";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { Primary, Secondary } from "./Buttons";
import Surface from "./Surface";
import { SMOKE_WARM } from "./Hero";
import { Mark } from "./Logo";
import { gsap, useGSAP } from "@/lib/motion";

type LenisLike = { stop: () => void; start: () => void };
const lenis = () => (window as unknown as { lenis?: LenisLike }).lenis;

/** Is the page under this screen point a light ([data-ink="dark"]) area? Corners themselves are skipped. */
function darkAt(x: number, y: number) {
  for (const el of document.elementsFromPoint(x, y)) {
    if (el.closest("[data-corners], .cursor")) continue;
    return !!el.closest('[data-ink="dark"]') && !el.closest('[data-ink="light"]');
  }
  return false;
}

/** No navbar: menu icon on the line, a meet button and a social link in the bottom corners, a hint top-right. */
export default function Chrome() {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(true);
  const [ink, setInk] = useState({ menu: false, meet: false, social: false, footer: false });
  const menu = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // Corners switch to umber over ivory sections.
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const line = btn.current?.getBoundingClientRect();
      const ly = line ? line.top + line.height / 2 : innerHeight / 2;
      const footer = !!document.elementsFromPoint(innerWidth - 120, 34).find((el) => !el.closest("[data-corners]"))?.closest("footer");
      const next = { menu: darkAt(30, ly), meet: darkAt(60, innerHeight - 36), social: darkAt(innerWidth - 60, innerHeight - 36), footer };
      setInk((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    };
    const on = () => (raf ||= requestAnimationFrame(check));
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    on();
    return () => {
      removeEventListener("scroll", on);
      removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  useGSAP(() => {
    tl.current = gsap.timeline({ paused: true })
      .fromTo(menu.current, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power3.inOut" })
      .from("[data-menu-item]", { x: () => -innerWidth * 0.6, rotate: -200, autoAlpha: 0, stagger: 0.07, duration: 1.3, ease: "power3.out" }, "-=0.55")
      .from("[data-menu-fade]", { autoAlpha: 0, filter: "blur(8px)", duration: 0.8, stagger: 0.05 }, "-=0.9");
  }, { scope: menu });

  useEffect(() => {
    const t = tl.current;
    if (open) {
      lenis()?.stop();
      t?.timeScale(1).play();
      menu.current?.querySelector<HTMLElement>("[data-close]")?.focus();
    } else if (t && t.progress() > 0) {
      lenis()?.start();
      t.timeScale(1.8).reverse();
    }
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [open]);

  const close = () => {
    lenis()?.start(); // before the anchor handler scrolls
    setOpen(false);
    btn.current?.focus();
  };
  const c = (dark: boolean) => (dark ? "text-ground" : "text-paper");
  const fade = open ? "pointer-events-none opacity-0" : "opacity-100";

  return (
    <div data-corners>
      {/* Menu icon sits on the line, at the left edge */}
      <button
        ref={btn}
        onClick={() => setOpen(true)}
        data-cursor="snap"
        data-cursor-snap-to="svg"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="site-menu"
        className={`group fixed left-0 z-[60] -translate-y-1/2 p-5 transition-[color,opacity] duration-500 ${c(ink.menu)} ${fade}`}
        style={{ top: "var(--line)" }}
      >
        <svg viewBox="0 0 24 14" className="h-[14px] w-6 overflow-visible" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
          <path d="M0 1h24" className="transition-transform duration-500 ease-out group-hover:translate-y-[3px]" />
          <path d="M0 7h24" />
          <path d="M0 13h24" className="transition-transform duration-500 ease-out group-hover:-translate-y-[3px]" />
        </svg>
      </button>

      <div className={`fixed bottom-3 left-1 z-[60] transition-[color,opacity] duration-500 md:bottom-5 ${c(ink.meet)} ${fade}`}>
        <Primary href={site.corners.meet.href}>{site.corners.meet.label}</Primary>
      </div>
      <div className={`fixed bottom-3 right-1 z-[60] hidden transition-[color,opacity] duration-500 md:bottom-5 md:block ${c(ink.social)} ${fade}`}>
        <Primary href={site.corners.social.href}>{site.corners.social.label}</Primary>
      </div>

      {hint && !ink.footer && (
        <div className={`fixed right-5 top-5 z-[60] hidden items-center bg-paper text-ground transition-opacity duration-500 md:flex ${fade}`}>
          <button onClick={() => setHint(false)} aria-label="Dismiss" data-cursor="snap" className="group grid h-7 w-7 place-items-center">
            <svg viewBox="0 0 12 12" className="h-3 w-3 text-accent transition-transform duration-500 ease-out group-hover:rotate-90" stroke="currentColor" aria-hidden>
              <path d="M1 1l10 10M11 1L1 11" />
            </svg>
          </button>
          <a href={site.corners.hint.href} data-cursor="snap" className="t-small py-1.5 pr-3">
            {site.corners.hint.label}
          </a>
          <span aria-hidden className="absolute -right-1.5 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[6px] border-l-[6px] border-y-transparent border-l-paper" />
        </div>
      )}

      {/* Menu */}
      <div ref={menu} id="site-menu" role="dialog" aria-modal="true" aria-label="Menu" inert={!open} className="fixed inset-0 z-[95] overflow-hidden text-paper" style={{ clipPath: "inset(0% 0% 100% 0%)" }}>
        {open ? (
          <Surface opts={{ mode: "smoke", palette: SMOKE_WARM, glow: "#ffe6bf" }}>
            <div className="smoke-fallback absolute inset-0" />
          </Surface>
        ) : (
          <div aria-hidden className="smoke-fallback absolute inset-0" />
        )}
        <span aria-hidden className="absolute inset-x-0 h-px bg-paper/30" style={{ top: "var(--line)" }} />
        <button data-close data-menu-fade data-cursor="snap" onClick={close} className="t-small absolute left-4 top-5 flex items-center gap-2 p-1 md:left-5">
          Close
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" stroke="currentColor" aria-hidden><path d="M1 1l10 10M11 1L1 11" /></svg>
        </button>
        <span data-menu-fade className="absolute right-5 top-5 hidden md:block"><Mark className="h-9 w-9" /></span>

        <nav aria-label="Main" className="absolute inset-x-0 flex -translate-y-1/2 justify-start overflow-x-auto px-4 [scrollbar-width:none] md:px-0" style={{ top: "var(--line)" }}>
          {site.menu.items.map((m) => (
            <a
              key={m.href}
              href={m.href}
              onClick={close}
              data-menu-item
              data-cursor="dissolve"
              data-cursor-snap-to="svg"
              className="group relative -mr-[2.2vw] grid aspect-square w-[44vw] shrink-0 place-items-center sm:w-[30vw] md:w-[19vw]"
            >
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]" aria-hidden>
                <circle cx="50" cy="50" r="49.6" className="fill-none stroke-paper/40 transition-[stroke] duration-500 [vector-effect:non-scaling-stroke] group-hover:stroke-paper group-focus-visible:stroke-paper" />
              </svg>
              <span className="t-tagline">{m.label}</span>
            </a>
          ))}
        </nav>

        <div data-menu-fade className="absolute inset-x-0 bottom-16 flex flex-wrap justify-center gap-3 px-4 md:bottom-5">
          {site.menu.actions.map((a) => (
            <Secondary key={a.label} href={a.href} label={a.label} />
          ))}
        </div>
      </div>
    </div>
  );
}
