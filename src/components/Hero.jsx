import { useEffect, useRef } from "react";
import { HeroPhone } from "./Devices";
import ParticleField from "./ParticleField";
import Split from "./Split";
import { STATS, PROJECTS } from "../data";
import { hasFinePointer, prefersReducedMotion, useCountUp } from "../hooks";

const SHIPPED = [
  { name: "DatePALOP", store: "App Store", color: PROJECTS[0].color },
  { name: "Gentle Hold", store: "Google Play", color: PROJECTS[1].color },
  { name: "Salonist", store: "App Store", color: PROJECTS[2].color },
];

function Stat({ value, suffix, label }) {
  const [ref, n] = useCountUp(value);
  return (
    <div className="stat">
      <b ref={ref}>
        {n}
        {suffix}
      </b>
      <span>{label}</span>
    </div>
  );
}

export default function Hero() {
  const stage = useRef(null);

  // Phone tilts toward the pointer and the floating chips drift at different depths.
  useEffect(() => {
    const node = stage.current;
    if (!node || !hasFinePointer() || prefersReducedMotion()) return;
    let raf = 0;
    const move = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = node.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        node.style.setProperty("--ry", `${(x * 14).toFixed(2)}deg`);
        node.style.setProperty("--rx", `${(-y * 10).toFixed(2)}deg`);
        node.style.setProperty("--mxp", x.toFixed(3));
        node.style.setProperty("--myp", y.toFixed(3));
      });
    };
    const leave = () => {
      ["--ry", "--rx"].forEach((k) => node.style.setProperty(k, "0deg"));
      ["--mxp", "--myp"].forEach((k) => node.style.setProperty(k, "0"));
    };
    const host = node.closest(".hero");
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return () => {
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="hero" id="top" data-scroll="out">
      <div className="hero__bg" aria-hidden="true">
        <span className="aurora aurora--a" />
        <span className="aurora aurora--b" />
        <ParticleField />
      </div>

      <div className="wrap hero__grid">
        <div className="hero__copy">
          <p className="pill" data-reveal style={{ "--d": 0 }}>
            <span className="pill__dot" /> Open to freelance projects &amp; full-time roles
          </p>

          <h1 className="hero__title" data-split style={{ "--base": "200ms" }}>
            <Split step={70}>
              I build mobile apps that <em>ship,</em> and get <em>used.</em>
            </Split>
          </h1>

          <p className="hero__lead" data-reveal style={{ "--d": 4 }}>
            I'm <strong>Jatin Sharma</strong>, a React Native developer who takes startups and
            businesses from idea to the App Store and Google Play: UI, API integration, store
            listing and onboarding copy, so your app doesn't just work, it converts.
          </p>

          <div className="hero__cta" data-reveal style={{ "--d": 5 }}>
            <a className="btn btn--accent" href="#work" data-magnetic data-track="cta_view_work">
              View selected work
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a className="btn btn--ghost" href="#contact" data-magnetic data-track="cta_start_project">
              Start a project
            </a>
          </div>

          <div className="stats" data-reveal style={{ "--d": 6 }}>
            {STATS.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </div>
        </div>

        <div className="hero__stage" ref={stage} data-reveal style={{ "--d": 3 }}>
          <HeroPhone apps={SHIPPED} />
          <div className="chip chip--a" style={{ "--depth": 46 }}>
            <i className="chip__dot" /> App Store
          </div>
          <div className="chip chip--b" style={{ "--depth": -38 }}>
            <i className="chip__dot chip__dot--g" /> Google Play
          </div>
          <div className="chip chip--c" style={{ "--depth": 64 }}>
            React Native
          </div>
        </div>
      </div>
    </section>
  );
}
