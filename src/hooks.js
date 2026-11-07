import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const hasFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

const clamp01 = (n) => Math.max(0, Math.min(1, n));

/* Adds `is-in` to every [data-reveal] / [data-split] element the first time it
   scrolls into view. Waits for `ready` so the intro loader can finish first. */
export function useRevealOnScroll(ready) {
  useEffect(() => {
    if (!ready) return;
    const nodes = document.querySelectorAll("[data-reveal],[data-split]");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [ready]);
}

/* Id of the section currently in the middle of the viewport. */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/* Writes page scroll progress (0..1) straight to an element, without React renders. */
export function useScrollProgressBar(ref) {
  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? clamp01(window.scrollY / h) : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(calc);
    };
    calc();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);
}

/* Scroll-linked CSS variables for any element with data-scroll="...":
     parallax -> --py  (-1 .. 1, 0 when the element is centred in the viewport)
     fill     -> --p   (0 .. 1, how far the element has scrolled past 60% of the viewport)
     out      -> --o   (0 .. 1, how far the element has scrolled out of the top) */
export function useScrollVars() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const nodes = [...document.querySelectorAll("[data-scroll]")];
    let raf = 0;
    const run = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const el of nodes) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -300 || r.top > vh + 300) continue;
        const mode = el.dataset.scroll;
        if (mode === "parallax") {
          const c = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
          el.style.setProperty("--py", Math.max(-1, Math.min(1, c)).toFixed(4));
        } else if (mode === "fill") {
          el.style.setProperty("--p", clamp01((vh * 0.6 - r.top) / r.height).toFixed(4));
        } else if (mode === "out") {
          el.style.setProperty("--o", clamp01(-r.top / r.height).toFixed(4));
        }
      }
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    run();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}

/* One pointer listener for three effects (fine pointers only):
     [data-spot]     cursor-following light     (--mx / --my)
     [data-tilt]     3D tilt toward the cursor  (--rx / --ry)
     [data-magnetic] button drifts toward the cursor (--tx / --ty) */
export function usePointerFx() {
  useEffect(() => {
    if (!hasFinePointer()) return;
    const reduce = prefersReducedMotion();
    const mags = [...document.querySelectorAll("[data-magnetic]")];
    let tilted = null;
    let raf = 0;
    let last = null;

    const resetTilt = (el) => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };

    const run = () => {
      raf = 0;
      const { clientX: x, clientY: y, target } = last;
      const spot = target.closest?.("[data-spot],[data-tilt]");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${x - r.left}px`);
        spot.style.setProperty("--my", `${y - r.top}px`);
        if (!reduce && spot.hasAttribute("data-tilt")) {
          const px = (x - r.left) / r.width - 0.5;
          const py = (y - r.top) / r.height - 0.5;
          spot.style.setProperty("--ry", `${(px * 8).toFixed(2)}deg`);
          spot.style.setProperty("--rx", `${(-py * 8).toFixed(2)}deg`);
        }
      }
      if (tilted && tilted !== spot) resetTilt(tilted);
      tilted = spot && spot.hasAttribute("data-tilt") ? spot : null;

      if (!reduce) {
        for (const m of mags) {
          const r = m.getBoundingClientRect();
          const dx = x - (r.left + r.width / 2);
          const dy = y - (r.top + r.height / 2);
          const reach = Math.max(r.width, r.height) / 2 + 70;
          if (Math.hypot(dx, dy) < reach) {
            m.style.setProperty("--tx", `${(dx * 0.28).toFixed(1)}px`);
            m.style.setProperty("--ty", `${(dy * 0.4).toFixed(1)}px`);
            m.classList.add("is-mag");
          } else if (m.classList.contains("is-mag")) {
            m.style.setProperty("--tx", "0px");
            m.style.setProperty("--ty", "0px");
            m.classList.remove("is-mag");
          }
        }
      }
    };

    const move = (e) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(run);
    };
    const out = (e) => {
      if (e.relatedTarget) return;
      if (tilted) resetTilt(tilted);
      tilted = null;
      mags.forEach((m) => {
        m.style.setProperty("--tx", "0px");
        m.style.setProperty("--ty", "0px");
        m.classList.remove("is-mag");
      });
    };

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseout", out);
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("mouseout", out);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}

/* Inertial smooth scrolling (Lenis) + smooth in-page anchor links. */
export function useLenis(enabled) {
  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    window.__lenis = lenis;
    let raf = 0;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href").slice(1);
      const el = id === "top" ? null : document.getElementById(id);
      if (id !== "top" && !el) return;
      e.preventDefault();
      lenis.scrollTo(el || 0, { offset: el ? -68 : 0, duration: 1.5 });
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, [enabled]);
}

/* Navigate to a section from anywhere (works with or without Lenis). */
export function goToSection(id) {
  const el = id === "top" ? null : document.getElementById(id);
  if (window.__lenis) {
    window.__lenis.scrollTo(el || 0, { offset: el ? -68 : 0, duration: 1.5 });
  } else if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/* Counts from 0 to `to` once the returned ref is visible. */
export function useCountUp(to, duration = 1400) {
  const ref = useRef(null);
  const [val, setVal] = useState(() => (prefersReducedMotion() ? to : 0));
  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          setVal(Math.round(to * (1 - Math.pow(1 - t, 3))));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to, duration]);
  return [ref, val];
}
