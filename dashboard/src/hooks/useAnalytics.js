import { useState, useEffect, useCallback } from 'react';
import { fetchAnalytics } from '../api/client';

const REFRESH_INTERVAL_MS = 30_000;

/**
 * Fetches aggregated analytics data.
 *
 * @param {{ projectId: string, pageUrl: string, startDate?: string, endDate?: string }} filters
 * @returns {{ analytics: Object|null, loading: boolean, error: string|null }}
 */
export function useAnalytics(filters = {}) {
  const { projectId, pageUrl, startDate, endDate } = filters;

  const [analytics, setAnalytics] = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);

  const load = useCallback(async () => {
    if (!projectId || !pageUrl) return;

    setLoading(true);
    setError(null);
    try {
      const json = await fetchAnalytics({ projectId, pageUrl, startDate, endDate });
      setAnalytics(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, pageUrl, startDate, endDate]);

  useEffect(() => {
    load();

    if (!projectId || !pageUrl) return;

    const intervalId = setInterval(load, REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [load, projectId, pageUrl]);

  return { analytics, loading, error };
}
