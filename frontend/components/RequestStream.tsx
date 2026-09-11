"use client";

import type { RequestEntry } from "@/lib/types";

interface Props {
  requests: RequestEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  methodFilter: string;
  statusFilter: string;
  searchQuery: string;
  onMethodFilter: (m: string) => void;
  onStatusFilter: (s: string) => void;
  onSearchQuery: (q: string) => void;
  savedIds: Set<string>;
  onToggleSave: (id: string) => void;
}

const METHODS = ["ALL", "GET", "POST", "PUT", "PATCH", "DELETE"];
const STATUSES = ["ALL", "2xx", "3xx", "4xx", "5xx"];

export default function RequestStream({
  requests,
  selectedId,
  onSelect,
  methodFilter,
  statusFilter,
  searchQuery,
  onMethodFilter,
  onStatusFilter,
  onSearchQuery,
  savedIds,
  onToggleSave,
}: Props) {
  const filtered = requests.filter((r) => {
    if (methodFilter !== "ALL" && r.method !== methodFilter) return false;
    if (statusFilter !== "ALL" && !String(r.status).startsWith(statusFilter[0]!))
      return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.path.toLowerCase().includes(q) ||
        r.method.toLowerCase().includes(q) ||
        String(r.status).includes(q)
      );
    }
    return true;
  });

  return (
    <div style={styles.wrap}>
      <div style={styles.filters}>
        <input
          placeholder="Search path, method, status…"
          value={searchQuery}
          onChange={(e) => onSearchQuery(e.target.value)}
          style={styles.search}
        />
        <select
          value={methodFilter}
          onChange={(e) => onMethodFilter(e.target.value)}
          style={styles.select}
        >
          {METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilter(e.target.value)}
          style={styles.select}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.list}>
        {filtered.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ margin: 0, fontSize: "0.82rem" }}>
              No requests match these filters.
            </p>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: "0.72rem",
                color: "var(--text-muted, #888)",
              }}
            >
              Try clearing the search or switching filters.
            </p>
          </div>
        ) : (
          filtered.map((r) => {
            const active = r.id === selectedId;
            const saved = savedIds.has(r.id);
            return (
              <button
                key={r.id}
                onClick={() => onSelect(r.id)}
                style={active ? { ...styles.row, ...styles.rowA } : styles.row}
              >
                <span
                  style={{
                    ...styles.method,
                    background: methodColor(r.method),
                    color: "#fff",
                  }}
                >
                  {r.method}
                </span>
                <span
                  style={{
                    ...styles.status,
                    color: statusColor(r.status),
                  }}
                >
                  {r.status}
                </span>
                <span style={styles.path} title={r.path}>
                  {r.path}
                </span>
                <span style={styles.time}>{r.receivedAgo}</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(r.id);
                  }}
                  style={{
                    ...styles.star,
                    color: saved ? "var(--warning, #f59e0b)" : "var(--text-muted, #888)",
                  }}
                  title={saved ? "Unsave" : "Save"}
                >
                  {saved ? "★" : "☆"}
                </span>
              </button>
            );
          })
        )}
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
    background: "var(--bg, #fafafa)",
  },
  filters: {
    display: "flex",
    gap: 6,
    padding: "8px 10px",
    borderBottom: "1px solid var(--border, #e5e5e5)",
    background: "var(--bg-elevated, #fff)",
  },
  search: {
    flex: 1,
    minWidth: 0,
    padding: "6px 10px",
    border: "1px solid var(--border, #e5e5e5)",
    borderRadius: "var(--r-md, 8px)",
    fontSize: "0.78rem",
    background: "var(--surface, #fff)",
    color: "var(--text, #0d0d0d)",
    fontFamily: "inherit",
    outline: "none",
  },
  select: {
    padding: "6px 8px",
    border: "1px solid var(--border, #e5e5e5)",
    borderRadius: "var(--r-md, 8px)",
    fontSize: "0.75rem",
    background: "var(--surface, #fff)",
    color: "var(--text, #0d0d0d)",
    fontFamily: "inherit",
    cursor: "pointer",
    outline: "none",
  },
  list: {
    flex: 1,
    overflowY: "auto",
    padding: 6,
  },
  empty: {
    padding: "var(--s5, 20px)",
    textAlign: "center",
    color: "var(--text-secondary, #666)",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "auto auto 1fr auto auto",
    alignItems: "center",
    gap: 8,
    width: "100%",
    padding: "8px 10px",
    background: "transparent",
    border: "1px solid transparent",
    borderRadius: "var(--r-md, 8px)",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
    marginBottom: 2,
  },
  rowA: {
    background: "var(--accent-soft, rgba(77,107,254,0.08))",
    border: "1px solid var(--accent, #4d6bfe)",
  },
  method: {
    fontSize: "0.65rem",
    fontWeight: 700,
    padding: "2px 6px",
    borderRadius: 4,
    letterSpacing: "0.02em",
    fontFamily: "var(--font-mono, monospace)",
  },
  status: {
    fontSize: "0.72rem",
    fontFamily: "var(--font-mono, monospace)",
    fontWeight: 600,
    minWidth: 30,
  },
  path: {
    fontSize: "0.78rem",
    color: "var(--text, #0d0d0d)",
    fontFamily: "var(--font-mono, monospace)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    minWidth: 0,
  },
  time: {
    fontSize: "0.68rem",
    color: "var(--text-muted, #888)",
    whiteSpace: "nowrap",
  },
  star: {
    fontSize: "0.9rem",
    cursor: "pointer",
    padding: 2,
    lineHeight: 1,
  },
};
