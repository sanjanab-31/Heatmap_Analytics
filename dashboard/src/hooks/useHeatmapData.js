import { useState, useEffect, useCallback } from 'react';
import { fetchHeatmapData } from '../api/client';

const REFRESH_INTERVAL_MS = 30_000;

/**
 * Fetches click-point data for the heatmap.
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

  const load = useCallback(async () => {
    // Guard: don't fetch if required fields are absent
    if (!projectId || !pageUrl) return;

    setLoading(true);
    setError(null);
    try {
      const json = await fetchHeatmapData({ projectId, pageUrl, startDate, endDate });
      setData(json.points  ?? []);
      setTotal(json.total  ?? 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, pageUrl, startDate, endDate]);

  useEffect(() => {
    load(); // immediate fetch

    if (!projectId || !pageUrl) return;

    const intervalId = setInterval(load, REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalId); // cleanup on unmount / filter change
  }, [load, projectId, pageUrl]);

  return { data, total, loading, error };
}
