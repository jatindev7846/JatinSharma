import { EXPERIENCE } from "../data";
import Split from "./Split";

export default function Experience() {
  return (
    <section className="section" id="experience">
      <div className="wrap">
        <div className="section__head">
          <p className="eyebrow" data-reveal>
            <span>06</span> Experience
          </p>
          <h2 className="display" data-split>
            <Split>
              Where I've been <em>building.</em>
            </Split>
          </h2>
        </div>

        <ol className="timeline">
          {EXPERIENCE.map((e, i) => (
            <li className="job" key={e.company} data-reveal style={{ "--d": 0 }}>
              <div className="job__when">
                <span>{e.period}</span>
                {i === 0 && <em className="job__now">Now</em>}
              </div>
              <div className="job__what">
                <h3>{e.role}</h3>
                <p className="job__co">{e.company}</p>
                <p>{e.desc}</p>
                <ul className="tags">
                  {e.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
