// All portfolio content lives here, so updating the site never means touching layout code.

export const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || "";
export const EMAIL = import.meta.env.VITE_CONTACT_EMAIL || "jatin0063@gmail.com";
export const LINKEDIN_URL = "https://www.linkedin.com/in/jatin-sharma-80645924b/";
export const GITHUB_URL = "https://github.com/jatindev7846";

export const NAV = [
  ["About", "about"],
  ["Services", "services"],
  ["Work", "work"],
  ["Process", "process"],
  ["Skills", "skills"],
  ["Experience", "experience"],
  ["Contact", "contact"],
];

export const STATS = [
  { value: 5, suffix: "+", label: "Apps built" },
  { value: 3, suffix: "", label: "Live on the stores" },
  { value: 2, suffix: "+", label: "Years of experience" },
];

export const TICKER = [
  "React Native",
  "iOS",
  "Android",
  "TypeScript",
  "App Store",
  "Google Play",
  "REST APIs",
  "Firebase",
  "Redux",
  "Reanimated",
];

export const SERVICES = [
  {
    n: "01",
    title: "Cross-platform mobile apps",
    text: "iOS and Android apps in React Native, from UI to API integration. One codebase, native feel, smooth 60fps interactions.",
    points: ["React Native / Expo", "REST APIs & GraphQL", "Auth, chat, payments & push"],
  },
  {
    n: "02",
    title: "Store launch, end to end",
    text: "I take the app all the way through App Store and Google Play publishing, and write the listing and onboarding copy that turns installs into users.",
    points: ["App Store & Play Store publishing", "Store listing copy", "Onboarding copy"],
  },
  {
    n: "03",
    title: "Responsive websites",
    text: "Fast, clean business websites that look sharp on every screen, with the details small businesses actually need, like WhatsApp ordering.",
    points: ["React & modern CSS", "SEO-ready markup", "Contact & ordering flows"],
  },
  {
    n: "04",
    title: "Build, maintain, improve",
    text: "I'm happy to join a product that already exists: ship new features, fix what's slow, and keep the app healthy release after release.",
    points: ["Feature delivery", "Performance tuning", "Bug fixing & upkeep"],
  },
];

// `shot`: put a screenshot in /public/screens and set e.g. "/screens/datepalop.png"
// and the device mockup will show your real app instead of the stylised screen.
export const PROJECTS = [
  {
    id: "datepalop",
    title: "DatePALOP",
    kind: "Social networking · iOS & Android",
    desc: "A social networking app for people from Portuguese-speaking African countries and their diasporas, with a professional networking mode and a dating mode. Includes profiles, groups, events, chat, swipe-based matching, profile verification and premium membership.",
    tags: ["React Native", "Chat", "Swipe matching", "Premium plans"],
    color: "#ff5d8f",
    variant: "swipe",
    device: "phone",
    shot: null,
    links: [{ label: "View on App Store", href: "https://apps.apple.com/app/id6748463185" }],
  },
  {
    id: "gentle-hold",
    title: "Gentle Hold",
    kind: "Health & wellness · Android",
    desc: "A mobile app that gives people a gentle, non-judgmental space while they go through grief, loss and emotional healing.",
    tags: ["React Native", "Wellness", "Calm UX"],
    color: "#6fe0c4",
    variant: "calm",
    device: "phone",
    shot: null,
    links: [
      {
        label: "View on Google Play",
        href: "https://play.google.com/store/apps/details?id=com.gentlehold",
      },
    ],
  },
  {
    id: "salonist",
    title: "Salonist",
    kind: "Salon & spa booking · iOS & Android",
    desc: "A full-featured salon and spa booking platform to discover nearby salons, book services instantly and manage appointments. Focused on smooth UX, real-time availability and performance, so bookings feel effortless.",
    tags: ["React Native", "Booking system", "Real-time availability"],
    color: "#b69cff",
    variant: "booking",
    device: "phone",
    shot: null,
    links: [
      {
        label: "View on App Store",
        href: "https://apps.apple.com/in/app/salonist-salon-spa-booking/id6511235328",
      },
    ],
  },
  {
    id: "gayatri",
    title: "Gayatri Business Group",
    kind: "Business website · Responsive",
    desc: "A responsive business website for a fire safety solutions company, showcasing fire extinguishers, hydrant systems, hoses, valves and accessories, with direct ordering over WhatsApp.",
    tags: ["Website", "Responsive", "WhatsApp ordering"],
    color: "#ff7a45",
    variant: "site",
    device: "browser",
    shot: null,
    url: "gayatribusinessgroup.com",
    cta: "Order on WhatsApp",
    links: [{ label: "Visit website", href: "https://www.gayatribusinessgroup.com/" }],
  },
  {
    id: "salonist-web",
    title: "Salonist.io",
    kind: "SaaS website · Responsive",
    desc: "The website for Salonist, cloud software that helps salons and spas run online booking, POS, inventory, staff payroll and client marketing from one dashboard. A clean, responsive site that explains the product, pricing and integrations at a glance.",
    tags: ["Website", "SaaS", "Responsive"],
    color: "#4fe0c0",
    variant: "site",
    device: "browser",
    shot: null,
    url: "salonist.io",
    cta: "Start free trial",
    links: [{ label: "Visit website", href: "https://salonist.io/" }],
  },
];

