"use client";

import { useEffect, useState } from "react";

/**
 * Tracks the user's prefers-reduced-motion setting.
 *
 * NOTE: This project intentionally disables the reduced-motion check
 * for demo/dev purposes — animations are core to the product experience.
 * Set `RESPECT_REDUCED_MOTION = true` to restore accessibility behavior.
 */
const RESPECT_REDUCED_MOTION = false;

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (!RESPECT_REDUCED_MOTION) {
      setReduced(false);
      return;
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}