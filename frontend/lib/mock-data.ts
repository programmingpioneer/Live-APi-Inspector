import type { Endpoint, HttpMethod, RequestEntry, StorageInfo } from "./types";

export const endpoints: Endpoint[] = [
  {
    id: "ep-1",
    slug: "abc123",
    name: "abc123",
    url: "https://api.example.com/api/v1/inspect/abc123",
    requestCount: 24,
    isLive: true,
  },
  {
    id: "ep-2",
    slug: "payments",
    name: "payments",
    url: "https://api.example.com/api/v1/inspect/payments",
    requestCount: 8,
    isLive: true,
  },
  {
    id: "ep-3",
    slug: "webhook-demo",
    name: "webhook-demo",
    url: "https://api.example.com/api/v1/inspect/webhook-demo",
    requestCount: 42,
    isLive: false,
  },
];

export const storage: StorageInfo = { usedMB: 12.4, totalMB: 15 };

const HEADERS: Record<string, string> = {
  "content-type": "application/json",
  "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  accept: "*/*",
  "x-request-id": "req_82jd92",
  authorization: "Bearer sk_live_••••••••••••",
  "accept-encoding": "gzip, deflate, br",
};

function buildRaw(
  method: HttpMethod,
  path: string,
  headers: Record<string, string>,
  body: string | null,
): string {
  const lines = [`${method} ${path} HTTP/1.1`, "Host: api.example.com"];
  for (const [k, v] of Object.entries(headers)) lines.push(`${k}: ${v}`);
  if (body) {
    lines.push("");
    lines.push(body);
  }
  return lines.join("\n");
}

function createRequest(
  id: string,
  method: HttpMethod,
  status: number,
  statusText: string,
  path: string,
  ip: string,
  sizeBytes: number,
  duration: number,
  receivedAgo: string,
  receivedAt: string,
  body: string | null,
  query: Record<string, string> = {},
  extraHeaders: Record<string, string> = {},
): RequestEntry {
  const headers = { ...HEADERS, ...extraHeaders };
  return {
    id,
    method,
    status,
    statusText,
    path,
    ip,
    size: sizeBytes === 0 ? "0 KB" : `${(sizeBytes / 1024).toFixed(1)} KB`,
    sizeBytes,
    duration,
    receivedAt,
    receivedAgo,
    headers,
    query,
    body,
    raw: buildRaw(method, path, headers, body),
  };
}

export const requests: RequestEntry[] = [
  createRequest(
    "req-1",
    "POST",
    200,
    "OK",
    "/webhook/user",
    "192.168.1.24",
    4300,
    142,
    "2s ago",
    "21:42:18",
    JSON.stringify(
      {
        event: "user.created",
        user: { id: 8472, name: "Alex", email: "alex@example.com" },
        timestamp: "2026-09-09T18:42:12Z",
      },
      null,
      2,
    ),
    {},
    { "x-webhook-event": "user.created" },
  ),
  createRequest("req-2", "GET", 200, "OK", "/health", "10.0.0.5", 819, 8, "6s ago", "21:42:14", null),
  createRequest(
    "req-3",
    "POST",
    400,
    "Bad Request",
    "/webhook/payment",
    "172.16.4.9",
    2150,
    51,
    "12s ago",
    "21:42:08",
    JSON.stringify({ error: "invalid_signature", detail: "Signature verification failed" }, null, 2),
  ),
  createRequest("req-4", "DELETE", 204, "No Content", "/resource/4821", "10.0.0.7", 0, 19, "20s ago", "21:42:00", null),
  createRequest(
    "req-5",
    "GET",
    200,
    "OK",
    "/api/v1/users?page=2&limit=20",
    "185.199.108.153",
    8912,
    233,
    "1m ago",
    "21:41:02",
    JSON.stringify({ page: 2, limit: 20, items: [{ id: 101, name: "Nina" }, { id: 102, name: "Omar" }] }, null, 2),
    { page: "2", limit: "20", sort: "newest", status: "active" },
  ),
  createRequest(
    "req-6",
    "POST",
    500,
    "Internal Server Error",
    "/webhook/order",
    "103.77.14.2",
    1228,
    801,
    "3m ago",
    "21:39:42",
    JSON.stringify({ error: "upstream_timeout" }, null, 2),
  ),
  createRequest(
    "req-7",
    "PATCH",
    200,
    "OK",
    "/resource/4821",
    "10.0.0.9",
    1675,
    34,
    "5m ago",
    "21:37:15",
    JSON.stringify({ status: "updated" }, null, 2),
  ),
  createRequest("req-8", "GET", 301, "Moved Permanently", "/old-path", "192.168.1.30", 512, 11, "8m ago", "21:34:08", null),
];

// ---- Helpers used by components/inspector/* ----

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function relativeTime(iso: string): string {
  try {
    const then = new Date(iso).getTime();
    const now = Date.now();
    const diff = Math.max(0, Math.floor((now - then) / 1000));
    if (diff < 5) return "just now";
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return "—";
  }
}