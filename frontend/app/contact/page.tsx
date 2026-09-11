"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import styles from "../pages.module.css";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No backend endpoint yet — just confirm locally.
    setSent(true);
  };

  return (
    <PageShell
      eyebrow="Contact"
      title="Get in touch."
      lead="Bug reports, feature requests, or just saying hi — all welcome."
    >
      {sent ? (
        <div
          className={styles.card}
          style={{ maxWidth: 560, margin: "40px auto 0", textAlign: "center" }}
        >
          <div className={styles.cardIcon} style={{ margin: "0 auto 16px" }} aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className={styles.cardTitle}>Thanks — message received.</h3>
          <p className={styles.cardDesc}>
            We&apos;ll get back to you as soon as we can. In the meantime, feel
            free to open an issue on GitHub.
          </p>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="c-name">Name</label>
            <input
              id="c-name"
              className={styles.input}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="c-email">Email</label>
            <input
              id="c-email"
              type="email"
              className={styles.input}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="c-msg">Message</label>
            <textarea
              id="c-msg"
              className={styles.textarea}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="How can we help?"
              required
            />
          </div>
          <button type="submit" className={styles.button}>
            Send message
          </button>
        </form>
      )}
    </PageShell>
  );
}
