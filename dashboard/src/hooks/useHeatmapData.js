import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchHeatmapData } from '../api/client';

const REFRESH_INTERVAL_MS = 30_000;

/**
 * Fetches click-point data for the heatmap.
 * - Fires immediately when projectId + pageUrl are present.
 * - Auto-refreshes every 30 s.
 * - Aborts in-flight requests on filter change / unmount (no stale writes).
 * - Resets to empty state when required filters are missing.
 *
 * @param {{ projectId: string, pageUrl: string, startDate?: string, endDate?: string }} filters
 * @returns {{ data: Array, total: number, loading: boolean, error: string|null }}
 */
export function useHeatmapData(filters = {}) {
  const { projectId, pageUrl, startDate, endDate } = filters;

  const [data,    setData]    = useState([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // Keep an AbortController ref so we can cancel on cleanup / re-run
  const abortRef = useRef(null);

  const load = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const json = await fetchHeatmapData(
        { projectId, pageUrl, startDate, endDate },
        signal,
      );
      // Only update state if this request wasn't aborted
      if (!signal?.aborted) {
        setData(json.points  ?? []);
        setTotal(json.total  ?? 0);
      }
    } catch (err) {
      // Silently ignore aborted requests
      if (err.name === 'AbortError' || signal?.aborted) return;
      setError(err.message);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [projectId, pageUrl, startDate, endDate]);

  useEffect(() => {
    // ── Reset to empty state when required filters are missing ──────
    if (!projectId || !pageUrl) {
      setData([]);
      setTotal(0);
      setLoading(false);
      setError(null);
      return;
    }

    // ── Abort any previous in-flight request ────────────────────────
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Immediate fetch
    load(controller.signal);

    // Auto-refresh every 30 s
    const intervalId = setInterval(() => {
      // Each interval tick gets its own controller so it can be
      // cancelled independently on the next tick or on cleanup.
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

  return { data, total, loading, error };
}
