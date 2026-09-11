/**
 * Shared domain types.
 *
 * Legacy types (used by mock-data + older components) + Inspector types
 * (used by components/inspector/*) live together here.
 */

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/* ---------- Legacy (mock-data, RequestStream, etc.) ---------- */

export interface Endpoint {
  id: string;
  slug: string;
  name: string;
  url: string;
  requestCount: number;
  isLive: boolean;
}

export interface RequestEntry {
  id: string;
  method: HttpMethod;
  status: number;
  statusText: string;
  path: string;
  ip: string;
  size: string;
  sizeBytes: number;
  duration: number;
  receivedAt: string;
  receivedAgo: string;
  headers: Record<string, string>;
  query: Record<string, string>;
  body: string | null;
  raw: string;
}

export interface StorageInfo {
  usedMB: number;
  totalMB: number;
}

/* ---------- Inspector ---------- */

export type ConnectionState = "connecting" | "connected" | "disconnected";

export type InspectorTab = "overview" | "headers" | "query" | "body" | "raw";

export type ReplayState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "success"; statusCode?: number }
  | { status: "error"; message: string };

/**
 * Rich shape used by components/inspector/*.
 * Has normalized fields (headers as array, contentType, userAgent, size in bytes).
 */
export interface CapturedRequest {
  id: string;
  slug: string;
  method: HttpMethod;
  path: string;
  status: number;
  statusText: string;
  duration: number;
  /** ISO timestamp */
  timestamp: string;
  /** Body size in bytes */
  size: number;
  headers: Array<{ key: string; value: string }>;
  query: Record<string, string>;
  body: unknown;
  /** Body serialized (used by RawTab) */
  raw: string;
  ip: string;
  httpVersion: string;
  contentType: string;
  userAgent: string;
}

/**
 * Raw shape as received from the backend (POST /api/v1/inspect/:slug event
 * payload). Fields are loosely typed — a normalizer converts to CapturedRequest.
 */
export interface RawCapturedRequest {
  id?: string;
  slug?: string;
  method?: string;
  path?: string;
  status?: number;
  statusText?: string;
  duration?: number;
  timestamp?: string;
  headers?: Record<string, string | string[] | undefined>;
  query?: Record<string, unknown>;
  body?: unknown;
  bodyRaw?: string | null;
  ip?: string | null;
  httpVersion?: string;
  [key: string]: unknown;
}

/* ---------- Normalization ---------- */

const KNOWN_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

function asHttpMethod(m: unknown): HttpMethod {
  const s = String(m ?? "GET").toUpperCase();
  return (KNOWN_METHODS.includes(s as HttpMethod) ? s : "GET") as HttpMethod;
}

function headersToArray(
  h: Record<string, string | string[] | undefined> | undefined,
): Array<{ key: string; value: string }> {
  if (!h) return [];
  return Object.entries(h)
    .map(([key, value]) => ({
      key,
      value: Array.isArray(value) ? value.join(", ") : (value ?? ""),
    }))
    .filter((x) => x.value.length > 0);
}

function queryToStrings(
  q: Record<string, unknown> | undefined,
): Record<string, string> {
  if (!q) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(q)) {
    out[k] = typeof v === "string" ? v : JSON.stringify(v);
  }
  return out;
}

function bodyToRaw(
  body: unknown,
  bodyRaw: string | null | undefined,
): string {
  if (typeof bodyRaw === "string" && bodyRaw.length > 0) return bodyRaw;
  if (body == null) return "";
  if (typeof body === "string") return body;
  try {
    return JSON.stringify(body, null, 2);
  } catch {
    return String(body);
  }
}

function headerGet(
  headers: Record<string, string | string[] | undefined> | undefined,
  name: string,
): string {
  if (!headers) return "";
  const v =
    headers[name.toLowerCase()] ??
    headers[name] ??
    headers[name.toUpperCase()];
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

export function normalizeCaptured(
  raw: RawCapturedRequest,
  slugFallback = "",
): CapturedRequest {
  const bodyRaw = bodyToRaw(raw.body, raw.bodyRaw);
  const size = (() => {
    try {
      return new TextEncoder().encode(bodyRaw).length;
    } catch {
      return bodyRaw.length;
    }
  })();

  return {
    id: String(
      raw.id ?? `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ),
    slug: String(raw.slug ?? slugFallback),
    method: asHttpMethod(raw.method),
    path: String(raw.path ?? "/"),
    status: Number(raw.status ?? 200),
    statusText: String(raw.statusText ?? ""),
    duration: Number(raw.duration ?? 0),
    timestamp: String(raw.timestamp ?? new Date().toISOString()),
    size,
    headers: headersToArray(raw.headers),
    query: queryToStrings(raw.query),
    body: raw.body ?? null,
    raw: bodyRaw,
    ip: String(raw.ip ?? "—"),
    httpVersion: String(raw.httpVersion ?? "HTTP/1.1"),
    contentType: headerGet(raw.headers, "content-type") || "—",
    userAgent: headerGet(raw.headers, "user-agent") || "—",
  };
}
