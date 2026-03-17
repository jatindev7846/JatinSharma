import { useState, useEffect, useRef } from "react";


function CursorTrail() {
  const [dots, setDots] = useState([]);
  useEffect(() => {
    const colors = ["#ff3cac", "#784ba0", "#2b86c5", "#00f5d4", "#ffbe0b"];
    let id = 0;
    const move = (e) => {
      const dot = {
        id: id++,
        x: e.clientX,
        y: e.clientY,
        color: colors[id % colors.length],
      };
      setDots((prev) => [...prev.slice(-18), dot]);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
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
            width: 12 - i * 0.4,
            height: 12 - i * 0.4,
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
  const links = [
    "Hero",
    "About",
    "Skills",
    "Projects",
    "Experience",
    "Contact",
  ];
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
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
        padding: "1rem 3rem",
        background: scrolled ? "rgba(5,5,15,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
        transition: "all 0.4s ease",
      }}
    >
      <span
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "1.6rem",
          fontWeight: 800,
          background: "linear-gradient(90deg,#ff3cac,#784ba0,#2b86c5)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-1px",
        }}
      >
        {" "}
        Jatin Dev.{" "}
      </span>
      <div style={{ display: "flex", gap: "2rem" }}>
        {links.map((l) => (
          <button
            key={l}
            onClick={() => {
              setActive(l);
              document
                .getElementById(l)
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Syne', sans-serif",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: active === l ? "#ff3cac" : "rgba(255,255,255,0.7)",
              transition: "color 0.3s",
              padding: "4px 0",
              borderBottom:
                active === l ? "2px solid #ff3cac" : "2px solid transparent",
            }}
          >
            {l}
          </button>
        ))}
      </div>
    </nav>
  );
}


