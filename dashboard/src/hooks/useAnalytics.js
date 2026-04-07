import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchAnalytics } from '../api/client';

const REFRESH_INTERVAL_MS = 5_000;

/**
 * Fetches aggregated analytics data.
 * - Fires immediately when projectId + pageUrl are present.
 * - Auto-refreshes every 30 s.
 * - Aborts in-flight requests on filter change / unmount (no stale writes).
 * - Resets to null when required filters are missing.
 *
 * @param {{ projectId: string, pageUrl: string, startDate?: string, endDate?: string }} filters
 * @returns {{ analytics: Object|null, loading: boolean, error: string|null }}
 */
export function useAnalytics(filters = {}) {
  const { projectId, pageUrl, startDate, endDate } = filters;

  const [analytics, setAnalytics] = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);

  const abortRef = useRef(null);

  const load = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const json = await fetchAnalytics(
        { projectId, pageUrl, startDate, endDate },
        signal,
      );
      if (!signal?.aborted) {
        setAnalytics(json);
      }
    } catch (err) {
      if (err.name === 'AbortError' || signal?.aborted) return;
      setError(err.message);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [projectId, pageUrl, startDate, endDate]);

  useEffect(() => {
    // ── Reset when required filters are missing ─────────────────────
    if (!projectId) {
      setAnalytics(null);
      setLoading(false);
      setError(null);
      return;
    }

    // ── Abort previous request ──────────────────────────────────────
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Immediate fetch
    load(controller.signal);

    // Auto-refresh every 30 s
    const intervalId = setInterval(() => {
      abortRef.current?.abort();
      const tick = new AbortController();
      abortRef.current = tick;
      load(tick.signal);
    }, REFRESH_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
      abortRef.current?.abort();
    };
  }, [load, projectId, pageUrl, startDate, endDate]);

  return { analytics, loading, error };
}
