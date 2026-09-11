"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { inspectionUrl } from "@/lib/api";
import { useCachedRequests } from "@/hooks/useCachedRequests";
import { useInspectorSocket } from "@/hooks/useInspectorSocket";
import type { CapturedRequest, HttpMethod } from "@/lib/types";
import { EndpointBar } from "./EndpointBar";
import { RequestList } from "./RequestList";
import { RequestDetails } from "./RequestDetails";
import { MetadataPanel } from "./MetadataPanel";
import { ReplayDrawer } from "./ReplayDrawer";
import { NewEndpointModal } from "./NewEndpointModal";
import { WaitingView } from "./WaitingView";
import { EmptyStateView } from "./EmptyStateView";
import { ToastStack, toast } from "@/components/Toast";
import CommandPalette from "@/components/CommandPalette";
import OnboardingTour from "@/components/OnboardingTour";
import { AppNav } from "./AppNav";
import { WorkspaceSkeleton } from "./WorkspaceSkeleton";
import { EndpointBarSkeleton } from "./EndpointBarSkeleton";
import styles from "./InspectorShell.module.css";

const FILTERS: Array<"ALL" | HttpMethod> = ["ALL", "GET", "POST", "PUT", "DELETE"];
const TOUR_KEY = "devtoll:tour-seen:v1";

interface Props {
  slug: string;
}

type View = "loading" | "not_found" | "waiting" | "tracking" | "error";

export function InspectorShell({ slug }: Props) {
  const cached = useCachedRequests(slug);
  const requests = cached.requests;
  const error = cached.error;
  const { setRequests } = cached;

  const view: View =
    cached.status === "loading"
      ? "loading"
      : cached.status === "error"
        ? "error"
        : !cached.exists
          ? "not_found"
          : cached.requests.length === 0
            ? "waiting"
            : "tracking";

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");
  const [query, setQuery] = useState("");
  const [replayFor, setReplayFor] = useState<CapturedRequest | null>(null);
  const [mobilePanel, setMobilePanel] = useState<"list" | "details">("list");
  const [newOpen, setNewOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  // Auto-select first request when list becomes populated and nothing selected
  useEffect(() => {
    if (requests.length > 0 && !selectedId) {
      setSelectedId(requests[0].id);
    }
  }, [requests, selectedId]);

  // Clear selection if the selected request disappears
  useEffect(() => {
    if (selectedId && !requests.some((r) => r.id === selectedId)) {
      setSelectedId(requests[0]?.id ?? null);
    }
  }, [requests, selectedId]);

  const onCaptured = useCallback(
    (req: CapturedRequest) => {
      setRequests((prev) => [req, ...prev].slice(0, 200));
      setSelectedId((prev) => prev ?? req.id);
      toast.show(req.method + " " + req.path + " received", "success", 2500);
    },
    [setRequests],
  );

  const connection = useInspectorSocket(slug, onCaptured);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    try {
      if (!localStorage.getItem(TOUR_KEY)) setTourOpen(true);
    } catch {
      /* ignore */
    }
  }, []);

  const finishTour = () => {
    setTourOpen(false);
    try {
      localStorage.setItem(TOUR_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const handlePaletteCommand = (id: string) => {
    switch (id) {
      case "create":
        setNewOpen(true);
        break;
      case "endpoints":
        window.location.href = "/endpoints";
        break;
      case "docs":
        window.location.href = "/docs";
        break;
      case "tour":
        setTourOpen(true);
        break;
      case "export":
        exportRequests(requests, slug);
        break;
      default:
        break;
    }
  };

  const filtered = useMemo(
    () =>
      requests.filter((r) => {
        if (filter !== "ALL" && r.method !== filter) return false;
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          r.path.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.method.toLowerCase().includes(q)
        );
      }),
    [requests, filter, query],
  );

  const selected = requests.find((r) => r.id === selectedId) ?? null;
  const url = inspectionUrl(slug);

  return (
    <div className={styles.app}>
      <AppNav
        connection={connection}
        onOpenPalette={() => setPaletteOpen(true)}
        onOpenTour={() => setTourOpen(true)}
        onExport={() => exportRequests(requests, slug)}
        exportDisabled={requests.length === 0}
      />

      {view === "loading" ? (
        <EndpointBarSkeleton />
      ) : (
        <EndpointBar
          slug={slug}
          url={url}
          requestCount={requests.length}
          live={connection === "connected"}
          onNewEndpoint={() => setNewOpen(true)}
        />
      )}

      {connection === "disconnected" && view !== "not_found" && (
        <div className={styles.connectionBanner} role="alert">
          <span>
            <strong>Connection interrupted.</strong>
          </span>
          <button type="button" onClick={() => window.location.reload()}>
            Reconnect
          </button>
        </div>
      )}

      {view === "error" && error && (
        <div className={styles.errorBanner} role="alert">
          <span>
            <strong>Couldn&apos;t load history:</strong> {error}
          </span>
          <button type="button" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {view === "loading" && <WorkspaceSkeleton />}

      {view === "not_found" && (
        <EmptyStateView slug={slug} onNewEndpoint={() => setNewOpen(true)} />
      )}

      {view === "waiting" && (
        <WaitingView
          slug={slug}
          url={url}
          live={connection === "connected"}
          onNewEndpoint={() => setNewOpen(true)}
        />
      )}

      {view === "tracking" && (
        <div className={styles.workspace} data-mobile-panel={mobilePanel}>
          <div className={styles.colList}>
            <RequestList
              requests={filtered}
              totalCount={requests.length}
              selectedId={selectedId}
              filter={filter}
              onFilter={setFilter}
              query={query}
              onQuery={setQuery}
              onSelect={(id) => {
                setSelectedId(id);
                setMobilePanel("details");
              }}
              filters={FILTERS}
              loading={false}
            />
          </div>

          <div className={styles.colDetails}>
            <RequestDetails
              request={selected}
              onBack={() => setMobilePanel("list")}
              onReplay={() => selected && setReplayFor(selected)}
            />
          </div>

          <div className={styles.colMeta}>
            <MetadataPanel request={selected} />
          </div>
        </div>
      )}

      <ReplayDrawer request={replayFor} onClose={() => setReplayFor(null)} />

      <NewEndpointModal open={newOpen} onClose={() => setNewOpen(false)} />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onRun={handlePaletteCommand}
      />

      {tourOpen && <OnboardingTour onFinish={finishTour} />}

      <ToastStack />
    </div>
  );
}

/* ---------- Export helper ---------- */
function exportRequests(requests: CapturedRequest[], slug: string) {
  if (requests.length === 0) return;
  const payload = {
    slug,
    exportedAt: new Date().toISOString(),
    count: requests.length,
    requests,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  a.href = url;
  a.download = `devtoll-${slug}-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}