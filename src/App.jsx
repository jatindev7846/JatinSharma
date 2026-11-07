import { useEffect, useState } from "react";
import Preloader from "./components/Preloader";
import Cursor from "./components/Cursor";
import CommandPalette from "./components/CommandPalette";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Services from "./components/Services";
import Work from "./components/Work";
import Process from "./components/Process";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import {
  prefersReducedMotion,
  useLenis,
  usePointerFx,
  useRevealOnScroll,
  useScrollVars,
} from "./hooks";

const REDUCED = prefersReducedMotion();

export default function App() {
  // `ready` flips once the intro loader has lifted; reveals and smooth scroll start then.
  const [ready, setReady] = useState(REDUCED);

  useEffect(() => {
    document.body.classList.toggle("is-loading", !ready);
    if (!ready) window.scrollTo(0, 0);
  }, [ready]);

  useLenis(ready);
  useRevealOnScroll(ready);
  useScrollVars();
  usePointerFx();

  return (
    <>
      <Preloader skip={REDUCED} onDone={() => setReady(true)} />
      <Cursor />
      <CommandPalette />
      <a className="skip" href="#about">
        Skip to content
      </a>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Work />
        <Process />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
