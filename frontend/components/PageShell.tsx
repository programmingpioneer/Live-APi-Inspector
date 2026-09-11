"use client";

import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import styles from "../app/pages.module.css";

interface Props {
  eyebrow?: string;
  title: string;
  lead?: string;
  children: ReactNode;
}

/**
 * PageShell
 * ---------
 * Shared wrapper for all content pages: Navbar + hero + content + Footer.
 * Provides the animated 3D background orbs + container.
 */
export function PageShell({ eyebrow, title, lead, children }: Props) {
  return (
    <>
      <Navbar />
      <main className={styles.wrap}>
        <div className={styles.orbA + " " + styles.orb} aria-hidden />
        <div className={styles.orbB + " " + styles.orb} aria-hidden />

        <div className={styles.inner}>
          <header className={styles.hero}>
            {eyebrow && (
              <span className={styles.eyebrow}>
                <span className={styles.eyebrowDot} aria-hidden />
                {eyebrow}
              </span>
            )}
            <h1 className={styles.title}>{title}</h1>
            {lead && <p className={styles.lead}>{lead}</p>}
          </header>

          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
