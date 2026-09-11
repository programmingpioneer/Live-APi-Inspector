"use client";

import { useEffect, useState } from "react";

interface Props {
  onFinish: () => void;
}

const STEPS: { title: string; body: string; icon: string }[] = [
  {
    icon: "👋",
    title: "Welcome to API Inspector",
    body: "A real-time webhook & request inspector. Let's take 3 quick steps.",
  },
  {
    icon: "⚡",
    title: "Create an endpoint",
    body: "Sidebar se + dabao ya 'Create Endpoint'. Backend ek real URL dega jahan webhooks bhej sakte ho.",
  },
  {
    icon: "📡",
    title: "Send & watch live",
    body: "Endpoint ka URL copy karo, curl/Postman se POST bhejo — request yahan live appear hogi.",
  },
];

export default function OnboardingTour({ onFinish }: Props) {
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const current = STEPS[step]!;
  const isLast = step === STEPS.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      onClick={onFinish}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "grid",
        placeItems: "center",
        zIndex: 260,
        padding: 16,
        animation: "fadeIn 200ms ease both",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-scale-in"
        style={{
          width: "min(460px, calc(100vw - 32px))",
          background: "var(--surface, #fff)",
          border: "1px solid var(--border-strong, #d1d5db)",
          borderRadius: "var(--r-lg, 14px)",
          boxShadow: "var(--shadow-lg, 0 16px 40px rgba(0,0,0,0.25))",
          padding: "24px 22px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div
          aria-hidden
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "var(--accent-soft, rgba(77,107,254,0.12))",
            display: "grid",
            placeItems: "center",
            fontSize: 22,
          }}
        >
          {current.icon}
        </div>

        <h2
          id="onboarding-title"
          style={{
            margin: 0,
            fontSize: "1.05rem",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: "var(--text, #0d0d0d)",
          }}
        >
          {current.title}
        </h2>

        <p style={{ margin: 0, fontSize: "0.85rem", lineHeight: 1.5, color: "var(--text-secondary, #555)" }}>
          {current.body}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 6,
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 6 }} aria-hidden>
            {STEPS.map((_, i) => (
              <span
                key={i}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: i === step ? "var(--accent, #4d6bfe)" : "var(--border, #e5e5e5)",
                  transition: "background 200ms ease",
                }}
              />
            ))}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onFinish}
              style={{ fontSize: "0.78rem" }}
            >
              Skip
            </button>
            {isLast ? (
              <button type="button" className="btn btn-primary btn-sm" onClick={onFinish}>
                Got it
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setStep((s) => s + 1)}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}