# Heatmap Analytics Dashboard

A premium, React-based dashboard for visualizing user interactions, click density, and page engagement metrics in real-time.

## UI Overview
The dashboard is structurally organized into the following sections:

1. **Header**: Displays the application title and a pulsating "Live" badge indicating real-time data tracking status.
2. **Filter Bar**: A horizontally aligned control panel allowing users to filter analytics by `Project ID` and `Page URL`. The "Load Data" button natively triggers dashboard wide updates.
3. **KPI Stats Cards**: Three top-level metric indicators surfacing `Total Clicks`, `Average Scroll Depth` and `Max Scroll Depth`. 
4. **Click Heatmap (60% width)**: Renders the spatial distribution of user clicks using `heatmap.js`. Areas with higher density feature pronounced hotspot colors (yellow/red), overlaying structural borders to simulate the tested page element bounds.
5. **Click by Hour Chart (40% width)**: A bar chart detailing how many clicks occurred categorized by 24-hour segments, natively powered by `react-chartjs-2`.
6. **Scroll Depth Analysis (Full width)**: A horizontal bar chart displaying horizontal depth percentage comparing average scroll against total visible maxima. 

## Getting Started

### Installation and Running locally

Navigate to your dashboard directory, install dependencies, and spin up the Vite development server:
```bash
# Navigate to the dashboard directory
cd path/to/dashboard

# Install all dependencies (React, Vite, Chart.js, Heatmap.js, etc.)
npm install

# Start the dev server
npm run dev
```
The application will normally be available at `http://localhost:5173`.

### Environment Configuration
The dashboard queries the local API endpoint `http://localhost:3000` by default. For production, establish the `VITE_API_URL` variable to point at your deployed backend. You can either place this inside a `.env` file at the dashboard root level:

```env
# .env
VITE_API_URL=https://api.yourdomain.com
```

### Mocking and Verification
To test Heatmap interactivity securely without blasting database calls or standing up complete endpoints, the `HeatmapView` component exposes a mock injection payload.

Open your browser's Developer Tools (F12) Console while on the dashboard and execute the global method:

```javascript
window.__testHeatmap()
```

This simulates live 100 randomized click data-points to ensure `heatmap.js` renders accurately under load formatting caps and radius requirements.
