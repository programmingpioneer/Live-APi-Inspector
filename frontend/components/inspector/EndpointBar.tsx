"use client";

import { useState } from "react";
import { toast } from "@/components/Toast";

interface Props {
  slug: string;
  url: string;
  requestCount: number;
  live: boolean;
  onNewEndpoint: () => void;
}

export function EndpointBar({
  slug,
  url,
  requestCount,
  live,
  onNewEndpoint,
}: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.show("URL copied to clipboard", "info", 2000);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.show("Clipboard blocked — copy manually", "warn", 3000);
    }
  };

  return (
    <div
     style={{
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "10px 18px",
  borderBottom: "1px solid var(--border, #2a2b30)",   
  background: "var(--bg-elevated, #0f0f11)",
  color: "var(--text, #f4f4f5)",
  flexWrap: "wrap",
}}
    >
      {/* Live dot + slug */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          minWidth: 0,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: live
              ? "var(--live, #24d17a)"
              : "var(--warn, #f59e0b)",
            boxShadow: live
              ? "0 0 0 3px rgba(36, 209, 122, 0.22)"
              : "none",
            flexShrink: 0,
          }}
        />
        <strong
          style={{
            fontSize: "0.85rem",
            fontFamily: "var(--font-mono), monospace",
            color: "var(--text, #0d0d0d)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {slug}
        </strong>
      </div>

      {/* Copy icon button */}
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy endpoint URL"}
        title={copied ? "Copied!" : "Copy endpoint URL"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "5px 10px",
          background: "transparent",
          border: "1px solid var(--border, #e5e5e5)",
          borderRadius: 8,
          color: copied
            ? "var(--success, #10b981)"
            : "var(--text-secondary, #666)",
          fontSize: "0.72rem",
          fontFamily: "inherit",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 140ms ease",
        }}
      >
        {copied ? (
          <>
            <CheckIcon /> Copied
          </>
        ) : (
          <>
            <CopyIcon /> Copy URL
          </>
        )}
      </button>

      {/* Right side */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginLeft: "auto",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: "0.72rem",
            color: "var(--text-muted, #888)",
            fontFamily: "var(--font-mono), monospace",
          }}
        >
          {requestCount} {requestCount === 1 ? "req" : "reqs"}
        </span>

        <button
          type="button"
          onClick={onNewEndpoint}
          style={{
            padding: "6px 14px",
            background: "var(--accent, #4d6bfe)",
            border: "1px solid transparent",
            borderRadius: 8,
            color: "#ffffff",
            fontSize: "0.78rem",
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: "pointer",
            transition: "all 140ms ease",
            boxShadow: "0 2px 8px rgba(77, 107, 254, 0.25)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          + New Endpoint
        </button>
      </div>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <rect
        x="5"
        y="5"
        width="9"
        height="9"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="m3 8 3.5 3.5L13 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
