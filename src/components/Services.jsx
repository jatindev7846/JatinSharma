import { SERVICES } from "../data";
import Split from "./Split";

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="wrap">
        <div className="section__head">
          <p className="eyebrow" data-reveal>
            <span>02</span> Services
          </p>
          <h2 className="display" data-split>
            <Split>
              One developer, from <em>first screen</em> to the store listing.
            </Split>
          </h2>
        </div>

        <div className="services">
          {SERVICES.map((s, i) => (
            <article className="card service" key={s.n} data-spot data-tilt data-reveal style={{ "--d": i }}>
              <span className="service__n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <ul>
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
