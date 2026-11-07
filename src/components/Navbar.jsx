import { useEffect, useRef, useState } from "react";
import { NAV } from "../data";
import { useActiveSection, useScrollProgressBar } from "../hooks";

const SECTION_IDS = ["top", ...NAV.map(([, id]) => id)];
const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad/.test(navigator.platform || "");

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const bar = useRef(null);
  const active = useActiveSection(SECTION_IDS);
  useScrollProgressBar(bar);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("no-scroll");
    window.__lenis?.stop();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("no-scroll");
      window.__lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className={`nav${scrolled || open ? " nav--solid" : ""}`}>
        <div className="nav__progress" ref={bar} />
        <div className="nav__in">
          <a
            className="nav__logo"
            href="#top"
            onClick={() => setOpen(false)}
            aria-label="Jatin Sharma, home"
          >
            <span className="nav__mark">JS</span>
            <span className="nav__name">Jatin Sharma</span>
          </a>

          <nav className="nav__links" aria-label="Primary">
            {NAV.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                className={active === id ? "is-active" : ""}
              >
                {label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="nav__kbd"
            onClick={() => window.dispatchEvent(new Event("open-palette"))}
            aria-label="Open quick navigation"
          >
            <kbd>{isMac ? "⌘" : "Ctrl"}</kbd>
            <kbd>K</kbd>
          </button>

          <a
            className="btn btn--sm btn--accent nav__cta"
            href="#contact"
            data-magnetic
          >
            Hire me
          </a>

          <button
            className={`nav__burger${open ? " is-open" : ""}`}
            onClick={() => setOpen((s) => !s)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Outside <header>: the header's backdrop-filter would otherwise trap this fixed layer. */}
      <div
        className={`drawer${open ? " is-open" : ""}`}
        aria-hidden={!open}
        data-lenis-prevent
      >
        {NAV.map(([label, id], i) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={() => setOpen(false)}
            style={{ "--i": i }}
            tabIndex={open ? 0 : -1}
          >
            <small>0{i + 1}</small>
            {label}
          </a>
        ))}
      </div>
    </>
  );
}
