"use client";

import { PageShell } from "@/components/PageShell";
import styles from "../pages.module.css";

interface Entry {
  version: string;
  date: string;
  title: string;
  bullets: string[];
}

const ENTRIES: Entry[] = [
  {
    version: "v0.6.0",
    date: "2026-09-11",
    title: "Landing pages & product site",
    bullets: [
      "New /product, /features, /about, /changelog, /contact, /privacy, /terms pages",
      "Updated Navbar with direct links to product pages",
      "Fixed all footer dead anchors",
      "3D card hover effects, animated background orbs",
      "Full responsive redesign for content pages",
    ],
  },
  {
    version: "v0.5.0",
    date: "2026-09-10",
    title: "Persistent endpoints",
    bullets: [
      "Endpoints and captured requests now persist to disk (.devtoll-data/)",
      "Backend restart no longer wipes history",
      "requestCount reconciled against live captures",
    ],
  },
  {
    version: "v0.4.0",
    date: "2026-09-08",
    title: "Command palette & workspaces",
    bullets: [
      "Ctrl+K command palette with arrow navigation",
      "Workspace switcher in navbar dropdown",
      "Export requests as JSON",
      "Onboarding tour on first visit",
    ],
  },
  {
    version: "v0.3.0",
    date: "2026-09-05",
    title: "Inspector redesign",
    bullets: [
      "Four-state flow: loading / not found / waiting / tracking",
      "3D animated WaitingView",
      "EmptyStateView with Create CTA",
      "Request details: headers, query, body, raw tabs",
    ],
  },
  {
    version: "v0.2.0",
    date: "2026-09-01",
    title: "Live streaming",
    bullets: [
      "WebSocket gateway for real-time captures",
      "Request list with method/status filters",
      "Search by path / ID / method",
    ],
  },
  {
    version: "v0.1.0",
    date: "2026-08-25",
    title: "Initial release",
    bullets: [
      "Create endpoint with custom prefix",
      "Capture and inspect incoming requests",
      "Replay captured requests",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <PageShell
      eyebrow="Changelog"
      title="What's new."
      lead="Every release, in reverse chronological order."
    >
      <div className={styles.timeline}>
        {ENTRIES.map((e, i) => (
          <article
            key={e.version}
            className={styles.entry}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div>
              <span className={styles.version}>{e.version}</span>
              <span className={styles.entryDate}>{e.date}</span>
            </div>
            <h2 className={styles.entryTitle}>{e.title}</h2>
            <ul className={styles.bullets}>
              {e.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
