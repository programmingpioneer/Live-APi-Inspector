"use client";

import { Skeleton } from "@/components/ui/Skeleton";

/**
 * EndpointBarSkeleton
 * -------------------
 * Mirror of the EndpointBar structure while the endpoint metadata loads.
 * Same height, paddings, and element widths.
 */
export function EndpointBarSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 18px",
        borderBottom: "1px solid var(--border, #e5e5e5)",
        background: "var(--bg-elevated, #fff)",
        flexWrap: "wrap",
      }}
    >
      {/* Live dot + slug */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <Skeleton width={8} height={8} radius="50%" />
        <Skeleton width={110} height={14} />
      </div>

      {/* Copy URL button */}
      <Skeleton width={84} height={26} radius={8} />

      {/* Right side */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginLeft: "auto",
          flexShrink: 0,
        }}
      >
        <Skeleton width={52} height={12} />
        <Skeleton width={120} height={28} radius={8} />
      </div>

      <span
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        Loading endpoint details…
      </span>
    </div>
  );
}