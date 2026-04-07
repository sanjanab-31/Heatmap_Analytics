import { useState } from 'react';
import { useHeatmapData } from '../hooks/useHeatmapData';
import { useAnalytics }   from '../hooks/useAnalytics';

import FilterBar   from '../components/FilterBar';
import StatsCards  from '../components/StatsCards';
import HeatmapView from '../components/HeatmapView';
import ClickChart  from '../components/ClickChart';
import ScrollChart from '../components/ScrollChart';

import {
  colors, typography, space, radius, shadows, fontFamily,
} from '../styles';

const DEFAULT_PROJECT = 'test-project-001';
const DEFAULT_PAGE    = 'http://localhost/test';

// ── Shared panel wrapper ─────────────────────────────────────────────
function Panel({ title, subtitle, badge, children, style: sx }) {
  return (
    <div
      style={{
        background:    '#fff',
        borderRadius:   radius.md,
        boxShadow:      shadows.card,
        border:        `1px solid ${colors.border}`,
        padding:       `${space['2xl']}px`,
        ...sx,
      }}
    >
      {(title || badge) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: space.lg }}>
          <div>
            {title    && <h2 style={typography.sectionTitle}>{title}</h2>}
            {subtitle && <p  style={typography.sectionSubtitle}>{subtitle}</p>}
          </div>
          {badge && badge}
        </div>
      )}
      {children}
    </div>
  );
}

// ── Error banner ─────────────────────────────────────────────────────
function ErrorBanner({ message }) {
  return (
    <div
      role="alert"
      style={{
        background:    colors.dangerBg,
        border:        `1px solid ${colors.danger}`,
        borderRadius:   radius.sm,
        padding:       `${space.md}px ${space.lg}px`,
        color:          colors.danger,
        fontFamily,
        fontSize:      '0.85rem',
        display:       'flex',
        alignItems:    'center',
        gap:            space.sm,
      }}
    >
      <span>⚠️</span>
      <span>{message}</span>
    </div>
  );
}

// ── Live badge ───────────────────────────────────────────────────────
function LiveBadge() {
  return (
    <span
      style={{
        fontFamily,
        fontSize:     '0.7rem',
        fontWeight:    600,
        color:         colors.success,
        background:    colors.successBg,
        borderRadius:  9999,
        padding:      '3px 10px',
        display:      'inline-flex',
        alignItems:   'center',
        gap:           5,
      }}
    >
      <span
        style={{
          width:        7,
          height:       7,
          borderRadius: '50%',
          background:   colors.success,
          animation:   'pulse 1.5s ease-in-out infinite',
        }}
      />
      Live
    </span>
  );
}

// Inject pulse animation once
if (typeof document !== 'undefined' && !document.getElementById('dashboard-pulse-style')) {
  const s = document.createElement('style');
  s.id = 'dashboard-pulse-style';
  s.textContent = `@keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.85); }
  }`;
  document.head.appendChild(s);
}

// ── Dashboard page ───────────────────────────────────────────────────
export default function Dashboard() {
  // Filter state — updates ONLY when Load Data is clicked
  const [filters, setFilters] = useState({
    projectId: DEFAULT_PROJECT,
    pageUrl:   DEFAULT_PAGE,
  });

  const { data, total, loading: hmLoading, error: hmError } = useHeatmapData(filters);
  const { analytics,   loading: anLoading, error: anError } = useAnalytics(filters);

  const anyError = hmError || anError;

  return (
    <div
      style={{
        maxWidth:   1400,
        margin:    '0 auto',
        padding:   `${space['2xl']}px`,
        minHeight: '100vh',
        background: colors.pageBg,
        boxSizing: 'border-box',
        fontFamily,
      }}
    >
      {/* ── Header ──────────────────────────────────────────────── */}
      <header style={{ marginBottom: space['3xl'] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: space.md, marginBottom: space.xs }}>
          <span style={{ fontSize: '1.6rem' }}>🔥</span>
          <h1 style={typography.pageTitle}>Heatmap Analytics Dashboard</h1>
          <LiveBadge />
        </div>
        <p style={typography.pageSubtitle}>
          Real-time click heatmaps and engagement metrics for your pages.
        </p>
      </header>

      {/* ── Filter Bar ──────────────────────────────────────────── */}
      <section style={{ marginBottom: space['2xl'] }}>
        <FilterBar
          projectId={filters.projectId}
          pageUrl={filters.pageUrl}
          onFilter={(f) => setFilters(f)}
        />
      </section>

      {/* ── Error banner ────────────────────────────────────────── */}
      {anyError && (
        <section style={{ marginBottom: space['2xl'] }}>
          <ErrorBanner message={anyError} />
        </section>
      )}

      {/* ── KPI Cards ───────────────────────────────────────────── */}
      <section style={{ marginBottom: space['2xl'] }}>
        <StatsCards analytics={analytics} loading={anLoading} />
      </section>

      {/* ── Main row: Heatmap (60%) + ClickChart (40%) ──────────── */}
      <section
        style={{
          display:             'grid',
          gridTemplateColumns: '3fr 2fr',
          gap:                  space['2xl'],
          marginBottom:         space['2xl'],
        }}
      >
        <Panel
          title="Click Heatmap"
          subtitle="User interaction density — where people click most"
          badge={<LiveBadge />}
        >
          <HeatmapView data={data} total={total} loading={hmLoading} error={hmError} />
        </Panel>

        <Panel
          title="Clicks by Hour"
          subtitle="Hourly click distribution over the tracked page"
        >
          <ClickChart analytics={analytics} loading={anLoading} />
        </Panel>
      </section>

      {/* ── Scroll Chart (full width) ────────────────────────────── */}
      <section style={{ marginBottom: space['4xl'] }}>
        <Panel
          title="Scroll Depth Analysis"
          subtitle="How far users scroll down the page on average"
        >
          <ScrollChart analytics={analytics} loading={anLoading} />
        </Panel>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop:      `1px solid ${colors.border}`,
          paddingTop:      space.lg,
          display:        'flex',
          justifyContent: 'space-between',
          flexWrap:       'wrap',
          gap:             space.sm,
        }}
      >
        <span style={typography.caption}>Heatmap Analytics Platform</span>
        <span style={typography.caption}>Auto-refreshes every 30 s · Powered by Vite + React</span>
      </footer>
    </div>
  );
}
