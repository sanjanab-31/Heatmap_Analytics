// ─── API Client: Heatmap Dashboard ──────────────────────────────────
// Shared request helper for all dashboard endpoints.

const BASE_URL = import.meta.env.VITE_API_URL || '';

// ── Core request helper ──────────────────────────────────────────────

/**
 * Generic GET request.
 *
 * @param {string}               endpoint  – path after BASE_URL  (e.g. "/api/heatmap")
 * @param {Record<string,any>}   [params]  – query-string key/values; undefined, null,
 *                                            and empty-string values are silently dropped
 * @param {RequestInit}          [opts]    – extra fetch options (headers, signal, etc.)
 * @returns {Promise<any>}       parsed JSON body
 * @throws  {Error}              readable message on non-2xx responses
 */
async function request(endpoint, params = {}, opts = {}) {
  // ── Build query string, skipping empty / undefined values ────────
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');

  const url = `${BASE_URL}${endpoint}${query ? `?${query}` : ''}`;

  let res;
  const requestOptions = {
    method: opts.method || 'GET',
    headers: { 'Accept': 'application/json', ...opts.headers },
    signal: opts.signal,
  };

  if (opts.body !== undefined) {
    requestOptions.body = JSON.stringify(opts.body);
    requestOptions.headers = {
      ...requestOptions.headers,
      'Content-Type': 'application/json',
    };
  }

  try {
    res = await fetch(url, requestOptions);
  } catch (networkErr) {
    throw new Error(
      `Network error while fetching ${endpoint}: ${networkErr.message}`
    );
  }

  // ── Readable error on non-2xx ────────────────────────────────────
  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = body.message || body.error || JSON.stringify(body);
    } catch {
      detail = res.statusText;
    }
    throw new Error(
      `API ${endpoint} responded ${res.status}: ${detail}`
    );
  }

  // ── Parse JSON ───────────────────────────────────────────────────
  try {
    return await res.json();
  } catch {
    throw new Error(
      `API ${endpoint} returned non-JSON body (status ${res.status})`
    );
  }
}

// ── Public API functions ─────────────────────────────────────────────

/**
 * Fetch raw heatmap data (click / move / scroll events).
 *
 * @param {Object}  [params]
 * @param {string}  [params.page]      – page URL or path to filter by
 * @param {string}  [params.startDate] – ISO date lower bound
 * @param {string}  [params.endDate]   – ISO date upper bound
 * @param {string}  [params.type]      – event type: "click" | "move" | "scroll"
 * @param {number}  [params.limit]     – max data points to return
 * @param {AbortSignal} [signal]       – optional AbortController signal
 * @returns {Promise<any>}
 */
export async function fetchHeatmapData(params = {}, signal) {
  return request('/api/heatmap', params, signal ? { signal } : {});
}

/**
 * Fetch aggregated analytics (sessions, top elements, device split, etc.).
 *
 * @param {Object}  [params]
 * @param {string}  [params.page]      – page URL or path to filter by
 * @param {string}  [params.startDate] – ISO date lower bound
 * @param {string}  [params.endDate]   – ISO date upper bound
 * @param {string}  [params.metric]    – specific metric key
 * @param {string}  [params.groupBy]   – grouping dimension (e.g. "device", "browser")
 * @param {AbortSignal} [signal]       – optional AbortController signal
 * @returns {Promise<any>}
 */
export async function fetchAnalytics(params = {}, signal) {
  return request('/api/analytics', params, signal ? { signal } : {});
}

export async function fetchProjects(signal) {
  return request('/api/projects', {}, signal ? { signal } : {});
}

export async function createProject({ name, domain }) {
  return request('/api/projects', {}, {
    method: 'POST',
    body: { name, domain },
  });
}

export async function updateProjectStatus(id, status) {
  return request(`/api/projects/${encodeURIComponent(id)}/status`, {}, {
    method: 'PATCH',
    body: { status },
  });
}

export async function deleteProject(id) {
  return request(`/api/projects/${encodeURIComponent(id)}`, {}, {
    method: 'DELETE',
  });
}
