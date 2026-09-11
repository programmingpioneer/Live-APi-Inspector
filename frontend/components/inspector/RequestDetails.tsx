"use client";

import { useState } from "react";
import type { CapturedRequest, InspectorTab } from "@/lib/types";
import { formatBytes, relativeTime } from "@/lib/mock-data";
import { formatTimestamp } from "@/lib/utils";
import { JsonViewer } from "../JsonViewer";
import styles from "./RequestDetails.module.css";

interface Props {
  request: CapturedRequest | null;
  onBack?: () => void;
  onReplay?: () => void;
}

const TABS: { id: InspectorTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "headers", label: "Headers" },
  { id: "query", label: "Query" },
  { id: "body", label: "Body" },
  { id: "raw", label: "Raw" },
];

export function RequestDetails({ request, onBack, onReplay }: Props) {
  const [tab, setTab] = useState<InspectorTab>("overview");

  if (!request) {
    return <EmptyDetails onBack={onBack} />;
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <button className={styles.back} onClick={onBack} aria-label="Back to list">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M10 3 5 8l5 5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className={styles.titleRow}>
          <span className={`${styles.method} ${styles[`m${request.method}`]}`}>
            {request.method}
          </span>
          <code className={styles.path}>{request.path}</code>
        </div>

        <div className={styles.right}>
          <span className={styles.statusOk}>
            {request.status} {request.statusText}
          </span>
          <span className={styles.time}>{formatTimestamp(request.timestamp)}</span>
          <button className={styles.replay} onClick={onReplay}>
            <ReplayIcon />
            Replay
          </button>
        </div>
      </header>

      <nav className={styles.tabs} role="tablist" aria-label="Request details">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`${styles.tab} ${tab === t.id ? styles.tabOn : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className={styles.body}>
        {tab === "overview" && <Overview request={request} />}
        {tab === "headers" && <HeadersTab request={request} />}
        {tab === "query" && <QueryTab request={request} />}
        {tab === "body" && <JsonViewer data={request.body} />}
        {tab === "raw" && <RawTab request={request} />}
      </div>
    </div>
  );
}

function Overview({ request }: { request: CapturedRequest }) {
  const rows: Array<[string, string]> = [
    ["Request ID", request.id],
    ["Status", `${request.status} ${request.statusText}`],
    ["Duration", `${request.duration} ms`],
    ["Size", formatBytes(request.size)],
    ["Content-Type", request.contentType],
    ["Client IP", request.ip],
    ["HTTP Version", request.httpVersion],
    ["Received", relativeTime(request.timestamp)],
  ];
  return (
    <div className={styles.overview}>
      {rows.map(([k, v]) => (
        <div key={k} className={styles.overviewRow}>
          <span className={styles.overviewKey}>{k}</span>
          <span className={styles.overviewVal} title={v}>
            {v}
          </span>
        </div>
      ))}
    </div>
  );
}

function HeadersTab({ request }: { request: CapturedRequest }) {
  return (
    <div className={styles.headers}>
      {request.headers.map((h) => (
        <div key={h.key} className={styles.headerRow}>
          <span className={styles.headerKey}>{h.key}</span>
          <span className={styles.headerVal} title={h.value}>
            {h.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function QueryTab({ request }: { request: CapturedRequest }) {
  const entries = Object.entries(request.query);
  if (entries.length === 0) {
    return (
      <div className={styles.emptyTab}>
        No query parameters on this request.
      </div>
    );
  }
  return (
    <div className={styles.headers}>
      {entries.map(([k, v]) => (
        <div key={k} className={styles.headerRow}>
          <span className={styles.headerKey}>{k}</span>
          <span className={styles.headerVal}>{v}</span>
        </div>
      ))}
    </div>
  );
}

function RawTab({ request }: { request: CapturedRequest }) {
  return (
    <pre className={styles.raw}>
      {`${request.method} ${request.path} ${request.httpVersion}
Host: inspect.dev
${request.headers.map((h) => `${h.key}: ${h.value}`).join("\n")}

${request.raw}`}
    </pre>
  );
}

function EmptyDetails({ onBack }: { onBack?: () => void }) {
  return (
    <div className={styles.emptyWrap}>
      <div className={styles.emptyArt}>
        <span className={styles.emptyPulse} />
      </div>
      <h3 className={styles.emptyTitle}>Waiting for your first request</h3>
      <p className={styles.emptyText}>
        Send an HTTP request to your inspection endpoint and it will appear here
        instantly.
      </p>
      <div className={styles.emptyEndpoint}>
        <code>https://inspect.dev/api/v1/inspect/demo-8x91</code>
      </div>
      {onBack && (
        <button className={styles.emptyBack} onClick={onBack}>
          Back to list
        </button>
      )}
    </div>
  );
}

function ReplayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12a8 8 0 1 0 3-6.3M4 4v4h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
