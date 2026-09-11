"use client";

import { useState } from "react";
import type { RequestEntry } from "@/lib/types";

interface Props {
  request: RequestEntry | null;
  onReplay: () => void;
}

type Tab = "overview" | "headers" | "body" | "raw";

export default function RequestDetails({ request, onReplay }: Props) {
  const [tab, setTab] = useState<Tab>("overview");

  if (!request) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon} aria-hidden>
          ⌁
        </div>
        <p style={styles.emptyTitle}>No request selected</p>
        <p style={styles.emptyHint}>
          Pick a request from the list to see its details.
        </p>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "headers", label: "Headers" },
    { key: "body", label: "Body" },
    { key: "raw", label: "Raw" },
  ];

  return (
    <div style={styles.wrap}>
      <div style={styles.hdr}>
        <div style={styles.hdrRow}>
          <span
            style={{ ...styles.method, background: methodColor(request.method) }}
          >
            {request.method}
          </span>
          <span
            style={{ ...styles.status, color: statusColor(request.status) }}
          >
            {request.status} {request.statusText}
          </span>
        </div>
        <div style={styles.path}>{request.path}</div>
        <div style={styles.meta}>
          <span>IP: {request.ip}</span>
          <span>Size: {request.size}</span>
          <span>Duration: {request.duration} ms</span>
          <span>{request.receivedAt}</span>
        </div>
        <div style={{ marginTop: 8 }}>
          <button className="btn btn-primary btn-sm" onClick={onReplay}>
            ↻ Replay Request
          </button>
        </div>
      </div>

      <div style={styles.tabs}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={tab === t.key ? { ...styles.tab, ...styles.tabA } : styles.tab}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {tab === "overview" && (
          <div style={styles.kv}>
            <Row k="Method" v={request.method} />
            <Row k="Path" v={request.path} />
            <Row k="Status" v={`${request.status} ${request.statusText}`} />
            <Row k="IP" v={request.ip} />
            <Row k="Size" v={request.size} />
            <Row k="Duration" v={`${request.duration} ms`} />
            <Row
              k="Received"
              v={`${request.receivedAt} (${request.receivedAgo})`}
            />
          </div>
        )}

        {tab === "headers" && (
          <div style={styles.kv}>
            {Object.entries(request.headers).length === 0 ? (
              <p style={styles.emptyHint}>No headers captured.</p>
            ) : (
              Object.entries(request.headers).map(([k, v]) => (
                <Row key={k} k={k} v={v} mono />
              ))
            )}
          </div>
        )}

        {tab === "body" &&
          (request.body ? (
            <pre style={styles.pre}>{request.body}</pre>
          ) : (
            <p style={styles.emptyHint}>No body for this request.</p>
          ))}

        {tab === "raw" && <pre style={styles.pre}>{request.raw}</pre>}
      </div>
    </div>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div style={styles.row}>
      <span style={styles.rowKey}>{k}</span>
      <span
        style={{
          ...styles.rowVal,
          fontFamily: mono ? "var(--font-mono, monospace)" : "inherit",
        }}
      >
        {v}
      </span>
    </div>
  );
}

function methodColor(m: string): string {
  switch (m) {
    case "GET":
      return "#10b981";
    case "POST":
      return "#4d6bfe";
    case "PUT":
      return "#f59e0b";
    case "PATCH":
      return "#a855f7";
    case "DELETE":
      return "#ef4444";
    default:
      return "#6b7280";
  }
}

function statusColor(s: number): string {
  const c = Math.floor(s / 100);
  if (c === 2) return "var(--success, #10b981)";
  if (c === 3) return "var(--warn, #f59e0b)";
  if (c === 4) return "var(--warning, #f59e0b)";
  if (c === 5) return "var(--danger, #ef4444)";
  return "var(--text-muted, #888)";
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
    background: "var(--bg-elevated, #fff)",
  },
  hdr: {
    padding: "12px 16px",
    borderBottom: "1px solid var(--border, #e5e5e5)",
  },
  hdrRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  method: {
    fontSize: "0.68rem",
    fontWeight: 700,
    color: "#fff",
    padding: "2px 8px",
    borderRadius: 4,
    fontFamily: "var(--font-mono, monospace)",
  },
  status: {
    fontSize: "0.78rem",
    fontWeight: 600,
    fontFamily: "var(--font-mono, monospace)",
  },
  path: {
    fontSize: "0.82rem",
    fontFamily: "var(--font-mono, monospace)",
    color: "var(--text, #0d0d0d)",
    wordBreak: "break-all",
    marginBottom: 6,
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px 14px",
    fontSize: "0.7rem",
    color: "var(--text-muted, #888)",
  },
  tabs: {
    display: "flex",
    gap: 2,
    padding: "6px 12px",
    borderBottom: "1px solid var(--border, #e5e5e5)",
    background: "var(--bg, #fafafa)",
  },
  tab: {
    padding: "6px 12px",
    background: "transparent",
    border: "none",
    borderRadius: "var(--r-md, 8px)",
    color: "var(--text-secondary, #666)",
    fontSize: "0.78rem",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  tabA: {
    background: "var(--surface, #fff)",
    color: "var(--text, #0d0d0d)",
    fontWeight: 600,
    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
  },
  content: { flex: 1, overflowY: "auto", padding: 14 },
  kv: { display: "flex", flexDirection: "column", gap: 4 },
  row: {
    display: "grid",
    gridTemplateColumns: "140px 1fr",
    gap: 10,
    alignItems: "baseline",
    padding: "5px 0",
    borderBottom: "1px solid var(--border, #f0f0f0)",
  },
  rowKey: {
    fontSize: "0.72rem",
    color: "var(--text-muted, #888)",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  },
  rowVal: {
    fontSize: "0.78rem",
    color: "var(--text, #0d0d0d)",
    wordBreak: "break-all",
  },
  pre: {
    margin: 0,
    padding: 12,
    background: "var(--surface-2, #f5f5f5)",
    borderRadius: "var(--r-md, 8px)",
    fontSize: "0.75rem",
    fontFamily: "var(--font-mono, monospace)",
    color: "var(--text, #0d0d0d)",
    overflowX: "auto",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  empty: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "var(--s5, 20px)",
    textAlign: "center",
    background: "var(--bg-elevated, #fff)",
  },
  emptyIcon: {
    fontSize: "2rem",
    color: "var(--text-muted, #888)",
    marginBottom: 10,
  },
  emptyTitle: {
    margin: 0,
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "var(--text, #0d0d0d)",
  },
  emptyHint: {
    margin: "6px 0 0",
    fontSize: "0.78rem",
    color: "var(--text-secondary, #666)",
  },
};