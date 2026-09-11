"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { RequestDetailsSkeleton } from "./RequestDetailsSkeleton";
import { MetadataSkeleton } from "./MetadataSkeleton";
import styles from "./InspectorShell.module.css";

/**
 * WorkspaceSkeleton
 * -----------------
 * Full 3-column placeholder matching the workspace grid.
 * Reuses the shell's .workspace class so responsive behaviour
 * and column widths remain identical.
 */
export function WorkspaceSkeleton() {
  return (
    <div className={styles.workspace} data-mobile-panel="list">
      {/* LEFT: request list */}
      <div className={styles.colList}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "14px 16px",
            gap: 16,
          }}
          aria-busy="true"
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Skeleton width={120} height={12} />
            <Skeleton width={28} height={16} radius={999} />
          </div>

          {/* Search input */}
          <Skeleton width="100%" height={32} radius={8} />

          {/* Filter chips */}
          <div style={{ display: "flex", gap: 6 }}>
            {[38, 42, 44, 40, 48].map((w, i) => (
              <Skeleton key={i} width={w} height={22} radius={999} />
            ))}
          </div>

          {/* Request rows */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginTop: 4,
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  padding: "10px 12px",
                  background: "var(--surface, transparent)",
                  border: "1px solid var(--border, #e5e5e5)",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <Skeleton width={36} height={16} radius={4} />
                  <Skeleton width="60%" height={12} />
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <Skeleton width={26} height={10} />
                  <Skeleton width={40} height={10} />
                  <Skeleton width={44} height={10} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CENTER: request details */}
      <div className={styles.colDetails}>
        <RequestDetailsSkeleton />
      </div>

      {/* RIGHT: metadata */}
      <div className={styles.colMeta}>
        <MetadataSkeleton />
      </div>
    </div>
  );
}