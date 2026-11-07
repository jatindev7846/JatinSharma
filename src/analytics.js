// Google Analytics 4, loaded only when VITE_GA_ID is set at build time
// (e.g. VITE_GA_ID=G-XXXXXXXXXX). Without it, nothing is loaded or sent.
// Visitors who have "Do Not Track" turned on are not tracked.
//
// Automatic: visitors, page views, location, device, traffic source (GA4 itself).
// Custom events sent from here:
//   section_view      first time each section is seen         { section }
//   app_store_click   App Store link                          { link_url, project }
//   play_store_click  Google Play link                        { link_url, project }
//   outbound_click    any other external link (e.g. website)  { link_url, project }
//   linkedin_click / github_click / email_click
//   cta_hire_me / cta_view_work / cta_start_project           (buttons with data-track)
//   copy_email, generate_lead                                 (contact section)

const GA_ID = import.meta.env.VITE_GA_ID;
let enabled = false;

export function track(name, params = {}) {
  if (enabled && typeof window.gtag === "function") window.gtag("event", name, params);
}

function classify(href) {
  if (/apps\.apple\.com/.test(href)) return "app_store_click";
  if (/play\.google\.com/.test(href)) return "play_store_click";
  if (/linkedin\.com/.test(href)) return "linkedin_click";
  if (/github\.com/.test(href)) return "github_click";
  if (href.startsWith("mailto:")) return "email_click";
  if (/^https?:/.test(href) && !href.includes(window.location.host)) return "outbound_click";
  return null;
}

function watchClicks() {
  document.addEventListener("click", (e) => {
    const el = e.target.closest?.("a[href],[data-track]");
    if (!el) return;

    const custom = el.dataset.track;
    if (custom) track(custom, { link_text: (el.textContent || "").trim().slice(0, 40) });

    const href = el.getAttribute("href") || "";
    const name = classify(href);
    if (name) {
      const project = el.closest(".project")?.querySelector("h3")?.textContent?.trim();
      track(name, { link_url: href, project });
    }
  });
}

function watchSections() {
  const seen = new Set();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting && !seen.has(en.target.id)) {
          seen.add(en.target.id);
          track("section_view", { section: en.target.id });
        }
      });
    },
    { threshold: 0.4 },
  );
  document.querySelectorAll("main section[id]").forEach((s) => io.observe(s));
}

export function initAnalytics() {
  if (!GA_ID || typeof window === "undefined") return;
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(s);

  enabled = true;
  watchClicks();
  // sections are rendered by React a moment after boot
  setTimeout(watchSections, 1500);
}