function Hero() {
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
      setPi((pi + 1) % phrases.length);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, pi]);

  return (
    <section
      id="Hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        flexDirection: "column",
        textAlign: "center",
        padding: "0 2rem",
      }}
    >
      {[
        { top: "10%", left: "5%", color: "#ff3cac44", size: 400 },
        { top: "55%", right: "5%", color: "#2b86c544", size: 350 },
        { bottom: "10%", left: "30%", color: "#784ba044", size: 300 },
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
          }}
        />
      ))}

      <div style={{ position: "relative", zIndex: 2 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(255,60,172,0.1)",
            border: "1px solid rgba(255,60,172,0.3)",
            borderRadius: 100,
            padding: "6px 18px",
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
            }}
          />
          <span
            style={{
              color: "#ff3cac",
              fontFamily: "'Syne', sans-serif",
              fontSize: "0.85rem",
              fontWeight: 700,
            }}
          >
            Available for Work
          </span>
        </div>

        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(3rem, 8vw, 7rem)",
            fontWeight: 900,
            lineHeight: 1,
            margin: "0 0 1.5rem",
            animation: "fadeUp 0.8s 0.2s ease both",
            letterSpacing: "-3px",
          }}
        >
          <span style={{ color: "#fff" }}>Hi, I'm</span>{" "}
          <span
            style={{
              background: "linear-gradient(135deg,#ff3cac,#784ba0,#2b86c5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Jatin Sharma
          </span>
        </h1>

        <div
          style={{
            height: "3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            animation: "fadeUp 0.8s 0.4s ease both",
          }}
        >
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(1.2rem, 3vw, 2rem)",
              color: "#e0e0e0",
              fontWeight: 300,
            }}
          >
            I build{" "}
          </span>
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(1.2rem, 3vw, 2rem)",
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
            margin: "1.5rem auto 2.5rem",
            color: "rgba(255,255,255,0.55)",
            fontFamily: "'Syne', sans-serif",
            fontSize: "1.05rem",
            lineHeight: 1.7,
            animation: "fadeUp 0.8s 0.5s ease both",
          }}
        >
          Crafting beautiful, high-performance mobile apps for iOS & Android
          using React Native. Turning ideas into pixel-perfect experiences that
          users love.
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            animation: "fadeUp 0.8s 0.6s ease both",
          }}
        >
          <button
            onClick={() =>
              document
                .getElementById("Projects")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            style={{
              padding: "0.9rem 2.2rem",
              borderRadius: "50px",
              background: "linear-gradient(135deg,#ff3cac,#784ba0)",
              color: "#fff",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "1rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 30px rgba(255,60,172,0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
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
            🚀 View My Work
          </button>
          <button
            onClick={() =>
              document
                .getElementById("Contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            style={{
              padding: "0.9rem 2.2rem",
              borderRadius: "50px",
              background: "transparent",
              color: "#fff",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "1rem",
              border: "2px solid rgba(255,255,255,0.3)",
              cursor: "pointer",
              transition: "border-color 0.2s, transform 0.2s",
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
            📬 Hire Me
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "3rem",
            justifyContent: "center",
            marginTop: "4rem",
            animation: "fadeUp 0.8s 0.8s ease both",
          }}
        >
          {[
            ["15+", "Apps Built"],
            ["3+", "Years Exp"],
            ["10+", "Happy Clients"],
          ].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "2rem",
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
                  fontSize: "0.8rem",
                  letterSpacing: "1px",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

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
    </section>
  );
}


function About() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVis(true),
      { threshold: 0.3 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <section
      id="About"
      ref={ref}
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        padding: "6rem 2rem",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "5rem",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            opacity: vis ? 1 : 0,
            transform: vis ? "none" : "translateX(-40px)",
            transition: "all 0.8s ease",
          }}
        >
          <div
            style={{
              width: 300,
              height: 300,
              borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
              background: "linear-gradient(135deg,#ff3cac,#784ba0,#2b86c5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "8rem",
              boxShadow: "0 30px 80px rgba(255,60,172,0.4)",
              animation: "morphBlob 6s ease-in-out infinite",
            }}
          >
            📱
          </div>
          {[
            {
              emoji: "⚡",
              label: "3+ Yrs Exp",
              pos: { top: -20, right: -20 },
              color: "#ffbe0b",
            },
            {
              emoji: "🏆",
              label: "15+ Apps",
              pos: { bottom: 20, right: -40 },
              color: "#00f5d4",
            },
            {
              emoji: "🌍",
              label: "iOS & Android",
              pos: { bottom: -20, left: 20 },
              color: "#ff3cac",
            },
          ].map((b, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                ...b.pos,
                background: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(10px)",
                border: `1px solid ${b.color}44`,
                borderRadius: 12,
                padding: "8px 14px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                animation: `float ${2 + i * 0.5}s ease-in-out infinite alternate`,
              }}
            >
              <span>{b.emoji}</span>
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  color: b.color,
                  fontSize: "0.8rem",
                  fontWeight: 700,
                }}
              >
                {b.label}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            opacity: vis ? 1 : 0,
            transform: vis ? "none" : "translateX(40px)",
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
            }}
          >
            ABOUT ME
          </p>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "3rem",
              fontWeight: 900,
              color: "#fff",
              margin: "0 0 1.5rem",
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
            }}
          >
            Beyond React Native, I have a solid understanding of JavaScript,
            TypeScript, REST APIs, Firebase, and general knowledge of backend
            technologies — allowing me to collaborate effectively with
            full-stack teams.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
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
                  padding: "6px 16px",
                  borderRadius: 100,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "0.85rem",
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
  "HTML / CSS 🎨",
  "Node.js 🟢",
  "Python 🐍",
  "SQL 🗄️",
  "Expo 📦",
  "Figma 🖌️",
  "App Store 🍎",
  "Play Store ▶️",
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
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          {icon} {name}
        </span>
        <span
          style={{ fontFamily: "'Syne', sans-serif", color, fontWeight: 700 }}
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
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVis(true),
      { threshold: 0.1 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <section
      id="Skills"
      ref={ref}
      style={{ padding: "6rem 2rem", maxWidth: 1100, margin: "0 auto" }}
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
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem 4rem",
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
            fontSize: "0.8rem",
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
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {OTHER_SKILLS.map((s, i) => (
            <div
              key={s}
              style={{
                padding: "10px 20px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.8)",
                fontFamily: "'Syne', sans-serif",
                fontSize: "0.9rem",
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
    title: "FoodDelivery App",
    desc: "Full-featured food delivery app with real-time order tracking, payment gateway integration, and smooth 60fps animations.",
    tags: ["React Native", "Firebase", "Redux"],
    emoji: "🍔",
    color: "#ff3cac",
    platform: "iOS & Android",
  },
  {
    title: "Fitness Tracker",
    desc: "Health & workout tracking app with custom charts, step counter, calorie tracking, and push notification reminders.",
    tags: ["React Native", "HealthKit", "Charts"],
    emoji: "💪",
    color: "#00f5d4",
    platform: "iOS & Android",
  },
  {
    title: "E-Commerce App",
    desc: "Complete shopping app with product catalog, cart management, Stripe payments, and real-time order updates.",
    tags: ["React Native", "Stripe", "Node.js"],
    emoji: "🛍️",
    color: "#ffbe0b",
    platform: "iOS & Android",
  },
  {
    title: "Chat Messenger",
    desc: "Real-time messaging app with group chats, media sharing, read receipts, and end-to-end encryption using Firebase.",
    tags: ["React Native", "Firebase", "Socket.io"],
    emoji: "💬",
    color: "#784ba0",
    platform: "iOS & Android",
  },
  {
    title: "Travel Planner",
    desc: "Plan trips with maps integration, itinerary builder, offline support, and currency converter. Works fully offline.",
    tags: ["React Native", "Maps", "SQLite"],
    emoji: "✈️",
    color: "#2b86c5",
    platform: "Android",
  },
  {
    title: "News Aggregator",
    desc: "Personalized news app with category filters, bookmarks, dark mode, and smooth pagination with skeleton loaders.",
    tags: ["React Native", "REST API", "AsyncStorage"],
    emoji: "📰",
    color: "#ff7043",
    platform: "iOS & Android",
  },
];

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function ProjectCard({ p, i }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  const [hov, setHov] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVis(true),
      { threshold: 0.1 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov
          ? `linear-gradient(135deg, rgba(${hexToRgb(p.color)},0.12), rgba(255,255,255,0.03))`
          : "rgba(255,255,255,0.04)",
        border: `1px solid ${hov ? p.color + "55" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 20,
        padding: "1.8rem",
        cursor: "pointer",
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(30px)",
        transition: `all 0.6s ${i * 0.1}s ease`,
        boxShadow: hov ? `0 20px 60px rgba(${hexToRgb(p.color)},0.2)` : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1rem",
        }}
      >
        <div style={{ fontSize: "2.5rem" }}>{p.emoji}</div>
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
          }}
        >
          📱 {p.platform}
        </span>
      </div>
      <h3
        style={{
          fontFamily: "'Syne', sans-serif",
          color: "#fff",
          fontWeight: 800,
          fontSize: "1.2rem",
          marginBottom: "0.5rem",
        }}
      >
        {p.title}
      </h3>
      <p
        style={{
          color: "rgba(255,255,255,0.6)",
          fontFamily: "'Syne', sans-serif",
          fontSize: "0.88rem",
          lineHeight: 1.6,
          marginBottom: "1.2rem",
        }}
      >
        {p.desc}
      </p>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "1.2rem",
        }}
      >
        {p.tags.map((t) => (
          <span
            key={t}
            style={{
              padding: "3px 12px",
              borderRadius: 100,
              background: `rgba(${hexToRgb(p.color)},0.12)`,
              color: p.color,
              fontFamily: "'Syne', sans-serif",
              fontSize: "0.78rem",
              fontWeight: 700,
              border: `1px solid ${p.color}33`,
            }}
          >
            {t}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <a
          href="#"
          style={{
            color: p.color,
            fontFamily: "'Syne', sans-serif",
            fontSize: "0.85rem",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          🔗 Live Demo
        </a>
        <a
          href="#"
          style={{
            color: "rgba(255,255,255,0.4)",
            fontFamily: "'Syne', sans-serif",
            fontSize: "0.85rem",
            textDecoration: "none",
          }}
        >
          📁 GitHub
        </a>
      </div>
    </div>
  );
}

function Projects() {
  return (
    <section
      id="Projects"
      style={{ padding: "6rem 2rem", maxWidth: 1100, margin: "0 auto" }}
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
          gridTemplateColumns: "repeat(3, 1fr)",
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

// ─── Experience ───────────────────────────────────────────────────────────────
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
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVis(true),
      { threshold: 0.1 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <section
      id="Experience"
      ref={ref}
      style={{ padding: "6rem 2rem", maxWidth: 1100, margin: "0 auto" }}
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
          margin: "3rem auto 0",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 20,
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
              paddingLeft: "4rem",
              marginBottom: "3rem",
              position: "relative",
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translateX(-30px)",
              transition: `all 0.6s ${i * 0.2}s ease`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 11,
                top: 10,
                width: 20,
                height: 20,
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
                fontSize: "0.85rem",
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
                fontSize: "1.4rem",
                margin: "0.3rem 0",
              }}
            >
              {e.role}
            </h3>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontFamily: "'Syne', sans-serif",
                fontSize: "0.9rem",
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
              }}
            >
              {e.desc}
            </p>
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              {e.achievements.map((a) => (
                <span
                  key={a}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 100,
                    background: `rgba(${hexToRgb(e.color)},0.1)`,
                    color: e.color,
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    border: `1px solid ${e.color}33`,
                  }}
                >
                  ✓ {a}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVis(true),
      { threshold: 0.2 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const inputStyle = {
    padding: "0.9rem 1.2rem",
    borderRadius: 12,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    fontFamily: "'Syne', sans-serif",
    fontSize: "1rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };
  return (
    <section
      id="Contact"
      ref={ref}
      style={{
        padding: "6rem 2rem",
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
          marginBottom: "3rem",
        }}
      >
        Have a mobile app idea? Want to collaborate or just say hello? I'm
        always open to new opportunities! 🚀
      </p>
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24,
          padding: "2.5rem",
          opacity: vis ? 1 : 0,
          transform: vis ? "none" : "translateY(30px)",
          transition: "all 0.8s ease",
        }}
      >
        {sent ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                color: "#00f5d4",
                fontWeight: 800,
                fontSize: "1.5rem",
              }}
            >
              Message Sent!
            </h3>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontFamily: "'Syne', sans-serif",
                marginTop: "0.5rem",
              }}
            >
              Thanks for reaching out! I'll get back to you within 24 hours. ✨
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
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <input
                type="text"
                placeholder="Your Name 🙂"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Email Address 📧"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
              />
            </div>
            <textarea
              placeholder="Tell me about your project or idea... 💬"
              rows={5}
              value={form.msg}
              onChange={(e) => setForm({ ...form, msg: e.target.value })}
              style={{ ...inputStyle, resize: "vertical" }}
            />
            <button
              onClick={() => {
                if (form.name && form.email && form.msg) setSent(true);
              }}
              style={{
                padding: "1rem",
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
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "translateY(-2px)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "")}
            >
              🚀 Send Message
            </button>
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          justifyContent: "center",
          marginTop: "2.5rem",
        }}
      >
        {[
          { label: "GitHub", emoji: "🐙", color: "#fff" },
          { label: "LinkedIn", emoji: "💼", color: "#2b86c5" },
          { label: "Twitter/X", emoji: "🐦", color: "#00f5d4" },
        ].map((s) => (
          <a
            key={s.label}
            href="#"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              color: s.color,
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              textDecoration: "none",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "translateY(-3px)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "")}
          >
            {s.emoji} {s.label}
          </a>
        ))}
      </div>
    </section>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
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
  return (
    <div style={{ textAlign: "center" }}>
      <p
        style={{
          color: "#ff3cac",
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          letterSpacing: "4px",
          marginBottom: "0.8rem",
        }}
      >
        {label}
      </p>
      <h2
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 900,
          color: "#fff",
          margin: 0,
          letterSpacing: "-1px",
        }}
      >
        {title}
      </h2>
    </div>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "2rem",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        color: "rgba(255,255,255,0.35)",
        fontFamily: "'Syne', sans-serif",
        fontSize: "0.85rem",
      }}
    >
      <span>Designed & Built with 🔥 by </span>
      <span
        style={{
          background: "linear-gradient(90deg,#ff3cac,#2b86c5)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: 700,
        }}
      >
        Jatin.
      </span>
      <span> — React Native Developer</span>
    </footer>
  );
}

// ─── Global CSS ───────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #05050f; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #05050f; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(#ff3cac,#2b86c5); border-radius: 10px; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:none; } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes blobFloat { from { transform:translateY(0) scale(1); } to { transform:translateY(-30px) scale(1.05); } }
  @keyframes float { from { transform:translateY(0); } to { transform:translateY(-10px); } }
  @keyframes morphBlob {
    0%,100% { border-radius:30% 70% 70% 30% / 30% 30% 70% 70%; }
    25% { border-radius:58% 42% 75% 25% / 76% 46% 54% 24%; }
    50% { border-radius:50% 50% 33% 67% / 55% 27% 73% 45%; }
    75% { border-radius:33% 67% 58% 42% / 63% 68% 32% 37%; }
  }
  @keyframes scrollBar { 0%{opacity:1;transform:scaleY(1) translateY(0)} 100%{opacity:0;transform:scaleY(0.5) translateY(10px)} }
`;

// ─── App ─────────────────────────────────────────────────────────────────────
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
      { threshold: 0.4 },
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
      <main>
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
