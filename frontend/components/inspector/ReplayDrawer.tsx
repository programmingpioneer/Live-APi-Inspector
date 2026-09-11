"use client";

import { useEffect, useRef, useState } from "react";
import { replayRequest } from "@/lib/api";
import { toast } from "@/components/Toast";
import type { CapturedRequest, ReplayState } from "@/lib/types";
import styles from "./ReplayDrawer.module.css";

interface Props {
  request: CapturedRequest | null;
  onClose: () => void;
}

export function ReplayDrawer({ request, onClose }: Props) {
  const [state, setState] = useState<ReplayState>({ status: "idle" });
  const [target, setTarget] = useState("");
  const [method, setMethod] = useState("POST");
  const [body, setBody] = useState("");
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const inFlightRef = useRef<string | null>(null);

  useEffect(() => {
    if (request) {
      inFlightRef.current = null; // cancel stale in-flight state writes
      setTarget("https://your-app.com/webhooks/receive");
      setMethod(request.method);
      setBody(JSON.stringify(request.body, null, 2));
      setState({ status: "idle" });
    }
  }, [request]);

  useEffect(() => {
    if (!request) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [request, onClose]);

  if (!request) return null;

  async function send() {
    if (!request) return;
    const thisId = request.id;
    inFlightRef.current = thisId;
    setState({ status: "sending" });
    try {
      const result = await replayRequest(thisId, target);
      if (inFlightRef.current !== thisId) return; // stale
      setState({ status: "success", statusCode: result.status });
      toast.show(
        `Replayed — ${result.status} ${result.statusText}`,
        "success",
        2500,
      );
    } catch (err) {
      if (inFlightRef.current !== thisId) return; // stale
      const msg = (err as Error).message;
      setState({ status: "error", message: msg });
      toast.show("Replay failed", "warn", 3000);
    }
  }

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <aside
        className={styles.drawer}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="replay-title"
      >
        <header className={styles.head}>
          <h2 id="replay-title" className={styles.title}>
            Replay Request
          </h2>
          <button
            ref={closeRef}
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className={styles.body}>
          <Field label="Target URL">
            <input
              className={styles.input}
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="https://your-app.com/webhooks/receive"
            />
          </Field>

          <Field label="Method">
            <select
              className={styles.select}
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Headers">
            <div className={styles.headers}>
              {request.headers.slice(0, 4).map((h) => (
                <div key={h.key} className={styles.headerRow}>
                  <span className={styles.headerKey}>{h.key}</span>
                  <span className={styles.headerVal}>{h.value}</span>
                </div>
              ))}
            </div>
          </Field>

          <Field label="Body">
            <textarea
              className={styles.textarea}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              spellCheck={false}
            />
          </Field>

          {state.status === "success" && (
            <div className={`${styles.note} ${styles.noteOk}`}>
              <span className="dot dot--live" /> Request replayed successfully —
              {" "}
              <code>{state.statusCode} OK</code>
            </div>
          )}
          {state.status === "error" && (
            <div className={`${styles.note} ${styles.noteWarn}`}>
              <span
                className="dot"
                style={{ background: "var(--warn)" }}
              />{" "}
              {state.message}
            </div>
          )}
        </div>

        <footer className={styles.foot}>
          <button className={styles.cancel} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.send}
            onClick={send}
            disabled={state.status === "sending"}
          >
            {state.status === "sending" ? "Sending…" : "Send Request"}
          </button>
        </footer>
      </aside>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      {children}
    </label>
  );
}
