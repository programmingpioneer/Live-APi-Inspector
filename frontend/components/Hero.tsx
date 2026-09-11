"use client";

import Link from "next/link";
import { WebGLBackground } from "./WebGLBackground";
import { HeroPreview } from "./HeroPreview";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <WebGLBackground />

      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>
            <span className="dot dot--live" /> Welcome to Live API Inspector
          </span>

          <h1 className={`h-hero ${styles.title}`}>
            Inspect every request.
            <br />
            <span className={styles.accent}>Live.</span>
          </h1>

          <p className={styles.sub}>
            Generate a webhook endpoint, send requests to it, and watch every
            payload appear instantly — no refreshes, no guesswork.
          </p>

          <div className={styles.ctas}>
            <Link href="/inspect/demo-8x91" className={styles.primary}>
              Create free endpoint
              <Arrow />
            </Link>
            <a href="#docs" className={styles.secondary}>
              View documentation
            </a>
          </div>

          <ul className={styles.indicators}>
            <li>
              <span className="dot dot--live" /> Real-time
            </li>
            <li>
              <span
                className="dot"
                style={{ background: "var(--accent-soft)" }}
              />{" "}
              No refresh
            </li>
            <li>
              <span
                className="dot"
                style={{ background: "var(--text-dim)" }}
              />{" "}
              Developer-first
            </li>
          </ul>
        </div>

        <aside className={styles.stats} aria-label="Live overview">
          <div className={`${styles.statCard} ${styles.statCardAccent}`}>
            <div className={styles.statLabel}>
              <span className="dot dot--live" />
              Requests captured
            </div>
            <div className={styles.statValue}>
              128<span className={styles.statSuffix}>live</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>Avg response</div>
            <div className={styles.statValue}>
              24<span className={styles.statSuffix}>ms</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>Payload inspected</div>
            <div className={styles.statValue}>
              2.1<span className={styles.statSuffix}>MB</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>Replay success</div>
            <div className={styles.statValue}>
              100<span className={styles.statSuffix}>%</span>
            </div>
          </div>
        </aside>
      </div>

      <div className={`container ${styles.previewWrap}`}>
        <HeroPreview />
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8h9M8.5 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
