"use client";

import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/utils";
import styles from "./HeroPreview.module.css";

const STREAM = [
  { method: "POST", path: "/webhook", status: 200, size: "2.1 KB", ago: "3 sec ago" },
  { method: "POST", path: "/stripe", status: 200, size: "4.8 KB", ago: "7 sec ago" },
  { method: "GET", path: "/callback", status: 200, size: "1.2 KB", ago: "12 sec ago" },
];

const JSON_SNIPPET = [
  ["{", ""],
  ['  "event"', ': "payment.completed",'],
  ['  "id"', ': "evt_8x92a",'],
  ['  "customer"', ": {"],
  ['    "email"', ': "developer@example.com"'],
  ["  }", ","],
  ['  "amount"', ": 4999"],
  ["}", ""],
];

const ENDPOINT = "https://inspect.dev/api/v1/inspect/demo-8x91";

export function HeroPreview() {
  const [count, setCount] = useState(128);
  const [copied, setCopied] = useState(false);
  const [tick, setTick] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setCount((c) => c + 1);
      setTick((t) => (t + 1) % STREAM.length);
    }, 4200);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  async function handleCopy() {
    const ok = await copyText(ENDPOINT);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    }
  }

  return (
    <div className={styles.frame}>
      <div className={styles.chrome}>
        <span className={styles.traffic}>
          <i style={{ background: "#3a3a44" }} />
          <i style={{ background: "#3a3a44" }} />
          <i style={{ background: "#3a3a44" }} />
        </span>
        <span className={styles.chromeTitle}>inspect.dev — live</span>
        <span className={styles.chromeSpacer} />
      </div>

      <div className={styles.endpointBar}>
        <span className={styles.method}>ENDPOINT</span>
        <code className={styles.endpoint}>{ENDPOINT}</code>
        <button
          className={`${styles.copyBtn} ${copied ? styles.copied : ""}`}
          onClick={handleCopy}
          aria-label="Copy endpoint"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className={styles.status}>
        <span className={styles.statusLive}>
          <span className="dot dot--live" /> Listening
        </span>
        <span className={styles.count}>{count} requests</span>
      </div>

      <div className={styles.body}>
        <div className={styles.stream}>
          <div className={styles.streamHead}>Request stream</div>
          <ul className={styles.streamList}>
            {STREAM.map((r, i) => (
              <li
                key={r.path}
                className={`${styles.streamItem} ${
                  i === tick ? styles.flash : ""
                }`}
              >
                <span className={styles.m}>{r.method}</span>
                <span className={styles.p}>{r.path}</span>
                <span className={styles.s}>{r.status}</span>
                <span className={styles.z}>{r.size}</span>
                <span className={styles.a}>{r.ago}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.json}>
          <div className={styles.jsonHead}>
            <span>JSON preview</span>
            <span className={styles.jsonBadge}>POST /webhook</span>
          </div>
          <pre className={styles.jsonBody}>
            {JSON_SNIPPET.map(([k, v], i) => (
              <div key={i} className={styles.line}>
                <span className={styles.ln}>{i + 1}</span>
                <span className={styles.k}>{k}</span>
                <span className={styles.v}>{v}</span>
              </div>
            ))}
          </pre>
        </div>
      </div>

      <div className={styles.glow} aria-hidden />
    </div>
  );
}
