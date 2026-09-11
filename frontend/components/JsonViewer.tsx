"use client";

import { useMemo, useState } from "react";
import { copyText } from "@/lib/utils";
import styles from "./JsonViewer.module.css";

interface Props {
  data: unknown;
  defaultRaw?: boolean;
}

/**
 * Structured JSON viewer with line numbers, syntax tokens,
 * copy + formatted/raw toggle. Handles arbitrary depth.
 */
export function JsonViewer({ data, defaultRaw = false }: Props) {
  const [raw, setRaw] = useState(defaultRaw);
  const [copied, setCopied] = useState(false);

  const formatted = useMemo(() => JSON.stringify(data, null, 2), [data]);
  const rawString = useMemo(() => JSON.stringify(data), [data]);
  const lines = useMemo(() => formatted.split("\n"), [formatted]);

  async function handleCopy() {
    const ok = await copyText(raw ? rawString : formatted);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1300);
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <span className={styles.lang}>JSON</span>
        <div className={styles.actions}>
          <button
            className={`${styles.toggle} ${!raw ? styles.toggleOn : ""}`}
            onClick={() => setRaw(false)}
          >
            Formatted
          </button>
          <button
            className={`${styles.toggle} ${raw ? styles.toggleOn : ""}`}
            onClick={() => setRaw(true)}
          >
            Raw
          </button>
          <button className={styles.copy} onClick={handleCopy}>
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className={styles.body}>
        {raw ? (
          <pre className={styles.raw}>{rawString}</pre>
        ) : (
          <pre className={styles.pre}>
            {lines.map((line, i) => (
              <div key={i} className={styles.line}>
                <span className={styles.ln}>{i + 1}</span>
                <span className={styles.code}>{highlight(line)}</span>
              </div>
            ))}
          </pre>
        )}
      </div>
    </div>
  );
}

/** Minimal JSON syntax highlighter — returns spans for one line. */
function highlight(line: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const re = /("(?:\\.|[^"\\])*")(\s*:)?|(\b-?\d+(?:\.\d+)?\b)|\b(true|false|null)\b|([{}[\],])/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;

  while ((m = re.exec(line)) !== null) {
    if (m.index > last) {
      parts.push(<span key={key++}>{line.slice(last, m.index)}</span>);
    }
    if (m[1] && m[2]) {
      // key
      parts.push(
        <span key={key++} className={styles.k}>
          {m[1]}
        </span>
      );
      parts.push(
        <span key={key++} className={styles.p}>
          {m[2]}
        </span>
      );
    } else if (m[1]) {
      // string value
      parts.push(
        <span key={key++} className={styles.s}>
          {m[1]}
        </span>
      );
    } else if (m[3]) {
      parts.push(
        <span key={key++} className={styles.n}>
          {m[3]}
        </span>
      );
    } else if (m[4]) {
      parts.push(
        <span key={key++} className={styles.b}>
          {m[4]}
        </span>
      );
    } else if (m[5]) {
      parts.push(
        <span key={key++} className={styles.p}>
          {m[5]}
        </span>
      );
    }
    last = re.lastIndex;
  }
  if (last < line.length) parts.push(<span key={key++}>{line.slice(last)}</span>);
  return parts;
}
