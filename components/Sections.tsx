import { site } from "@/content/site";
import { Panel } from "./Run";
import { Secondary } from "./Buttons";
import Surface from "./Surface";

const pad = (n: number) => String(n).padStart(2, "0");

/* eslint-disable @next/next/no-img-element */

/**
 * "Every future begins with one step." Transparent while sideways: the hero's own surface burns to dark around it.
 * Sideways it holds the run still: the title stays left, the photo grows towards it ([data-grow]) and stops short,
 * then the text below the line passes through from right to left ([data-pass]) before the run moves on.
 */
export function Intro() {
  const t = site.intro;
  return (
    <Panel id="intro" fx={["arrive", "hold"]} className="row:w-[260vw] bg-ground px-6 py-28 text-paper row:bg-transparent row:p-0 mo:h-svh mo:bg-transparent mo:p-0">
      <div data-stage className="row:absolute row:inset-y-0 row:left-0 row:w-screen mo:relative mo:h-full">
        <h2 data-arrive className="t-display text-jade row:absolute row:left-[6vw] mo:absolute mo:left-6 mo:top-[11svh]" style={{ bottom: "calc(100% - var(--line) + 14vh)" }}>
          {t.title.map((l, i) => <span key={i} className="block">{l}</span>)}
        </h2>
        <div data-grow="0.28" data-cursor="grow" className="duo mt-10 aspect-[4/5] w-40 origin-bottom-right row:absolute row:left-[54vw] row:right-[6vw] row:top-[8vh] row:mt-0 row:aspect-auto row:w-auto mo:absolute mo:inset-x-6 mo:top-[33svh] mo:mt-0 mo:h-[30svh] mo:w-auto mo:aspect-auto" style={{ bottom: "calc(100% - var(--line) + 24px)" }}>
          <img src={t.portrait} alt="" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div data-pass className="mt-12 row:absolute row:left-[40vw] row:mt-0 row:flex row:w-[52vw] row:gap-[3vw] mo:absolute mo:inset-x-6 mo:top-[67svh] mo:mt-0" style={{ top: "calc(var(--line) + 7vh)" }}>
          <p className="t-label shrink-0 text-sand row:pt-2">{t.label}</p>
          <p className="t-statement mt-4 max-w-[28rem] text-sand row:mt-0 row:max-w-none mo:mt-2 mo:max-w-[36rem]">{t.text}</p>
        </div>
      </div>
    </Panel>
  );
}

/**
 * Student stories: a dimmed full-bleed photo the pointer stirs; the heading sits above the line on the left,
 * and three testimonial cards (who, where they study, which visa, in their words) ride the line to the right.
 */
