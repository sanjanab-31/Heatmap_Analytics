// ─── API Client: Heatmap Dashboard ──────────────────────────────────
// Thin fetch wrapper with query-string building, error formatting,
// and JSON parsing.  Every endpoint function delegates to `request()`
// so networking logic is never duplicated.

const BASE_URL = import.meta.env.VITE_API_URL || '';
const PROJECTS_STORAGE_KEY = 'heatwave_projects_v1';

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getStoredProjects = () => {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveProjects = (projects) => {
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
};

const pageLabelFromUrl = (pageUrl) => {
  if (!pageUrl) return 'Unknown Page';

  try {
    const parsed = new URL(pageUrl);
    return parsed.pathname === '/' ? `${parsed.hostname}/` : `${parsed.hostname}${parsed.pathname}`;
  } catch {
    return pageUrl;
  }
};

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
  const raw = await request('/api/analytics', params, signal ? { signal } : {});

  const totalClicks = toNumber(raw?.totalClicks);
  const totalScrollEvents = toNumber(raw?.totalScrollEvents);
  const avgScrollDepth = toNumber(raw?.avgScrollDepth);
  const maxScrollDepth = toNumber(raw?.maxScrollDepth);

  const clicksByHour = Array.from({ length: 24 }, (_, hour) => {
    const bucket = Array.isArray(raw?.clicksPerHour)
      ? raw.clicksPerHour.find((item) => toNumber(item?.hour, -1) === hour)
      : null;
    return toNumber(bucket?.count);
  });

  const topElements = (Array.isArray(raw?.topPages) ? raw.topPages : []).map((page, index) => {
    const clicks = toNumber(page?.clicks);
    return {
      id: `${index}_${page?.pageUrl || 'page'}`,
      name: page?.pageUrl || 'unknown',
      label: pageLabelFromUrl(page?.pageUrl),
      clicks,
      percentage: totalClicks > 0 ? Math.round((clicks / totalClicks) * 100) : 0,
    };
  });

  return {
    total_clicks: totalClicks,
    total_sessions: totalScrollEvents,
    click_rate: totalScrollEvents > 0 ? (totalClicks / totalScrollEvents) * 100 : 0,
    avg_scroll: avgScrollDepth,
    max_scroll: maxScrollDepth,
    clicks_by_hour: clicksByHour,
    top_elements: topElements,
  };
}

export async function fetchProjects(signal) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      if (signal?.aborted) {
        reject(new DOMException('Request aborted', 'AbortError'));
        return;
      }

      resolve(getStoredProjects());
    }, 250);

    signal?.addEventListener('abort', () => {
      clearTimeout(timeoutId);
      reject(new DOMException('Request aborted', 'AbortError'));
    }, { once: true });
  });
}

export async function createProject({ name, domain }) {
  return new Promise((resolve, reject) => setTimeout(() => {
    const existingProjects = getStoredProjects();

    if (existingProjects.some((p) => p.domain === domain)) {
      return reject(new Error('A project with this domain already exists.'));
    }

    const rawApiKey = `pk_live_${crypto.randomUUID().replace(/-/g, '').slice(0, 24)}`;
    const newProject = {
      _id: crypto.randomUUID(),
      name,
      domain,
      projectId: `proj_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`,
      apiKeyLastFour: rawApiKey.slice(-4),
      status: 'active',
      totalClicks: 0,
      totalSessions: 0,
      lastEventAt: null,
      createdAt: new Date().toISOString(),
    };

    saveProjects([newProject, ...existingProjects]);
    resolve({ ...newProject, rawApiKey });
  }, 400));
}

export async function updateProjectStatus(id, status) {
  return new Promise((resolve, reject) => setTimeout(() => {
    const projects = getStoredProjects();
    const projectIndex = projects.findIndex((p) => p._id === id);

    if (projectIndex === -1) {
      return reject(new Error('Project not found'));
    }

    projects[projectIndex] = { ...projects[projectIndex], status };
    saveProjects(projects);
    resolve(projects[projectIndex]);
  }, 250));
}

export async function deleteProject(id) {
  return new Promise((resolve) => setTimeout(() => {
    const projects = getStoredProjects();
    const filtered = projects.filter((p) => p._id !== id);
    saveProjects(filtered);
    resolve({ message: 'Project deleted' });
  }, 250));
}
