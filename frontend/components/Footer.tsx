"use client";

import Link from "next/link";
import { Reveal } from "./Reveal";
import styles from "./Footer.module.css";

/** TODO: apna GitHub repo URL yahan daalo */
const GITHUB_URL = "https://github.com/your-username/devtoll";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Reveal direction="fade" className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <strong>Live API Inspector</strong>
          <p>Inspect every request, live.</p>
        </div>

        <div className={styles.cols}>
          <div>
            <span>Product</span>
            <Link href="/features">Features</Link>
            <Link href="/product">Product</Link>
            <Link href="/pricing">Pricing</Link>
          </div>
          <div>
            <span>Developers</span>
            <Link href="/docs">Documentation</Link>
            <Link href="/docs">API Reference</Link>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
          <div>
            <span>Company</span>
            <Link href="/about">About</Link>
            <Link href="/changelog">Changelog</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </Reveal>

      <Reveal
        direction="fade"
        delay={120}
        className={`container ${styles.bottom}`}
      >
        <span>© {new Date().getFullYear()} Live API Inspector</span>
        <div className={styles.legal}>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </Reveal>
    </footer>
  );
}