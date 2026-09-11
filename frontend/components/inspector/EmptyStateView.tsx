"use client";

interface Props {
  slug: string;
  onNewEndpoint: () => void;
}

export function EmptyStateView({ slug, onNewEndpoint }: Props) {
  return (
    <div
      style={{
        flex: 1,
        display: "grid",
        placeItems: "center",
        padding: "48px 20px",
        background: "var(--bg, #fafafa)",
        overflowY: "auto",
      }}
    >
      <style>{`
        @keyframes bds-es-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes bds-es-orbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes bds-es-ring {
          0%   { transform: scale(0.85); opacity: 0.55; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bds-es-float, .bds-es-orbit, .bds-es-ring { animation: none !important; }
        }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 22,
        }}
      >
        {/* Orb */}
        <div
          className="bds-es-float"
          aria-hidden
          style={{
            position: "relative",
            width: 96,
            height: 96,
            animation: "bds-es-float 4s ease-in-out infinite",
          }}
        >
          <div
            className="bds-es-orbit"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "1px dashed var(--border-strong, #d4d4d8)",
              animation: "bds-es-orbit 20s linear infinite",
            }}
          />
          <div
            className="bds-es-ring"
            style={{
              position: "absolute",
              inset: 8,
              borderRadius: "50%",
              border: "1.5px solid var(--accent, #4d6bfe)",
              animation: "bds-es-ring 2.4s ease-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 16,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 30% 25%, #7d92ff 0%, #4d6bfe 45%, #2f4ad1 100%)",
              boxShadow:
                "0 12px 32px rgba(77,107,254,0.35), inset 0 -6px 12px rgba(0,0,0,0.2), inset 0 6px 12px rgba(255,255,255,0.15)",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            ⚡
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h1
            style={{
              margin: 0,
              fontSize: "1.4rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text, #0d0d0d)",
              lineHeight: 1.25,
            }}
          >
            No endpoint yet
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              lineHeight: 1.55,
              color: "var(--text-secondary, #666)",
              maxWidth: 380,
            }}
          >
            Create your first endpoint and get a unique URL to start receiving
            webhooks instantly.
          </p>
        </div>

        {/* Slug pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 999,
            background: "var(--surface-2, #f5f5f5)",
            border: "1px solid var(--border, #e5e5e5)",
            fontSize: "0.72rem",
            fontFamily: "var(--font-mono), monospace",
            color: "var(--text-muted, #888)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--text-muted, #888)",
            }}
          />
          <span>{slug}</span>
          <span style={{ opacity: 0.5 }}>· not found</span>
        </div>

        <button
          type="button"
          onClick={onNewEndpoint}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 22px",
            background: "var(--accent, #4d6bfe)",
            border: "none",
            borderRadius: 12,
            color: "#ffffff",
            fontSize: "0.9rem",
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(77, 107, 254, 0.32)",
            transition: "all 140ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow =
              "0 12px 32px rgba(77, 107, 254, 0.42)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 8px 24px rgba(77, 107, 254, 0.32)";
          }}
        >
          + Create your first endpoint
        </button>
      </div>
    </div>
  );
}
