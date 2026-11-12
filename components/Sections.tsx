import { site } from "@/content/site";
import { Panel } from "./Run";
import { Secondary, Words } from "./Buttons";
import Surface from "./Surface";

const pad = (n: number) => String(n).padStart(2, "0");

/* eslint-disable @next/next/no-img-element */

/** "Every future begins with one step." Transparent while sideways: the hero's own surface burns to dark around it. */
export function Intro() {
  const t = site.intro;
  return (
    <Panel id="intro" fx={["arrive"]} className="row:w-[165vw] bg-ground px-6 py-28 text-paper row:bg-transparent row:p-0">
      <h2 data-arrive className="t-display text-lacquer row:absolute row:left-[10vw]" style={{ bottom: "calc(100% - var(--line) + 14vh)" }}>
        {t.title.map((l, i) => <span key={i} className="block">{l}</span>)}
      </h2>
      <div data-arrive data-cursor="grow" className="duo mt-10 aspect-[4/5] w-40 row:absolute row:left-[88vw] row:top-[24vh] row:mt-0 row:w-[11vw]">
        <img src={t.portrait} alt="" loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="mt-12 row:absolute row:left-[106vw] row:mt-0 row:flex row:gap-[3vw]" style={{ top: "calc(var(--line) + 7vh)" }}>
        <p className="t-label shrink-0 text-sand row:pt-2">{t.label}</p>
        <p className="t-statement mt-4 max-w-[28rem] text-sand row:mt-0 row:w-[24vw]"><Words text={t.text} /></p>
      </div>
    </Panel>
  );
}

/** Full-bleed film the pointer stirs, with a small "student stories" card on the line linking to the testimonials. */
export function Film() {
  const f = site.film;
  return (
    <Panel fx={["reveal"]} className="row:w-screen relative h-[80svh] overflow-hidden bg-black">
      <div data-drift="0.06" className="absolute inset-[-3%_-8%]">
        <Surface opts={{ mode: "ground", ground: "#0f0f0f", images: [f.image], tone: "color", glow: "#ff8a5a" }} state={{ color: 1 }}>
          {f.video ? (
            <video className="h-full w-full object-cover" src={f.video} poster={f.image} autoPlay muted loop playsInline aria-hidden />
          ) : (
            <img src={f.image} alt="" loading="lazy" className="h-full w-full object-cover" />
          )}
        </Surface>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-black/20" />
      <a href={f.href} target="_blank" rel="noreferrer" data-cursor="snap" aria-label={`${f.label} (opens in a new tab)`} className="group absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-stretch bg-paper text-ground" style={{ top: "var(--line)" }}>
        <span className="block h-[72px] w-[120px] overflow-hidden">
          <img src={f.thumb} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
        </span>
        <span className="flex items-center gap-6 px-4">
          <span className="t-label">{f.cta.map((l, i) => <span key={i} className="block">{l}</span>)}</span>
          <svg viewBox="0 0 10 12" className="h-3 w-2.5 fill-current" aria-hidden><path d="M0 0l10 6-10 6z" /></svg>
        </span>
      </a>
      <p className="t-label absolute inset-x-0 text-center text-paper/80" style={{ top: "calc(var(--line) + 70px)" }}>{f.caption}</p>
    </Panel>
  );
}

/**
 * Who we are. Left: the statement above the line, the intro and "About us" below it. Middle: a big ring on the line
 * that draws itself while a photo opens inside it like an iris (colour as it crosses the middle). Right: three rings
 * on the line — what we handle — that light up as they pass.
 */
