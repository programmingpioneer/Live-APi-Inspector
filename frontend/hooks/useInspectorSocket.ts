"use client";

import { useEffect, useRef, useState } from "react";
import { connectInspectorSocket } from "@/lib/socket";
import type { CapturedRequest, ConnectionState } from "@/lib/types";

/**
 * Subscribes to the /inspector room for `slug`.
 *
 * Uses a ref for the callback so that changing the callback does NOT
 * tear down and re-create the socket.
 */
export function useInspectorSocket(
  slug: string,
  onCaptured: (req: CapturedRequest) => void,
) {
  const [state, setState] = useState<ConnectionState>("connecting");
  const captureRef = useRef(onCaptured);
  captureRef.current = onCaptured;

  useEffect(() => {
    setState("connecting");

    const disconnect = connectInspectorSocket(slug, {
      onCaptured: (req) => captureRef.current(req),
      onConnect: () => setState("connected"),
      onDisconnect: () => setState("disconnected"),
      onError: () => setState("disconnected"),
    });

    return () => {
      disconnect();
      setState("disconnected");
    };
  }, [slug]);

  return state;
}
