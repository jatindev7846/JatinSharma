import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../hooks";

// Stylised device mockups. They are deliberately abstract (wireframe-style) so the
// site never shows a fake screenshot. Pass `shot` to swap in a real screenshot.

const Bars = ({ n = 3, w = ["78%", "56%", "68%"] }) => (
  <div className="sk-lines">
    {Array.from({ length: n }).map((_, i) => (
      <i key={i} style={{ width: w[i % w.length] }} />
    ))}
  </div>
);

function StatusBar() {
  return (
    <div className="sk-status">
      <span>9:41</span>
      <span className="sk-status__r">
        <i /> <i /> <i className="sk-batt" />
      </span>
    </div>
  );
}

function ScreenSwipe() {
  return (
    <div className="sk sk--swipe">
      <StatusBar />
      <div className="sk-top">
        <b>Discover</b>
        <span className="sk-pill">Dating</span>
      </div>
      <div className="sk-card">
        <div className="sk-card__img" />
        <div className="sk-card__meta">
          <i style={{ width: "58%" }} />
          <i style={{ width: "36%" }} />
        </div>
      </div>
      <div className="sk-actions">
        <span className="sk-btn">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </span>
        <span className="sk-btn sk-btn--on">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 21s-7-4.6-9.3-9.1C1 8.5 3 5 6.4 5c2 0 3.4 1.1 4.1 2.3h1C12.2 6.1 13.6 5 15.6 5 19 5 21 8.5 21.3 11.9 19 16.4 12 21 12 21z" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function ScreenCalm() {
  return (
    <div className="sk sk--calm">
      <StatusBar />
      <div className="sk-top">
        <b>Take a moment</b>
      </div>
      <div className="sk-breathe">
        <span />
        <span />
        <span />
        <em>breathe</em>
      </div>
      <Bars n={2} w={["70%", "48%"]} />
      <div className="sk-cta">Begin</div>
    </div>
  );
}

function ScreenBooking() {
  const slots = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30"];
  return (
    <div className="sk sk--booking">
      <StatusBar />
      <div className="sk-top">
        <b>Book a slot</b>
      </div>
      <div className="sk-days">
        {["Mon", "Tue", "Wed", "Thu"].map((d, i) => (
          <span key={d} className={i === 1 ? "on" : ""}>
            <small>{d}</small>
            {12 + i}
          </span>
        ))}
      </div>
      <div className="sk-service">
        <span className="sk-service__ico" />
        <div>
          <i style={{ width: "70%" }} />
          <i style={{ width: "40%" }} />
        </div>
        <b>Select</b>
      </div>
      <div className="sk-slots">
        {slots.map((s, i) => (
          <span key={s} className={i === 2 ? "on" : i === 4 ? "off" : ""}>
            {s}
          </span>
        ))}
      </div>
      <div className="sk-cta">Confirm booking</div>
    </div>
  );
}

function ScreenSocial() {
  return (
    <div className="sk sk--social">
      <StatusBar />
      <div className="sk-top">
        <b>Feed</b>
      </div>
      {[0, 1].map((i) => (
        <div className="sk-post" key={i}>
          <div className="sk-post__h">
            <span className="sk-av" />
            <i style={{ width: "34%" }} />
          </div>
          <div className="sk-post__img" />
          <Bars n={1} w={["60%"]} />
        </div>
      ))}
    </div>
  );
}

const SCREENS = {
  swipe: ScreenSwipe,
  calm: ScreenCalm,
  booking: ScreenBooking,
  social: ScreenSocial,
};

export function Phone({ variant = "social", color = "#c8ff3d", shot, title = "", tilt = false }) {
  const Screen = SCREENS[variant] || ScreenSocial;
  return (
    <div className={`phone${tilt ? " phone--tilt" : ""}`} style={{ "--c": color }}>
      <div className="phone__body">
        <span className="phone__island" />
        <div className="phone__screen">
          {shot ? <img src={shot} alt={`${title} app screenshot`} loading="lazy" /> : <Screen />}
        </div>
      </div>
      <div className="phone__glow" />
    </div>
  );
}

export function Browser({ color = "#ff7a45", shot, title = "", url = "gayatribusinessgroup.com" }) {
  return (
    <div className="browser" style={{ "--c": color }}>
      <div className="browser__bar">
        <span />
        <span />
        <span />
        <em>{url}</em>
      </div>
      <div className="browser__view">
        {shot ? (
          <img src={shot} alt={`${title} website screenshot`} loading="lazy" />
        ) : (
          <div className="sk sk--site">
            <div className="sk-nav">
              <b />
              <i />
              <i />
              <i />
            </div>
            <div className="sk-hero">
              <div className="sk-hero__t">
                <i style={{ width: "74%" }} />
                <i style={{ width: "52%" }} />
                <span className="sk-cta">Order on WhatsApp</span>
              </div>
              <div className="sk-hero__img" />
            </div>
            <div className="sk-grid">
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// The phone shown in the hero: the portfolio itself, "as an app".
// A looping in-app notification highlights each shipped app in turn.
const NOTES = ["New match nearby", "Session completed", "Booking confirmed"];

export function HeroPhone({ apps }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const t = setInterval(() => setI((n) => n + 1), 3600);
    return () => clearInterval(t);
  }, []);
  const hot = i % apps.length;

  return (
    <div className="phone phone--hero phone--tilt" style={{ "--c": "#c8ff3d" }}>
      <div className="phone__body">
        <span className="phone__island" />
        <div className="phone__screen">
          <div className="sk sk--hero">
            <StatusBar />
            <div className="hp-head">
              <span className="hp-logo">JS</span>
              <div>
                <b>Jatin Sharma</b>
                <small>React Native developer</small>
              </div>
            </div>
            <div className="hp-label">Shipped &amp; live</div>
            <div className="hp-list">
              {apps.map((a, k) => (
                <div className={`hp-row${k === hot ? " is-hot" : ""}`} key={a.name} style={{ "--ac": a.color }}>
                  <span className="hp-ico">{a.name[0]}</span>
                  <div>
                    <b>{a.name}</b>
                    <small>{a.store}</small>
                  </div>
                  <span className="hp-live">Live</span>
                </div>
              ))}
              <div className="hp-row hp-row--next">
                <span className="hp-ico">+</span>
                <div>
                  <b>Your app</b>
                  <small>Let's build it next</small>
                </div>
              </div>
            </div>
            <div className="hp-cta">Start a project</div>

            <div className="hp-toast" key={i} style={{ "--ac": apps[hot].color }}>
              <span className="hp-toast__ico">{apps[hot].name[0]}</span>
              <div>
                <b>{NOTES[hot % NOTES.length]}</b>
                <small>{apps[hot].name} · now</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="phone__glow" />
    </div>
  );
}
