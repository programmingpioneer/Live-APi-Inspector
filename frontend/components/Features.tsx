"use client";

import { Reveal } from "./Reveal";
import styles from "./Features.module.css";

const FEATURES = [
  {
    title: "Real-Time Requests",
    desc: "See incoming requests the instant they arrive — no refresh, no polling.",
    icon: <PulseIcon />,
    accent: "violet",
  },
  {
    title: "Request Inspector",
    desc: "Inspect headers, queries, body, and metadata in one structured view.",
    icon: <LensIcon />,
  },
  {
    title: "JSON Viewer",
    desc: "Read structured payloads with syntax highlighting and collapsible nodes.",
    icon: <BracesIcon />,
    visual: "json",
  },
  {
    title: "Request Replay",
    desc: "Send any captured request to another destination in one click.",
    icon: <ReplayIcon />,
  },
  {
    title: "Live Connection",
    desc: "Know exactly when your inspector is connected — and when it isn't.",
    icon: <LinkIcon />,
  },
  {
    title: "Request History",
    desc: "Browse everything you've captured without losing context.",
    icon: <HistoryIcon />,
    visual: "list",
  },
];

export function Features() {
  return (
    <section id="features" className={styles.section}>
      <div className="container">
        <Reveal as="section" direction="up" className={styles.head}>
          <span className="eyebrow">Features</span>
          <h2 className="h-section">Everything you need to inspect webhooks.</h2>
          <p className={styles.lead}>
            Six focused tools, engineered for the moment a request hits your
            endpoint.
          </p>
        </Reveal>

        <div className={styles.grid}>
          {FEATURES.map((f, i) => (
            <Reveal
              key={f.title}
              as="article"
              direction={i % 2 === 0 ? "left" : "right"}
              delay={i * 70}
              className={`${styles.card} ${styles[`accent-${f.accent ?? "plain"}`]}`}
            >
              <div className={styles.cardIcon}>{f.icon}</div>
              <h3 className="h-card">{f.title}</h3>
              <p className={styles.cardDesc}>{f.desc}</p>
              {f.visual === "json" && <JsonMini />}
              {f.visual === "list" && <ListMini />}
              <span className={styles.cardEdge} aria-hidden />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function JsonMini() {
  return (
    <pre className={styles.mini}>
      <span className={styles.mk}>{`{`}</span>
      {"\n  "}
      <span className={styles.mk}>"event"</span>
      <span className={styles.mp}>: </span>
      <span className={styles.ms}>"payment.completed"</span>
      {"\n"}
      <span className={styles.mk}>{`}`}</span>
    </pre>
  );
}

function ListMini() {
  return (
    <div className={styles.miniList}>
      {[200, 201, 200].map((s, i) => (
        <div key={i} className={styles.miniRow}>
          <span className={styles.miniDot} />
          <span className={styles.miniBar} style={{ width: `${60 + i * 12}%` }} />
          <span className={styles.miniCode}>{s}</span>
        </div>
      ))}
    </div>
  );
}

/* --- Icons --- */
function PulseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 12h4l2-6 4 12 2-6h6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function LensIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function BracesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 4c-2 0-3 1-3 3v2c0 1.5-1 2.5-2 3 1 .5 2 1.5 2 3v2c0 2 1 3 3 3M15 4c2 0 3 1 3 3v2c0 1.5 1 2.5 2 3-1 .5-2 1.5-2 3v2c0 2-1 3-3 3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ReplayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12a8 8 0 1 0 3-6.3M4 4v4h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 15 15 9M8 12l-2 2a3.5 3.5 0 0 0 5 5l2-2M16 12l2-2a3.5 3.5 0 0 0-5-5l-2 2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
function HistoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16M4 12h10M4 18h14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
