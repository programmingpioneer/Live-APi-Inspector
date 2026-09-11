"use client";

import { Skeleton } from "@/components/ui/Skeleton";

/**
 * RequestDetailsSkeleton
 * ----------------------
 * Placeholder for the middle details column while the selected
 * request's full payload is being loaded.
 */
export function RequestDetailsSkeleton() {
  return (
    <div
      aria-busy="true"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "20px 22px",
        gap: 20,
        overflow: "hidden",
      }}
    >
      {/* Header row: method + path */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Skeleton width={48} height={20} radius={6} />
        <Skeleton width="55%" height={16} />
      </div>

      {/* Status row: status code + timestamp */}
      <div style={{ display: "flex", gap: 14 }}>
        <Skeleton width={70} height={12} />
        <Skeleton width={90} height={12} />
      </div>

      {/* Tabs row */}
      <div
        style={{
          display: "flex",
          gap: 8,
          borderBottom: "1px solid var(--border, #e5e5e5)",
          paddingBottom: 10,
        }}
      >
        {[60, 72, 58, 50, 44].map((w, i) => (
          <Skeleton key={i} width={w} height={14} />
        ))}
      </div>

      {/* JSON / code body — fake line numbers + code */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginTop: 4,
        }}
      >
        {[
          [40, "30%", "20%"],
          [40, "55%"],
          [40, "45%", "25%"],
          [40, "35%"],
          [40, "60%", "15%"],
          [40, "25%"],
        ].map((parts, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            {/* Line number */}
            <Skeleton width={24} height={12} />
            {/* Code chunks */}
            {parts.map((w, j) => (
              <Skeleton key={j} width={w as number | string} height={12} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}