"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onRun?: (id: string) => void;
}

interface Command {
  id: string;
  label: string;
  hint?: string;
}

export default function CommandPalette({ open, onClose, onRun }: Props) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset on open/close
  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIdx(0);
      return;
    }
    // focus after mount
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(t);
  }, [open]);

  const commands = useMemo<Command[]>(
    () => [
      { id: "create", label: "Create Endpoint", hint: "New" },
      { id: "inspect", label: "Open Inspector", hint: "↻" },
      { id: "endpoints", label: "View Endpoints", hint: "☰" },
      { id: "history", label: "View History", hint: "◷" },
      { id: "docs", label: "Open Documentation", hint: "?" },
      { id: "tour", label: "Show Tour", hint: "◎" },
      { id: "export", label: "Export Requests (JSON)", hint: "↓" },
    ],
    [],
  );

  const filtered = useMemo(
    () =>
      commands.filter((c) =>
        c.label.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [commands, query],
  );

  // Keyboard: Esc / Enter / Arrow up-down
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[activeIdx];
        if (cmd) {
          onRun?.(cmd.id);
          onClose();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, activeIdx, onRun, onClose]);

  // Clamp active when list shrinks
  useEffect(() => {
    if (activeIdx > filtered.length - 1) setActiveIdx(0);
  }, [filtered.length, activeIdx]);

  if (!open) return null;

  const runCommand = (id: string) => {
    onRun?.(id);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        display: "grid",
        placeItems: "start center",
        paddingTop: "12vh",
        zIndex: 250,
        animation: "fadeIn 160ms ease both",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cp-slide {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cp-panel, .cp-item { animation: none !important; }
        }
      `}</style>

      <div
        className="cp-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(560px, calc(100vw - 32px))",
          background: "var(--surface, #16171a)",
          border: "1px solid var(--border-strong, #34343c)",
          borderRadius: 14,
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.6)",
          overflow: "hidden",
          animation: "cp-slide 180ms cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        {/* Input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 16px",
            borderBottom: "1px solid var(--border, #26262c)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-muted, #71717a)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIdx(0);
            }}
            placeholder="Type a command…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text, #f4f4f5)",
              fontFamily: "inherit",
              fontSize: "0.92rem",
            }}
            aria-label="Command input"
          />
          <kbd
            style={{
              padding: "2px 8px",
              background: "var(--surface-2, #18181c)",
              border: "1px solid var(--border, #26262c)",
              borderRadius: 5,
              color: "var(--text-muted, #71717a)",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "0.68rem",
              fontWeight: 600,
            }}
          >
            ESC
          </kbd>
        </div>

        {/* List */}
        <div
          style={{
            maxHeight: "min(400px, 60vh)",
            overflowY: "auto",
            padding: 6,
          }}
          role="listbox"
        >
          {filtered.length === 0 ? (
            <div
              style={{
                padding: "24px 16px",
                textAlign: "center",
                color: "var(--text-muted, #71717a)",
                fontSize: "0.82rem",
              }}
            >
              No commands match "{query}"
            </div>
          ) : (
            filtered.map((c, idx) => {
              const active = idx === activeIdx;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => runCommand(c.id)}
                  onMouseEnter={() => setActiveIdx(idx)}
                  role="option"
                  aria-selected={active}
                  className="cp-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "10px 12px",
                    background: active
                      ? "var(--surface-2, #18181c)"
                      : "transparent",
                    border: "none",
                    borderRadius: 8,
                    color: active
                      ? "var(--text, #f4f4f5)"
                      : "var(--text-dim, #a1a1aa)",
                    fontFamily: "inherit",
                    fontSize: "0.85rem",
                    fontWeight: active ? 600 : 500,
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "background 120ms ease, color 120ms ease",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: active
                        ? "var(--accent, #8b5cf6)"
                        : "var(--text-muted, #71717a)",
                      flexShrink: 0,
                      transition: "background 120ms ease",
                    }}
                    aria-hidden
                  />
                  <span style={{ flex: 1 }}>{c.label}</span>
                  {c.hint && (
                    <span
                      style={{
                        fontFamily: "var(--font-mono, monospace)",
                        fontSize: "0.7rem",
                        color: "var(--text-muted, #71717a)",
                        padding: "2px 6px",
                        border: "1px solid var(--border, #26262c)",
                        borderRadius: 4,
                      }}
                    >
                      {c.hint}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer hints */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "10px 16px",
            borderTop: "1px solid var(--border, #26262c)",
            background: "var(--surface-2, #18181c)",
            fontSize: "0.7rem",
            color: "var(--text-muted, #71717a)",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <kbd style={kbdMini}>↑</kbd>
            <kbd style={kbdMini}>↓</kbd>
            navigate
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <kbd style={kbdMini}>↵</kbd>
            run
          </span>
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            {filtered.length} / {commands.length}
          </span>
        </div>
      </div>
    </div>
  );
}

const kbdMini: React.CSSProperties = {
  padding: "1px 5px",
  background: "var(--bg-elev-1, #0f0f11)",
  border: "1px solid var(--border, #26262c)",
  borderRadius: 4,
  fontFamily: "var(--font-mono, monospace)",
  fontSize: "0.65rem",
  fontWeight: 600,
  color: "var(--text-dim, #a1a1aa)",
};