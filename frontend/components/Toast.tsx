"use client";

import { useEffect, useState } from "react";

export type ToastTone = "info" | "success" | "warn";

interface ToastItem {
  id: string;
  message: string;
  tone: ToastTone;
  durationMs: number;
}

let items: ToastItem[] = [];
const listeners = new Set<(snapshot: ToastItem[]) => void>();
let counter = 0;

function emit() {
  const snapshot = [...items];
  listeners.forEach((l) => l(snapshot));
}

function add(item: ToastItem) {
  items = [item, ...items].slice(0, 3);
  emit();
  window.setTimeout(() => dismiss(item.id), item.durationMs);
}

function dismiss(id: string) {
  items = items.filter((t) => t.id !== id);
  emit();
}

export const toast = {
  show(message: string, tone: ToastTone = "info", durationMs = 5000) {
    if (typeof window === "undefined") return;
    add({ id: `toast-${++counter}`, message, tone, durationMs });
  },
};

export function useToast() {
  const [list, setList] = useState<ToastItem[]>(items);
  useEffect(() => {
    listeners.add(setList);
    setList([...items]);
    return () => {
      listeners.delete(setList);
    };
  }, []);
  return { list, dismiss };
}

const TONE_DOT: Record<ToastTone, string> = {
  info: "var(--accent, #4d6bfe)",
  success: "var(--live, #24d17a)",
  warn: "var(--warn, #f59e0b)",
};

const TONE_BORDER: Record<ToastTone, string> = {
  info: "var(--border, #e5e5e5)",
  success: "rgba(36, 209, 122, 0.45)",
  warn: "rgba(245, 158, 11, 0.45)",
};

export function ToastStack() {
  const { list, dismiss } = useToast();
  if (list.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes bds-toast-in {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bds-toast { animation: none !important; }
        }
      `}</style>

      <div
        aria-live="polite"
        aria-atomic="false"
        style={{
          position: "fixed",
          top: "calc(var(--nav-h, 56px) + 12px)",
          right: 16,
          zIndex: 300,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: "min(360px, calc(100vw - 32px))",
          pointerEvents: "none",
        }}
      >
        {list.map((t) => (
          <div
            key={t.id}
            className="bds-toast"
            role="status"
            style={{
              pointerEvents: "auto",
              background: "var(--surface, #fff)",
              border: `1px solid ${TONE_BORDER[t.tone]}`,
              borderRadius: 12,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              padding: "10px 12px",
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              animation: "bds-toast-in 240ms cubic-bezier(.2,.8,.2,1) both",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: TONE_DOT[t.tone],
                marginTop: 6,
                flexShrink: 0,
              }}
            />
            <p
              style={{
                margin: 0,
                fontSize: "0.82rem",
                lineHeight: 1.45,
                color: "var(--text, #0d0d0d)",
                flex: 1,
              }}
            >
              {t.message}
            </p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted, #888)",
                cursor: "pointer",
                fontSize: "0.9rem",
                lineHeight: 1,
                padding: 2,
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
