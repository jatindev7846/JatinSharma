import { useState } from "react";
import Split from "./Split";
import { track } from "../analytics";
import { CONTACT_ENDPOINT, EMAIL, LINKEDIN_URL, GITHUB_URL } from "../data";

// Delivery (unchanged from the previous site):
//   VITE_CONTACT_ENDPOINT = Google Apps Script URL (saves to a Google Sheet, see
//   contact-sheet/README.md) or a Formspree URL. Without it, the form opens the
//   visitor's email app addressed to EMAIL.

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [state, setState] = useState("idle"); // idle | sending | sent | mail
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      track("copy_email");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.msg.trim()) {
      setError("Please fill in your name, email and message.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (CONTACT_ENDPOINT) {
      setState("sending");
      try {
        const payload = { name: form.name, email: form.email, message: form.msg };
        if (CONTACT_ENDPOINT.includes("script.google.com")) {
          // Apps Script blocks cross-origin reads, so send a simple request.
          await fetch(CONTACT_ENDPOINT, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload),
          });
        } else {
          const res = await fetch(CONTACT_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error("bad response");
        }
        track("generate_lead", { method: "form" });
        setState("sent");
        setForm({ name: "", email: "", msg: "" });
      } catch {
        setState("idle");
        setError("Couldn't send your message. Please try again, or message me on LinkedIn.");
      }
      return;
    }

    const subject = encodeURIComponent(`Project enquiry from ${form.name}`);
    const body = encodeURIComponent(`${form.msg}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    track("generate_lead", { method: "mailto" });
    setState("mail");
  };

  return (
    <section className="section contact" id="contact">
      <div className="wrap contact__grid">
        <div className="contact__copy">
          <p className="eyebrow" data-reveal>
            <span>07</span> Contact
          </p>
          <h2 className="display display--xl" data-split>
            <Split step={65}>
              Got an app idea? <em>Let's build it.</em>
            </Split>
          </h2>
          <p className="contact__lead" data-reveal style={{ "--d": 2 }}>
            Whether it's a new product, an app that needs a rescue, or a role on your team, tell me
            a little about it. I usually reply within 24 hours.
          </p>

          <div className="contact__links" data-reveal style={{ "--d": 3 }}>
            <button type="button" className="mail" onClick={copyEmail} data-magnetic>
              <span>{EMAIL}</span>
              <em>{copied ? "Copied ✓" : "Copy"}</em>
            </button>
            <div className="socials">
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={`mailto:${EMAIL}`}>Email</a>
            </div>
          </div>
        </div>

        <div className="card formcard" data-spot data-reveal style={{ "--d": 2 }}>
          {state === "sent" || state === "mail" ? (
            <div className="done" role="status">
              <div className="done__tick">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </div>
              <h3>{state === "mail" ? "Almost there" : "Message sent"}</h3>
              <p>
                {state === "mail"
                  ? "Your email app should have opened with your message ready. Just hit send."
                  : "Thanks for reaching out! I'll get back to you within 24 hours."}
              </p>
              <button className="btn btn--ghost btn--sm" onClick={() => setState("idle")}>
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="row">
                <label>
                  <span>Name</span>
                  <input type="text" name="name" autoComplete="name" placeholder="Your name" value={form.name} onChange={set("name")} />
                </label>
                <label>
                  <span>Email</span>
                  <input type="email" name="email" autoComplete="email" placeholder="you@company.com" value={form.email} onChange={set("email")} />
                </label>
              </div>
              <label>
                <span>Project</span>
                <textarea name="message" rows={5} placeholder="Tell me about your project or idea…" value={form.msg} onChange={set("msg")} />
              </label>

              {error && (
                <p className="form__error" role="alert">
                  {error}
                </p>
              )}

              <button className="btn btn--accent btn--block" type="submit" disabled={state === "sending"} data-magnetic>
                {state === "sending" ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
