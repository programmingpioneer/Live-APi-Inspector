/**
 * CapturedRequest — webhook capture ka canonical shape.
 * Ye shape persistence, gateway broadcast, aur frontend me consistent rehta hai.
 */
export interface CapturedRequest {
  id: string;
  slug: string;
  method: string;
  path: string;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, unknown>;
  body: unknown;
  bodyRaw: string | null;
  ip: string | null;
  httpVersion: string;
  timestamp: string;
}

/** Replay request body — frontend se aane wala payload. */
export interface ReplayPayload {
  targetUrl: string;
  requestId: string;
}
