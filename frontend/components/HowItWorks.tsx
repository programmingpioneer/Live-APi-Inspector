"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import styles from "./HowItWorks.module.css";

const STEPS = [
  {
    n: "01",
    title: "Generate Endpoint",
    desc: "Create a unique inspection URL in seconds. No signup, no config.",
  },
  {
    n: "02",
    title: "Send Request",
    desc: "Point your webhook or API request at the generated endpoint.",
  },
  {
    n: "03",
    title: "Inspect Live",
    desc: "Watch the request appear instantly and inspect every detail.",
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const DIRECTIONS = ["left", "up", "right"] as const;

  return (
    <section id="product" className={styles.section}>
      <div className="container">
        <Reveal as="section" direction="up" className={styles.head}>
          <span className="eyebrow">How it works</span>
          <h2 className="h-section">Three steps. Zero friction.</h2>
        </Reveal>

        <div className={styles.track} ref={trackRef}>
          <span className={styles.line} aria-hidden>
            <span className={`${styles.lineFlow} ${active ? styles.lineFlowOn : ""}`} />
          </span>

          {STEPS.map((s, i) => (
            <Reveal
              key={s.n}
              as="article"
              direction={DIRECTIONS[i] ?? "up"}
              delay={i * 100}
              className={styles.step}
            >
              <span className={styles.num}>{s.n}</span>
              <h3 className="h-card">{s.title}</h3>
              <p>{s.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
