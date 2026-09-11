/**
 * Frontend API client.
 */

import {
  normalizeCaptured,
  type CapturedRequest,
  type RawCapturedRequest,
} from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface CreateEndpointResponse {
  slug: string;
  createdAt: string;
  requestCount: number;
}

export interface FetchRequestsResult {
  /** true = endpoint exists in backend, false = 404 (never created) */
  exists: boolean;
  requests: CapturedRequest[];
}

export function normalizeEndpointPrefix(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 16);
}

export async function createEndpoint(
  name: string,
): Promise<CreateEndpointResponse> {
  const prefix = normalizeEndpointPrefix(name);

  if (prefix.length < 2) {
    throw new Error(
      "Name must contain at least 2 letters or numbers (a-z, 0-9).",
    );
  }

  const res = await fetch(`${BASE}/api/v1/endpoints`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prefix }),
  });

  if (!res.ok) {
    let message = `Create failed (${res.status})`;
    try {
      const body = (await res.json()) as {
        error?: string;
        message?: string | string[];
        issues?: Array<{ message: string }>;
      };
      if (Array.isArray(body.issues) && body.issues.length > 0) {
        message = body.issues[0]?.message ?? message;
      } else if (typeof body.message === "string") {
        message = body.message;
      } else if (Array.isArray(body.message)) {
        message = body.message[0] ?? message;
      } else if (typeof body.error === "string") {
        message = body.error;
      }
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  return (await res.json()) as CreateEndpointResponse;
}

export function inspectionUrl(slug: string): string {
  return `${BASE}/api/v1/inspect/${slug}`;
}

/**
 * Fetch recent captures for a slug.
 *
 * Returns { exists, requests }:
 *   - 404 → { exists: false, requests: [] }    (endpoint never created)
 *   - 200 → { exists: true,  requests: [...] } (created; may be empty)
 *   - other non-OK → throws
 */
export async function fetchRequests(
  slug: string,
): Promise<FetchRequestsResult> {
  const res = await fetch(`${BASE}/api/v1/inspect/${slug}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (res.status === 404) {
    return { exists: false, requests: [] };
  }

  if (!res.ok) {
    throw new Error(`History load failed (${res.status})`);
  }

  const body = (await res.json()) as unknown;

  const list: RawCapturedRequest[] = Array.isArray(body)
    ? (body as RawCapturedRequest[])
    : body &&
        typeof body === "object" &&
        Array.isArray((body as { requests?: unknown }).requests)
      ? ((body as { requests: RawCapturedRequest[] }).requests)
      : [];

  return {
    exists: true,
    requests: list.map((r) => normalizeCaptured(r, slug)),
  };
}

/* ---------- Endpoint listing ---------- */

export interface EndpointListItem {
  slug: string;
  createdAt: string;
  requestCount: number;
}

/**
 * GET /api/v1/endpoints
 * Returns all endpoints created on this server.
 */
export async function listEndpoints(): Promise<EndpointListItem[]> {
  const res = await fetch(`${BASE}/api/v1/endpoints`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to load endpoints (${res.status})`);
  }

  const body = (await res.json()) as unknown;
  if (!Array.isArray(body)) return [];

  return body
    .filter((x): x is Record<string, unknown> => typeof x === "object" && x !== null)
    .map((x) => ({
      slug: String(x.slug ?? ""),
      createdAt: String(x.createdAt ?? new Date().toISOString()),
      requestCount: Number(x.requestCount ?? 0),
    }))
    .filter((x) => x.slug.length > 0);
}
/* ---------- Replay ---------- */

export interface ReplayResult {
  id: string;
  requestId: string;
  targetUrl: string;
  status: number;
  statusText: string;
  timestamp: string;
}

/**
 * POST /api/v1/replay
 * Sends the captured request to `targetUrl`.
 * 400 → validation (invalid UUID / bad URL)  — user-friendly message
 * 422 → upstream replay failure              — server message
 */
export async function replayRequest(
  requestId: string,
  targetUrl: string,
): Promise<ReplayResult> {
  const res = await fetch(`${BASE}/api/v1/replay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestId, targetUrl }),
  });

  if (res.status === 400) {
    throw new Error("This request cannot be replayed (invalid ID).");
  }

  if (!res.ok) {
    let message = `Replay failed (${res.status})`;
    try {
      const body = (await res.json()) as {
        error?: string;
        message?: string | string[];
      };
      if (typeof body.message === "string") message = body.message;
      else if (Array.isArray(body.message)) message = body.message[0] ?? message;
      else if (typeof body.error === "string") message = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  return (await res.json()) as ReplayResult;
}