"use client";

import { useState } from "react";
import { toast } from "@/components/Toast";

interface Props {
  slug: string;
  url: string;
  live: boolean;
  onNewEndpoint: () => void;
}

export function WaitingView({ url, live, onNewEndpoint }: Props) {
  const [tab, setTab] = useState<"curl" | "powershell">("curl");
  const [copied, setCopied] = useState<"url" | "cmd" | null>(null);

  const curlCmd =
    "curl -X POST " +
    url +
    " \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"hello\":\"world\"}'";

  const psCmd =
    "Invoke-RestMethod -Uri \"" +
    url +
    "\" `\n  -Method Post `\n  -ContentType \"application/json\" `\n  -Body '{\"hello\":\"world\"}'";

  const activeCmd = tab === "curl" ? curlCmd : psCmd;

  const copy = async (text: string, kind: "url" | "cmd", label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      toast.show(label + " copied", "info", 2000);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      toast.show("Clipboard blocked", "warn", 2000);
    }
  };

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        position: "relative",
        background: "#0a0a0b",
        color: "#f4f4f5",
      }}
    >
      <style>{`
        @keyframes bds-wv-grid {
          from { background-position: 0 0; }
          to   { background-position: 60px 60px; }
        }
        @keyframes bds-wv-float {
          0%, 100% { transform: translateY(0) rotateX(0deg); }
          50%      { transform: translateY(-10px) rotateX(2deg); }
        }
        @keyframes bds-wv-ring {
          0%   { transform: scale(0.85); opacity: 0.7; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes bds-wv-orbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes bds-wv-glow {
          0%, 100% { opacity: 0.5; }
          50%      { opacity: 0.85; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bds-wv-float, .bds-wv-ring, .bds-wv-orbit, .bds-wv-grid { animation: none !important; }
        }
      `}</style>

      {/* Animated grid backdrop */}
      <div
        className="bds-wv-grid"
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(77,107,254,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(77,107,254,0.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          animation: "bds-wv-grid 8s linear infinite",
          maskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 75%)",
          pointerEvents: "none",
        }}
      />

      {/* Radial glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(77,107,254,0.22) 0%, transparent 65%)",
          filter: "blur(20px)",
          animation: "bds-wv-glow 5s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 720,
          margin: "0 auto",
          padding: "56px 24px 64px",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {/* 3D Orb */}
        <div
          className="bds-wv-float"
          aria-hidden
          style={{
            display: "grid",
            placeItems: "center",
            perspective: 800,
            animation: "bds-wv-float 5s ease-in-out infinite",
          }}
        >
          <div
            style={{
              position: "relative",
              width: 110,
              height: 110,
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="bds-wv-orbit"
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "1px dashed rgba(196,181,253,0.35)",
                animation: "bds-wv-orbit 24s linear infinite",
              }}
            />
            <div
              className="bds-wv-ring"
              style={{
                position: "absolute",
                inset: 10,
                borderRadius: "50%",
                border: "1.5px solid #7d92ff",
                animation: "bds-wv-ring 2.4s ease-out infinite",
              }}
            />
            <div
              className="bds-wv-ring"
              style={{
                position: "absolute",
                inset: 10,
                borderRadius: "50%",
                border: "1.5px solid #7d92ff",
                animation: "bds-wv-ring 2.4s ease-out infinite 1.2s",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 18,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 30% 25%, #9aadff 0%, #4d6bfe 45%, #2f4ad1 100%)",
                boxShadow:
                  "0 20px 60px rgba(77,107,254,0.55), 0 0 0 1px rgba(255,255,255,0.08) inset, 0 -10px 24px rgba(0,0,0,0.35) inset, 0 10px 24px rgba(255,255,255,0.08) inset",
                display: "grid",
                placeItems: "center",
                fontSize: 26,
              }}
            >
              📡
            </div>
          </div>
        </div>

        {/* Heading */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              borderRadius: 999,
              background: live
                ? "rgba(36, 209, 122, 0.14)"
                : "rgba(245, 158, 11, 0.14)",
              color: live ? "#4ade80" : "#fbbf24",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "currentColor",
                boxShadow: live
                  ? "0 0 8px rgba(74,222,128,0.8)"
                  : "0 0 8px rgba(251,191,36,0.8)",
              }}
            />
            {live ? "CONNECTED" : "CONNECTING…"}
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "1.55rem",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#f4f4f5",
              lineHeight: 1.2,
            }}
          >
            Waiting for your first request
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              color: "#a1a1aa",
              maxWidth: 460,
              lineHeight: 1.55,
            }}
          >
            Send any HTTP request to your endpoint URL below and it will appear
            here <span style={{ color: "#c4b5fd", fontWeight: 600 }}>instantly</span>.
          </p>
        </div>

        {/* URL card */}
        <div
          style={{
            background: "rgba(20,20,24,0.7)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(77,107,254,0.28)",
            borderRadius: 14,
            padding: "18px 20px",
            boxShadow:
              "0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#a1a1aa",
              }}
            >
              Your Endpoint URL
            </span>
            <button
              type="button"
              onClick={() => copy(url, "url", "URL")}
              style={{
                padding: "5px 12px",
                background: copied === "url" ? "rgba(36,209,122,0.15)" : "transparent",
                border:
                  "1px solid " +
                  (copied === "url"
                    ? "rgba(36,209,122,0.5)"
                    : "rgba(255,255,255,0.14)"),
                borderRadius: 8,
                color: copied === "url" ? "#4ade80" : "#e4e4e7",
                fontSize: "0.72rem",
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
                transition: "all 140ms ease",
              }}
            >
              {copied === "url" ? "Copied ✓" : "Copy URL"}
            </button>
          </div>

          <code
            style={{
              display: "block",
              padding: "12px 14px",
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10,
              fontFamily: "var(--font-mono), monospace",
              fontSize: "0.82rem",
              color: "#c4b5fd",
              wordBreak: "break-all",
              lineHeight: 1.5,
            }}
          >
            {url}
          </code>
        </div>

        {/* Instructions */}
        <div
          style={{
            background: "rgba(20,20,24,0.7)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            padding: "20px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            boxShadow:
              "0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03) inset",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <h2
              style={{
                margin: 0,
                fontSize: "0.95rem",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: "#f4f4f5",
              }}
            >
              How to test
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: "0.8rem",
                color: "#a1a1aa",
                lineHeight: 1.5,
              }}
            >
              Copy the command below and run it in your terminal — the request
              streams in live.
            </p>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: 2,
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {(["curl", "powershell"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                style={{
                  padding: "8px 14px",
                  background: "transparent",
                  border: "none",
                  borderBottom:
                    t === tab
                      ? "2px solid #7d92ff"
                      : "2px solid transparent",
                  color: t === tab ? "#f4f4f5" : "#71717a",
                  fontSize: "0.75rem",
                  fontWeight: t === tab ? 600 : 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  marginBottom: -1,
                  transition: "all 140ms ease",
                }}
              >
                {t === "curl" ? "bash / curl" : "PowerShell"}
              </button>
            ))}
          </div>

          {/* Command block */}
          <div style={{ position: "relative" }}>
            <pre
              style={{
                margin: 0,
                padding: "14px 16px",
                paddingRight: 90,
                background: "rgba(0,0,0,0.55)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10,
                fontSize: "0.76rem",
                fontFamily: "var(--font-mono), monospace",
                lineHeight: 1.65,
                overflowX: "auto",
                color: "#e4e4e7",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {activeCmd}
            </pre>
            <button
              type="button"
              onClick={() => copy(activeCmd, "cmd", "Command")}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                padding: "5px 12px",
                background: "rgba(255,255,255,0.06)",
                border:
                  "1px solid " +
                  (copied === "cmd"
                    ? "rgba(36,209,122,0.5)"
                    : "rgba(255,255,255,0.12)"),
                borderRadius: 8,
                fontSize: "0.7rem",
                fontWeight: 600,
                color: copied === "cmd" ? "#4ade80" : "#e4e4e7",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 140ms ease",
              }}
            >
              {copied === "cmd" ? "Copied ✓" : "Copy"}
            </button>
          </div>

          {/* Steps */}
          <ol
            style={{
              margin: 0,
              paddingLeft: "1.2rem",
              fontSize: "0.82rem",
              color: "#a1a1aa",
              lineHeight: 1.65,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <li>
              Run the command (or POST from Postman, your app, anywhere)
            </li>
            <li>
              The request appears here{" "}
              <span style={{ color: "#c4b5fd", fontWeight: 600 }}>
                instantly
              </span>{" "}
              with headers, body, and metadata
            </li>
            <li>
              Click any request to inspect — or hit{" "}
              <span style={{ color: "#c4b5fd", fontWeight: 600 }}>Replay</span>{" "}
              to resend it
            </li>
          </ol>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 4,
          }}
        >
          <button
            type="button"
            onClick={onNewEndpoint}
            style={{
              padding: "9px 18px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 10,
              color: "#a1a1aa",
              fontSize: "0.78rem",
              fontWeight: 500,
              fontFamily: "inherit",
              cursor: "pointer",
              transition: "all 140ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(125,146,255,0.5)";
              e.currentTarget.style.color = "#f4f4f5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
              e.currentTarget.style.color = "#a1a1aa";
            }}
          >
            + Create another endpoint
          </button>
        </div>
      </div>
    </div>
  );
}
