"use client";

import { useState } from "react";
import type { CapturedRequest } from "@/lib/types";
import { formatBytes, relativeTime } from "@/lib/mock-data";
import styles from "./MetadataPanel.module.css";

interface Props {
  request: CapturedRequest | null;
}

export function MetadataPanel({ request }: Props) {
  const [networkOpen, setNetworkOpen] = useState(true);
  const [payloadOpen, setPayloadOpen] = useState(true);

  if (!request) {
    return (
      <div className={styles.wrap}>
        <div className={styles.head}>Metadata</div>
        <div className={styles.empty}>Select a request to view metadata.</div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>Metadata</div>

      <Section
        title="Request"
        open={true}
        onToggle={() => {}}
      >
        <Row k="Request ID" v={request.id} />
        <Row k="Method" v={request.method} />
        <Row k="HTTP Version" v={request.httpVersion} />
        <Row k="Timestamp" v={relativeTime(request.timestamp)} />
      </Section>

      <Section
        title="Network"
        open={networkOpen}
        onToggle={() => setNetworkOpen((v) => !v)}
      >
        <Row k="IP Address" v={request.ip} />
        <Row k="User Agent" v={request.userAgent} />
      </Section>

      <Section
        title="Payload"
        open={payloadOpen}
        onToggle={() => setPayloadOpen((v) => !v)}
      >
        <Row k="Content Type" v={request.contentType} />
        <Row k="Content Length" v={formatBytes(request.size)} />
        <Row k="Duration" v={`${request.duration} ms`} />
      </Section>
    </div>
  );
}

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.section}>
      <button className={styles.sectionHead} onClick={onToggle}>
        <span>{title}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
          style={{
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <path
            d="m6 4 4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && <div className={styles.sectionBody}>{children}</div>}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className={styles.row}>
      <span className={styles.k}>{k}</span>
      <span className={styles.v} title={v}>
        {v}
      </span>
    </div>
  );
}
