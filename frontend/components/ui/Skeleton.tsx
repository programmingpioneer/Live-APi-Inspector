"use client";

import type { CSSProperties } from "react";
import styles from "./Skeleton.module.css";

interface Props {
  /** CSS width — number (px) or string ("40%", "120px") */
  width?: number | string;
  /** CSS height — number (px) or string */
  height?: number | string;
  /** Border-radius override */
  radius?: number | string;
  /** Extra inline styles (margin, etc.) */
  style?: CSSProperties;
  /** Skip the shimmer animation */
  static?: boolean;
  className?: string;
}

/**
 * Skeleton
 * --------
 * Reusable placeholder block matching the project's existing
 * `.skeleton` visual language (subtle dark surface + low-contrast shimmer).
 */
export function Skeleton({
  width,
  height = 12,
  radius = 6,
  style,
  static: isStatic,
  className,
}: Props) {
  return (
    <span
      aria-hidden
      className={
        (isStatic ? styles.blockStatic : styles.block) +
        (className ? " " + className : "")
      }
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius:
          typeof radius === "number" ? `${radius}px` : radius,
        ...style,
      }}
    />
  );
}