"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import styles from "./docs.module.css";

const SECTIONS = [
  { id: "introduction", label: "Introduction" },
  { id: "quickstart", label: "Quickstart" },
  { id: "endpoints", label: "Endpoints" },
  { id: "inspect", label: "Inspecting requests" },
  { id: "replay", label: "Replay" },
  { id: "webhooks", label: "Webhook signatures" },
  { id: "errors", label: "Error handling" },
];

export default function DocsPage() {
  const [active, setActive] = useState("introduction");

  // Track active section as user scrolls
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.hero}>
          <div className="container">
            <Reveal direction="down">
              <span className="eyebrow">Documentation</span>
            </Reveal>
            <Reveal direction="up" delay={100}>
              <h1 className={styles.title}>
                Everything you need to <span className={styles.accent}>inspect</span> with confidence.
              </h1>
            </Reveal>
            <Reveal direction="up" delay={180}>
              <p className={styles.lead}>
                Generate endpoints, send requests, inspect payloads, and replay
                failures — all in one workspace.
              </p>
            </Reveal>
          </div>
        </div>

        <div className={`container ${styles.layout}`}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarInner}>
              <span className={styles.sidebarLabel}>On this page</span>
              <nav className={styles.navList}>
                {SECTIONS.map((s, i) => (
                  <Reveal key={s.id} direction="left" delay={i * 40} distance={20}>
                    <a
                      href={`#${s.id}`}
                      className={`${styles.navItem} ${
                        active === s.id ? styles.navItemActive : ""
                      }`}
                    >
                      {s.label}
                    </a>
                  </Reveal>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <article className={styles.content}>
            <Section id="introduction" title="Introduction">
              <p>
                Live API Inspector generates a unique webhook endpoint for you.
                Any HTTP request sent to that URL is captured, parsed, and
                streamed to your browser in real-time — no refresh, no polling.
              </p>
              <p>
                It's designed for the moment when a third-party webhook fires
                and you need to see exactly what arrived: headers, query,
                body, and metadata.
              </p>

              <Reveal direction="up">
                <Callout>
                  <strong>No account required.</strong> Generate an endpoint and
                  start sending requests in seconds.
                </Callout>
              </Reveal>
            </Section>

            <Section id="quickstart" title="Quickstart">
              <p>Three steps to your first inspected request.</p>

              <Step n="1" title="Generate an endpoint">
                <p>
                  Create a unique URL. Every request sent to it is captured
                  automatically.
                </p>
                <CodeBlock
                  code={`POST https://inspect.dev/api/v1/inspect/generate
Content-Type: application/json

{ "name": "my-webhook" }`}
                  lang="http"
                />
              </Step>

              <Step n="2" title="Send a request">
                <p>
                  Point any webhook provider, curl command, or your own code at
                  the endpoint.
                </p>
                <CodeBlock
                  code={`curl -X POST https://inspect.dev/api/v1/inspect/demo-8x91 \\
  -H "Content-Type: application/json" \\
  -d '{"event":"payment.completed","amount":4999}'`}
                  lang="bash"
                />
              </Step>

              <Step n="3" title="Watch it arrive">
                <p>
                  The request appears in your workspace instantly. Click it to
                  inspect headers, body, query, and metadata.
                </p>
              </Step>
            </Section>

            <Section id="endpoints" title="Endpoints">
              <p>
                Each inspector has a unique slug. The endpoint URL always
                follows this pattern:
              </p>
              <CodeBlock
                code={`https://inspect.dev/api/v1/inspect/{slug}`}
                lang="http"
              />
              <h3 className={styles.sub}>Regenerating</h3>
              <p>
                You can regenerate the slug at any time. Old URLs stop accepting
                requests immediately — you'll need to update any senders.
              </p>
            </Section>

            <Section id="inspect" title="Inspecting requests">
              <p>
                Every captured request exposes the same structure, regardless of
                method:
              </p>
              <CodeBlock
                code={`{
  "id": "req_8x92a",
  "method": "POST",
  "path": "/api/webhooks/github",
  "status": 200,
  "timestamp": "2026-03-04T11:22:10Z",
  "headers": { "content-type": "application/json" },
  "query": {},
  "body": { "event": "payment.completed" },
  "ip": "140.82.115.42"
}`}
                lang="json"
              />
              <p>
                The JSON viewer supports collapse/expand, syntax highlighting,
                and formatted/raw toggle.
              </p>
            </Section>

            <Section id="replay" title="Replay">
              <p>
                Send any captured request to another destination. Useful for
                re-triggering a failing webhook against a fixed handler.
              </p>
              <CodeBlock
                code={`POST /api/v1/replay
{
  "requestId": "req_8x92a",
  "target": "https://your-app.com/webhooks/receive",
  "method": "POST"
}`}
                lang="http"
              />
              <Callout>
                <strong>Safety note.</strong> Replay forwards the original
                headers and body. Remove any auth headers if the target doesn't
                expect them.
              </Callout>
            </Section>

            <Section id="webhooks" title="Webhook signatures">
              <p>
                If you configured a signing secret, every request includes an{" "}
                <code className={styles.inlineCode}>x-signature</code> header:
              </p>
              <CodeBlock
                code={`x-signature: sha256=8f3a7c2e1b09d4e5...`}
                lang="http"
              />
              <p>
                Verify by computing HMAC-SHA256 over the raw body using your
                secret, and comparing against the signature value.
              </p>
            </Section>

            <Section id="errors" title="Error handling">
              <p>Common error codes and their meaning:</p>
              <div className={styles.errorTable}>
                {[
                  ["404", "Endpoint not found", "Slug doesn't exist or was regenerated"],
                  ["413", "Payload too large", "Body exceeds 2 MB"],
                  ["429", "Rate limited", "Too many requests in a short window"],
                  ["500", "Internal error", "Contact support with the request ID"],
                ].map(([code, name, desc], i) => (
                  <Reveal key={code} direction="right" delay={i * 60}>
                    <div className={styles.errorRow}>
                      <span className={styles.errorCode}>{code}</span>
                      <span className={styles.errorName}>{name}</span>
                      <span className={styles.errorDesc}>{desc}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Section>

            <Reveal direction="up">
              <div className={styles.ctaBox}>
                <div>
                  <h3>Ready to try it?</h3>
                  <p>Generate your first endpoint — no signup required.</p>
                </div>
                <Link href="/inspect/demo-8x91" className={styles.ctaBtn}>
                  Create free endpoint
                </Link>
              </div>
            </Reveal>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

/* ---------- Helpers ---------- */

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={styles.section}>
      <Reveal direction="up">
        <h2 className={styles.h2}>{title}</h2>
      </Reveal>
      <Reveal direction="up" delay={80}>
        <div className={styles.sectionBody}>{children}</div>
      </Reveal>
    </section>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal direction="up">
      <div className={styles.step}>
        <span className={styles.stepNum}>{n}</span>
        <div className={styles.stepBody}>
          <h4 className={styles.stepTitle}>{title}</h4>
          {children}
        </div>
      </div>
    </Reveal>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return <div className={styles.callout}>{children}</div>;
}

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1300);
    } catch {}
  }

  return (
    <div className={styles.code}>
      <div className={styles.codeHead}>
        <span>{lang}</span>
        <button className={styles.copyBtn} onClick={copy} type="button">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className={styles.codeBody}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
