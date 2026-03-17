import { useState, useEffect, useRef } from "react";

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
            ["15+", "Apps Built"],
            ["3+", "Years Exp"],
            ["10+", "Happy Clients"],
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
              label: "3+ Yrs Exp",
              pos: { top: -16, right: isTablet ? 40 : -20 },
              color: "#ffbe0b",
            },
            {
              emoji: "🏆",
              label: "15+ Apps",
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
            I'm a passionate React Native Developer specializing in building
            cross-platform mobile applications for both iOS and Android. I focus
            on writing clean, efficient code that delivers smooth 60fps
            experiences.
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
    desc: "A business-focused safety management app that helps companies manage OSHA compliance, employee training, and safety documentation. Built to streamline workflows and reduce operational costs through structured data handling.",
    tags: ["React Native", "Forms", "Enterprise App"],
    emoji: "🦺",
    color: "#00f5d4",
    platform: "iOS & Android",
    live: "https://apps.apple.com/in/app/safetydrop/id1448668332",
    github: "",
  },
  {
    title: "Save Me – RECi Security",
    desc: "A personal safety and emergency response app with panic alert functionality. Users can instantly send alerts, share location, and trigger emergency communication with a single action for real-time assistance.",
    tags: ["React Native", "Security", "Location"],
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
    year: "2024 — Present",
    role: "Senior React Native Developer",
    company: "MobileTech Solutions",
    desc: "Leading the mobile development team to build and ship cross-platform apps for 50K+ users. Improved app performance by 35% and reduced crash rate to under 0.1%.",
    color: "#ff3cac",
    achievements: ["50K+ Users", "35% Faster", "Team Lead"],
  },
  {
    year: "2023 — 2024",
    role: "React Native Developer",
    company: "AppVenture Inc.",
    desc: "Built 5 production-level apps from scratch including an e-commerce platform and a health tracker. Integrated Stripe, Google Maps, and Firebase SDKs.",
    color: "#2b86c5",
    achievements: ["5 Apps Shipped", "Stripe Integration", "Maps API"],
  },
  {
    year: "2022 — 2023",
    role: "Junior Mobile Developer",
    company: "StartupHub",
    desc: "Started professional journey in mobile development. Contributed to 3 apps, fixed 200+ bugs, and learned the full mobile development lifecycle from design handoff to App Store submission.",
    color: "#00f5d4",
    achievements: ["3 Apps", "200+ Bug Fixes", "App Store Launch"],
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
