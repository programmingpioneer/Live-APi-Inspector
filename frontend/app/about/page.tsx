"use client";

import { PageShell } from "@/components/PageShell";
import styles from "../pages.module.css";

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title="Built for developers, by developers."
      lead="Live API Inspector is an open debugging tool for webhooks, callbacks, and any HTTP traffic that needs to be seen in real time."
    >
      <section className={styles.prose}>
        <h2>Why we built this</h2>
        <p>
          Webhooks are the plumbing of modern software. Payment providers, CI
          systems, chat platforms, and hundreds of other services use them to
          notify your application that something happened. But debugging them
          has always been painful — you fire a request, guess whether it
          arrived, and dig through logs to find out what the payload even
          looked like.
        </p>
        <p>
          Live API Inspector turns that guesswork into a live, inspectable
          workspace. Create an endpoint, point your webhook at it, and watch
          every request stream in instantly. See the headers, body, query
          params, and metadata — then replay it to test a fix.
        </p>

        <h2>The principles</h2>
        <ul>
          <li>
            <strong>No signup required.</strong> Create an endpoint in seconds
            and start receiving requests.
          </li>
          <li>
            <strong>Real-time by default.</strong> WebSocket streaming, not
            polling.
          </li>
          <li>
            <strong>Developer-first.</strong> Curl, PowerShell, and Postman
            snippets on every endpoint.
          </li>
          <li>
            <strong>Privacy-conscious.</strong> Captures persist to your own
            server's disk — never sent to a third party.
          </li>
        </ul>

        <h2>Technology</h2>
        <p>
          Built with a NestJS backend (TypeScript, WebSocket gateway, modular
          services) and a Next.js frontend (App Router, React 18, TypeScript,
          CSS modules). No external analytics, no tracking pixels, no
          third-party SDKs phoning home.
        </p>

        <h2>Status</h2>
        <p>
          Currently in active development. All endpoints are free while we
          build out the product. Feedback and bug reports are welcome via the{" "}
          <a href="/contact" style={{ color: "var(--accent)" }}>
            contact page
          </a>
          .
        </p>
      </section>
    </PageShell>
  );
}
