"use client";

import { formatBytes, relativeTime } from "@/lib/mock-data";
import type { CapturedRequest, HttpMethod } from "@/lib/types";
import styles from "./RequestList.module.css";
import { Tooltip } from "./Tooltip";

interface Props {
  requests: CapturedRequest[];
  totalCount: number;
  selectedId: string | null;
  filter: "ALL" | HttpMethod;
  onFilter: (f: "ALL" | HttpMethod) => void;
  query: string;
  onQuery: (q: string) => void;
  onSelect: (id: string) => void;
  filters: Array<"ALL" | HttpMethod>;
  loading?: boolean;
}

export function RequestList({
  requests,
  totalCount,
  selectedId,
  filter,
  onFilter,
  query,
  onQuery,
  onSelect,
  filters,
  loading,
}: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <span className={styles.headTitle}>Incoming Requests</span>
        <span className={styles.headCount}>{totalCount}</span>
      </div>

      <div className={styles.searchRow}>
        <SearchIcon />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search requests..."
          className={styles.search}
          aria-label="Search requests"
        />
        {query && (
          <Tooltip content="Clear search" side="bottom">
            <button
              className={styles.clear}
              onClick={() => onQuery("")}
              aria-label="Clear search"
            >
              ×
            </button>
          </Tooltip>
        )}
      </div>

      <div className={styles.filters} role="tablist" aria-label="Filter by method">
        {filters.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={f === filter}
            className={`${styles.chip} ${f === filter ? styles.chipOn : ""}`}
            onClick={() => onFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className={styles.listWrap}>
        {loading ? (
          <Skeletons />
        ) : requests.length === 0 ? (
          <EmptyList hasQuery={!!query} />
        ) : (
          <ul className={styles.list}>
            {requests.map((r) => (
              <li key={r.id}>
                <button
                  className={`${styles.item} ${
                    r.id === selectedId ? styles.itemActive : ""
                  }`}
                  onClick={() => onSelect(r.id)}
                >
                  <div className={styles.itemTop}>
                    <span className={`${styles.method} ${styles[`m${r.method}`]}`}>
                      {r.method}
                    </span>
                    <span className={styles.path}>{r.path}</span>
                  </div>
                  <div className={styles.itemBottom}>
                    <span className={styles.status}>{r.status}</span>
                    <span className={styles.dotSep}>·</span>
                    <span>{formatBytes(r.size)}</span>
                    <span className={styles.dotSep}>·</span>
                    <span>{relativeTime(r.timestamp)}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Skeletons() {
  return (
    <div className={styles.skels}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.skelItem}>
          <div className={`skeleton ${styles.skelRow1}`} />
          <div className={`skeleton ${styles.skelRow2}`} />
        </div>
      ))}
    </div>
  );
}

function EmptyList({ hasQuery }: { hasQuery: boolean }) {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon}>∅</span>
      <p>{hasQuery ? "No requests match your search." : "No requests yet."}</p>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
