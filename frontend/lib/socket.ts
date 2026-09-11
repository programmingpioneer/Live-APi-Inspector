import { io, type Socket } from "socket.io-client";
import {
  normalizeCaptured,
  type CapturedRequest,
  type RawCapturedRequest,
} from "./types";

const BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:4000";

export interface InspectorSocketHandlers {
  onCaptured: (req: CapturedRequest) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (err: Error) => void;
}

/**
 * Connect to the /inspector namespace, join the room for `slug`, and route
 * normalized `request:captured` events to the provided callback.
 *
 * Returns a cleanup function — call it on unmount.
 */
export function connectInspectorSocket(
  slug: string,
  handlers: InspectorSocketHandlers,
): () => void {
  const socket: Socket = io(`${BASE}/inspector`, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 8000,
    reconnectionAttempts: Infinity,
  });

  socket.on("connect", () => {
    handlers.onConnect?.();
    socket.emit("room:join", { slug });
  });

  socket.on("request:captured", (data: RawCapturedRequest) => {
    try {
      handlers.onCaptured(normalizeCaptured(data, slug));
    } catch (err) {
      handlers.onError?.(
        err instanceof Error ? err : new Error("Failed to normalize event"),
      );
    }
  });

  socket.on("disconnect", () => {
    handlers.onDisconnect?.();
  });

  socket.on("connect_error", (err: Error) => {
    handlers.onError?.(err);
  });

  return () => {
    socket.emit("room:leave", { slug });
    socket.disconnect();
  };
}
