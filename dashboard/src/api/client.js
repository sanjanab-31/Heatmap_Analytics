// ─── API Client: Heatmap Dashboard ──────────────────────────────────
// Thin fetch wrapper with query-string building, error formatting,
// and JSON parsing.  Every endpoint function delegates to `request()`
// so networking logic is never duplicated.

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
  try {
    res = await fetch(url, {
      headers: { 'Accept': 'application/json', ...opts.headers },
      ...opts,
    });
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

// --- MOCK API FOR PROJECTS (Frontend Demonstration) ---
let mockProjects = [
  {
    _id: "mock_1",
    name: "Example SaaS App",
    projectId: "proj_9f8e7d6c",
    domain: "example.com",
    apiKeyLastFour: "8x92",
    status: "active",
    totalClicks: 42850,
    totalSessions: 1250,
    lastEventAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString()
  }
];

export async function fetchProjects(signal) {
  return new Promise(resolve => setTimeout(() => resolve([...mockProjects]), 600));
}

export async function createProject({ name, domain }) {
  return new Promise((resolve, reject) => setTimeout(() => {
    if (mockProjects.some(p => p.domain === domain)) {
      return reject(new Error("A project with this domain already exists."));
    }
    const rawApiKey = `pk_test_${Math.random().toString(36).substring(2, 15)}`;
    const newProject = {
      _id: `mock_${Date.now()}`,
      name,
      domain,
      projectId: `proj_${Math.random().toString(36).substring(2, 10)}`,
      apiKeyLastFour: rawApiKey.slice(-4),
      status: "active",
      totalClicks: 0,
      totalSessions: 0,
      lastEventAt: null,
      createdAt: new Date().toISOString()
    };
    mockProjects = [newProject, ...mockProjects];
    resolve({ ...newProject, rawApiKey });
  }, 800));
}

export async function updateProjectStatus(id, status) {
  return new Promise((resolve, reject) => setTimeout(() => {
    const projectIndex = mockProjects.findIndex(p => p._id === id);
    if (projectIndex === -1) return reject(new Error("Project not found"));
    mockProjects[projectIndex] = { ...mockProjects[projectIndex], status };
    resolve(mockProjects[projectIndex]);
  }, 400));
}

export async function deleteProject(id) {
  return new Promise(resolve => setTimeout(() => {
    mockProjects = mockProjects.filter(p => p._id !== id);
    resolve({ message: "Project deleted" });
  }, 400));
}
