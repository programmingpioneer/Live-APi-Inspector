"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./endpoints.module.css";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface EndpointItem {
  slug: string;
  createdAt: string;
  requestCount: number;
}

type State = "loading" | "ready" | "error";

export default function EndpointsPage() {
  const [endpoints, setEndpoints] = useState<EndpointItem[]>([]);
  const [state, setState] = useState<State>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`${BASE}/api/v1/endpoints`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    })
      .then(async (res) => {
        if (cancelled) return;
        if (!res.ok) throw new Error(`Failed (${res.status})`);
        const body: unknown = await res.json();
        const list: EndpointItem[] = Array.isArray(body)
          ? (body as EndpointItem[])
          : [];
        setEndpoints(list);
        setState("ready");
      })
      .catch((e: Error) => {
        if (cancelled) return;
        setError(e.message);
        setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark} aria-hidden />
          Live API Inspector
        </Link>
        <Link href="/" className={styles.back}>
          ← Back to Inspector
        </Link>
      </header>

      <main className={styles.main}>
        <div className={styles.head}>
          <h1 className={styles.title}>Endpoints</h1>
          <p className={styles.sub}>
            All endpoints created on this server. Click any to open the live
            inspector.
          </p>
        </div>

        {state === "loading" && <p className={styles.status}>Loading…</p>}

        {state === "error" && (
          <div className={styles.errorCard}>
            <strong>Couldn&apos;t load endpoints</strong>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {state === "ready" && endpoints.length === 0 && (
          <div className={styles.emptyCard}>
            <h2>No endpoints yet</h2>
            <p>
              Go to the Inspector page and create your first endpoint to start
              capturing webhooks.
            </p>
            <Link href="/" className={styles.cta}>
              Go to Inspector
            </Link>
          </div>
        )}

        {state === "ready" && endpoints.length > 0 && (
          <div className={styles.grid}>
            {endpoints.map((ep) => (
              <Link
                key={ep.slug}
                href={`/inspect/${ep.slug}`}
                className={styles.card}
              >
                <div className={styles.cardTop}>
                  <span className={styles.dot} aria-hidden />
                  <span className={styles.slug}>{ep.slug}</span>
                </div>
                <div className={styles.cardMeta}>
                  <span>{ep.requestCount} reqs</span>
                  <span>{new Date(ep.createdAt).toLocaleDateString()}</span>
                </div>
                <span className={styles.open}>
                  Open <span aria-hidden>→</span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}