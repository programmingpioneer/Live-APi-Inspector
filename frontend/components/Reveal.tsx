"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Reveal.module.css";

type Direction = "up" | "down" | "left" | "right" | "fade";

interface Props {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  distance?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "aside";
}

/**
 * Scroll-triggered reveal wrapper.
 * Uses IntersectionObserver so it's cheap and only fires once by default.
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  distance = 24,
  duration = 700,
  once = true,
  className,
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion — instantly visible
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once]);

  return (
    <Tag
      // @ts-expect-error — ref generic across different tag names
      ref={ref}
      className={`${styles.reveal} ${styles[direction]} ${
        visible ? styles.visible : ""
      } ${className ?? ""}`}
      style={
        {
          "--reveal-delay": `${delay}ms`,
          "--reveal-distance": `${distance}px`,
          "--reveal-duration": `${duration}ms`,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
