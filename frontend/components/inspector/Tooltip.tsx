"use client";

import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import type { ReactElement, KeyboardEvent } from "react";
import styles from "./Tooltip.module.css";

type Side = "top" | "bottom" | "left" | "right";

interface Props {
  /** Tooltip text. Empty string → renders children without a tooltip. */
  content: string;
  /** Single focusable element (button, link, etc.). */
  children: ReactElement;
  /** Which side of the child the tooltip appears on. */
  side?: Side;
  /** Hover delay in ms. Focus uses min(delay, 150). */
  delay?: number;
}

/**
 * Tooltip
 * -------
 * Accessible, dark-UI matched tooltip for icon-only controls.
 *
 * Behaviour:
 *   - Hover: appears after `delay` ms (default 400) to prevent accidental spam.
 *   - Focus: appears after 150 ms (keyboard users get faster feedback).
 *   - Escape: dismisses immediately.
 *   - Touch: hover/focus do not fire reliably → no tooltip shown (child's
 *     aria-label still covers accessibility).
 *   - Respects prefers-reduced-motion via globals.css reset.
 */
export function Tooltip({
  content,
  children,
  side = "top",
  delay = 400,
}: Props) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<number | null>(null);
  const id = useId();

  const cancel = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const show = (ms: number) => {
    cancel();
    timerRef.current = window.setTimeout(() => setOpen(true), ms);
  };

  const hide = () => {
    cancel();
    setOpen(false);
  };

  useEffect(() => cancel, []);

  if (!content) return children;

  const child = isValidElement(children)
    ? cloneElement(children, {
        "aria-describedby": open ? id : undefined,
      } as Record<string, unknown>)
    : children;

  return (
    <span
      className={styles.wrap}
      onMouseEnter={() => show(delay)}
      onMouseLeave={hide}
      onFocus={() => show(Math.min(delay, 150))}
      onBlur={hide}
      onKeyDown={(e: KeyboardEvent<HTMLSpanElement>) => {
        if (e.key === "Escape") hide();
      }}
    >
      {child}
      {open && (
        <span
          role="tooltip"
          id={id}
          className={`${styles.tip} ${styles[side]}`}
        >
          {content}
        </span>
      )}
    </span>
  );
}