export function Poem() {
  const p = site.poem;
  return (
    <Panel id="poem" ink="dark" className="bd-clear relative bg-paper px-6 py-28 text-ground row:w-[172vw] row:p-0">
      {/* Statement */}
      <div data-arrive-group className="relative row:absolute row:inset-y-0 row:left-[8vw] row:w-[50vw]">
        <div className="row:absolute row:bottom-[calc(100%-var(--line)+32px)]">
          <p data-arrive className="t-label text-sand">{p.label}</p>
          <h2 className="t-display mt-5 row:whitespace-nowrap">
            {p.title.map((l, i) => (
              <span key={i} data-arrive className="block">
                {l.includes(p.accent) ? <>{l.split(p.accent)[0]}<span className="text-accent">{p.accent}</span>{l.split(p.accent)[1]}</> : l}
              </span>
            ))}
          </h2>
        </div>
        <div className="mt-8 row:absolute row:top-[calc(var(--line)+32px)] row:mt-0 row:w-[30vw]">
          <p data-arrive className="t-verse text-ground/75">{p.text}</p>
          <div data-arrive className="mt-6"><Secondary href={p.cta.href} label={p.cta.label} /></div>
        </div>
      </div>

      {/* A photo opening inside a ring */}
      <figure data-light className="relative mx-auto mt-14 aspect-square w-full max-w-[26rem] row:absolute row:left-[66vw] row:top-[var(--line)] row:mt-0 row:h-[84vh] row:w-[84vh] row:max-w-none row:-translate-y-1/2">
        <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
          <circle data-draw cx="50" cy="50" r="49.8" pathLength={1} className="ring" style={{ strokeOpacity: 0.35 }} />
        </svg>
        <div data-iris className="duo absolute inset-[7%] rounded-full">
          <img src={p.image} alt="" loading="lazy" className="h-full w-full scale-110 object-cover" />
        </div>
        <figcaption className="t-label absolute inset-x-0 -bottom-9 text-center text-sand">{p.caption}</figcaption>
      </figure>

      {/* What we handle */}
      <div className="relative mt-20 row:absolute row:inset-y-0 row:left-[122vw] row:mt-0 row:w-[44vw]">
        <p className="t-label text-sand row:absolute row:bottom-[calc(100%-var(--line)+15vw)]">{p.pillarsLabel}</p>
        <ul className="mt-6 grid gap-8 sm:grid-cols-3 row:absolute row:left-0 row:top-[var(--line)] row:mt-0 row:flex row:-translate-y-1/2 row:gap-0">
          {p.pillars.map((pl, i) => (
            <li key={pl.label} data-light className={`relative mx-auto grid aspect-square w-[60vw] max-w-[16rem] place-items-center sm:w-full row:w-[14.5vw] row:max-w-none ${i ? "row:-ml-[1.6vw]" : ""}`}>
              <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 h-full w-full"><circle cx="50" cy="50" r="49.6" className="ring" /></svg>
              <svg aria-hidden viewBox="0 0 24 24" className="lit-text absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2" stroke="currentColor" strokeWidth="1"><path d="M0 12h24M12 0v24" /></svg>
              <span className="absolute inset-x-0 top-[calc(50%+22px)] text-center">
                <span className="t-ui lit-text block">{pl.label}</span>
                <span className="t-small mt-1 block px-[14%] normal-case text-ground/60">{pl.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}

export function Rail() {
  const u = site.universities;
  return (
    <Panel id="universities" ink="dark" className="row:w-max row:flex bg-paper px-6 py-28 text-ground row:p-0">
      <div data-arrive-group className="relative row:h-full row:w-[62vw] row:shrink-0 row:pl-[8vw]">
        <h2 data-arrive className="t-display row:absolute row:whitespace-nowrap" style={{ bottom: "calc(100% - var(--line) + 32px)" }}>
          <span className="block">{u.title}</span>
          <span className="block text-accent">({u.items.length})</span>
        </h2>
        <p data-arrive className="t-small mt-6 max-w-[22rem] text-ground/60 row:absolute row:mt-0" style={{ top: "calc(var(--line) + 32px)" }}>{u.intro}</p>
      </div>
      <ul className="mt-12 grid gap-12 sm:grid-cols-2 row:mt-0 row:flex row:gap-0">
        {u.items.map((c, i) => (
          <li key={c.name} data-light className="relative row:h-full row:w-[19vw] row:shrink-0">
            <div data-cursor="grow" className="duo aspect-[4/3] row:absolute row:left-[1.5vw] row:right-[1.5vw] row:aspect-auto row:h-[27vh]" style={{ bottom: "calc(100% - var(--line) + 30px)" }}>
              <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <a href="#contact" aria-label={`Ask about ${c.name}`} data-cursor="snap" data-round className="relative my-4 grid h-9 w-9 place-items-center rounded-full row:absolute row:left-[1.5vw] row:my-0 row:top-[var(--line)] row:-translate-y-1/2">
              <svg viewBox="0 0 36 36" className="absolute inset-0" aria-hidden><circle cx="18" cy="18" r="17.5" className="ring" /></svg>
              <svg viewBox="0 0 12 12" className="lit-text h-3 w-3" stroke="currentColor" aria-hidden><path d="M0 6h12M6 0v12" /></svg>
            </a>
            <div className="row:absolute row:left-[1.5vw] row:right-[1.5vw]" style={{ top: "calc(var(--line) + 30px)" }}>
              <p className="t-label text-sand">{pad(i + 1)} · {c.city}</p>
              <h3 className="lit-text t-tagline mt-2">{c.name}</h3>
              <p className="t-small mt-3 text-ground/60">{c.level}</p>
              <p className="t-small text-ground/60">Intake · {c.intake}</p>
              <p className="t-label mt-2 text-ground/80">{c.fee}</p>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function Cities() {
  const c = site.cities;
  return (
    <Panel ink="dark" className="row:w-max row:flex bg-paper px-6 py-28 text-ground row:p-0">
      <div data-arrive-group className="relative row:h-full row:w-[64vw] row:shrink-0 row:pl-[8vw]">
        <h2 className="t-display row:absolute row:whitespace-nowrap" style={{ bottom: "calc(100% - var(--line) + 32px)" }}>
          {c.title.map((l, i) => <span key={i} data-arrive className="block">{l}</span>)}
        </h2>
      </div>
      <ul className="mt-12 grid gap-16 sm:grid-cols-2 row:mt-0 row:flex row:gap-[3vw] row:pr-[8vw]">
        {c.items.map((city, i) => (
          <li key={city.name} data-light className="relative row:h-full row:w-[24vw] row:shrink-0">
            <div className="relative mx-auto aspect-square w-full max-w-[22rem] row:absolute row:left-0 row:max-w-none row:top-[var(--line)] row:-translate-y-1/2">
              <div data-cursor="grow" className="duo absolute inset-[7%] rounded-full">
                <img src={city.image} alt={city.name} loading="lazy" className="h-full w-full scale-110 object-cover" />
              </div>
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden><circle cx="50" cy="50" r="49.8" className="ring" /></svg>
              <span className="t-label absolute left-1/2 top-[-1.75rem] -translate-x-1/2 text-sand">{pad(i + 1)}</span>
            </div>
            <div className="mt-6 text-center row:absolute row:inset-x-0 row:mt-0" style={{ top: "calc(var(--line) + 12vw + 24px)" }}>
              <h3 className="lit-text t-tagline">{city.name}</h3>
              <p className="t-small mt-2 text-ground/60">{city.note}</p>
              <p className="t-label mt-1 text-ground/80">{city.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function Steps() {
  const s = site.steps;
  return (
    <Panel id="steps" ink="dark" className="row:w-max row:flex bg-paper px-6 py-28 text-ground row:p-0">
      <div data-arrive-group className="relative row:h-full row:w-[42vw] row:shrink-0 row:pl-[8vw]">
        <div className="row:absolute" style={{ bottom: "calc(100% - var(--line) + 32px)" }}>
          <p data-arrive className="t-label text-sand">How it works</p>
          <h2 className="t-statement mt-6">
            {s.intro.map((line, i) => (
              <span key={i} data-arrive className="block pl-[calc(var(--i)*0.6em)] row:whitespace-nowrap row:pl-[calc(var(--i)*1.4em)]" style={{ ["--i" as string]: i }}>
                {i === 0 ? <span className="text-accent">{line}</span> : line}
              </span>
            ))}
          </h2>
        </div>
      </div>
      <ol className="relative mt-12 grid gap-10 sm:grid-cols-2 row:mt-0 row:flex row:gap-[2.5vw] row:pr-[10vw]">
        <span aria-hidden data-fill className="absolute left-0 hidden h-px w-full bg-accent row:block" style={{ top: "var(--line)" }} />
        {s.items.map((step, i) => (
          <li key={step.title} data-light className="relative mx-auto aspect-square w-full max-w-[22rem] shrink-0 row:h-full row:w-[24vw] row:max-w-none">
            <div className="absolute inset-0 row:inset-auto row:left-0 row:top-[var(--line)] row:h-[24vw] row:w-[24vw] row:-translate-y-1/2">
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden><circle cx="50" cy="50" r="49.8" className="ring" /></svg>
              {/* Title above the line, details below it: the line runs through the ring untouched. */}
              <div className="absolute inset-x-[14%] bottom-[54%] text-center">
                <p className="t-label lit-text text-sand">Step {pad(i + 1)}</p>
                <h3 className="t-tagline mt-2">{step.title}</h3>
              </div>
              <div className="absolute inset-x-[16%] top-[56%] text-center">
                <p className="t-small text-ground/60">{step.text}</p>
                <p className="t-label mt-3 inline-block border border-current/25 px-2 py-0.5 text-ground/70">{step.tag}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