export function Film() {
  const f = site.stories;
  return (
    <Panel id="stories" className="relative overflow-hidden bg-deep px-6 py-28 text-paper row:w-[175vw] row:p-0">
      <div data-drift="0.06" className="absolute inset-[-3%_-8%]">
        <Surface opts={{ mode: "ground", ground: "#070d12", images: [f.image], tone: "color", glow: "#ffd08a" }} state={{ color: 1 }}>
          <img src={f.image} alt="" loading="lazy" className="h-full w-full object-cover" />
        </Surface>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-deep/90 via-deep/70 to-deep/40" />

      <div data-arrive-group data-drift="0.2" className="relative row:absolute row:inset-y-0 row:left-[8vw] row:w-[46vw]">
        <div className="row:absolute row:bottom-[calc(100%-var(--line)+32px)]">
          <p data-arrive className="t-label text-sand">{f.label}</p>
          <h2 className="t-display mt-5 text-jade row:whitespace-nowrap">
            {f.title.map((l, i) => <span key={i} data-arrive className="block">{l}</span>)}
          </h2>
        </div>
        <div className="mt-8 row:absolute row:top-[calc(var(--line)+32px)] row:mt-0 row:w-[28vw]">
          <p data-arrive className="t-verse max-w-[34rem] text-paper/80">{f.text}</p>
          <div data-arrive className="mt-6"><Secondary href={f.cta.href} label={f.cta.label} arrow /></div>
        </div>
      </div>

      <ul data-drift="-0.07" className="relative mt-14 grid gap-6 md:grid-cols-3 row:absolute row:left-[60vw] row:top-[var(--line)] row:mt-0 row:flex row:-translate-y-1/2 row:gap-[3vw]">
        {f.items.map((s) => (
          <li key={s.name} data-light className="flex flex-col bg-paper p-7 text-ground row:w-[33vw] row:p-[2.4vw]">
            <svg viewBox="0 0 24 18" className="lit-text h-5 w-6 fill-current text-sand" aria-hidden><path d="M0 18V9.6C0 3.9 3.2.7 9.3 0l.8 2.6C6.7 3.4 5.2 5 5 7.6h4.6V18zm13.9 0V9.6C13.9 3.9 17.1.7 23.2 0l.8 2.6c-3.4.8-4.9 2.4-5.1 5h4.6V18z" /></svg>
            <blockquote className="t-verse mt-5 flex-1">{s.quote}</blockquote>
            <div className="mt-8 flex items-center gap-4 border-t border-current/15 pt-5">
              <span aria-hidden className="t-label grid h-12 w-12 shrink-0 place-items-center rounded-full border border-current/25 text-accent">{s.name.split(" ").map((w) => w[0]).join("")}</span>
              <div className="min-w-0">
                <p className="t-ui">{s.name} <span className="text-ground/50">· {s.from}</span></p>
                <p className="t-small mt-1 text-ground/60">{s.detail}</p>
                <p className="t-label lit-text mt-2 inline-block border border-current/25 px-2 py-0.5 text-ground/70">{s.tag}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
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
            <li key={pl.label} data-light data-touch className={`relative mx-auto grid aspect-square w-[60vw] max-w-[16rem] place-items-center sm:w-full row:w-[14.5vw] row:max-w-none ${i ? "row:-ml-[1.6vw]" : ""}`}>
              <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 h-full w-full"><circle cx="50" cy="50" r="49.6" className="ring" /></svg>
              <svg data-magnet aria-hidden viewBox="0 0 24 24" className="lit-text absolute inset-0 m-auto h-5 w-5" stroke="currentColor" strokeWidth="1"><path d="M0 12h24M12 0v24" /></svg>
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
      <ul aria-label="Universities, swipe for more" className="mt-12 grid gap-12 sm:grid-cols-2 row:mt-0 row:flex row:gap-0 mo:-mx-6 mo:flex mo:snap-x mo:snap-mandatory mo:overflow-x-auto mo:px-6 mo:pb-4 mo:[scrollbar-width:none] mo:gap-6">
        {u.items.map((c, i) => (
          <li key={c.name} data-light className="relative row:h-full row:w-[19vw] row:shrink-0 mo:w-[76vw] mo:max-w-[22rem] mo:shrink-0 mo:snap-start">
            <div data-cursor="grow" className="duo aspect-[4/3] row:absolute row:left-[1.5vw] row:right-[1.5vw] row:aspect-auto row:h-[27vh]" style={{ bottom: "calc(100% - var(--line) + 30px)" }}>
              <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <a href="#contact" aria-label={`Ask about ${c.name}`} data-cursor="snap" data-round data-touch className="relative my-4 grid h-9 w-9 place-items-center rounded-full row:absolute row:left-[1.5vw] row:my-0 row:top-[var(--line)] row:-translate-y-1/2">
              <svg viewBox="0 0 36 36" className="absolute inset-0" aria-hidden><circle cx="18" cy="18" r="17.5" className="ring" /></svg>
              <svg data-magnet viewBox="0 0 12 12" className="lit-text h-3 w-3" stroke="currentColor" aria-hidden><path d="M0 6h12M6 0v12" /></svg>
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
      <ul aria-label="Cities, swipe for more" className="mt-12 grid gap-16 sm:grid-cols-2 row:mt-0 row:flex row:gap-[3vw] row:pr-[8vw] mo:-mx-6 mo:flex mo:snap-x mo:snap-mandatory mo:overflow-x-auto mo:px-6 mo:pb-4 mo:[scrollbar-width:none] mo:gap-8">
        {c.items.map((city, i) => (
          <li key={city.name} data-light className="relative row:h-full row:w-[24vw] row:shrink-0 mo:w-[70vw] mo:max-w-[22rem] mo:shrink-0 mo:snap-start mo:pt-8">
            <div data-touch className="relative mx-auto aspect-square w-full max-w-[22rem] row:absolute row:left-0 row:max-w-none row:top-[var(--line)] row:-translate-y-1/2">
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
      <ol aria-label="Steps, swipe for more" className="relative mt-12 grid gap-10 sm:grid-cols-2 row:mt-0 row:flex row:gap-[2.5vw] row:pr-[10vw] mo:-mx-6 mo:flex mo:snap-x mo:snap-mandatory mo:overflow-x-auto mo:px-6 mo:pb-4 mo:[scrollbar-width:none] mo:gap-6">
        <span aria-hidden data-fill className="absolute left-0 hidden h-px w-full bg-accent row:block" style={{ top: "var(--line)" }} />
        {s.items.map((step, i) => (
          <li key={step.title} data-light className="relative mx-auto aspect-square w-full max-w-[22rem] shrink-0 row:h-full row:w-[24vw] row:max-w-none mo:mx-0 mo:w-[78vw] mo:snap-start">
            <div data-touch className="absolute inset-0 row:inset-auto row:left-0 row:top-[var(--line)] row:h-[24vw] row:w-[24vw] row:-translate-y-1/2">
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
