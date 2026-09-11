"use client";

import { PageShell } from "@/components/PageShell";
import styles from "../pages.module.css";

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Terms"
      title="Terms of Service"
      lead="The rules for using Live API Inspector."
    >
      <section className={styles.prose}>
        <h2>Acceptance</h2>
        <p>
          By using Live API Inspector, you agree to these terms. If you do not
          agree, please do not use the service.
        </p>

        <h2>Use of the service</h2>
        <ul>
          <li>
            You may use Live API Inspector for any lawful purpose, including
            commercial and production environments.
          </li>
          <li>
            You are responsible for any data you send to your endpoints and
            for complying with your own privacy obligations to your users.
          </li>
          <li>
            Do not use the service to receive illegal content, to attack other
            systems, or to circumvent rate limits or abuse detection.
          </li>
        </ul>

        <h2>No warranty</h2>
        <p>
          Live API Inspector is provided &quot;as is&quot; without warranty of
          any kind. We do not guarantee uptime, data durability, or fitness
          for any particular purpose. Captured requests may be lost due to
          backend restarts, disk failures, or other events outside our
          control.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, Live API Inspector and its
          contributors are not liable for any indirect, incidental, or
          consequential damages arising from use of the service.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these terms from time to time. Continued use of the
          service after changes constitutes acceptance of the new terms.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms? Reach out via the{" "}
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
