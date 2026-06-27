import { useEffect, useRef, useState } from "react";

function useResponsive() {
  const getWidth = () =>
    typeof window !== "undefined" ? window.innerWidth : 1440;

  const [width, setWidth] = useState(getWidth);

  useEffect(() => {
    const onResize = () => setWidth(getWidth());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return {
    width,
    isMobile: width <= 480,
    isSmall: width <= 640,
    isTablet: width <= 1024,
    isLarge: width >= 1280,
  };
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

function CursorTrail() {
  const { isTablet } = useResponsive();
  const [dots, setDots] = useState([]);

  useEffect(() => {
    if (isTablet) return;
    const colors = ["#ff3cac", "#784ba0", "#2b86c5", "#00f5d4", "#ffbe0b"];
    let id = 0;
    const move = (e) => {
      const nextId = id++;
      setDots((prev) => [
        ...prev.slice(-18),
        {
          id: nextId,
          x: e.clientX,
          y: e.clientY,
          color: colors[nextId % colors.length],
        },
      ]);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [isTablet]);

  if (isTablet) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {dots.map((d, i) => (
        <div
          key={d.id}
          style={{
            position: "fixed",
            left: d.x - 6,
            top: d.y - 6,
            width: Math.max(4, 12 - i * 0.4),
            height: Math.max(4, 12 - i * 0.4),
            borderRadius: "50%",
            background: d.color,
            opacity: (i + 1) / dots.length,
            transition: "opacity 0.3s",
            boxShadow: `0 0 8px ${d.color}`,
          }}
        />
      ))}
    </div>
  );
}

function Navbar({ active, setActive }) {
  const { isMobile, isTablet } = useResponsive();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    "Hero",
    "About",
    "Skills",
    "Projects",
    "Experience",
    "Contact",
  ];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!isTablet) setMenuOpen(false);
  }, [isTablet]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleScroll = (id) => {
    setActive(id);
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: isMobile
          ? "0.75rem 1rem"
          : isTablet
            ? "0.9rem 1.5rem"
            : "1rem 3rem",
        background: scrolled || menuOpen ? "rgba(5,5,15,0.95)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(16px)" : "none",
        borderBottom:
          scrolled || menuOpen ? "1px solid rgba(255,255,255,0.07)" : "none",
        transition: "all 0.4s ease",
      }}
    >
      <span
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: isMobile ? "1.2rem" : "1.6rem",
          fontWeight: 800,
          background: "linear-gradient(90deg,#ff3cac,#784ba0,#2b86c5)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-1px",
          flexShrink: 0,
        }}
      >
        JS
      </span>

      {isTablet ? (
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen((s) => !s)}
            aria-label="Toggle menu"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "#fff",
              borderRadius: 12,
              padding: "0.55rem 1rem",
              cursor: "pointer",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>
              {menuOpen ? "✕" : "☰"}
            </span>
            {!isMobile && <span>{menuOpen ? "Close" : "Menu"}</span>}
          </button>

          {menuOpen && (
            <>
              {/* Backdrop */}
              <div
                onClick={() => setMenuOpen(false)}
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.5)",
                  zIndex: -1,
                }}
              />
              <div
                style={{
                  position: "fixed",
                  top: isMobile ? "58px" : "66px",
                  right: 0,
                  left: 0,
                  background: "rgba(8,8,20,0.98)",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
                  zIndex: 99,
                }}
              >
                {links.map((l) => (
                  <button
                    key={l}
                    onClick={() => handleScroll(l)}
                    style={{
                      background:
                        active === l ? "rgba(255,60,172,0.1)" : "none",
                      border: "none",
                      color: active === l ? "#ff3cac" : "rgba(255,255,255,0.8)",
                      textAlign: "left",
                      padding: "0.85rem 1.25rem",
                      borderRadius: 12,
                      cursor: "pointer",
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: "1rem",
                      width: "100%",
                      maxWidth: 480,
                      marginInline: "auto",
                      display: "block",
                      borderLeft:
                        active === l
                          ? "3px solid #ff3cac"
                          : "3px solid transparent",
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            gap: "clamp(1rem, 2vw, 2rem)",
            flexWrap: "wrap",
          }}
        >
          {links.map((l) => (
            <button
              key={l}
              onClick={() => handleScroll(l)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(0.8rem, 1vw, 0.9rem)",
                fontWeight: 600,
                color: active === l ? "#ff3cac" : "rgba(255,255,255,0.7)",
                transition: "color 0.3s",
                padding: "4px 0",
                borderBottom:
                  active === l ? "2px solid #ff3cac" : "2px solid transparent",
                whiteSpace: "nowrap",
              }}
            >
              {l}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

function Hero() {
  const { isMobile, isSmall, isTablet } = useResponsive();
  const [text, setText] = useState("");
  const phrases = [
    "React Native Developer",
    "Mobile App Builder",
    "Cross-Platform Expert",
    "UI/UX Enthusiast",
  ];
  const [pi, setPi] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[pi];
    let timeout;
    if (!deleting && text.length < current.length) {
      timeout = setTimeout(
        () => setText(current.slice(0, text.length + 1)),
        80,
      );
    } else if (!deleting && text.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1600);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(text.slice(0, -1)), 40);
    } else {
      setDeleting(false);
      setPi((prev) => (prev + 1) % phrases.length);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, pi]);

  return (
    <section
      id="Hero"
      style={{
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        flexDirection: "column",
        textAlign: "center",
        padding: isMobile
          ? "5rem 1.25rem 3rem"
          : isTablet
            ? "6rem 2rem 3rem"
            : "0 3rem",
      }}
    >
      {[
        {
          top: "8%",
          left: "3%",
          color: "#ff3cac44",
          size: isMobile ? 200 : isTablet ? 300 : 420,
        },
        {
          top: "55%",
          right: "3%",
          color: "#2b86c544",
          size: isMobile ? 160 : isTablet ? 260 : 360,
        },
        {
          bottom: "8%",
          left: "28%",
          color: "#784ba044",
          size: isMobile ? 150 : isTablet ? 240 : 310,
        },
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: b.color,
            top: b.top,
            left: b.left,
            right: b.right,
            bottom: b.bottom,
            filter: "blur(80px)",
            animation: `blobFloat ${3 + i}s ease-in-out infinite alternate`,
            pointerEvents: "none",
          }}
        />
      ))}

      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 700,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(255,60,172,0.1)",
            border: "1px solid rgba(255,60,172,0.3)",
            borderRadius: 100,
            padding: isMobile ? "5px 14px" : "6px 18px",
            marginBottom: "1.5rem",
            animation: "fadeUp 0.8s ease both",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#ff3cac",
              display: "inline-block",
              animation: "blink 1.2s infinite",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              color: "#ff3cac",
              fontFamily: "'Syne', sans-serif",
              fontSize: isMobile ? "0.78rem" : "0.85rem",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            Available for Work
          </span>
        </div>

        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(2.2rem, 9vw, 7rem)",
            fontWeight: 900,
            lineHeight: 1.05,
            margin: "0 0 1.2rem",
            animation: "fadeUp 0.8s 0.2s ease both",
            letterSpacing: isMobile ? "-1px" : "-3px",
          }}
        >
          <span style={{ color: "#fff" }}>Hi, I'm</span>{" "}
          <span
            style={{
              background: "linear-gradient(135deg,#ff3cac,#784ba0,#2b86c5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}
          >
            Jatin Sharma
          </span>
        </h1>

        <div
          style={{
            minHeight: isMobile ? "4rem" : "3.2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.4rem",
            flexWrap: "wrap",
            animation: "fadeUp 0.8s 0.4s ease both",
            padding: "0 0.5rem",
          }}
        >
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(1rem, 3.5vw, 2rem)",
              color: "#e0e0e0",
              fontWeight: 300,
            }}
          >
            I build
          </span>
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(1rem, 3.5vw, 2rem)",
              fontWeight: 800,
              background: "linear-gradient(90deg,#00f5d4,#ffbe0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {text}
            <span
              style={{
                animation: "blink 1s step-end infinite",
                color: "#00f5d4",
                WebkitTextFillColor: "#00f5d4",
              }}
            >
              |
            </span>
          </span>
        </div>

        <p
          style={{
            maxWidth: 520,
            margin: "1.25rem auto 2.5rem",
            color: "rgba(255,255,255,0.55)",
            fontFamily: "'Syne', sans-serif",
            fontSize: isMobile ? "0.9rem" : "1.05rem",
            lineHeight: 1.75,
            animation: "fadeUp 0.8s 0.5s ease both",
            padding: "0 0.5rem",
          }}
        >
          Crafting beautiful, high-performance mobile apps for iOS & Android
          using React Native. Turning ideas into pixel-perfect experiences that
          users love.
        </p>

        <div
          style={{
            display: "flex",
            gap: "0.85rem",
            justifyContent: "center",
            flexWrap: "wrap",
            animation: "fadeUp 0.8s 0.6s ease both",
            padding: "0 0.5rem",
          }}
        >
          <button
            onClick={() =>
              document
                .getElementById("Projects")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            style={{
              padding: isMobile ? "0.8rem 1.75rem" : "0.9rem 2.2rem",
              borderRadius: "50px",
              background: "linear-gradient(135deg,#ff3cac,#784ba0)",
              color: "#fff",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: isMobile ? "0.9rem" : "1rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 30px rgba(255,60,172,0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
              flex: isSmall ? "1 1 100%" : "0 0 auto",
              maxWidth: isSmall ? 360 : "none",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow =
                "0 12px 40px rgba(255,60,172,0.6)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow =
                "0 8px 30px rgba(255,60,172,0.4)";
            }}
          >
            View My Work
          </button>

          <button
            onClick={() =>
              document
                .getElementById("Contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            style={{
              padding: isMobile ? "0.8rem 1.75rem" : "0.9rem 2.2rem",
              borderRadius: "50px",
              background: "transparent",
              color: "#fff",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: isMobile ? "0.9rem" : "1rem",
              border: "2px solid rgba(255,255,255,0.3)",
              cursor: "pointer",
              transition: "border-color 0.2s, transform 0.2s",
              flex: isSmall ? "1 1 100%" : "0 0 auto",
              maxWidth: isSmall ? 360 : "none",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "#00f5d4";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              e.currentTarget.style.transform = "";
            }}
          >
            Hire Me
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: isMobile ? "0" : "1rem",
            justifyContent: "center",
            margin: "3.5rem auto 0",
            animation: "fadeUp 0.8s 0.8s ease both",
            width: "100%",
            maxWidth: 480,
            padding: "0 0.5rem",
          }}
        >
          {[
            ["5+", "Apps Built"],
            ["3 Live", "On App Store"],
            ["1+", "Year Exp"],
          ].map(([num, label], idx) => (
            <div
              key={label}
              style={{
                textAlign: "center",
                flex: 1,
                padding: "0.5rem",
                borderRight:
                  idx < 2 ? "1px solid rgba(255,255,255,0.1)" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: isMobile ? "1.5rem" : "2rem",
                  fontWeight: 900,
                  background: "linear-gradient(90deg,#ff3cac,#2b86c5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {num}
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontFamily: "'Syne', sans-serif",
                  fontSize: isMobile ? "0.7rem" : "0.8rem",
                  letterSpacing: "1px",
                  marginTop: "0.15rem",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isTablet && (
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.4rem",
            animation: "fadeIn 1s 1s ease both",
          }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.75rem",
              fontFamily: "'Syne', sans-serif",
              letterSpacing: "2px",
            }}
          >
            SCROLL
          </span>
          <div
            style={{
              width: 2,
              height: 50,
              background: "linear-gradient(#ff3cac, transparent)",
              animation: "scrollBar 1.5s ease-in-out infinite",
            }}
          />
        </div>
      )}
    </section>
  );
}

