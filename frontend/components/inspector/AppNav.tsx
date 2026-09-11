"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./InspectorShell.module.css";
import { Tooltip } from "./Tooltip";

const WS_KEY = "devtoll:workspaces:v1";
const WS_CURRENT_KEY = "devtoll:current-workspace:v1";
const THEME_KEY = "theme";

/** TODO: apna GitHub repo URL yahan daalo */
export const GITHUB_URL = "https://github.com/programmingpioneer";

interface Props {
  connection?: "connecting" | "connected" | "disconnected";
  onOpenPalette?: () => void;
  onOpenTour?: () => void;
  onExport?: () => void;
  exportDisabled?: boolean;
}

const NAV_LINKS = [
  { href: "/", label: "Inspector" },
  { href: "/endpoints", label: "Endpoints" },
  { href: "/docs", label: "Docs" },
];

export function AppNav({
  connection,
  onOpenPalette,
  onOpenTour,
  onExport,
  exportDisabled,
}: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState<"workspace" | "tools" | null>(null);
  const [workspaces, setWorkspaces] = useState<string[]>(["Personal"]);
  const [current, setCurrent] = useState("Personal");
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [hydrated, setHydrated] = useState(false);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      const rawWs = localStorage.getItem(WS_KEY);
      const ws: string[] | null = rawWs ? JSON.parse(rawWs) : null;
      if (Array.isArray(ws) && ws.length > 0) setWorkspaces(ws);
      const cw = localStorage.getItem(WS_CURRENT_KEY);
      if (cw && (ws ? ws.includes(cw) : true)) setCurrent(cw);
      const t = localStorage.getItem(THEME_KEY);
      if (t === "light" || t === "dark") {
        setTheme(t);
        document.documentElement.setAttribute("data-theme", t);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(WS_KEY, JSON.stringify(workspaces));
  }, [workspaces, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(WS_CURRENT_KEY, current);
  }, [current, hydrated]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    const onClick = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const applyTheme = (next: "dark" | "light") => {
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const createWorkspace = () => {
    const name = newName.trim();
    if (!name) return;
    if (!workspaces.includes(name)) setWorkspaces([...workspaces, name]);
    setCurrent(name);
    setCreating(false);
    setNewName("");
    setOpen(null);
  };

  const deleteWorkspace = (name: string) => {
    if (name === "Personal") return;
    const next = workspaces.filter((w) => w !== name);
    const safe = next.length ? next : ["Personal"];
    setWorkspaces(safe);
    if (current === name) setCurrent(safe[0]);
  };

  const tone =
    connection === "connected"
      ? "var(--live)"
      : connection === "connecting"
        ? "var(--warn)"
        : "var(--error)";
  const connClass =
    connection === "connected"
      ? styles.connOk
      : connection === "connecting"
        ? styles.connWarn
        : styles.connBad;
  const label =
    connection === "connected"
      ? "Connected"
      : connection === "connecting"
        ? "Connecting…"
        : "Disconnected";

  return (
    <header className={styles.topbar} ref={barRef}>
      {/* LEFT */}
      <div className={styles.topLeft}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark} aria-hidden />
          <span className={styles.brandText}>Live API Inspector</span>
        </Link>

        {/* Workspace switcher */}
        <div className={styles.navMenuWrap}>
          <button
            type="button"
            className={`${styles.navTrigger} ${
              open === "workspace" ? styles.navTriggerOpen : ""
            }`}
            onClick={() => setOpen(open === "workspace" ? null : "workspace")}
            aria-haspopup="menu"
            aria-expanded={open === "workspace"}
          >
            <span className={styles.navWsDot} aria-hidden />
            <span className={styles.navWsName}>{current}</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.navChevron}
              aria-hidden
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {open === "workspace" && (
            <div className={styles.navDropdown} role="menu">
              <div className={styles.navDropdownHeader}>Workspaces</div>

              {workspaces.map((w) => {
                const active = w === current;
                const canDelete = w !== "Personal" && workspaces.length > 1;
                return (
                  <div
                    key={w}
                    className={`${styles.navItem} ${
                      active ? styles.navItemActive : ""
                    }`}
                    role="menuitem"
                    tabIndex={0}
                    onClick={() => {
                      setCurrent(w);
                      setOpen(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setCurrent(w);
                        setOpen(null);
                      }
                    }}
                  >
                    <span className={styles.navItemDot} aria-hidden />
                    <span className={styles.navItemLabel}>{w}</span>
                    {active && <span className={styles.navCheck}>✓</span>}
                    {canDelete && (
                      <button
                        type="button"
                        className={styles.navDelete}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteWorkspace(w);
                        }}
                        aria-label={`Delete ${w}`}
                      >
                        🗑
                      </button>
                    )}
                  </div>
                );
              })}

              <div className={styles.navDivider} />

              {creating ? (
                <div className={styles.navCreateRow}>
                  <input
                    autoFocus
                    className={styles.navInput}
                    placeholder="Workspace name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") createWorkspace();
                      if (e.key === "Escape") {
                        setCreating(false);
                        setNewName("");
                      }
                    }}
                  />
                  <button
                    type="button"
                    className={styles.navCreateBtn}
                    onClick={createWorkspace}
                    disabled={!newName.trim()}
                  >
                    Create
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.navItem}
                  onClick={() => setCreating(true)}
                >
                  <span className={styles.navPlus}>+</span>
                  <span className={styles.navItemLabel}>Create workspace</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav className={styles.navLinks}>
          {NAV_LINKS.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={styles.navLink}
                style={
                  active
                    ? {
                        background: "var(--surface-2)",
                        color: "var(--text)",
                        fontWeight: 600,
                      }
                    : undefined
                }
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* CENTER — connection pill only if provided */}
      <div className={styles.topCenter}>
        <span className={styles.viewName}>Webhook Inspector</span>
        {connection && (
          <span className={`${styles.connPill} ${connClass}`}>
            <span
              className="dot"
              style={{
                background: tone,
                boxShadow:
                  connection === "connected"
                    ? "0 0 0 3px rgba(36, 209, 122, 0.28)"
                    : "none",
              }}
            />
            {label}
          </span>
        )}
      </div>

      {/* RIGHT */}
      <div className={styles.topRight}>
        <div className={styles.navMenuWrap}>
        <Tooltip content="Open tools menu" side="bottom">
          <button
            type="button"
            className={`${styles.iconBtn} ${
              open === "tools" ? styles.navTriggerOpen : ""
            }`}
            onClick={() => setOpen(open === "tools" ? null : "tools")}
            aria-haspopup="menu"
            aria-expanded={open === "tools"}
            aria-label="Tools"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
            </svg>
          </button>
          </Tooltip>

          {open === "tools" && (
            <div
              className={`${styles.navDropdown} ${styles.navDropdownRight}`}
              role="menu"
            >
              <div className={styles.navDropdownHeader}>Tools</div>

              {onOpenPalette && (
                <button
                  type="button"
                  className={styles.navItem}
                  onClick={() => {
                    setOpen(null);
                    onOpenPalette();
                  }}
                >
                  <span className={styles.navItemLabel}>Command palette</span>
                  <kbd className={styles.navKbd}>⌘K</kbd>
                </button>
              )}

              {onOpenTour && (
                <button
                  type="button"
                  className={styles.navItem}
                  onClick={() => {
                    setOpen(null);
                    onOpenTour();
                  }}
                >
                  <span className={styles.navItemLabel}>Show tour</span>
                </button>
              )}

              {onExport && (
                <button
                  type="button"
                  className={styles.navItem}
                  disabled={exportDisabled}
                  onClick={() => {
                    setOpen(null);
                    onExport();
                  }}
                  style={
                    exportDisabled
                      ? { opacity: 0.4, cursor: "not-allowed" }
                      : undefined
                  }
                >
                  <span className={styles.navItemLabel}>Export requests</span>
                </button>
              )}

              <div className={styles.navDivider} />

              <div className={styles.navThemeRow}>
                <button
                  type="button"
                  className={`${styles.navThemeBtn} ${
                    theme === "dark" ? styles.navThemeBtnActive : ""
                  }`}
                  onClick={() => applyTheme("dark")}
                >
                  🌙 Dark
                </button>
                <button
                  type="button"
                  className={`${styles.navThemeBtn} ${
                    theme === "light" ? styles.navThemeBtnActive : ""
                  }`}
                  onClick={() => applyTheme("light")}
                >
                  ☀️ Light
                </button>
              </div>
            </div>
          )}
        </div>

        {/* GitHub */}
        <Tooltip content="View source on GitHub" side="bottom">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.iconBtn}
          aria-label="GitHub repository"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.94c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.3-1.7-1.3-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.73-1.56-2.56-.3-5.25-1.28-5.25-5.7 0-1.26.45-2.3 1.18-3.1-.12-.3-.51-1.5.11-3.1 0 0 .96-.32 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.18-1.5 3.14-1.18 3.14-1.18.63 1.6.24 2.8.12 3.1.74.8 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.2.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
        </svg>
        </a>
        </Tooltip>
      </div>
    </header>
  );
}