"use client";

import { Skeleton } from "@/components/ui/Skeleton";

const ROWS = 7;

/**
 * MetadataSkeleton
 * ----------------
 * Right column placeholder while metadata is loading.
 * Same row structure as MetadataPanel.
 */
export function MetadataSkeleton() {
  return (
    <div
      aria-busy="true"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "16px 18px",
        gap: 14,
      }}
    >
      {/* Section heading */}
      <Skeleton width={70} height={11} />

      {/* Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {Array.from({ length: ROWS }).map((_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Skeleton width={70} height={11} />
            <Skeleton width={90 + (i % 3) * 20} height={11} />
          </div>
        ))}
      </div>
    </div>
  );
}