function About() {
  const { isMobile, isTablet } = useResponsive();
  const [ref, vis] = useInView(0.15);

  return (
    <section
      id="About"
      ref={ref}
      style={{
        padding: isMobile
          ? "5rem 1.25rem"
          : isTablet
            ? "5rem 2rem"
            : "6rem 3rem",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr",
          gap: isMobile ? "3.5rem" : isTablet ? "3.5rem" : "5rem",
          alignItems: "center",
        }}
      >
        {/* Avatar column */}
        <div
          style={{
            position: "relative",
            opacity: vis ? 1 : 0,
            transform: vis ? "none" : "translateX(-40px)",
            transition: "all 0.8s ease",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: isMobile ? 220 : isTablet ? 260 : 300,
              height: isMobile ? 220 : isTablet ? 260 : 300,
              borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
              background: "linear-gradient(135deg,#ff3cac,#784ba0,#2b86c5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? "4.5rem" : "6rem",
              boxShadow: "0 30px 80px rgba(255,60,172,0.4)",
              animation: "morphBlob 6s ease-in-out infinite",
              flexShrink: 0,
            }}
          >
            📱
          </div>

          {[
            {
              emoji: "⚡",
              label: "1+ Yr Exp",
              pos: { top: -16, right: isTablet ? 40 : -20 },
              color: "#ffbe0b",
            },
            {
              emoji: "🏆",
              label: "5+ Apps",
              pos: { bottom: 10, right: isTablet ? 20 : -40 },
              color: "#00f5d4",
            },
            {
              emoji: "🌍",
              label: "iOS & Android",
              pos: { bottom: -16, left: isTablet ? 40 : 10 },
              color: "#ff3cac",
            },
          ].map((b, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                ...b.pos,
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
                border: `1px solid ${b.color}44`,
                borderRadius: 12,
                padding: "7px 12px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                animation: `float ${2 + i * 0.5}s ease-in-out infinite alternate`,
                whiteSpace: "nowrap",
              }}
            >
              <span>{b.emoji}</span>
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  color: b.color,
                  fontSize: "0.78rem",
                  fontWeight: 700,
                }}
              >
                {b.label}
              </span>
            </div>
          ))}
        </div>

        {/* Text column */}
        <div
          style={{
            opacity: vis ? 1 : 0,
            transform: vis
              ? "none"
              : isTablet
                ? "translateY(40px)"
                : "translateX(40px)",
            transition: "all 0.8s 0.2s ease",
          }}
        >
          <p
            style={{
              color: "#ff3cac",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              letterSpacing: "3px",
              marginBottom: "1rem",
              fontSize: "0.8rem",
            }}
          >
            ABOUT ME
          </p>

          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 900,
              color: "#fff",
              margin: "0 0 1.25rem",
              lineHeight: 1.1,
              letterSpacing: "-1px",
            }}
          >
            I build apps that{" "}
            <span
              style={{
                background: "linear-gradient(90deg,#00f5d4,#784ba0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              people love
            </span>
          </h2>

          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.8,
              fontFamily: "'Syne', sans-serif",
              marginBottom: "1rem",
              fontSize: isMobile ? "0.92rem" : "1rem",
            }}
          >
            I'm a passionate React Native Developer with hands-on experience
            building cross-platform mobile applications for both iOS and
            Android. I focus on writing clean, efficient code that delivers
            smooth 60fps experiences.
          </p>

          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.8,
              fontFamily: "'Syne', sans-serif",
              marginBottom: "1.5rem",
              fontSize: isMobile ? "0.92rem" : "1rem",
            }}
          >
            Beyond React Native, I have a solid understanding of JavaScript,
            TypeScript, REST APIs, Firebase, and general knowledge of backend
            technologies, allowing me to collaborate effectively with full-stack
            teams.
          </p>

          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            {[
              "React Native",
              "JavaScript",
              "TypeScript",
              "Firebase",
              "Redux",
              "REST APIs",
            ].map((t) => (
              <span
                key={t}
                style={{
                  padding: "5px 14px",
                  borderRadius: 100,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  fontFamily: "'Syne', sans-serif",
                  fontSize: isMobile ? "0.78rem" : "0.85rem",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const SKILLS = [
  { name: "React Native", level: 95, color: "#61dbfb", icon: "📱" },
  { name: "JavaScript (ES6+)", level: 90, color: "#ffbe0b", icon: "🟨" },
  { name: "TypeScript", level: 78, color: "#2b86c5", icon: "🔷" },
  { name: "Redux / Zustand", level: 82, color: "#784ba0", icon: "🔄" },
  { name: "Firebase / Supabase", level: 75, color: "#ff7043", icon: "🔥" },
  { name: "REST APIs / GraphQL", level: 85, color: "#00f5d4", icon: "🌐" },
  { name: "Git & GitHub", level: 88, color: "#ff3cac", icon: "🐙" },
  { name: "React.js", level: 70, color: "#61dbfb", icon: "⚛️" },
];

const OTHER_SKILLS = [
  "HTML / CSS",
  "Node.js",
  "Python",
  "SQL",
  "Expo",
  "Figma",
  "App Store",
  "Play Store",
];

function SkillBar({ name, level, color, icon, vis, delay }) {
  return (
    <div
      style={{
        marginBottom: "1.5rem",
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(20px)",
        transition: `all 0.6s ${delay}s ease`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: 8,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.9rem",
          }}
        >
          {icon} {name}
        </span>
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            color,
            fontWeight: 700,
            fontSize: "0.9rem",
          }}
        >
          {level}%
        </span>
      </div>
      <div
        style={{
          height: 8,
          borderRadius: 100,
          background: "rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 100,
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            width: vis ? `${level}%` : "0%",
            transition: `width 1.2s ${delay + 0.2}s cubic-bezier(0.22,1,0.36,1)`,
            boxShadow: `0 0 12px ${color}88`,
          }}
        />
      </div>
    </div>
  );
}

function Skills() {
  const { isMobile, isTablet } = useResponsive();
  const [ref, vis] = useInView(0.1);

  return (
    <section
      id="Skills"
      ref={ref}
      style={{
        padding: isMobile
          ? "5rem 1.25rem"
          : isTablet
            ? "5rem 2rem"
            : "6rem 3rem",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <SectionHeader
        label="SKILLS"
        title={
          <>
            Tech Stack I <Grad>Master</Grad>
          </>
        }
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "0 2rem",
          marginTop: "3rem",
        }}
      >
        {SKILLS.map((s, i) => (
          <SkillBar key={s.name} {...s} vis={vis} delay={i * 0.08} />
        ))}
      </div>

      <div style={{ marginTop: "3rem" }}>
        <p
          style={{
            fontFamily: "'Syne', sans-serif",
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.78rem",
            letterSpacing: "3px",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          ALSO FAMILIAR WITH
        </p>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {OTHER_SKILLS.map((s, i) => (
            <div
              key={s}
              style={{
                padding: isMobile ? "8px 16px" : "10px 20px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.8)",
                fontFamily: "'Syne', sans-serif",
                fontSize: isMobile ? "0.82rem" : "0.9rem",
                fontWeight: 600,
                opacity: vis ? 1 : 0,
                transform: vis ? "none" : "scale(0.8)",
                transition: `all 0.4s ${0.6 + i * 0.06}s ease`,
                cursor: "default",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.background = "rgba(255,60,172,0.12)";
                e.currentTarget.style.borderColor = "#ff3cac44";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PROJECTS = [
  {
    title: "Salonist – Salon & Spa Booking",
    desc: "A full-featured salon & spa booking platform that allows users to discover nearby salons, book services instantly, and manage appointments. Focused on smooth UX, real-time availability, and performance optimization for seamless bookings.",
    tags: ["React Native", "Booking System", "UI/UX"],
    emoji: "💇‍♀️",
    color: "#ff3cac",
    platform: "iOS & Android",
    live: "https://apps.apple.com/in/app/salonist-salon-spa-booking/id6511235328",
    github: "",
  },
  {
    title: "SafetyDrop",
    desc: "A business-focused safety management app that helps companies manage OSHA compliance, employee training, and safety documentation. Built with Angular & Ionic to streamline workflows and reduce operational costs through structured data handling.",
    tags: ["Angular", "Ionic", "Enterprise App"],
    emoji: "🦺",
    color: "#00f5d4",
    platform: "iOS & Android",
    live: "https://apps.apple.com/in/app/safetydrop/id1448668332",
    github: "",
  },
  {
    title: "Save Me – RECi Security",
    desc: "A personal safety and emergency response app built natively in Swift. Users can instantly send panic alerts, share live location, and trigger emergency communication with a single tap for real-time assistance.",
    tags: ["Swift", "iOS Native", "Location"],
    emoji: "🚨",
    color: "#ffbe0b",
    platform: "iOS",
    live: "https://apps.apple.com/in/app/save-me-reci-security/id6736370555",
    github: "",
  },
  {
    title: "Social Media App (In Progress)",
    desc: "Currently building a scalable social media platform with real-time chat, posts, likes, comments, and push notifications. Focused on performance, clean architecture, and smooth user experience.",
    tags: ["React Native", "Firebase", "Realtime"],
    emoji: "📱",
    color: "#2b86c5",
    platform: "iOS & Android",
    live: "",
    github: "",
  },
];

function hexToRgb(hex) {
  return `${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)}`;
}

function ProjectCard({ p, i }) {
  const [ref, vis] = useInView(0.08);
  const [hov, setHov] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov
          ? `linear-gradient(135deg, rgba(${hexToRgb(p.color)},0.12), rgba(255,255,255,0.03))`
          : "rgba(255,255,255,0.04)",
        border: `1px solid ${hov ? `${p.color}55` : "rgba(255,255,255,0.08)"}`,
        borderRadius: 20,
        padding: "1.5rem",
        cursor: "pointer",
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(30px)",
        transition: `all 0.6s ${i * 0.1}s ease`,
        boxShadow: hov ? `0 20px 60px rgba(${hexToRgb(p.color)},0.2)` : "none",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontSize: "2.2rem" }}>{p.emoji}</div>
        <span
          style={{
            fontSize: "0.72rem",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            color: p.color,
            background: `rgba(${hexToRgb(p.color)},0.12)`,
            border: `1px solid ${p.color}33`,
            padding: "3px 10px",
            borderRadius: 100,
            whiteSpace: "nowrap",
          }}
        >
          {p.platform}
        </span>
      </div>

      <h3
        style={{
          fontFamily: "'Syne', sans-serif",
          color: "#fff",
          fontWeight: 800,
          fontSize: "1.1rem",
          marginBottom: "0.5rem",
        }}
      >
        {p.title}
      </h3>

      <p
        style={{
          color: "rgba(255,255,255,0.6)",
          fontFamily: "'Syne', sans-serif",
          fontSize: "0.87rem",
          lineHeight: 1.65,
          marginBottom: "1.2rem",
          flex: 1,
        }}
      >
        {p.desc}
      </p>

      <div
        style={{
          display: "flex",
          gap: "0.45rem",
          flexWrap: "wrap",
          marginBottom: "1.2rem",
        }}
      >
        {p.tags.map((t) => (
          <span
            key={t}
            style={{
              padding: "3px 10px",
              borderRadius: 100,
              background: `rgba(${hexToRgb(p.color)},0.12)`,
              color: p.color,
              fontFamily: "'Syne', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 700,
              border: `1px solid ${p.color}33`,
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {p.live && (
          <a
            href={p.live}
            target="_blank"
            rel="noreferrer"
            style={{
              color: p.color,
              fontFamily: "'Syne', sans-serif",
              fontSize: "0.85rem",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            ↗ Live Demo
          </a>
        )}
        {p.github ? (
          <a
            href={p.github}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "rgba(255,255,255,0.75)",
              fontFamily: "'Syne', sans-serif",
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
          >
            GitHub
          </a>
        ) : (
          <span
            style={{
              color: "rgba(255,255,255,0.3)",
              fontFamily: "'Syne', sans-serif",
              fontSize: "0.82rem",
            }}
          >
            🔒 Private
          </span>
        )}
      </div>
    </div>
  );
}

function Projects() {
  const { isMobile, isTablet } = useResponsive();

  return (
    <section
      id="Projects"
      style={{
        padding: isMobile
          ? "5rem 1.25rem"
          : isTablet
            ? "5rem 2rem"
            : "6rem 3rem",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <SectionHeader
        label="PROJECTS"
        title={
          <>
            Apps I've <Grad>Built & Shipped</Grad>
          </>
        }
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : isTablet
              ? "repeat(2, 1fr)"
              : "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginTop: "3rem",
        }}
      >
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.title} p={p} i={i} />
        ))}
      </div>
    </section>
  );
}

const EXP = [
  {
    year: "Aug 2025 — Present",
    role: "React Native Developer",
    company: "Vision Vivante Pvt. Ltd.",
    desc: "Currently working on building high-quality cross-platform mobile applications, contributing to product development and delivering pixel-perfect, performant experiences for both iOS and Android users.",
    color: "#ff3cac",
    achievements: ["iOS & Android", "Current Role", "React Native"],
  },
  {
    year: "Jan 2025 — Jul 2025",
    role: "Junior React Native Developer",
    company: "Techner Solutions",
    desc: "Developed and maintained cross-platform mobile applications using React Native. Collaborated with design and backend teams to deliver smooth, production-ready features and improve overall app performance.",
    color: "#2b86c5",
    achievements: ["React Native", "Cross-Platform", "Production Apps"],
  },
  {
    year: "Aug 2024 — Nov 2024",
    role: "React Native Intern",
    company: "Deftsoft Informatics Pvt. Ltd.",
    desc: "Kickstarted my professional journey with a hands-on internship in React Native development. Gained real-world experience building mobile app features, debugging, and working within an agile team environment.",
    color: "#00f5d4",
    achievements: ["Internship", "React Native", "Agile Team"],
  },
];

function Experience() {
  const { isMobile, isTablet } = useResponsive();
  const [ref, vis] = useInView(0.1);

  return (
    <section
      id="Experience"
      ref={ref}
      style={{
        padding: isMobile
          ? "5rem 1.25rem"
          : isTablet
            ? "5rem 2rem"
            : "6rem 3rem",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <SectionHeader
        label="EXPERIENCE"
        title={
          <>
            My Professional <Grad>Journey</Grad>
          </>
        }
      />

      <div
        style={{
          marginTop: "3rem",
          position: "relative",
          maxWidth: 750,
          marginInline: "auto",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: isMobile ? 10 : 20,
            top: 0,
            bottom: 0,
            width: 2,
            background:
              "linear-gradient(to bottom,#ff3cac,#784ba0,#2b86c5,transparent)",
          }}
        />

        {EXP.map((e, i) => (
          <div
            key={i}
            style={{
              paddingLeft: isMobile ? "2.25rem" : "4rem",
              marginBottom: "2.5rem",
              position: "relative",
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translateX(-30px)",
              transition: `all 0.6s ${i * 0.2}s ease`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: isMobile ? 1 : 11,
                top: 8,
                width: isMobile ? 18 : 20,
                height: isMobile ? 18 : 20,
                borderRadius: "50%",
                background: e.color,
                boxShadow: `0 0 20px ${e.color}88`,
                border: "3px solid #05050f",
              }}
            />

            <span
              style={{
                color: e.color,
                fontFamily: "'Syne', sans-serif",
                fontSize: "0.82rem",
                fontWeight: 700,
                letterSpacing: "1px",
              }}
            >
              {e.year}
            </span>

            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                color: "#fff",
                fontWeight: 800,
                fontSize: isMobile
                  ? "1.05rem"
                  : isTablet
                    ? "1.15rem"
                    : "1.35rem",
                margin: "0.3rem 0",
              }}
            >
              {e.role}
            </h3>

            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontFamily: "'Syne', sans-serif",
                fontSize: "0.88rem",
                marginBottom: "0.6rem",
              }}
            >
              @ {e.company}
            </p>

            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                fontFamily: "'Syne', sans-serif",
                lineHeight: 1.7,
                marginBottom: "1rem",
                fontSize: isMobile ? "0.9rem" : "1rem",
              }}
            >
              {e.desc}
            </p>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {e.achievements.map((a) => (
                <span
                  key={a}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 100,
                    background: `rgba(${hexToRgb(e.color)},0.1)`,
                    color: e.color,
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    border: `1px solid ${e.color}33`,
                  }}
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const { isMobile, isTablet } = useResponsive();
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);
  const [ref, vis] = useInView(0.15);

  const inputStyle = {
    padding: isMobile ? "0.8rem 1rem" : "0.9rem 1.2rem",
    borderRadius: 12,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    fontFamily: "'Syne', sans-serif",
    fontSize: isMobile ? "0.95rem" : "1rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    WebkitAppearance: "none",
  };

  return (
    <section
      id="Contact"
      ref={ref}
      style={{
        padding: isMobile
          ? "5rem 1.25rem"
          : isTablet
            ? "5rem 2rem"
            : "6rem 3rem",
        maxWidth: 720,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <SectionHeader
        label="CONTACT"
        title={
          <>
            Let's Build Something <Grad>Amazing!</Grad>
          </>
        }
      />

      <p
        style={{
          color: "rgba(255,255,255,0.6)",
          fontFamily: "'Syne', sans-serif",
          marginTop: "1rem",
          marginBottom: "2.5rem",
          fontSize: isMobile ? "0.92rem" : "1rem",
        }}
      >
        Have a mobile app idea? Want to collaborate or just say hello? I'm
        always open to new opportunities.
      </p>

      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24,
          padding: isMobile ? "1.5rem 1.25rem" : isTablet ? "2rem" : "2.5rem",
          opacity: vis ? 1 : 0,
          transform: vis ? "none" : "translateY(30px)",
          transition: "all 0.8s ease",
        }}
      >
        {sent ? (
          <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🎉</div>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                color: "#00f5d4",
                fontWeight: 800,
                fontSize: "1.4rem",
              }}
            >
              Message Sent!
            </h3>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontFamily: "'Syne', sans-serif",
                marginTop: "0.5rem",
                fontSize: "0.95rem",
              }}
            >
              Thanks for reaching out! I'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => setSent(false)}
              style={{
                marginTop: "1.5rem",
                padding: "0.7rem 2rem",
                borderRadius: 100,
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
              }}
            >
              Send Another
            </button>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                gap: "0.9rem",
              }}
            >
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
              />
            </div>

            <textarea
              placeholder="Tell me about your project or idea..."
              rows={isMobile ? 4 : 5}
              value={form.msg}
              onChange={(e) => setForm({ ...form, msg: e.target.value })}
              style={{ ...inputStyle, resize: "vertical", minHeight: "100px" }}
            />

            <button
              onClick={() => {
                if (form.name && form.email && form.msg) setSent(true);
              }}
              style={{
                padding: isMobile ? "0.85rem" : "1rem",
                borderRadius: 12,
                background: "linear-gradient(135deg,#ff3cac,#784ba0,#2b86c5)",
                color: "#fff",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "1rem",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 8px 30px rgba(255,60,172,0.3)",
                transition: "transform 0.2s",
                width: "100%",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "";
              }}
            >
              Send Message 🚀
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: "1.25rem",
          justifyContent: "center",
          marginTop: "2.5rem",
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "GitHub", color: "#fff", href: "#" },
          { label: "LinkedIn", color: "#2b86c5", href: "#" },
          { label: "Twitter/X", color: "#00f5d4", href: "#" },
        ].map((s) => (
          <a
            key={s.label}
            href={s.href}
            style={{
              color: s.color,
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              textDecoration: "none",
              transition: "transform 0.2s",
              fontSize: isMobile ? "0.9rem" : "1rem",
              padding: "0.4rem",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "";
            }}
          >
            {s.label}
          </a>
        ))}
      </div>
    </section>
  );
}

function Grad({ children }) {
  return (
    <span
      style={{
        background: "linear-gradient(90deg,#ff3cac,#784ba0,#2b86c5)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {children}
    </span>
  );
}

function SectionHeader({ label, title }) {
  const { isMobile } = useResponsive();
  return (
    <div style={{ textAlign: "center" }}>
      <p
        style={{
          color: "#ff3cac",
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          letterSpacing: "4px",
          marginBottom: "0.8rem",
          fontSize: "0.78rem",
        }}
      >
        {label}
      </p>
      <h2
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: isMobile
            ? "clamp(1.7rem, 7vw, 2.5rem)"
            : "clamp(2rem, 5vw, 3rem)",
          fontWeight: 900,
          color: "#fff",
          margin: 0,
          letterSpacing: "-1px",
          lineHeight: 1.1,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

function Footer() {
  const { isMobile } = useResponsive();
  return (
    <footer
      style={{
        textAlign: "center",
        padding: isMobile ? "1.5rem 1rem" : "2rem 1rem",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        color: "rgba(255,255,255,0.35)",
        fontFamily: "'Syne', sans-serif",
        fontSize: isMobile ? "0.78rem" : "0.85rem",
      }}
    >
      <span>Designed & Built with ❤️ by </span>
      <span
        style={{
          background: "linear-gradient(90deg,#ff3cac,#2b86c5)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: 700,
        }}
      >
        Jatin
      </span>
      <span> • React Native Developer</span>
    </footer>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html {
    scroll-behavior: smooth;
    /* Prevent horizontal scroll on all devices */
    overflow-x: hidden;
  }

  body {
    background: #05050f;
    color: #fff;
    overflow-x: hidden;
    font-family: 'Syne', sans-serif;
    /* Better text rendering on mobile */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* Fix iOS tap highlight */
    -webkit-tap-highlight-color: transparent;
  }

  img, svg, video, canvas, iframe {
    max-width: 100%;
    height: auto;
    display: block;
  }

  button, input, textarea, select {
    font: inherit;
    /* Prevent zoom on focus iOS */
    font-size: max(16px, 1em);
  }

  textarea {
    /* Restrict horizontal resize on mobile */
    resize: vertical;
  }

  section {
    scroll-margin-top: 80px;
    width: 100%;
  }

  a {
    /* Ensure tap target size on mobile */
    min-height: 44px;
    display: inline-flex;
    align-items: center;
  }

  button {
    /* iOS button reset */
    -webkit-appearance: none;
    touch-action: manipulation;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #05050f; }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(#ff3cac, #2b86c5);
    border-radius: 10px;
  }

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(30px); }
    to { opacity:1; transform:none; }
  }
  @keyframes fadeIn {
    from { opacity:0; }
    to { opacity:1; }
  }
  @keyframes blink {
    0%,100% { opacity:1; }
    50% { opacity:0; }
  }
  @keyframes blobFloat {
    from { transform:translateY(0) scale(1); }
    to { transform:translateY(-30px) scale(1.05); }
  }
  @keyframes float {
    from { transform:translateY(0); }
    to { transform:translateY(-10px); }
  }
  @keyframes morphBlob {
    0%,100% { border-radius:30% 70% 70% 30% / 30% 30% 70% 70%; }
    25% { border-radius:58% 42% 75% 25% / 76% 46% 54% 24%; }
    50% { border-radius:50% 50% 33% 67% / 55% 27% 73% 45%; }
    75% { border-radius:33% 67% 58% 42% / 63% 68% 32% 37%; }
  }
  @keyframes scrollBar {
    0% { opacity:1; transform:scaleY(1) translateY(0); }
    100% { opacity:0; transform:scaleY(0.5) translateY(10px); }
  }

  /* Prevent content overflow on tiny screens */
  @media (max-width: 360px) {
    section { padding-left: 1rem !important; padding-right: 1rem !important; }
    h1 { font-size: 2rem !important; letter-spacing: -0.5px !important; }
  }

  /* Respect reduce motion preference */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Better focus styles for keyboard navigation */
  button:focus-visible, a:focus-visible {
    outline: 2px solid #ff3cac;
    outline-offset: 3px;
    border-radius: 4px;
  }
  button:focus:not(:focus-visible), a:focus:not(:focus-visible) {
    outline: none;
  }
`;

export default function App() {
  const [active, setActive] = useState("Hero");

  useEffect(() => {
    const sections = [
      "Hero",
      "About",
      "Skills",
      "Projects",
      "Experience",
      "Contact",
    ];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.35 },
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{STYLES}</style>
      <CursorTrail />
      <Navbar active={active} setActive={setActive} />
      <main style={{ width: "100%", overflowX: "hidden" }}>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

// import { useState, useEffect, useRef } from "react";

// const PHOTO_SRC = "data:image/jpeg;base64,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AP8A+sMMMP8A/wCwwF90S1QPgsAAAQURT6wwwgDfeccYQgggggws1vv/AP7/APf/AP8A/wD/ACwww3/+wwlX1a1QPAAPCAQRUdd/7w6fbSQgAAgggggwkgvv/wD/AP8A/wD/AP8A/wA8MMMP/wDrCCRXWrXM8oA+AABdt99/vDp951BCCCCCCCCCCGOe/wD81/8A/wD/AP7wwww//wDsMNX9ateDgAGdcARw333/ALD/AL3YAAggggggggggks1q0v8A/wD/AP8A88MMMP8A/vCB9fFrXHpBN99+c4+889vr1txCCCAACCCCCCCCCDTzDX//AP8A/wD7jDDD/wD7wQdaxS15ywww8bAANdPPPr1YwgggggggghgAgggggw8ggn//AP8AvPDDDX//AKQVfF63w6gwwwQUAAgsffPEwggggAjDAkpDigggggggggk//wD/AP8A6ww1/fQARbVqQ1awwwRSBggAgFv/ALsMAATzzzzzzzzz4oIIIIIIMPf/AP8A3/Sw0/8A0MFGla/desMH3z76x3wAIJiUUxzzzzzzzzzzz6ooIIIIIIMNPb778MMPf2EAH1SldWsMHDD77z31bA6Bnzzzzzzzzz7zzzz764IAAIIIMNb77/8ADDT9rABlWr3XrDDMICW+ohm++AuR0+888888++88882+OICCCCCDT/8A/wD8MNP28kFVYBdcsMPjBiQAQ77qIDw0EBTz77z77777zzz774IIIIIIIP8A+/rDA09tBFWJXVqDDFc8040oCGCA99BBAQw+++++88888+++qCCCCCCCX/8A/gw1fPSUVAd1Sww7EIAAAAgggAHfbQQQAkpltvvvPPPPPvvjiggggggs/wD6oALzyUFQFfcMP1awywAAIIID3330EEEEAKIJa5bz7zzz7777oIYIIILL+4IJTz0HwHdcMM9Lzzzzw4IIbz33200kEEDCAMXXz77zz77777q4IIIJL/8AvCS89tARpXGdxAU88888OO+989995hBBBAAuLHc+++888+++++KCCCC/++CC89xgVrXCUMtAw088++++999995BBJDDG2FmCC2++88+/++++qCCCW+/DC089BVDfScwpAUc88++++9/9999HF9PPdzviCCC++888/wD/AD/4IIIIL78sNLzyF9O8OX2kABTzzz777733332EX832LfCY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u9Lb3/8A9t9Nd89t/DCCCCCCCe++OCCG+D2qCWtpVVVGpU+P/wDwHLPPPrl46xivvffffQXfffec4wgjqggsvvrgghvglug/6a3VQShqg3wxx3zPPPuk1UIn/wD33332kBHX3286ta8IIIJL44II74Ja4L0De5TS1e88/wDsv2xz18urfSO995//APcAQQDffffLDPKAgggvuogkvgtrgfSBrtlDdcTQc7gAAQ89f7unPffdeQQQYRQwVPfffPDffYggtrjggnqgvqVaFPVm61KQaCw3AFjqYAVZfcYYQwTjgUJzSAFPfffffPbAglvvqkvqgPAEeQPxF3VTQfu9OvPvPu407LIwx/8A/wC++++++8Y99999988ICS+e8KyuCcDVtE3SiXVhDDACASjC+51WPENd99f/APv+/wD/AO8oIx9x99988uLT/wDglvilIQFRBVB/VSQ8oDvPvy5tkdDUQ8s84ww84R//AL7zyxDf/wB9988rD/8AvgvrkKgMSP1tz1yzcZDmNyj6CXlJpCgAggywwwQQ8/8A7TwwrH33z3ywKLb4JK5C4kWyP0d/fk3ePYr7rR/uNRZ/L+oIAEMAAAADf77zzwDX3333/wCCD+qCVJ0sAID0T9WLBGvOVL2qCHD8V/CW/vPAAAAADHSy+888ogBx099/qCS/CSoR8IwA4ixhBz7fjvPDBBDE819vCaz9tYoIAAPCCy/888MIBBR1/wDzgv6wfwfZQaaEc/QfRWskf7/fXvAUd/Qwlvv/AFzygCuMDb77zzzzgEUXz/8APWvDXp98UIgjDBBBR/vLCCw8+6AF99tPKWu/Pe9hZvAACe888885sAR1/vS+uXvV8t9x1Dkfz+f/ACwwgscAgTNffe4wgks8lgk4wAAPvvvPPPPCASx/wv8A8P8ABcxVVXjAeOTIx3jDAABCR99995BDLAAFhIY88IAk++898888qTx/rT+CXJR8eArLc2yXsXf7DAAACBz99/8ARxfjDFhtFfOPAAAnvvffvfABDr/w9ilrxfdCs0/RPV+g1/8AsoAgAY33332EXw6cupkRPb8AAY5/373zzygLO6N6oD4kUrzdX0jFWoMP/wD/APTfLP8A332kF/LzqjFULgK8kABD/wB//wDffLCAlqkri1bQXQw3xdfN6g073/8A/wD9+89/951f688IAAyJG/8A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";

// const T = {
//   display: "'Fraunces', Georgia, serif",
//   body: "'DM Sans', system-ui, sans-serif",
//   mono: "'DM Mono', monospace",
//   bg: "#0a0a0f",
//   bgCard: "#111118",
//   bgHover: "#16161f",
//   border: "rgba(255,255,255,0.08)",
//   borderHover: "rgba(255,255,255,0.18)",
//   accent: "#6C8EFF",
//   accentDim: "rgba(108,142,255,0.1)",
//   accentBorder: "rgba(108,142,255,0.28)",
//   teal: "#3ECFB2",
//   tealDim: "rgba(62,207,178,0.1)",
//   textPrimary: "#F0F0F5",
//   textSecondary: "rgba(240,240,245,0.55)",
//   textMuted: "rgba(240,240,245,0.3)",
//   radius: "14px",
//   radiusLg: "20px",
//   radiusFull: "999px",
//   shadowHover: "0 8px 40px rgba(108,142,255,0.14)",
// };

// function useResponsive() {
//   const getWidth = () => (typeof window !== "undefined" ? window.innerWidth : 1440);
//   const [width, setWidth] = useState(getWidth);
//   useEffect(() => {
//     const fn = () => setWidth(getWidth());
//     window.addEventListener("resize", fn);
//     return () => window.removeEventListener("resize", fn);
//   }, []);
//   return { width, isMobile: width <= 480, isSmall: width <= 640, isTablet: width <= 1024 };
// }

// function useInView(threshold = 0.12) {
//   const ref = useRef(null);
//   const [visible, setVisible] = useState(false);
//   useEffect(() => {
//     const node = ref.current;
//     if (!node) return;
//     const obs = new IntersectionObserver(
//       ([e]) => { if (e.isIntersecting) setVisible(true); },
//       { threshold }
//     );
//     obs.observe(node);
//     return () => obs.disconnect();
//   }, [threshold]);
//   return [ref, visible];
// }

// function Navbar({ active, setActive }) {
//   const { isMobile, isTablet } = useResponsive();
//   const [scrolled, setScrolled] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const links = ["Hero", "About", "Skills", "Projects", "Experience", "Contact"];
//   useEffect(() => {
//     const fn = () => setScrolled(window.scrollY > 40);
//     window.addEventListener("scroll", fn);
//     return () => window.removeEventListener("scroll", fn);
//   }, []);
//   useEffect(() => { if (!isTablet) setMenuOpen(false); }, [isTablet]);
//   useEffect(() => {
//     document.body.style.overflow = menuOpen ? "hidden" : "";
//     return () => { document.body.style.overflow = ""; };
//   }, [menuOpen]);
//   const go = (id) => {
//     setActive(id);
//     setMenuOpen(false);
//     document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
//   };
//   return (
//     <nav style={{
//       position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
//       display: "flex", justifyContent: "space-between", alignItems: "center",
//       padding: isMobile ? "0.8rem 1.25rem" : isTablet ? "0.9rem 2rem" : "0.9rem 3.5rem",
//       background: scrolled || menuOpen ? "rgba(10,10,15,0.95)" : "transparent",
//       backdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
//       borderBottom: scrolled || menuOpen ? `1px solid ${T.border}` : "none",
//       transition: "all 0.35s ease",
//     }}>
//       <span style={{ fontFamily: T.display, fontSize: isMobile ? "1.25rem" : "1.45rem", fontWeight: 900, color: T.textPrimary, letterSpacing: "-0.5px", fontStyle: "italic" }}>
//         Jatin<span style={{ color: T.accent }}>.</span>
//       </span>
//       {isTablet ? (
//         <div>
//           <button onClick={() => setMenuOpen(s => !s)} aria-label="Toggle menu" style={{ background: T.bgCard, border: `1px solid ${T.border}`, color: T.textPrimary, borderRadius: T.radius, padding: "0.5rem 0.9rem", cursor: "pointer", fontFamily: T.body, fontWeight: 600, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
//             <span>{menuOpen ? "✕" : "☰"}</span>
//             {!isMobile && <span>{menuOpen ? "Close" : "Menu"}</span>}
//           </button>
//           {menuOpen && (
//             <>
//               <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: -1 }} />
//               <div style={{ position: "fixed", top: isMobile ? "60px" : "68px", left: 0, right: 0, background: "rgba(10,10,15,0.98)", borderBottom: `1px solid ${T.border}`, padding: "0.75rem 1.25rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.2rem", boxShadow: "0 16px 40px rgba(0,0,0,0.5)", zIndex: 99 }}>
//                 {links.map(l => (
//                   <button key={l} onClick={() => go(l)} style={{ background: active === l ? T.accentDim : "none", border: "none", borderLeft: active === l ? `2px solid ${T.accent}` : "2px solid transparent", color: active === l ? T.accent : T.textSecondary, textAlign: "left", padding: "0.8rem 1rem", borderRadius: "0 10px 10px 0", cursor: "pointer", fontFamily: T.body, fontWeight: 600, fontSize: "0.95rem" }}>{l}</button>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       ) : (
//         <div style={{ display: "flex", gap: "clamp(1.5rem, 2.5vw, 2.5rem)" }}>
//           {links.map(l => (
//             <button key={l} onClick={() => go(l)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: T.body, fontSize: "0.875rem", fontWeight: active === l ? 600 : 400, color: active === l ? T.textPrimary : T.textSecondary, transition: "color 0.2s", padding: "4px 0", borderBottom: active === l ? `1.5px solid ${T.accent}` : "1.5px solid transparent", whiteSpace: "nowrap" }}>{l}</button>
//           ))}
//         </div>
//       )}
//     </nav>
//   );
// }

// function Hero() {
//   const { isMobile, isSmall, isTablet } = useResponsive();
//   const [text, setText] = useState("");
//   const phrases = ["React Native Developer", "Mobile App Builder", "Cross-Platform Expert", "UI/UX Enthusiast"];
//   const [pi, setPi] = useState(0);
//   const [deleting, setDeleting] = useState(false);
//   useEffect(() => {
//     const current = phrases[pi];
//     let t;
//     if (!deleting && text.length < current.length) { t = setTimeout(() => setText(current.slice(0, text.length + 1)), 75); }
//     else if (!deleting && text.length === current.length) { t = setTimeout(() => setDeleting(true), 2000); }
//     else if (deleting && text.length > 0) { t = setTimeout(() => setText(text.slice(0, -1)), 38); }
//     else { setDeleting(false); setPi(p => (p + 1) % phrases.length); }
//     return () => clearTimeout(t);
//   }, [text, deleting, pi]);
//   return (
//     <section id="Hero" style={{ minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", textAlign: "center", padding: isMobile ? "5.5rem 1.25rem 3rem" : isTablet ? "6rem 2.5rem 3rem" : "0 3rem", position: "relative", overflow: "hidden" }}>
//       <div style={{ position: "absolute", width: isTablet ? 360 : 520, height: isTablet ? 360 : 520, borderRadius: "50%", background: "rgba(108,142,255,0.05)", top: "10%", left: "50%", transform: "translateX(-50%)", filter: "blur(90px)", pointerEvents: "none" }} />
//       <div style={{ position: "relative", zIndex: 2, maxWidth: 640, width: "100%" }}>
//         <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", background: T.tealDim, border: `1px solid rgba(62,207,178,0.25)`, borderRadius: T.radiusFull, padding: isMobile ? "4px 14px" : "5px 16px", marginBottom: "1.75rem", animation: "fadeUp 0.7s ease both" }}>
//           <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.teal, display: "inline-block", animation: "pulse 2s ease-in-out infinite", flexShrink: 0 }} />
//           <span style={{ color: T.teal, fontFamily: T.body, fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.04em" }}>Available for Work</span>
//         </div>
//         <h1 style={{ fontFamily: T.display, fontSize: "clamp(2.6rem, 8.5vw, 5.5rem)", fontWeight: 900, lineHeight: 1.04, letterSpacing: "-2px", margin: "0 0 1rem", color: T.textPrimary, animation: "fadeUp 0.7s 0.15s ease both", fontStyle: "italic" }}>Jatin Sharma</h1>
//         <div style={{ minHeight: isMobile ? "3.2rem" : "2.6rem", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeUp 0.7s 0.28s ease both", marginBottom: "1.5rem" }}>
//           <span style={{ fontFamily: T.mono, fontSize: "clamp(0.85rem, 2.4vw, 1.05rem)", color: T.textSecondary, letterSpacing: "0.02em" }}>
//             {text}<span style={{ animation: "blink 1s step-end infinite", color: T.accent }}>|</span>
//           </span>
//         </div>
//         <p style={{ maxWidth: 460, margin: "0 auto 2.25rem", color: T.textSecondary, fontFamily: T.body, fontSize: isMobile ? "0.9rem" : "0.97rem", lineHeight: 1.82, animation: "fadeUp 0.7s 0.4s ease both", padding: "0 0.5rem" }}>
//           Building polished, high-performance mobile apps for iOS & Android. Focused on clean code and seamless user experiences.
//         </p>
//         <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", animation: "fadeUp 0.7s 0.5s ease both", padding: "0 0.5rem" }}>
//           <button onClick={() => document.getElementById("Projects")?.scrollIntoView({ behavior: "smooth" })} style={{ padding: isMobile ? "0.75rem 1.75rem" : "0.8rem 2rem", borderRadius: T.radiusFull, background: T.accent, color: "#fff", fontFamily: T.body, fontWeight: 600, fontSize: isMobile ? "0.88rem" : "0.92rem", border: "none", cursor: "pointer", transition: "opacity 0.2s, transform 0.2s", flex: isSmall ? "1 1 100%" : "0 0 auto", maxWidth: isSmall ? 340 : "none" }} onMouseOver={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseOut={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = ""; }}>View My Work</button>
//           <button onClick={() => document.getElementById("Contact")?.scrollIntoView({ behavior: "smooth" })} style={{ padding: isMobile ? "0.75rem 1.75rem" : "0.8rem 2rem", borderRadius: T.radiusFull, background: "transparent", color: T.textPrimary, fontFamily: T.body, fontWeight: 600, fontSize: isMobile ? "0.88rem" : "0.92rem", border: `1.5px solid ${T.border}`, cursor: "pointer", transition: "border-color 0.2s, transform 0.2s", flex: isSmall ? "1 1 100%" : "0 0 auto", maxWidth: isSmall ? 340 : "none" }} onMouseOver={e => { e.currentTarget.style.borderColor = T.textSecondary; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseOut={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = ""; }}>Hire Me</button>
//         </div>
//         <div style={{ display: "flex", margin: "3.5rem auto 0", animation: "fadeUp 0.7s 0.65s ease both", maxWidth: 400, width: "100%" }}>
//           {[["5+", "Apps Built"], ["3 Live", "On App Store"], ["1+", "Year Exp"]].map(([num, label], idx) => (
//             <div key={label} style={{ flex: 1, textAlign: "center", padding: "0.5rem", borderRight: idx < 2 ? `1px solid ${T.border}` : "none" }}>
//               <div style={{ fontFamily: T.display, fontStyle: "italic", fontSize: isMobile ? "1.45rem" : "1.75rem", fontWeight: 900, color: T.textPrimary }}>{num}</div>
//               <div style={{ fontFamily: T.body, color: T.textMuted, fontSize: "0.72rem", letterSpacing: "0.06em", marginTop: "0.1rem" }}>{label}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//       {!isTablet && (
//         <div style={{ position: "absolute", bottom: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", animation: "fadeIn 1s 1.2s ease both" }}>
//           <span style={{ color: T.textMuted, fontSize: "0.68rem", fontFamily: T.body, letterSpacing: "3px" }}>SCROLL</span>
//           <div style={{ width: 1, height: 38, background: `linear-gradient(${T.accent}, transparent)`, animation: "scrollBar 1.8s ease-in-out infinite" }} />
//         </div>
//       )}
//     </section>
//   );
// }

// function About() {
//   const { isMobile, isTablet } = useResponsive();
//   const [ref, vis] = useInView(0.12);
//   return (
//     <section id="About" ref={ref} style={{ padding: isMobile ? "5rem 1.25rem" : isTablet ? "5rem 2.5rem" : "6rem 3.5rem", maxWidth: 1080, margin: "0 auto" }}>
//       <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 1.15fr", gap: isMobile ? "3rem" : "4.5rem", alignItems: "center" }}>

//         {/* PHOTO COLUMN */}
//         <div style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateX(-28px)", transition: "all 0.7s ease", display: "flex", justifyContent: "center" }}>
//           <div style={{ position: "relative", width: isMobile ? 220 : isTablet ? 260 : 300, flexShrink: 0 }}>
//             {/* Accent ring behind photo */}
//             <div style={{ position: "absolute", inset: -4, borderRadius: "38% 62% 60% 40% / 42% 38% 62% 58%", background: `linear-gradient(135deg, ${T.accent}66, ${T.teal}44)`, animation: "morphBlob 8s ease-in-out infinite", zIndex: 0 }} />
//             {/* Photo blob */}
//             <div style={{ position: "relative", width: isMobile ? 220 : isTablet ? 260 : 300, height: isMobile ? 268 : isTablet ? 316 : 365, borderRadius: "38% 62% 60% 40% / 42% 38% 62% 58%", overflow: "hidden", border: `2px solid ${T.borderHover}`, animation: "morphBlob 8s ease-in-out infinite", zIndex: 1, boxShadow: "0 28px 72px rgba(0,0,0,0.5)" }}>
//               <img src={PHOTO_SRC} alt="Jatin Sharma" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 10%", display: "block" }} />
//               <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "25%", background: `linear-gradient(to top, ${T.bg}cc, transparent)` }} />
//             </div>
//             {/* Floating chips */}
//             {[
//               { label: "1+ Yr Exp", pos: { top: -14, right: isMobile ? 10 : isTablet ? 30 : -12 }, color: T.accent },
//               { label: "5+ Apps", pos: { bottom: 20, right: isMobile ? 5 : isTablet ? 20 : -22 }, color: T.teal },
//               { label: "iOS & Android", pos: { bottom: -14, left: isMobile ? 10 : isTablet ? 30 : -8 }, color: T.textSecondary },
//             ].map((b, i) => (
//               <div key={i} style={{ position: "absolute", ...b.pos, background: T.bgCard, border: `1px solid ${T.borderHover}`, borderRadius: 10, padding: "5px 11px", whiteSpace: "nowrap", animation: `float ${2.2 + i * 0.4}s ease-in-out infinite alternate`, zIndex: 2, backdropFilter: "blur(12px)" }}>
//                 <span style={{ fontFamily: T.body, color: b.color, fontSize: "0.73rem", fontWeight: 600 }}>{b.label}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* TEXT COLUMN */}
//         <div style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : isTablet ? "translateY(28px)" : "translateX(28px)", transition: "all 0.7s 0.18s ease" }}>
//           <p style={{ fontFamily: T.body, color: T.accent, fontWeight: 600, fontSize: "0.72rem", letterSpacing: "0.12em", marginBottom: "0.7rem" }}>ABOUT ME</p>
//           <h2 style={{ fontFamily: T.display, fontStyle: "italic", fontSize: "clamp(1.8rem, 4vw, 2.75rem)", fontWeight: 900, color: T.textPrimary, margin: "0 0 1.2rem", lineHeight: 1.15, letterSpacing: "-0.5px" }}>
//             I build apps that <span style={{ color: T.accent }}>people love</span>
//           </h2>
//           <p style={{ color: T.textSecondary, lineHeight: 1.85, fontFamily: T.body, marginBottom: "0.9rem", fontSize: isMobile ? "0.91rem" : "0.96rem" }}>
//             I'm a React Native Developer with hands-on experience building cross-platform mobile applications for iOS and Android. I focus on clean, efficient code that delivers smooth, pixel-perfect experiences.
//           </p>
//           <p style={{ color: T.textMuted, lineHeight: 1.85, fontFamily: T.body, marginBottom: "1.6rem", fontSize: isMobile ? "0.88rem" : "0.93rem" }}>
//             Beyond React Native, I'm comfortable with JavaScript, TypeScript, REST APIs, Firebase, Angular, and Ionic — allowing me to collaborate effectively across stacks.
//           </p>
//           <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
//             {["React Native", "JavaScript", "TypeScript", "Firebase", "Redux", "REST APIs"].map(t => (
//               <span key={t} style={{ padding: "5px 13px", borderRadius: T.radiusFull, background: T.bgCard, border: `1px solid ${T.border}`, color: T.textSecondary, fontFamily: T.body, fontSize: "0.79rem", fontWeight: 500 }}>{t}</span>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// const SKILLS = [
//   { name: "React Native", level: 95, color: "#6C8EFF", icon: "📱" },
//   { name: "JavaScript (ES6+)", level: 90, color: "#F5C842", icon: "🟨" },
//   { name: "TypeScript", level: 78, color: "#4A8FD4", icon: "🔷" },
//   { name: "Redux / Zustand", level: 82, color: "#9B72CF", icon: "🔄" },
//   { name: "Firebase / Supabase", level: 75, color: "#F07040", icon: "🔥" },
//   { name: "REST APIs / GraphQL", level: 85, color: "#3ECFB2", icon: "🌐" },
//   { name: "Angular & Ionic", level: 70, color: "#E04050", icon: "🅰️" },
//   { name: "Git & GitHub", level: 88, color: "#9CA3AF", icon: "🐙" },
// ];
// const OTHER_SKILLS = ["HTML / CSS", "Node.js", "Python", "SQL", "Expo", "Swift", "Figma", "App Store", "Play Store"];

// function SkillBar({ name, level, color, icon, vis, delay }) {
//   return (
//     <div style={{ marginBottom: "1.35rem", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(14px)", transition: `all 0.55s ${delay}s ease` }}>
//       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
//         <span style={{ fontFamily: T.body, color: T.textSecondary, fontWeight: 500, fontSize: "0.87rem" }}>{icon} {name}</span>
//         <span style={{ fontFamily: T.mono, color: T.textMuted, fontSize: "0.78rem" }}>{level}%</span>
//       </div>
//       <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,0.06)" }}>
//         <div style={{ height: "100%", borderRadius: 99, background: color, width: vis ? `${level}%` : "0%", transition: `width 1.1s ${delay + 0.2}s cubic-bezier(0.22,1,0.36,1)`, opacity: 0.8 }} />
//       </div>
//     </div>
//   );
// }

// function Skills() {
//   const { isMobile, isTablet } = useResponsive();
//   const [ref, vis] = useInView(0.1);
//   return (
//     <section id="Skills" ref={ref} style={{ padding: isMobile ? "5rem 1.25rem" : isTablet ? "5rem 2.5rem" : "6rem 3.5rem", maxWidth: 1080, margin: "0 auto" }}>
//       <SectionHeader label="SKILLS" title={<>Tech Stack I <Em>Work With</Em></>} />
//       <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(260px, 1fr))", gap: "0 2.5rem", marginTop: "2.75rem" }}>
//         {SKILLS.map((s, i) => <SkillBar key={s.name} {...s} vis={vis} delay={i * 0.07} />)}
//       </div>
//       <div style={{ marginTop: "2.75rem" }}>
//         <p style={{ fontFamily: T.body, color: T.textMuted, fontSize: "0.7rem", letterSpacing: "0.12em", marginBottom: "1.2rem", textAlign: "center" }}>ALSO FAMILIAR WITH</p>
//         <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap", justifyContent: "center" }}>
//           {OTHER_SKILLS.map((s, i) => (
//             <span key={s} style={{ padding: isMobile ? "6px 13px" : "6px 15px", borderRadius: T.radius, background: T.bgCard, border: `1px solid ${T.border}`, color: T.textSecondary, fontFamily: T.body, fontSize: "0.8rem", fontWeight: 500, opacity: vis ? 1 : 0, transform: vis ? "none" : "scale(0.9)", transition: `all 0.4s ${0.5 + i * 0.05}s ease`, cursor: "default" }} onMouseOver={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.textPrimary; }} onMouseOut={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSecondary; }}>{s}</span>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// const PROJECTS = [
//   { title: "Salonist – Salon & Spa Booking", desc: "A full-featured salon & spa booking platform for discovering nearby salons, booking services, and managing appointments with real-time availability.", tags: ["React Native", "Booking System", "UI/UX"], emoji: "💇‍♀️", accentColor: "#6C8EFF", platform: "iOS & Android", live: "https://apps.apple.com/in/app/salonist-salon-spa-booking/id6511235328" },
//   { title: "SafetyDrop", desc: "An enterprise safety management app for OSHA compliance, employee training, and safety documentation — built with Angular & Ionic.", tags: ["Angular", "Ionic", "Enterprise App"], emoji: "🦺", accentColor: "#3ECFB2", platform: "iOS & Android", live: "https://apps.apple.com/in/app/safetydrop/id1448668332" },
//   { title: "Save Me – RECi Security", desc: "A native iOS personal safety app. One tap sends a panic alert, shares live location, and triggers emergency communication for instant assistance.", tags: ["Swift", "iOS Native", "Location"], emoji: "🚨", accentColor: "#F5A623", platform: "iOS", live: "https://apps.apple.com/in/app/save-me-reci-security/id6736370555" },
//   { title: "Social Media App", desc: "A scalable social platform in progress — real-time chat, posts, likes, comments, and push notifications with a focus on performance and clean architecture.", tags: ["React Native", "Firebase", "Realtime"], emoji: "📱", accentColor: "#7B8FBB", platform: "iOS & Android", live: "", inProgress: true },
// ];

// function ProjectCard({ p, i }) {
//   const [ref, vis] = useInView(0.08);
//   const [hov, setHov] = useState(false);
//   return (
//     <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: hov ? T.bgHover : T.bgCard, border: `1px solid ${hov ? T.borderHover : T.border}`, borderRadius: T.radiusLg, padding: "1.5rem", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(22px)", transition: `all 0.55s ${i * 0.09}s ease`, boxShadow: hov ? T.shadowHover : "none", display: "flex", flexDirection: "column", minWidth: 0 }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", gap: "0.75rem", flexWrap: "wrap" }}>
//         <span style={{ fontSize: "1.75rem", lineHeight: 1 }}>{p.emoji}</span>
//         <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
//           {p.inProgress && <span style={{ fontSize: "0.67rem", fontFamily: T.body, fontWeight: 600, color: T.teal, background: T.tealDim, border: "1px solid rgba(62,207,178,0.2)", padding: "2px 9px", borderRadius: T.radiusFull }}>In Progress</span>}
//           <span style={{ fontSize: "0.68rem", fontFamily: T.body, fontWeight: 500, color: T.textMuted, background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, padding: "2px 9px", borderRadius: T.radiusFull }}>{p.platform}</span>
//         </div>
//       </div>
//       <h3 style={{ fontFamily: T.display, fontStyle: "italic", color: T.textPrimary, fontWeight: 800, fontSize: "1.05rem", marginBottom: "0.45rem", lineHeight: 1.3 }}>{p.title}</h3>
//       <p style={{ color: T.textSecondary, fontFamily: T.body, fontSize: "0.85rem", lineHeight: 1.72, marginBottom: "1.1rem", flex: 1 }}>{p.desc}</p>
//       <div style={{ display: "flex", gap: "0.38rem", flexWrap: "wrap", marginBottom: "1.1rem" }}>
//         {p.tags.map(t => <span key={t} style={{ padding: "3px 10px", borderRadius: T.radiusFull, background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, color: T.textMuted, fontFamily: T.body, fontSize: "0.73rem", fontWeight: 500 }}>{t}</span>)}
//       </div>
//       <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
//         {p.live ? <a href={p.live} target="_blank" rel="noreferrer" style={{ color: p.accentColor, fontFamily: T.body, fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}>↗ App Store</a> : <span style={{ color: T.textMuted, fontFamily: T.body, fontSize: "0.82rem" }}>Coming soon</span>}
//         <span style={{ color: T.textMuted, fontFamily: T.body, fontSize: "0.79rem" }}>🔒 Private</span>
//       </div>
//     </div>
//   );
// }

// function Projects() {
//   const { isMobile, isTablet } = useResponsive();
//   return (
//     <section id="Projects" style={{ padding: isMobile ? "5rem 1.25rem" : isTablet ? "5rem 2.5rem" : "6rem 3.5rem", maxWidth: 1080, margin: "0 auto" }}>
//       <SectionHeader label="PROJECTS" title={<>Apps I've <Em>Built & Shipped</Em></>} />
//       <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(270px, 1fr))", gap: "1.2rem", marginTop: "2.75rem" }}>
//         {PROJECTS.map((p, i) => <ProjectCard key={p.title} p={p} i={i} />)}
//       </div>
//     </section>
//   );
// }

// const EXP = [
//   { year: "Aug 2025 — Present", role: "React Native Developer", company: "Vision Vivante Pvt. Ltd.", desc: "Currently building high-quality cross-platform mobile applications, contributing to product development and delivering performant experiences for iOS and Android users.", color: "#6C8EFF", tags: ["iOS & Android", "Current Role", "React Native"] },
//   { year: "Jan 2025 — Jul 2025", role: "Junior React Native Developer", company: "Techner Solutions", desc: "Developed and maintained cross-platform mobile apps. Collaborated with design and backend teams to deliver smooth, production-ready features and improve overall app performance.", color: "#3ECFB2", tags: ["React Native", "Cross-Platform", "Production Apps"] },
//   { year: "Aug 2024 — Nov 2024", role: "React Native Intern", company: "Deftsoft Informatics Pvt. Ltd.", desc: "Kickstarted my professional journey with hands-on internship experience in React Native — building mobile features, debugging, and working within an agile team environment.", color: "#9B72CF", tags: ["Internship", "React Native", "Agile"] },
// ];

// function Experience() {
//   const { isMobile, isTablet } = useResponsive();
//   const [ref, vis] = useInView(0.1);
//   return (
//     <section id="Experience" ref={ref} style={{ padding: isMobile ? "5rem 1.25rem" : isTablet ? "5rem 2.5rem" : "6rem 3.5rem", maxWidth: 1080, margin: "0 auto" }}>
//       <SectionHeader label="EXPERIENCE" title={<>My Professional <Em>Journey</Em></>} />
//       <div style={{ marginTop: "2.75rem", position: "relative", maxWidth: 660, marginInline: "auto" }}>
//         <div style={{ position: "absolute", left: isMobile ? 9 : 17, top: 6, bottom: 6, width: 1, background: `linear-gradient(to bottom, #6C8EFF55, #3ECFB255, transparent)` }} />
//         {EXP.map((e, i) => (
//           <div key={i} style={{ paddingLeft: isMobile ? "2.2rem" : "3.6rem", marginBottom: i < EXP.length - 1 ? "2.75rem" : 0, position: "relative", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(18px)", transition: `all 0.6s ${i * 0.18}s ease` }}>
//             <div style={{ position: "absolute", left: isMobile ? 0 : 8, top: 6, width: isMobile ? 18 : 20, height: isMobile ? 18 : 20, borderRadius: "50%", background: e.color, border: `3px solid ${T.bg}`, boxShadow: `0 0 0 1px ${e.color}44` }} />
//             <span style={{ fontFamily: T.mono, color: T.textMuted, fontSize: "0.73rem", letterSpacing: "0.06em" }}>{e.year}</span>
//             <h3 style={{ fontFamily: T.display, fontStyle: "italic", color: T.textPrimary, fontWeight: 800, fontSize: isMobile ? "1rem" : isTablet ? "1.1rem" : "1.2rem", margin: "0.28rem 0 0.1rem", lineHeight: 1.2 }}>{e.role}</h3>
//             <p style={{ color: e.color, fontFamily: T.body, fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.55rem" }}>{e.company}</p>
//             <p style={{ color: T.textSecondary, fontFamily: T.body, lineHeight: 1.78, marginBottom: "0.85rem", fontSize: isMobile ? "0.87rem" : "0.92rem" }}>{e.desc}</p>
//             <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
//               {e.tags.map(a => <span key={a} style={{ padding: "3px 10px", borderRadius: T.radiusFull, background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, color: T.textMuted, fontFamily: T.body, fontSize: "0.73rem", fontWeight: 500 }}>{a}</span>)}
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

// function Contact() {
//   const { isMobile, isTablet } = useResponsive();
//   const [form, setForm] = useState({ name: "", email: "", msg: "" });
//   const [sent, setSent] = useState(false);
//   const [ref, vis] = useInView(0.12);
//   const inputStyle = { padding: isMobile ? "0.75rem 1rem" : "0.82rem 1.1rem", borderRadius: T.radius, background: T.bgCard, border: `1px solid ${T.border}`, color: T.textPrimary, fontFamily: T.body, fontSize: "max(16px, 0.93rem)", outline: "none", width: "100%", boxSizing: "border-box", WebkitAppearance: "none", transition: "border-color 0.2s" };
//   return (
//     <section id="Contact" ref={ref} style={{ padding: isMobile ? "5rem 1.25rem" : isTablet ? "5rem 2.5rem" : "6rem 3.5rem", maxWidth: 660, margin: "0 auto", textAlign: "center" }}>
//       <SectionHeader label="CONTACT" title={<>Let's Build Something <Em>Together</Em></>} />
//       <p style={{ color: T.textSecondary, fontFamily: T.body, marginTop: "0.85rem", marginBottom: "2.25rem", fontSize: isMobile ? "0.9rem" : "0.95rem", lineHeight: 1.8 }}>
//         Have a mobile app idea, want to collaborate, or just say hello? I'm always open to new opportunities.
//       </p>
//       <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: isMobile ? "1.5rem 1.25rem" : isTablet ? "2rem" : "2.25rem", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(22px)", transition: "all 0.7s ease", textAlign: "left" }}>
//         {sent ? (
//           <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
//             <div style={{ fontSize: "2.5rem", marginBottom: "1rem", color: T.teal }}>✓</div>
//             <h3 style={{ fontFamily: T.display, fontStyle: "italic", color: T.teal, fontWeight: 800, fontSize: "1.35rem" }}>Message Sent</h3>
//             <p style={{ color: T.textSecondary, fontFamily: T.body, marginTop: "0.5rem", fontSize: "0.9rem" }}>Thanks for reaching out! I'll get back to you within 24 hours.</p>
//             <button onClick={() => setSent(false)} style={{ marginTop: "1.4rem", padding: "0.62rem 1.6rem", borderRadius: T.radiusFull, background: "rgba(255,255,255,0.06)", color: T.textPrimary, border: `1px solid ${T.border}`, cursor: "pointer", fontFamily: T.body, fontWeight: 500, fontSize: "0.87rem" }}>Send Another</button>
//           </div>
//         ) : (
//           <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
//             <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "0.8rem" }}>
//               <input type="text" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} onFocus={e => { e.target.style.borderColor = T.accentBorder; }} onBlur={e => { e.target.style.borderColor = T.border; }} style={inputStyle} />
//               <input type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} onFocus={e => { e.target.style.borderColor = T.accentBorder; }} onBlur={e => { e.target.style.borderColor = T.border; }} style={inputStyle} />
//             </div>
//             <textarea placeholder="Tell me about your project or idea..." rows={isMobile ? 4 : 5} value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })} onFocus={e => { e.target.style.borderColor = T.accentBorder; }} onBlur={e => { e.target.style.borderColor = T.border; }} style={{ ...inputStyle, resize: "vertical", minHeight: "100px" }} />
//             <button onClick={() => { if (form.name && form.email && form.msg) setSent(true); }} style={{ padding: "0.82rem", borderRadius: T.radius, background: T.accent, color: "#fff", fontFamily: T.body, fontWeight: 600, fontSize: "0.93rem", border: "none", cursor: "pointer", transition: "opacity 0.2s, transform 0.2s", width: "100%" }} onMouseOver={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }} onMouseOut={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = ""; }}>Send Message</button>
//           </div>
//         )}
//       </div>
//       <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginTop: "1.75rem", flexWrap: "wrap" }}>
//         {[{ label: "GitHub", href: "#" }, { label: "LinkedIn", href: "#" }, { label: "Twitter / X", href: "#" }].map(s => (
//           <a key={s.label} href={s.href} style={{ color: T.textMuted, fontFamily: T.body, fontWeight: 500, textDecoration: "none", fontSize: "0.83rem", transition: "color 0.2s, transform 0.2s", padding: "0.3rem" }} onMouseOver={e => { e.currentTarget.style.color = T.textPrimary; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseOut={e => { e.currentTarget.style.color = T.textMuted; e.currentTarget.style.transform = ""; }}>{s.label}</a>
//         ))}
//       </div>
//     </section>
//   );
// }

// function Em({ children }) {
//   return <span style={{ color: T.accent, fontStyle: "italic" }}>{children}</span>;
// }

// function SectionHeader({ label, title }) {
//   const { isMobile } = useResponsive();
//   return (
//     <div style={{ textAlign: "center" }}>
//       <p style={{ fontFamily: T.body, color: T.accent, fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.14em", marginBottom: "0.7rem" }}>{label}</p>
//       <h2 style={{ fontFamily: T.display, fontStyle: "italic", fontSize: isMobile ? "clamp(1.65rem, 7vw, 2.3rem)" : "clamp(1.9rem, 4.5vw, 2.7rem)", fontWeight: 900, color: T.textPrimary, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.12 }}>{title}</h2>
//     </div>
//   );
// }

// function Footer() {
//   const { isMobile } = useResponsive();
//   return (
//     <footer style={{ textAlign: "center", padding: isMobile ? "1.5rem 1rem" : "2rem 1rem", borderTop: `1px solid ${T.border}`, color: T.textMuted, fontFamily: T.body, fontSize: "0.8rem" }}>
//       Designed & built by <span style={{ color: T.textSecondary, fontWeight: 600 }}>Jatin Sharma</span>{" "}— React Native Developer
//     </footer>
//   );
// }

// const STYLES = `
//   @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Mono:wght@400;500&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;0,9..144,900;1,9..144,700;1,9..144,800;1,9..144,900&display=swap');
//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//   html { scroll-behavior: smooth; overflow-x: hidden; }
//   body { background: #0a0a0f; color: #F0F0F5; overflow-x: hidden; font-family: 'DM Sans', system-ui, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; -webkit-tap-highlight-color: transparent; }
//   img, svg, video, canvas, iframe { max-width: 100%; height: auto; display: block; }
//   button, input, textarea, select { font: inherit; font-size: max(16px, 1em); }
//   textarea { resize: vertical; }
//   section { scroll-margin-top: 74px; width: 100%; }
//   a { min-height: 44px; display: inline-flex; align-items: center; }
//   button { -webkit-appearance: none; touch-action: manipulation; }
//   ::-webkit-scrollbar { width: 3px; }
//   ::-webkit-scrollbar-track { background: #0a0a0f; }
//   ::-webkit-scrollbar-thumb { background: rgba(108,142,255,0.3); border-radius: 99px; }
//   @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
//   @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
//   @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
//   @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.55; transform: scale(0.8); } }
//   @keyframes float { from { transform: translateY(0); } to { transform: translateY(-7px); } }
//   @keyframes morphBlob { 0%,100% { border-radius: 38% 62% 60% 40% / 42% 38% 62% 58%; } 33% { border-radius: 60% 40% 50% 50% / 55% 45% 55% 45%; } 66% { border-radius: 45% 55% 40% 60% / 60% 40% 60% 40%; } }
//   @keyframes scrollBar { 0% { opacity: 1; transform: scaleY(1) translateY(0); } 100% { opacity: 0; transform: scaleY(0.4) translateY(8px); } }
//   @media (max-width: 360px) { section { padding-left: 1rem !important; padding-right: 1rem !important; } h1 { font-size: 1.9rem !important; } }
//   @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; } }
//   button:focus-visible, a:focus-visible { outline: 2px solid #6C8EFF; outline-offset: 3px; border-radius: 4px; }
//   button:focus:not(:focus-visible), a:focus:not(:focus-visible) { outline: none; }
// `;

// export default function App() {
//   const [active, setActive] = useState("Hero");
//   useEffect(() => {
//     const sections = ["Hero", "About", "Skills", "Projects", "Experience", "Contact"];
//     const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }), { threshold: 0.35 });
//     sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
//     return () => obs.disconnect();
//   }, []);
//   return (
//     <>
//       <style>{STYLES}</style>
//       <Navbar active={active} setActive={setActive} />
//       <main style={{ width: "100%", overflowX: "hidden" }}>
//         <Hero />
//         <About />
//         <Skills />
//         <Projects />
//         <Experience />
//         <Contact />
//       </main>
//       <Footer />
//     </>
//   );
// }
