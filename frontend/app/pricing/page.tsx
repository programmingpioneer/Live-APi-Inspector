"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import styles from "./pricing.module.css";

const FEATURES = [
  "Unlimited inspection endpoints",
  "Unlimited requests per day",
  "30-day request history",
  "Full JSON viewer with collapse/expand",
  "Request replay to any destination",
  "Webhook signature verification",
  "Header, query, and body inspection",
  "Real-time streaming — no refresh",
];

const FAQ = [
  {
    q: "Is it really free?",
    a: "Yes. Everything on this page is available to every developer at no cost — no credit card, no trial expiry, no hidden limits.",
  },
  {
    q: "What's the catch?",
    a: "There isn't one. Live API Inspector is free while we're building out the product. When paid tiers arrive, existing users keep their free access.",
  },
  {
    q: "Do you store my request data?",
    a: "Requests are retained for 30 days so you can review them. You can delete any request at any time from the workspace.",
  },
  {
    q: "Can I use this in production?",
    a: "Absolutely. Use it for staging, production, or internal tooling. There are no usage restrictions during the free period.",
  },
  {
    q: "How do I get support?",
    a: "Open an issue on GitHub or join our community channel. We respond to every question.",
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className="container">
            <Reveal direction="down">
              <span className={styles.pill}>
                <span className="dot dot--live" /> Free forever — no credit card
              </span>
            </Reveal>

            <Reveal direction="up" delay={100}>
              <h1 className={styles.title}>
                Everything is{" "}
                <span className={styles.accent}>free.</span>
              </h1>
            </Reveal>

            <Reveal direction="up" delay={180}>
              <p className={styles.lead}>
                Live API Inspector is completely free while we build. Every
                feature, no limits, no pricing tiers. Just ship.
              </p>
            </Reveal>

            <Reveal direction="up" delay={260}>
              <div className={styles.ctas}>
                <Link href="/inspect/demo-8x91" className={styles.primary}>
                  Create free endpoint
                  <Arrow />
                </Link>
                <Link href="/docs" className={styles.secondary}>
                  Read the docs
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Single free plan card */}
        <section className={styles.planSection}>
          <div className="container">
            <Reveal direction="left">
              <div className={styles.planCard}>
                <div className={styles.planLeft}>
                  <span className={styles.planLabel}>The plan</span>
                  <h2 className={styles.planName}>Free</h2>
                  <p className={styles.planTag}>
                    Every feature. Every developer. No asterisks.
                  </p>

                  <div className={styles.priceRow}>
                    <span className={styles.priceSymbol}>$</span>
                    <span className={styles.priceValue}>0</span>
                    <span className={styles.pricePeriod}>/ forever</span>
                  </div>

                  <Link
                    href="/inspect/demo-8x91"
                    className={styles.planCta}
                  >
                    Start now
                    <Arrow />
                  </Link>

                  <ul className={styles.quickBadges}>
                    <li>
                      <Check /> No signup
                    </li>
                    <li>
                      <Check /> No credit card
                    </li>
                    <li>
                      <Check /> No limits
                    </li>
                  </ul>
                </div>

                <div className={styles.planRight}>
                  <span className={styles.featuresLabel}>
                    What's included
                  </span>
                  <ul className={styles.featureList}>
                    {FEATURES.map((f, i) => (
                      <Reveal
                        key={f}
                        direction="right"
                        delay={i * 50}
                        distance={16}
                        as="li"
                      >
                        <span className={styles.featureItem}>
                          <Check />
                          <span>{f}</span>
                        </span>
                      </Reveal>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Promise strip */}
        <section className={styles.promiseSection}>
          <div className="container">
            <div className={styles.promiseGrid}>
              <Reveal direction="up" delay={0}>
                <PromiseCard
                  icon={<ShieldIcon />}
                  title="No data selling"
                  desc="Your requests belong to you. We never share or sell payload data."
                />
              </Reveal>
              <Reveal direction="up" delay={100}>
                <PromiseCard
                  icon={<ClockIcon />}
                  title="No expiry"
                  desc="Free access does not expire. No trial countdown, no surprise paywall."
                />
              </Reveal>
              <Reveal direction="up" delay={200}>
                <PromiseCard
                  icon={<CodeIcon />}
                  title="Open development"
                  desc="Built in the open. Feature requests and bug reports go straight to the roadmap."
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className={styles.faqSection}>
          <div className="container">
            <Reveal direction="up">
              <h2 className={styles.faqTitle}>Questions</h2>
            </Reveal>
            <div className={styles.faqList}>
              {FAQ.map((item, i) => (
                <Reveal key={item.q} direction="up" delay={i * 70}>
                  <details className={styles.faq}>
                    <summary className={styles.faqQ}>{item.q}</summary>
                    <p className={styles.faqA}>{item.a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className={styles.ctaSection}>
          <div className="container">
            <Reveal direction="up">
              <div className={styles.cta}>
                <span className={styles.ctaGlow} aria-hidden />
                <h2>Ready to inspect your first request?</h2>
                <p>Generate an endpoint in seconds. No signup required.</p>
                <Link href="/inspect/demo-8x91" className={styles.ctaBtn}>
                  Create free endpoint
                  <Arrow />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function PromiseCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className={styles.promiseCard}>
      <div className={styles.promiseIcon}>{icon}</div>
      <h3 className={styles.promiseTitle}>{title}</h3>
      <p className={styles.promiseDesc}>{desc}</p>
    </div>
  );
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8.5 6.5 12 13 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3 4 6v6c0 4.5 3.2 8.4 8 9.5 4.8-1.1 8-5 8-9.5V6l-8-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function CodeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m9 7-5 5 5 5M15 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
