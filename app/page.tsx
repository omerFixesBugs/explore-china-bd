import Loader from "@/components/Loader";
import Shell from "@/components/Shell";
import Chrome from "@/components/Chrome";
import Run from "@/components/Run";
import Hero from "@/components/Hero";
import Services, { LastService } from "@/components/Services";
import Gallery from "@/components/Gallery";
import { Intro, Film, Poem, Rail, Cities, Steps } from "@/components/Sections";
import { Backdrop, Invitation, RedStatement } from "@/components/Journey";
import { Faq, Footer, LoopTail, Breath } from "@/components/Closing";

export default function Home() {
  return (
    <>
      <Loader />
      <Shell />
      <Chrome />
      <main>
        <Run className="bg-deep text-paper">
          <Hero />
          <Intro />
          <Film />
        </Run>
        <Services />
        <Backdrop />
        {/* Overlaps the stack by a screen so its first panel (the last card) swings in over the previous one. */}
        <Run id="journey" className="relative z-10 text-ground row:-mt-[100svh]" line={false}>
          <LastService />
          <Gallery />
          <Invitation />
          <RedStatement />
          <Poem />
          <Rail />
          <Cities />
          <Steps />
        </Run>
        <Faq />
      </main>
      <Footer />
      <LoopTail />
      <Breath />
    </>
  );
}
