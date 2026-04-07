# 🎨 Developer 3 — React Dashboard
### Heatmap Analytics Platform | Your Task Brief

> **Copy everything below the line and paste it into Claude (VS Code / Claude Code / any AI coding tool)**

---

---

You are an expert React developer. Build a complete React dashboard for a heatmap analytics platform.

---

## PROJECT GOAL
A React single-page application that:
- Lets a website owner select a project and page to analyse
- Shows a live heatmap of where users clicked on that page
- Shows analytics charts for click counts and scroll depth
- Refreshes all data automatically every 30 seconds

---

## FOLDER STRUCTURE TO CREATE

```
dashboard/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── pages/
│   │   └── Dashboard.jsx
│   ├── components/
│   │   ├── FilterBar.jsx
│   │   ├── HeatmapView.jsx
│   │   ├── ClickChart.jsx
│   │   ├── ScrollChart.jsx
│   │   └── StatsCards.jsx
│   ├── hooks/
│   │   ├── useHeatmapData.js
│   │   └── useAnalytics.js
│   └── api/
│       └── client.js
├── index.html
├── vite.config.js
└── package.json
```

---

## THE BACKEND API (already built by Dev 2)

Your dashboard talks to these endpoints. Dev 2 runs the backend on port 3000.

```
GET /api/heatmap?projectId=test-project-001&pageUrl=http://localhost/test
Response:
{
  "points": [
    { "x": 540, "y": 320, "xPercent": 50.2, "yPercent": 41.6, "value": 1 }
  ],
  "total": 245
}

GET /api/analytics?projectId=test-project-001&pageUrl=http://localhost/test
Response:
{
  "totalClicks": 245,
  "totalScrollEvents": 89,
  "avgScrollDepth": 62.4,
  "maxScrollDepth": 98.1,
  "clicksPerHour": [
    { "hour": 0, "count": 0 },
    { "hour": 14, "count": 45 }
  ],
  "topPages": [
    { "pageUrl": "http://localhost/test", "clicks": 245 }
  ]
}
```

Default projectId to use for testing: `test-project-001`
Default pageUrl to use for testing: `http://localhost/test`

---

## FILE SPECIFICATIONS

### package.json
- Use Vite + React (NOT Create React App)
- dependencies: react, react-dom, heatmap.js, chart.js, react-chartjs-2
- devDependencies: vite, @vitejs/plugin-react
- scripts: dev, build, preview
- No CSS framework — use plain inline styles only

---

### vite.config.js
Standard React plugin. Add this proxy so API calls work in dev:
```js
server: {
  proxy: {
    '/api': 'http://localhost:3000'
  }
}
```

---

### src/api/client.js

Base URL: import.meta.env.VITE_API_URL or fallback to empty string (proxy handles it in dev).

Export these two async functions:

```js
// Fetches click point data for the heatmap
export async function fetchHeatmapData({ projectId, pageUrl, startDate, endDate })
// Calls GET /api/heatmap with query params
// Returns: { points: [...], total: number }

// Fetches summary analytics
export async function fetchAnalytics({ projectId, pageUrl, startDate, endDate })
// Calls GET /api/analytics with query params
// Returns: { totalClicks, totalScrollEvents, avgScrollDepth, maxScrollDepth, clicksPerHour, topPages }
```

Both functions must:
- Build query string from params (skip undefined values)
- Throw an error with a readable message on non-200 response
- Return parsed JSON

---

### src/hooks/useHeatmapData.js

```js
// Usage: const { data, total, loading, error } = useHeatmapData({ projectId, pageUrl })
```

- Fetch immediately when projectId and pageUrl are set
- Auto-refresh every 30 seconds using setInterval
- Clear interval on component unmount (avoid memory leaks)
- Return { data: [], total: 0, loading: false, error: null }
- Do not fetch if projectId or pageUrl is empty

---

### src/hooks/useAnalytics.js

```js
// Usage: const { analytics, loading, error } = useAnalytics({ projectId, pageUrl })
```

Same pattern as useHeatmapData.
Return { analytics: null, loading: false, error: null }
When analytics is null, components must show empty/zero state.

---

### src/components/FilterBar.jsx

Props: `{ projectId, pageUrl, onFilter }`

Renders:
- Label + text input for Project ID (default value: "test-project-001")
- Label + text input for Page URL (default value: "http://localhost/test")
- A blue "Load Data" button
- On button click: call onFilter({ projectId, pageUrl })
- Show a small "Auto-refreshing every 30s" note below the button

Style: horizontal row, inputs inline, clean and minimal.

---

### src/components/StatsCards.jsx

Props: `{ analytics, loading }`

Renders 4 stat cards in a horizontal row:
- 🖱️ Total Clicks → analytics.totalClicks
- 📜 Total Scroll Events → analytics.totalScrollEvents
- 📊 Avg Scroll Depth → analytics.avgScrollDepth + "%"
- ⬇️ Max Scroll Depth → analytics.maxScrollDepth + "%"

