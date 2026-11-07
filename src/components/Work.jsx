import { PROJECTS, IN_PROGRESS } from "../data";
import { Phone, Browser } from "./Devices";
import Split from "./Split";

const Arrow = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
);

function Project({ p, i }) {
  const flip = i % 2 === 1;
  return (
    <article className={`project${flip ? " project--flip" : ""}`} style={{ "--c": p.color }}>
      <div className="project__text" data-reveal>
        <p className="project__idx">
          <span>{String(i + 1).padStart(2, "0")}</span>
          {p.kind}
        </p>
        <h3 data-split>
          <Split step={70}>{p.title}</Split>
        </h3>
        <p className="project__desc">{p.desc}</p>
        <ul className="tags">
          {p.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div className="project__links">
          {p.links.map((l) => (
            <a key={l.href} className="btn btn--outline" href={l.href} target="_blank" rel="noreferrer" data-magnetic>
              {l.label}
              <Arrow />
            </a>
          ))}
        </div>
      </div>

      {/* parallax (scroll) + 3D tilt (pointer) */}
      <div className="project__media" data-reveal data-scroll="parallax" data-tilt style={{ "--d": 1 }}>
        <div className="project__halo" aria-hidden="true" />
        {p.device === "browser" ? (
          <Browser color={p.color} shot={p.shot} title={p.title} />
        ) : (
          <Phone variant={p.variant} color={p.color} shot={p.shot} title={p.title} tilt />
        )}
      </div>
    </article>
  );
}

export default function Work() {
  return (
    <section className="section" id="work">
      <div className="wrap">
        <div className="section__head">
          <p className="eyebrow" data-reveal>
            <span>03</span> Selected work
          </p>
          <h2 className="display" data-split>
            <Split>
              Apps and sites I've <em>built &amp; shipped.</em>
            </Split>
          </h2>
        </div>

        <div className="projects">
          {PROJECTS.map((p, i) => (
            <Project key={p.id} p={p} i={i} />
          ))}
        </div>

        <article className="wip card" data-spot data-tilt data-reveal>
          <div>
            <p className="eyebrow eyebrow--sm">
              <span className="wip__dot" /> In progress
            </p>
            <h3>{IN_PROGRESS.title}</h3>
            <p>{IN_PROGRESS.desc}</p>
          </div>
          <ul className="tags">
            {IN_PROGRESS.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