export const IN_PROGRESS = {
  title: "Social media platform",
  desc: "Currently building a scalable social platform with real-time chat, posts, likes, comments and push notifications. Focused on performance, clean architecture and a smooth user experience.",
  tags: ["React Native", "Firebase", "Realtime"],
};

export const PROCESS = [
  {
    n: "01",
    title: "Understand the idea",
    text: "We talk through the product, the users and the goals, then agree on scope, timeline and the smallest version that's worth shipping.",
    tags: ["Scope", "Timeline", "MVP"],
  },
  {
    n: "02",
    title: "Shape the flow",
    text: "Screens and user flow come first, so the app feels obvious before production code is written. Fewer surprises, faster builds.",
    tags: ["User flow", "UI", "Figma"],
  },
  {
    n: "03",
    title: "Build & integrate",
    text: "A clean React Native build with API integration and regular builds you can test on your own phone, so you always see real progress.",
    tags: ["React Native", "APIs", "Regular builds"],
  },
  {
    n: "04",
    title: "Launch & improve",
    text: "Store submission, listing and onboarding copy, then iteration based on how people actually use the app.",
    tags: ["App Store", "Google Play", "Iteration"],
  },
];

export const SKILL_GROUPS = [
  {
    title: "Mobile",
    items: [
      "React Native",
      "Expo",
      "Reanimated",
      "In-app purchases",
      "App Store publishing",
      "Play Store publishing",
    ],
  },
  {
    title: "Languages",
    items: ["JavaScript (ES6+)", "TypeScript", "HTML / CSS", "Python", "SQL"],
  },
  {
    title: "State & data",
    items: ["Redux / Zustand", "React Query", "REST APIs / GraphQL", "Firebase / Supabase", "Node.js"],
  },
  {
    title: "Tooling",
    items: ["React.js", "Git & GitHub", "Figma"],
  },
];

export const EXPERIENCE = [
  {
    period: "Sep 2026 — Present",
    role: "Mobile Application Developer",
    company: "Apptechies",
    desc: "Building and maintaining cross-platform mobile applications for iOS and Android.",
    tags: ["iOS & Android", "Current role"],
  },
  {
    period: "Sep 2025 — Sep 2026",
    role: "React Native Developer",
    company: "Vision Vivante Pvt. Ltd.",
    desc: "Built high-quality cross-platform mobile applications, contributing to product development and delivering performant experiences for both iOS and Android users.",
    tags: ["React Native", "Full-time"],
  },
  {
    period: "Jan 2025 — Jul 2025",
    role: "Junior React Native Developer",
    company: "Techner Solutions",
    desc: "Developed and maintained cross-platform apps in React Native. Worked with design and backend teams to ship smooth, production-ready features and improve overall app performance.",
    tags: ["React Native", "Production apps"],
  },
  {
    period: "Aug 2024 — Nov 2024",
    role: "React Native Intern",
    company: "Deftsoft Informatics Pvt. Ltd.",
    desc: "Started my professional journey with a hands-on internship: building app features, debugging and working inside an agile team.",
    tags: ["Internship", "Agile team"],
  },
];
