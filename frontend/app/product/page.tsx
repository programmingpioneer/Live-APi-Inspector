"use client";

import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import styles from "../pages.module.css";

const PILLARS = [
  {
    title: "Stream, don't poll",
    desc: "WebSocket-powered live updates. Every request lands in your browser the instant it reaches the server — no refresh, no delay.",
  },
  {
    title: "Inspect everything",
    desc: "Headers, query params, JSON bodies, raw text, metadata — one structured workspace per request.",
  },
  {
    title: "Replay with one click",
    desc: "Send any captured request to a different destination. Perfect for debugging retries and webhook failures.",
  },
  {
    title: "Persists to disk",
    desc: "Endpoints and captures survive server restarts. No lost data, no surprise wipes.",
  },
];

export default function ProductPage() {
  return (
    <PageShell
      eyebrow="Product"
      title="The workspace for webhook debugging."
      lead="Live API Inspector turns an opaque webhook into a live, inspectable request stream. Built for developers who need to see what actually arrives."
    >
      <section className={styles.grid}>
        {PILLARS.map((p, i) => (
          <article
            key={p.title}
            className={styles.card}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={styles.cardIcon} aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>{p.title}</h3>
            <p className={styles.cardDesc}>{p.desc}</p>
          </article>
        ))}
      </section>

      <section style={{ marginTop: 64, textAlign: "center" }}>
        <Link
          href="/endpoints"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "13px 26px",
            background: "var(--accent)",
            color: "#fff",
            borderRadius: 12,
            fontSize: "0.9rem",
            fontWeight: 600,
            textDecoration: "none",
            boxShadow: "0 12px 28px -10px var(--accent)",
          }}
        >
          Open Inspector
          <span aria-hidden>→</span>
        </Link>
      </section>
    </PageShell>
  );
}
