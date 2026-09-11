"use client";

import { useState } from "react";
import type { RequestEntry } from "@/lib/types";

interface Props {
  request: RequestEntry | null;
  onClose: () => void;
}

export default function ReplayModal({ request, onClose }: Props) {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  if (!request) return null;

  const send = async () => {
    setSending(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 700));
    setResult(`Replayed ${request.method} ${request.path} → 200 OK (simulated)`);
    setSending(false);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "grid",
        placeItems: "center",
        zIndex: 220,
        padding: 16,
        animation: "fadeIn 180ms ease both",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-scale-in"
        style={{
          width: "min(520px, calc(100vw - 32px))",
          background: "var(--surface, #fff)",
          border: "1px solid var(--border-strong, #d1d5db)",
          borderRadius: "var(--r-lg, 14px)",
          boxShadow: "var(--shadow-lg, 0 16px 40px rgba(0,0,0,0.25))",
          padding: "20px 22px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "var(--text, #0d0d0d)" }}>
            Replay Request
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="btn btn-ghost btn-icon"
            style={{ fontSize: "0.9rem" }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              color: "#fff",
              padding: "2px 8px",
              borderRadius: 4,
              background: methodColor(request.method),
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            {request.method}
          </span>
          <code style={{ fontSize: "0.82rem", fontFamily: "var(--font-mono, monospace)", wordBreak: "break-all" }}>
            {request.path}
          </code>
        </div>

        <div>
          <label style={styles.lbl}>Body</label>
          <pre style={styles.pre}>{request.body ?? "(no body)"}</pre>
        </div>

        {result && (
          <p
            style={{
              margin: 0,
              fontSize: "0.78rem",
              padding: "8px 10px",
              borderRadius: "var(--r-md, 8px)",
              background: "rgba(36,209,122,0.12)",
              color: "var(--success, #10b981)",
            }}
          >
            {result}
          </p>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
          <button className="btn" onClick={onClose} disabled={sending}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={send} disabled={sending}>
            {sending ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

function methodColor(m: string): string {
  switch (m) {
    case "GET": return "#10b981";
    case "POST": return "#4d6bfe";
    case "PUT": return "#f59e0b";
    case "PATCH": return "#a855f7";
    case "DELETE": return "#ef4444";
    default: return "#6b7280";
  }
}

const styles: Record<string, React.CSSProperties> = {
  lbl: {
    display: "block",
    fontSize: "0.65rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "var(--text-muted, #888)",
    marginBottom: 4,
  },
  pre: {
    margin: 0,
    padding: 10,
    background: "var(--surface-2, #f5f5f5)",
    borderRadius: "var(--r-md, 8px)",
    fontSize: "0.75rem",
    fontFamily: "var(--font-mono, monospace)",
    color: "var(--text, #0d0d0d)",
    maxHeight: 180,
    overflow: "auto",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
};