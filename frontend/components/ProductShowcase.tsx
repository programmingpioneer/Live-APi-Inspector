"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { JsonViewer } from "./JsonViewer";
import { Reveal } from "./Reveal";
import styles from "./ProductShowcase.module.css";

/* ---------- Local demo data — landing page only ---------- */

interface DemoRequest {
  id: string;
  method: string;
  path: string;
  status: number;
  statusText: string;
  size: number;
  timestamp: number;
  ip: string;
  contentType: string;
  httpVersion: string;
  body: unknown;
}

const SEED: DemoRequest[] = [
  {
    id: "req_1",
    method: "POST",
    path: "/api/webhooks/github",
    status: 200,
    statusText: "OK",
    size: 1843,
    timestamp: Date.now() - 4000,
    ip: "140.82.115.42",
    contentType: "application/json",
    httpVersion: "1.1",
    body: {
      action: "opened",
      issue: { number: 128, title: "Fix flaky webhook retries" },
      repository: { full_name: "acme/inspector" },
    },
  },
  {
    id: "req_2",
    method: "POST",
    path: "/api/payments",
    status: 201,
    statusText: "Created",
    size: 3277,
    timestamp: Date.now() - 11000,
    ip: "54.187.174.169",
    contentType: "application/json",
    httpVersion: "1.1",
    body: {
      event: "payment.completed",
      id: "evt_8x92a",
      amount: 4999,
      currency: "usd",
    },
  },
  {
    id: "req_3",
    method: "GET",
    path: "/api/callback",
    status: 200,
    statusText: "OK",
    size: 892,
    timestamp: Date.now() - 22000,
    ip: "18.234.12.88",
    contentType: "application/json",
    httpVersion: "1.1",
    body: { ok: true, received: true },
  },
  {
    id: "req_4",
    method: "POST",
    path: "/api/webhook",
    status: 200,
    statusText: "OK",
    size: 2150,
    timestamp: Date.now() - 31000,
    ip: "52.89.214.238",
    contentType: "application/json",
    httpVersion: "1.1",
    body: {
      event: "payment.completed",
      id: "evt_8x92a",
      customer: { email: "developer@example.com" },
    },
  },
  {
    id: "req_5",
    method: "PUT",
    path: "/api/v1/orders",
    status: 200,
    statusText: "OK",
    size: 1204,
    timestamp: Date.now() - 48000,
    ip: "3.18.12.45",
    contentType: "application/json",
    httpVersion: "1.1",
    body: { orderId: "ord_771", status: "shipped" },
  },
  {
    id: "req_6",
    method: "DELETE",
    path: "/api/v1/users/9f1c",
    status: 204,
    statusText: "No Content",
    size: 0,
    timestamp: Date.now() - 62000,
    ip: "104.18.12.101",
    contentType: "—",
    httpVersion: "1.1",
    body: null,
  },
];

/* ---------- Component ---------- */

export function ProductShowcase() {
  const { ref, inView } = useInView<HTMLElement>();
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setRequests(SEED);
    setSelectedId(SEED[0].id);
  }, []);

  const selected =
    requests.find((r) => r.id === selectedId) ?? requests[0] ?? null;

  return (
    <section ref={ref} className={styles.section}>
      <div className="container">
        <Reveal as="section" direction="up" className={styles.head}>
          <span className="eyebrow">The workspace</span>
          <h2 className="h-section">This is what your endpoint sees.</h2>
          <p className={styles.lead}>
            A real inspector — stream, details, and metadata. Nothing invented.
          </p>
        </Reveal>

        <div className={`${styles.workspace} ${inView ? styles.on : ""}`}>
          {/* LEFT: request stream */}
          <aside className={styles.stream} aria-label="Request stream">
            <div className={styles.panelHead}>
              <span>Incoming</span>
              <span className={styles.panelCount}>
                {requests.length || 6}
              </span>
            </div>
            <ul className={styles.list}>
              {requests.length === 0
                ? Array.from({ length: 6 }).map((_, i) => (
                    <li key={i}>
                      <div className={styles.skelRow}>
                        <span className={`skeleton ${styles.skelM}`} />
                        <span className={`skeleton ${styles.skelP}`} />
                      </div>
                    </li>
                  ))
                : requests.map((r) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        className={`${styles.item} ${
                          r.id === selectedId ? styles.itemActive : ""
                        }`}
                        onClick={() => setSelectedId(r.id)}
                      >
                        <span
                          className={`${styles.method} ${
                            styles[`m${r.method}`] ?? ""
                          }`}
                        >
                          {r.method}
                        </span>
                        <span className={styles.itemPath}>{r.path}</span>
                        <span className={styles.itemMeta}>
                          <span className={styles.status}>{r.status}</span>
                          <span className={styles.muted}>
                            {formatBytes(r.size)}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
            </ul>
          </aside>

          {/* CENTER: details */}
          <div className={styles.details}>
            {selected ? (
              <>
                <div className={styles.detailsHead}>
                  <div className={styles.detailsTitle}>
                    <span
                      className={`${styles.method} ${
                        styles[`m${selected.method}`] ?? ""
                      }`}
                    >
                      {selected.method}
                    </span>
                    <code className={styles.detailsPath}>{selected.path}</code>
                  </div>
                  <div className={styles.detailsMeta}>
                    <span className={styles.ok}>
                      {selected.status} {selected.statusText}
                    </span>
                    <span className={styles.muted}>
                      {relativeTime(selected.timestamp)}
                    </span>
                  </div>
                </div>
                <div
                  className={styles.tabs}
                  role="tablist"
                  aria-label="Request details"
                >
                  {["Overview", "Headers", "Query", "Body", "Raw"].map((t, i) => (
                    <button
                      key={t}
                      type="button"
                      role="tab"
                      aria-selected={i === 0}
                      className={`${styles.tab} ${
                        i === 0 ? styles.tabActive : ""
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className={styles.detailBody}>
                  <JsonViewer data={selected.body} />
                </div>
              </>
            ) : (
              <div className={styles.detailsSkeleton}>
                <span className={`skeleton ${styles.skelHead}`} />
                <span className={`skeleton ${styles.skelBody}`} />
              </div>
            )}
          </div>

          {/* RIGHT: metadata */}
          <aside className={styles.meta} aria-label="Request metadata">
            <div className={styles.panelHead}>Metadata</div>
            <dl className={styles.metaList}>
              {selected ? (
                <>
                  <MetaRow k="Request ID" v={selected.id} />
                  <MetaRow k="IP" v={selected.ip} />
                  <MetaRow k="Content-Type" v={selected.contentType} />
                  <MetaRow
                    k="Content-Length"
                    v={formatBytes(selected.size)}
                  />
                  <MetaRow k="HTTP" v={`HTTP/${selected.httpVersion}`} />
                  <MetaRow k="Method" v={selected.method} />
                  <MetaRow k="Time" v={relativeTime(selected.timestamp)} />
                </>
              ) : (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={styles.metaRow}>
                    <span className={`skeleton ${styles.skelK}`} />
                    <span className={`skeleton ${styles.skelV}`} />
                  </div>
                ))
              )}
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}

function MetaRow({ k, v }: { k: string; v: string }) {
  return (
    <div className={styles.metaRow}>
      <dt>{k}</dt>
      <dd title={v}>{v}</dd>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s} sec ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  return `${h} hr ago`;
}