import { SKILL_GROUPS } from "../data";
import Split from "./Split";

export default function Skills() {
  return (
    <section className="section" id="skills">
      <div className="wrap">
        <div className="section__head">
          <p className="eyebrow" data-reveal>
            <span>05</span> Skills
          </p>
          <h2 className="display" data-split>
            <Split>
              The stack I <em>reach for.</em>
            </Split>
          </h2>
        </div>

        <div className="skills">
          {SKILL_GROUPS.map((g, i) => (
            <div className="skillgroup card" key={g.title} data-spot data-tilt data-reveal style={{ "--d": i }}>
              <h3>{g.title}</h3>
              <ul>
                {g.items.map((s, k) => (
                  <li key={s} style={{ "--k": k }}>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
