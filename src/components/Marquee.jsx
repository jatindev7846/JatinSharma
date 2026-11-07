import { useEffect, useRef } from "react";
import { TICKER } from "../data";
import { prefersReducedMotion } from "../hooks";

// Two tech tickers that run in opposite directions. They speed up with your scroll
// velocity and reverse when you scroll back up.
export default function Marquee() {
  const wrap = useRef(null);
  const rows = useRef([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const els = rows.current.filter(Boolean);
    const widths = [0, 0];
    const pos = [0, 0];
    let lastY = window.scrollY;
    let vel = 0;
    let dir = 1;
    let target = 1;
    let visible = true;
    let raf = 0;

    const measure = () => {
      els.forEach((el, i) => {
        widths[i] = el.scrollWidth / 2;
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    els.forEach((el) => ro.observe(el));
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(wrap.current);

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const y = window.scrollY;
      vel += (y - lastY - vel) * 0.12;
      lastY = y;
      if (!visible) return;
      if (vel > 0.6) target = 1;
      else if (vel < -0.6) target = -1;
      dir += (target - dir) * 0.06;
      const speed = (0.55 + Math.min(40, Math.abs(vel)) * 0.4) * dir;
      els.forEach((el, i) => {
        if (!widths[i]) return;
        pos[i] += i === 0 ? -speed : speed;
        if (pos[i] <= -widths[i]) pos[i] += widths[i];
        if (pos[i] > 0) pos[i] -= widths[i];
        el.style.transform = `translate3d(${pos[i].toFixed(2)}px,0,0)`;
      });
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const set = [...TICKER, ...TICKER];
  return (
    <div className="marquee" ref={wrap} aria-hidden="true">
      {[0, 1].map((k) => (
        <div className={`marquee__row marquee__row--${k ? "b" : "a"}`} key={k}>
          <div className="marquee__strip" ref={(el) => (rows.current[k] = el)}>
            {[0, 1].map((rep) =>
              set.map((t, i) => (
                <span key={`${rep}-${i}`}>
                  {t}
                  <i />
                </span>
              )),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
