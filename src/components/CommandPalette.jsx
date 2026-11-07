import { useEffect, useMemo, useRef, useState } from "react";
import { EMAIL, GITHUB_URL, LINKEDIN_URL, NAV } from "../data";
import { goToSection } from "../hooks";

// Ctrl/⌘ + K opens a quick-jump menu: sections, copy email, social links.
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const [toast, setToast] = useState("");
  const input = useRef(null);
  const lastFocus = useRef(null);

  const actions = useMemo(
    () => [
      ...NAV.map(([label, id], i) => ({
        id,
        group: "Go to",
        label,
        hint: `0${i + 1}`,
        run: () => goToSection(id),
      })),
      { id: "project", group: "Actions", label: "Start a project", hint: "→", run: () => goToSection("contact") },
      {
        id: "copy",
        group: "Actions",
        label: "Copy email address",
        hint: "copy",
        run: async () => {
          try {
            await navigator.clipboard.writeText(EMAIL);
            setToast("Email copied to clipboard");
          } catch {
            window.location.href = `mailto:${EMAIL}`;
          }
        },
      },
      { id: "li", group: "Links", label: "Open LinkedIn", hint: "↗", run: () => window.open(LINKEDIN_URL, "_blank", "noopener") },
      { id: "gh", group: "Links", label: "Open GitHub", hint: "↗", run: () => window.open(GITHUB_URL, "_blank", "noopener") },
    ],
    [],
  );

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? actions.filter((a) => a.label.toLowerCase().includes(s)) : actions;
  }, [q, actions]);

  const close = () => setOpen(false);

  // global shortcut + open event from the nav button
  useEffect(() => {
    const key = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const openEv = () => setOpen(true);
    window.addEventListener("keydown", key);
    window.addEventListener("open-palette", openEv);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("open-palette", openEv);
    };
  }, []);

  // lock page scroll + manage focus while open
  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement;
    document.body.classList.add("no-scroll");
    window.__lenis?.stop();
    requestAnimationFrame(() => input.current?.focus());
    return () => {
      // reset for the next time it opens
      setQ("");
      setIdx(0);
      document.body.classList.remove("no-scroll");
      window.__lenis?.start();
      lastFocus.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const choose = (a) => {
    close();
    // let the modal unlock scrolling first, then run the action
    setTimeout(() => a.run(), 60);
  };

  const onKey = (e) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx((i) => (list.length ? (i + 1) % list.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((i) => (list.length ? (i - 1 + list.length) % list.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (list[idx]) choose(list[idx]);
    } else if (e.key === "Tab") {
      e.preventDefault();
    }
  };

  return (
    <>
      {open && (
        <div className="palette" onMouseDown={close}>
          <div
            className="palette__box"
            role="dialog"
            aria-modal="true"
            aria-label="Quick navigation"
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={onKey}
          >
            <div className="palette__search">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                ref={input}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setIdx(0);
                }}
                placeholder="Jump to a section or run an action…"
                aria-label="Search commands"
              />
              <kbd>esc</kbd>
            </div>

            <ul className="palette__list" data-lenis-prevent role="listbox">
              {list.length === 0 && <li className="palette__empty">No matches</li>}
              {list.map((a, i) => (
                <li
                  key={a.id}
                  role="option"
                  aria-selected={i === idx}
                  className={i === idx ? "is-on" : ""}
                  onMouseEnter={() => setIdx(i)}
                  onClick={() => choose(a)}
                >
                  <span className="palette__group">{a.group}</span>
                  <span className="palette__label">{a.label}</span>
                  <kbd>{a.hint}</kbd>
                </li>
              ))}
            </ul>

            <div className="palette__foot">
              <span>
                <kbd>↑</kbd> <kbd>↓</kbd> navigate
              </span>
              <span>
                <kbd>↵</kbd> select
              </span>
            </div>
          </div>
        </div>
      )}

      <div className={`toast${toast ? " is-on" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  );
}
