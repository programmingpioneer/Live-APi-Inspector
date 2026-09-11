"use client";

import { PageShell } from "@/components/PageShell";
import styles from "../pages.module.css";

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Privacy"
      title="Privacy Policy"
      lead="What we collect, why, and how it's stored."
    >
      <section className={styles.prose}>
        <h2>Summary</h2>
        <p>
          Live API Inspector is designed to be privacy-first. We do not sell
          your data, we do not run analytics or tracking pixels, and captured
          requests stay on the server you control.
        </p>

        <h2>Data we collect</h2>
        <ul>
          <li>
            <strong>Endpoint slugs and metadata</strong> — the short identifier
            for each endpoint you create, its creation timestamp, and a
            request counter.
          </li>
          <li>
            <strong>Captured HTTP requests</strong> — headers, query params,
            body, IP, and timestamps of any traffic sent to your endpoints.
          </li>
          <li>
            <strong>Local browser storage</strong> — theme preference,
            workspace list, and onboarding-seen flag. Never sent to a server.
          </li>
        </ul>

        <h2>How it's stored</h2>
        <p>
          Captured requests and endpoints persist as JSON files on the backend
          server under <code>.devtoll-data/</code>. If you deploy Live API
          Inspector on your own infrastructure, this data never leaves your
          machine.
        </p>

        <h2>Third parties</h2>
        <p>
          None. This application does not call home. No analytics SDKs, no
          error reporters, no ads.
        </p>

        <h2>Your rights</h2>
        <p>
          You can delete any endpoint at any time, which removes its captures
          from disk. To purge everything, delete the <code>.devtoll-data/</code>{" "}
          directory on your server.
        </p>

        <h2>Contact</h2>
        <p>
          Questions? Use the{" "}
          <a href="/contact" style={{ color: "var(--accent)" }}>
            contact page
          </a>
          .
        </p>
      </section>

      <div className={styles.lastUpdated}>
        Last updated: September 11, 2026
      </div>
    </PageShell>
  );
}
