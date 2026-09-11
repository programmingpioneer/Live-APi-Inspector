"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createEndpoint, normalizeEndpointPrefix } from "@/lib/api";
import { toast } from "@/components/Toast";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NewEndpointModal({ open, onClose }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setMounted(true);
      setName("");
      setError(null);
      setCreating(false);
    } else {
      setMounted(false);
    }
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !creating) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, creating, onClose]);

  if (!open) return null;

  const preview = normalizeEndpointPrefix(name);
  const valid = preview.length >= 2;

  const submit = async () => {
    if (!valid || creating) return;
    setCreating(true);
    setError(null);

    try {
      const record = await createEndpoint(name);
      toast.show(`Endpoint created: ${record.slug}`, "success");
      onClose();
      router.push(`/inspect/${record.slug}`);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Couldn't reach the backend on :4000",
      );
      setCreating(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes bds-modal-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes bds-modal-rise {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bds-modal-card { animation: none !important; }
          .bds-modal-backdrop { animation: none !important; }
        }
      `}</style>

      <div
        className="bds-modal-backdrop"
        role="presentation"
        onClick={() => !creating && onClose()}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.72)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          display: "grid",
          placeItems: "center",
          zIndex: 1000,
          padding: 20,
          animation: "bds-modal-fade 180ms ease both",
        }}
      >
        <div
          className="bds-modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bds-modal-title"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "min(460px, 100%)",
            background: "#131316",
            border: "1px solid #2a2a30",
            borderRadius: 16,
            padding: "26px 26px 22px",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            color: "#f4f4f5",
            fontFamily:
              "var(--font-inter), system-ui, -apple-system, sans-serif",
            animation:
              "bds-modal-rise 240ms cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div
                aria-hidden
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(77, 107, 254, 0.14)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                ⚡
              </div>
              <div>
                <h2
                  id="bds-modal-title"
                  style={{
                    margin: 0,
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    color: "#f4f4f5",
                  }}
                >
                  Create Endpoint
                </h2>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: "0.8rem",
                    color: "#a1a1aa",
                    lineHeight: 1.4,
                  }}
                >
                  You&apos;ll get a unique URL for receiving webhooks.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => !creating && onClose()}
              disabled={creating}
              aria-label="Close"
              style={{
                background: "transparent",
                border: "none",
                color: "#71717a",
                fontSize: "1rem",
                lineHeight: 1,
                padding: 6,
                cursor: creating ? "not-allowed" : "pointer",
                borderRadius: 8,
                transition: "color 120ms ease, background 120ms ease",
              }}
              onMouseEnter={(e) => {
                if (!creating) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.color = "#f4f4f5";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#71717a";
              }}
            >
              ✕
            </button>
          </div>

          {/* Name input */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label
              htmlFor="bds-endpoint-name"
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#a1a1aa",
              }}
            >
              Endpoint Name
            </label>
            <input
              id="bds-endpoint-name"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") void submit();
              }}
              disabled={creating}
              placeholder="e.g. My Webhook"
              spellCheck={false}
              style={{
                width: "100%",
                background: "#0a0a0b",
                border: "1px solid #2a2a30",
                borderRadius: 10,
                padding: "11px 14px",
                fontSize: "0.9rem",
                color: "#f4f4f5",
                fontFamily: "inherit",
                outline: "none",
                transition: "border-color 140ms ease, box-shadow 140ms ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#4d6bfe";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(77,107,254,0.18)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#2a2a30";
                e.currentTarget.style.boxShadow = "none";
              }}
            />

            {/* Live slug preview */}
            {name.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: "0.75rem",
                  color: valid ? "#a1a1aa" : "#f87171",
                }}
              >
                <span>Will be created as:</span>
                <code
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    padding: "1px 6px",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 4,
                    color: valid ? "#c4b5fd" : "#f87171",
                  }}
                >
                  {preview || "—"}
                </code>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              style={{
                padding: "10px 12px",
                background: "rgba(248, 113, 113, 0.10)",
                border: "1px solid rgba(248, 113, 113, 0.35)",
                borderRadius: 10,
                fontSize: "0.8rem",
                color: "#fca5a5",
                lineHeight: 1.45,
              }}
            >
              <strong style={{ color: "#f87171" }}>Error: </strong>
              {error}
            </div>
          )}

          {/* Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 4,
            }}
          >
            <button
              type="button"
              onClick={() => !creating && onClose()}
              disabled={creating}
              style={{
                padding: "10px 16px",
                background: "transparent",
                border: "1px solid #2a2a30",
                borderRadius: 10,
                color: "#a1a1aa",
                fontSize: "0.85rem",
                fontWeight: 500,
                cursor: creating ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                transition: "all 140ms ease",
              }}
              onMouseEnter={(e) => {
                if (!creating) {
                  e.currentTarget.style.borderColor = "#3a3a42";
                  e.currentTarget.style.color = "#f4f4f5";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#2a2a30";
                e.currentTarget.style.color = "#a1a1aa";
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => void submit()}
              disabled={!valid || creating}
              style={{
                padding: "10px 18px",
                background:
                  !valid || creating ? "#2a2a30" : "#4d6bfe",
                border: "1px solid transparent",
                borderRadius: 10,
                color: !valid || creating ? "#71717a" : "#ffffff",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: !valid || creating ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                transition: "all 140ms ease",
                boxShadow:
                  !valid || creating
                    ? "none"
                    : "0 4px 14px rgba(77, 107, 254, 0.35)",
              }}
              onMouseEnter={(e) => {
                if (valid && !creating) {
                  e.currentTarget.style.background = "#5f7bff";
                }
              }}
              onMouseLeave={(e) => {
                if (valid && !creating) {
                  e.currentTarget.style.background = "#4d6bfe";
                }
              }}
            >
              {creating ? "Creating…" : "Create Endpoint"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
