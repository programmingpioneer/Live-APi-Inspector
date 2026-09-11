"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchRequests, type FetchRequestsResult } from "@/lib/api";
import { cacheGet, cacheSet, cacheDelete } from "@/lib/cache";
import type { CapturedRequest } from "@/lib/types";

export type CachedRequestsStatus = "loading" | "ready" | "error";

interface InternalState {
  exists: boolean;
  requests: CapturedRequest[];
  status: CachedRequestsStatus;
  isRefreshing: boolean;
  error: string | null;
}

export interface CachedRequestsState extends InternalState {
  refresh: () => void;
  setRequests: (updater: (prev: CapturedRequest[]) => CapturedRequest[]) => void;
}

const cacheKey = (slug: string) => `requests:${slug}`;

export function useCachedRequests(slug: string): CachedRequestsState {
  const [state, setState] = useState<InternalState>(() => initialState(slug));
  const slugRef = useRef(slug);
  slugRef.current = slug;

  const fetchNow = useCallback(async (silent: boolean) => {
    const currentSlug = slugRef.current;
    try {
      const result = await fetchRequests(currentSlug);
      if (slugRef.current !== currentSlug) return;
      cacheSet(cacheKey(currentSlug), result);
      setState({
        exists: result.exists,
        requests: result.requests,
        status: "ready",
        isRefreshing: false,
        error: null,
      });
    } catch (e) {
      if (slugRef.current !== currentSlug) return;
      const msg = (e as Error).message;
      if (silent) {
        setState((prev) => ({ ...prev, isRefreshing: false }));
      } else {
        setState((prev) => ({
          ...prev,
          status: "error",
          isRefreshing: false,
          error: msg,
        }));
      }
    }
  }, []);

  useEffect(() => {
    setState(initialState(slug));
    const cached = cacheGet<FetchRequestsResult>(cacheKey(slug));
    if (!cached || !cached.fresh) {
      void fetchNow(!!cached);
    }
  }, [slug, fetchNow]);

  const refresh = useCallback(() => {
    cacheDelete(cacheKey(slugRef.current));
    setState((prev) => ({ ...prev, isRefreshing: true }));
    void fetchNow(false);
  }, [fetchNow]);

  const setRequests = useCallback(
    (updater: (prev: CapturedRequest[]) => CapturedRequest[]) => {
      const currentSlug = slugRef.current;
      setState((prev) => {
        const nextRequests = updater(prev.requests);
        const cached = cacheGet<FetchRequestsResult>(cacheKey(currentSlug));
        const exists = cached?.data.exists ?? prev.exists ?? true;
        cacheSet(cacheKey(currentSlug), { exists, requests: nextRequests });
        return { ...prev, requests: nextRequests, exists };
      });
    },
    [],
  );

  return { ...state, refresh, setRequests };
}

function initialState(slug: string): InternalState {
  const cached = cacheGet<FetchRequestsResult>(cacheKey(slug));
  if (cached) {
    return {
      exists: cached.data.exists,
      requests: cached.data.requests,
      status: "ready",
      isRefreshing: !cached.fresh,
      error: null,
    };
  }
  return {
    exists: false,
    requests: [],
    status: "loading",
    isRefreshing: false,
    error: null,
  };
}