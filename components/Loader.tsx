"use client";
import { useRef, useState } from "react";
import { site } from "@/content/site";
import { gsap, useGSAP, introDone } from "@/lib/motion";

/**
 * Opening, as in the reference (plays on every page load):
 * a hairline draws across the dark at the horizon line while the words blur in one by one; the words blur away;
 * then the line itself splits open — a thin glowing slit that widens up and down until the hero fills the screen.
 */
export default function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(() => {
    const el = ref.current!;
    const words = el.querySelectorAll("[data-pl-word]");
    const line = el.querySelector("[data-pl-line]");
    const top = el.querySelector("[data-pl-top]");
    const bottom = el.querySelector("[data-pl-bottom]");
    const finish = () => setGone(true);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      introDone();
      gsap.to(el, { autoAlpha: 0, duration: 0.4, delay: 0.3, onComplete: finish });
      return;
    }
    gsap.timeline({ onComplete: finish })
      .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 2.4, ease: "power2.inOut" }, 0)
      .fromTo(words, { autoAlpha: 0, filter: "blur(10px)" }, { autoAlpha: 1, filter: "blur(0px)", duration: 0.9, stagger: 0.3, ease: "power2.out" }, 0.15)
      .to(words, { autoAlpha: 0, filter: "blur(10px)", duration: 0.7, stagger: 0.08, ease: "power2.in" }, "+=0.9")
      .to({}, { duration: 0.3 })
      // the line warms up, as if the hero were already showing through a hairline slit
      .to(line, { backgroundColor: "#ff6a3d", opacity: 1, boxShadow: "0 0 18px 1px rgba(255,106,61,.55)", duration: 0.4, ease: "power2.out" })
      // then it splits open: slow start, fast middle, soft landing
      .add(() => introDone())
      .to([top, bottom], { scaleY: 0, duration: 0.95, ease: "power4.inOut", force3D: true }, ">-0.05")
      .to(line, { opacity: 0, duration: 0.35, ease: "power2.out" }, "<0.12");
  }, { scope: ref });

  if (gone) return null;
  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[100] text-paper">
      <div data-pl-top className="absolute inset-x-0 top-0 origin-top bg-black" style={{ height: "var(--line)" }} />
      <div data-pl-bottom className="absolute inset-x-0 bottom-0 origin-bottom bg-black" style={{ top: "var(--line)" }} />
      <p className="t-small absolute inset-x-0 flex justify-center gap-[0.9em] px-6 text-center" style={{ top: "calc(var(--line) - 44px)" }}>
        {site.preloader.map((w, i) => (
          <span key={i} data-pl-word className={i === 0 ? "text-paper/60" : ""}>
            {w}
          </span>
        ))}
      </p>
      <span data-pl-line className="absolute left-0 right-0 h-px origin-left bg-paper/30" style={{ top: "var(--line)" }} />
    </div>
  );
}