Each card: white background, subtle border, number in large bold text, label below.
Show "—" for all values when analytics is null or loading is true.

---

### src/components/HeatmapView.jsx

**This is the most important component — the WOW moment of the demo.**

Props: `{ data, loading, error }`

Requirements:
- Import heatmap.js: `import h337 from 'heatmap.js'`
- Use a ref on the container div: `const containerRef = useRef(null)`
- Create the heatmap instance once on mount:
  ```js
  heatmapInstance.current = h337.create({
    container: containerRef.current,
    maxOpacity: 0.8,
    radius: 30,
    blur: 0.75
  })
  ```
- When data prop changes, call:
  ```js
  heatmapInstance.current.setData({
    max: 5,
    data: data.map(p => ({ x: Math.round(p.x), y: Math.round(p.y), value: p.value }))
  })
  ```
- Container div: width 100%, height 500px, position relative, background #f8f8f8, border radius 8px
- Show a centred "No click data yet — interact with the tracked page" message when data is empty
- Show a centred loading spinner when loading is true
- Show a legend below: "🔴 High activity    🔵 Low activity"
- Show total point count: "Showing X click events"

---

### src/components/ClickChart.jsx

Props: `{ analytics, loading }`

Renders a Chart.js Bar chart using react-chartjs-2.

```js
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip)
```

- X axis labels: hours 0–23 formatted as "12am", "1am" ... "11pm"
- Y axis: click count
- Bar colour: rgba(26, 86, 219, 0.7) (blue)
- Title: "Clicks by Hour of Day"
- Height: 250px
- Show "No data yet" text when analytics is null

---

### src/components/ScrollChart.jsx

Props: `{ analytics, loading }`

Renders a Chart.js horizontal bar chart showing scroll depth.

Show two bars:
- "Average Scroll Depth" → analytics.avgScrollDepth
- "Maximum Scroll Depth" → analytics.maxScrollDepth

X axis: 0 to 100 (percentage).
Title: "Scroll Depth Analysis"
Colours: blue for avg, lighter blue for max.
Height: 150px.
Show "No data yet" when analytics is null.

---

### src/pages/Dashboard.jsx

The main page. Compose all components:

```
┌─────────────────────────────────────────────┐
│  🔥 Heatmap Analytics Dashboard              │
├─────────────────────────────────────────────┤
│  FilterBar (project + page inputs)           │
├──────────────┬──────────────────────────────┤
│  StatsCards (4 cards spanning full width)    │
├──────────────┬──────────────────────────────┤
│              │                              │
│  HeatmapView │  ClickChart                  │
│  (60% wide)  │  (40% wide)                  │
│              │                              │
├──────────────┴──────────────────────────────┤
│  ScrollChart (full width)                   │
└─────────────────────────────────────────────┘
```

State managed here:
- `projectId` — string, default "test-project-001"
- `pageUrl` — string, default "http://localhost/test"
- `filters` — object passed to hooks, only updates when Load Data is clicked

Both hooks receive `filters` as their input so data only reloads on explicit filter apply or auto-refresh.

---

### index.html
- Title: "Heatmap Dashboard"
- Standard Vite React entry point
- No extra CDN scripts needed (heatmap.js installed via npm)

---

## LAYOUT & STYLE RULES
- Background: #f3f4f6 (light gray page background)
- Cards/panels: white background, border-radius 8px, subtle box-shadow
- Primary colour: #1A56DB (blue — used for buttons, chart bars, accents)
- Font: system-ui, sans-serif
- All styles as inline style objects or CSS modules — no Tailwind, no Bootstrap
- Dashboard max-width: 1400px, centered with auto margins
- Padding: 24px on all sides

---

## REQUIREMENTS
- Must handle loading state — show spinners or "—" placeholders, never crash
- Must handle error state — show a red error banner with the error message
- Must handle empty data — show empty state messages, not blank white space
- Auto-refresh interval must be cleaned up on component unmount (no memory leaks)
- Do not fetch if projectId or pageUrl inputs are empty strings
- The heatmap must not crash if data array is empty

---

## AFTER GENERATING ALL FILES show me:

1. Exact terminal commands to install and run the dashboard
2. How to set VITE_API_URL to point at a deployed backend
3. How to verify the heatmap is rendering correctly using this mock data injection:
```js
// Paste in browser console to test heatmap without backend
window.__testHeatmap([
  { x: 200, y: 150, xPercent: 25, yPercent: 30, value: 1 },
  { x: 400, y: 250, xPercent: 50, yPercent: 50, value: 1 },
  { x: 600, y: 400, xPercent: 75, yPercent: 80, value: 1 },
])
```
4. What the final dashboard should look like — describe each section
