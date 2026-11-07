import Split from "./Split";

const FACTS = [
  ["Focus", "React Native for iOS & Android"],
  ["Also builds", "Responsive business websites"],
  ["Works with", "Startups & growing businesses"],
  ["Status", "Open to freelance & full-time"],
];

export default function About() {
  return (
    <section className="section" id="about">
      <div className="wrap about">
        <div className="about__head">
          <p className="eyebrow" data-reveal>
            <span>01</span> About
          </p>
          <h2 className="display" data-split>
            <Split>
              I care about what happens <em>after</em> the code compiles.
            </Split>
          </h2>
        </div>

        <div className="about__body">
          <p data-reveal style={{ "--d": 1 }}>
            I'm a passionate React Native developer with hands-on experience building
            cross-platform mobile applications for both iOS and Android. I write clean, efficient
            code that delivers smooth 60fps experiences.
          </p>
          <p data-reveal style={{ "--d": 2 }}>
            Beyond React Native, I have a solid understanding of JavaScript, TypeScript, REST
            APIs, Firebase and backend fundamentals, which lets me work comfortably with
            full-stack teams, and take a product all the way to the stores.
          </p>

          <dl className="facts" data-reveal style={{ "--d": 3 }}>
            {FACTS.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
