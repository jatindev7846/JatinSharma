import { PROCESS } from "../data";
import Split from "./Split";

// A vertical timeline whose line fills as you scroll (driven by --p from useScrollVars);
// every step lights up when the line reaches it.
export default function Process() {
  return (
    <section className="section" id="process">
      <div className="wrap">
        <div className="section__head">
          <p className="eyebrow" data-reveal>
            <span>04</span> Process
          </p>
          <h2 className="display" data-split>
            <Split>
              From idea to the <em>store, in four steps.</em>
            </Split>
          </h2>
        </div>

        <ol className="process" data-scroll="fill">
          <li className="process__line" aria-hidden="true">
            <i />
          </li>
          {PROCESS.map((s, i) => (
            <li className="step" key={s.title} style={{ "--at": ((i + 0.25) / PROCESS.length).toFixed(3) }}>
              <div className="step__head">
                <span className="step__n">{s.n}</span>
                <h3>{s.title}</h3>
              </div>
              <div className="step__body">
                <p>{s.text}</p>
                <ul className="tags">
                  {s.tags.map((t) => (
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
