"use client";

import { useState } from "react";

type Page = "home" | "inspector" | "endpoints" | "history" | "docs";

interface Props {
  page: Page;
  onNavigate: (p: Page) => void;
  workspaces: string[];
  currentWorkspace: string;
  onSwitchWorkspace: (name: string) => void;
  onCreateWorkspace: (name: string) => void;
  onDeleteWorkspace: (name: string) => void;
}

const TABS: { key: Page; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "inspector", label: "Inspector" },
  { key: "endpoints", label: "Endpoints" },
  { key: "history", label: "History" },
  { key: "docs", label: "Docs" },
];

export default function TopNav({
  page,
  onNavigate,
  workspaces,
  currentWorkspace,
  onSwitchWorkspace,
  onCreateWorkspace,
  onDeleteWorkspace,
}: Props) {
  const [wsOpen, setWsOpen] = useState(false);
  const [newWs, setNewWs] = useState("");

  return (
    <header style={styles.bar}>
      <div style={styles.brand}>
        <span style={styles.mark} aria-hidden />
        <span style={styles.brandText}>API Inspector</span>
      </div>

      <nav style={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => onNavigate(t.key)}
            style={page === t.key ? { ...styles.tab, ...styles.tabA } : styles.tab}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div style={styles.right}>
        <div style={{ position: "relative" }}>
          <button
            style={styles.wsBtn}
            onClick={() => setWsOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={wsOpen}
          >
            <span style={styles.wsDot} aria-hidden />
            {currentWorkspace}
            <span style={{ fontSize: "0.6rem", opacity: 0.6 }}>▾</span>
          </button>

          {wsOpen && (
            <div style={styles.wsMenu}>
              <div style={styles.wsLabel}>Workspaces</div>
              {workspaces.map((w) => (
                <button
                  key={w}
                  onClick={() => {
                    onSwitchWorkspace(w);
                    setWsOpen(false);
                  }}
                  style={
                    w === currentWorkspace
                      ? { ...styles.wsItem, ...styles.wsItemA }
                      : styles.wsItem
                  }
                >
                  <span>{w}</span>
                  {w !== "Personal" && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteWorkspace(w);
                      }}
                      style={styles.wsDel}
                      title="Delete workspace"
                    >
                      ✕
                    </span>
                  )}
                </button>
              ))}

              <div style={styles.wsNewRow}>
                <input
                  placeholder="New workspace…"
                  value={newWs}
                  onChange={(e) => setNewWs(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newWs.trim()) {
                      onCreateWorkspace(newWs.trim());
                      setNewWs("");
                      setWsOpen(false);
                    }
                  }}
                  style={styles.wsInput}
                />
                <button
                  onClick={() => {
                    if (newWs.trim()) {
                      onCreateWorkspace(newWs.trim());
                      setNewWs("");
                      setWsOpen(false);
                    }
                  }}
                  style={styles.wsAdd}
                  disabled={!newWs.trim()}
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  bar: {
    height: "var(--nav-h, 56px)",
    display: "flex",
    alignItems: "center",
    gap: "var(--s4, 16px)",
    padding: "0 var(--s4, 16px)",
    borderBottom: "1px solid var(--border, #e5e5e5)",
    background: "var(--bg-elevated, #fff)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  mark: {
    width: 20,
    height: 20,
    borderRadius: 6,
    background: "var(--accent, #4d6bfe)",
  },
  brandText: {
    fontSize: "0.9rem",
    fontWeight: 700,
    letterSpacing: "-0.01em",
    color: "var(--text, #0d0d0d)",
  },
  tabs: {
    display: "flex",
    gap: 2,
    flex: 1,
    minWidth: 0,
    overflowX: "auto",
  },
  tab: {
    padding: "7px 12px",
    background: "transparent",
    border: "none",
    borderRadius: "var(--r-md, 8px)",
    color: "var(--text-secondary, #666)",
    fontSize: "0.82rem",
    fontFamily: "inherit",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  tabA: {
    background: "var(--accent-soft, rgba(77,107,254,0.10))",
    color: "var(--text, #0d0d0d)",
    fontWeight: 600,
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  wsBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    background: "var(--surface, #fff)",
    border: "1px solid var(--border, #e5e5e5)",
    borderRadius: "var(--r-md, 8px)",
    color: "var(--text, #0d0d0d)",
    fontSize: "0.8rem",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  wsDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "var(--accent, #4d6bfe)",
  },
  wsMenu: {
    position: "absolute",
    top: "calc(100% + 6px)",
    right: 0,
    width: 220,
    background: "var(--surface, #fff)",
    border: "1px solid var(--border-strong, #d1d5db)",
    borderRadius: "var(--r-lg, 12px)",
    boxShadow: "var(--shadow-lg, 0 12px 32px rgba(0,0,0,0.15))",
    padding: 6,
    zIndex: 200,
  },
  wsLabel: {
    fontSize: "0.65rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "var(--text-muted, #888)",
    padding: "6px 8px 4px",
  },
  wsItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "7px 10px",
    background: "transparent",
    border: "none",
    borderRadius: "var(--r-md, 8px)",
    color: "var(--text, #0d0d0d)",
    fontSize: "0.8rem",
    textAlign: "left",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  wsItemA: {
    background: "var(--accent-soft, rgba(77,107,254,0.08))",
    fontWeight: 600,
  },
  wsDel: {
    color: "var(--text-muted, #888)",
    fontSize: "0.7rem",
    cursor: "pointer",
  },
  wsNewRow: {
    display: "flex",
    gap: 4,
    marginTop: 4,
    paddingTop: 6,
    borderTop: "1px solid var(--border, #e5e5e5)",
  },
  wsInput: {
    flex: 1,
    padding: "6px 8px",
    border: "1px solid var(--border, #e5e5e5)",
    borderRadius: "var(--r-md, 8px)",
    fontSize: "0.78rem",
    background: "var(--surface, #fff)",
    color: "var(--text, #0d0d0d)",
    fontFamily: "inherit",
    outline: "none",
  },
  wsAdd: {
    width: 30,
    border: "1px solid var(--border, #e5e5e5)",
    borderRadius: "var(--r-md, 8px)",
    background: "var(--accent, #4d6bfe)",
    color: "#fff",
    fontSize: "1rem",
    cursor: "pointer",
    fontFamily: "inherit",
  },
};
