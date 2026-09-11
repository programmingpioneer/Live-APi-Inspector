"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";


const GITHUB_URL = "https://github.com/programmingpioneer";

const NAV_LINKS = [
  { href: "/product", label: "Product" },
  { href: "/features", label: "Features" },
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        <Link
          href="/"
          className={styles.logo}
          aria-label="Live API Inspector home"
          onClick={close}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className={styles.logoMark}
          >
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="5"
              stroke="currentColor"
              strokeWidth="1.6"
              opacity="0.35"
            />
            <circle cx="12" cy="12" r="2.6" fill="currentColor" />
            <circle
              cx="12"
              cy="12"
              r="6.4"
              stroke="currentColor"
              strokeWidth="1.4"
              opacity="0.5"
            />
          </svg>
          <span>Live&nbsp;API&nbsp;Inspector</span>
        </Link>

        <nav className={styles.center} aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={styles.link}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className={styles.right}>
          <a
            href={GITHUB_URL}
            className={styles.ghost}
            aria-label="GitHub repository"
            title="GitHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.69-3.88-1.36-3.88-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.18-1.49 3.14-1.18 3.14-1.18.63 1.59.24 2.77.12 3.06.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
          </a>

          <Link href="/endpoints" className={styles.cta}>
            Open Inspector
          </Link>

          <button
            type="button"
            className={`${styles.burger} ${open ? styles.burgerOpen : ""}`}
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {open && (
        <nav className={styles.mobileMenu} aria-label="Mobile">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={close}>
              {l.label}
            </Link>
          ))}
          <Link href="/endpoints" className={styles.mobileCta} onClick={close}>
            Open Inspector
          </Link>
        </nav>
      )}
    </header>
  );
}