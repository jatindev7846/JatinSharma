import { useEffect, useState } from "react";

const NAME = "Jatin Sharma";

// Intro: letters rise, counter runs 000 -> 100, then the curtain lifts.
// Returning visitors (same session) get a much shorter version.
export default function Preloader({ skip, onDone }) {
  const [n, setN] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (skip) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem("js-intro") === "1";
    } catch {
      /* storage blocked: just play the full intro */
    }
    const duration = seen ? 650 : 1800;
    let raf = 0;
    let start = 0;
    const timers = [];
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(100 * (1 - Math.pow(1 - p, 2.4))));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      try {
        sessionStorage.setItem("js-intro", "1");
      } catch {
        /* ignore */
      }
      setLeaving(true);
      timers.push(setTimeout(onDone, 380));
      timers.push(setTimeout(() => setGone(true), 1400));
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [skip, onDone]);

  if (skip || gone) return null;

  return (
    <div className={`pre${leaving ? " is-out" : ""}`} role="status" aria-label="Loading portfolio">
      <div className="pre__top">
        <span className="pre__mark">JS</span>
        <span>Portfolio · {new Date().getFullYear()}</span>
      </div>

      <div className="pre__center">
        <div className="pre__name" aria-hidden="true">
          {NAME.split("").map((c, i) => (
            <span key={i} style={{ "--i": i }}>
              {c === " " ? " " : c}
            </span>
          ))}
        </div>
        <p className="pre__role">React Native developer</p>
      </div>

      <div className="pre__bottom">
        <b>{String(n).padStart(3, "0")}</b>
        <i>
          <em style={{ transform: `scaleX(${n / 100})` }} />
        </i>
      </div>
    </div>
  );
}
