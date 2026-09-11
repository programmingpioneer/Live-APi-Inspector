"use client";

import { PageShell } from "@/components/PageShell";
import styles from "../pages.module.css";

const FEATURES = [
  {
    title: "Real-time request stream",
    desc: "See incoming requests the instant they arrive via WebSocket. No refresh, no polling, no delay.",
  },
  {
    title: "Full request inspector",
    desc: "Headers, query parameters, body, raw text, IP, HTTP version, content type — all in one view.",
  },
  {
    title: "JSON viewer with syntax highlighting",
    desc: "Collapsible nodes, syntax highlighting, copy-paste ready. Handles nested payloads cleanly.",
  },
  {
    title: "One-click replay",
    desc: "Send any captured request to a custom destination URL. Debug retries and webhook failures instantly.",
  },
  {
    title: "Persistent endpoints",
    desc: "Endpoints and captured requests survive backend restarts. No accidental data loss.",
  },
  {
    title: "Command palette (⌘K)",
    desc: "Keyboard-first navigation. Create endpoints, open the inspector, jump to any view — all from ⌘K.",
  },
  {
    title: "Workspaces",
    desc: "Organize endpoints by project. Switch between workspaces from the navbar dropdown.",
  },
  {
    title: "Export to JSON",
    desc: "Download any request or full session as JSON. Share payloads with teammates in one click.",
  },
  {
    title: "Dark & light themes",
    desc: "Automatic and toggleable. Every component tested in both themes.",
  },
  {
    title: "Mobile responsive",
    desc: "Three-column desktop layout collapses gracefully to a stacked mobile view.",
  },
  {
    title: "Reduced-motion support",
    desc: "All animations respect `prefers-reduced-motion`. Accessibility-first motion design.",
  },
  {
    title: "Developer-first CLI",
    desc: "Every endpoint has a copy-paste curl and PowerShell snippet ready to run.",
  },
];

export default function FeaturesPage() {
  return (
    <PageShell
      eyebrow="Features"
      title="Everything you need to inspect webhooks."
      lead="Twelve focused capabilities, engineered for the moment a request hits your endpoint."
    >
      <section className={styles.grid}>
        {FEATURES.map((f, i) => (
          <article
            key={f.title}
            className={styles.card}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <h3 className={styles.cardTitle}>{f.title}</h3>
            <p className={styles.cardDesc}>{f.desc}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
