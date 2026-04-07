import { useState, useEffect } from 'react';
import {
  colors, typography, space, radius, shadows, transition,
  card, cardHeader, btnPrimary, btnGhost, badge, divider,
  pageWrapper, grid, row, col, fontFamily,
} from './styles';

// ── Responsive hook ──────────────────────────────────────────────────
function useBreakpoint(query = '(max-width: 900px)') {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

// ── Stat Card ────────────────────────────────────────────────────────
function StatCard({ label, value, delta, accent = colors.primary, accentBg = colors.primaryGhost }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...card,
        padding: `${space.xl}px ${space['2xl']}px`,
        borderLeft: `3px solid ${accent}`,
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? shadows.md : shadows.card,
        cursor: 'default',
      }}
    >
      <p style={typography.label}>{label}</p>
      <p style={{ ...typography.value, marginTop: space.xs, color: accent }}>{value}</p>
      {delta && (
        <span
          style={{
            ...badge(accentBg, accent),
            marginTop: space.sm,
          }}
        >
          {delta}
        </span>
      )}
    </div>
  );
}

// ── Panel (generic card wrapper) ─────────────────────────────────────
function Panel({ title, subtitle, action, span, children, style: sx }) {
  return (
    <div
      style={{
        ...card,
        ...(span ? { gridColumn: `span ${span}` } : {}),
        ...sx,
      }}
    >
      {(title || action) && (
        <div style={cardHeader}>
          <div>
            {title && <h2 style={typography.sectionTitle}>{title}</h2>}
            {subtitle && <p style={typography.sectionSubtitle}>{subtitle}</p>}
          </div>
          {action && action}
        </div>
      )}
      {children}
    </div>
  );
}

// ── Placeholder content ──────────────────────────────────────────────
function PlaceholderBox({ height = 200, label = 'Content area' }) {
  return (
    <div
      style={{
        height,
        borderRadius: radius.sm,
        background: `repeating-linear-gradient(
          -45deg,
          ${colors.borderLight},
          ${colors.borderLight} 8px,
          transparent 8px,
          transparent 16px
        )`,
        border: `1px dashed ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{ ...typography.caption, color: colors.textMuted }}>{label}</span>
    </div>
  );
}

// ── App Shell ────────────────────────────────────────────────────────
function App() {
  const isTablet = useBreakpoint('(max-width: 900px)');
  const isMobile = useBreakpoint('(max-width: 600px)');

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ ...pageWrapper, padding: isMobile ? space.lg : space['2xl'] }}>

      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <header
        style={{
          display: 'flex',
          alignItems: isTablet ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          flexDirection: isTablet ? 'column' : 'row',
          gap: space.lg,
          marginBottom: space['3xl'],
        }}
      >
        <div>
          <h1 style={typography.pageTitle}>Heatmap Dashboard</h1>
          <p style={typography.pageSubtitle}>{greeting} — here's your analytics overview.</p>
        </div>

        <div style={row(space.sm)}>
          <button
            style={btnGhost}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Export
          </button>
          <button
            style={btnPrimary}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            + New Report
          </button>
        </div>
      </header>

      {/* ── KPI Row ─────────────────────────────────────────────── */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile
            ? '1fr'
            : isTablet
              ? 'repeat(2, 1fr)'
              : 'repeat(4, 1fr)',
          gap: space['2xl'],
          marginBottom: space['3xl'],
        }}
      >
        <StatCard
          label="Total Sessions"
          value="12,847"
          delta="↑ 14.2%"
          accent={colors.primary}
          accentBg={colors.primaryGhost}
        />
        <StatCard
          label="Active Users"
          value="3,429"
          delta="↑ 8.7%"
          accent={colors.success}
          accentBg={colors.successBg}
        />
        <StatCard
          label="Avg. Duration"
          value="4m 32s"
          delta="↓ 2.1%"
          accent={colors.warning}
          accentBg={colors.warningBg}
        />
        <StatCard
          label="Bounce Rate"
          value="24.6%"
          delta="↑ 1.3%"
          accent={colors.danger}
          accentBg={colors.dangerBg}
        />
      </section>

      {/* ── Main Content Grid ───────────────────────────────────── */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: isTablet ? '1fr' : '2fr 1fr',
          gap: space['2xl'],
          marginBottom: space['2xl'],
        }}
      >
        <Panel
          title="Click Heatmap"
          subtitle="User interaction density across the page"
          action={
            <button style={{ ...btnGhost, fontSize: '0.75rem', padding: `${space.xs}px ${space.md}px` }}>
              Filter ▾
            </button>
          }
        >
          <PlaceholderBox height={320} label="Heatmap canvas will render here" />
        </Panel>

        <Panel
          title="Top Clicked Elements"
          subtitle="Most engaged UI components"
        >
          {['Primary CTA Button', 'Navigation Menu', 'Search Bar', 'Hero Image', 'Footer Links'].map(
            (item, i) => (
              <div
                key={item}
                style={{
                  ...row(space.md),
                  justifyContent: 'space-between',
                  padding: `${space.md}px 0`,
                  borderBottom: i < 4 ? `1px solid ${colors.borderLight}` : 'none',
                }}
              >
                <div style={row(space.md)}>
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: radius.sm,
                      background: colors.primaryGhost,
                      color: colors.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      fontFamily,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={typography.body}>{item}</span>
                </div>
                <span style={badge()}>{`${(980 - i * 147).toLocaleString()} clicks`}</span>
              </div>
            )
          )}
        </Panel>
      </section>

      {/* ── Bottom Row ──────────────────────────────────────────── */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: isTablet ? '1fr' : 'repeat(2, 1fr)',
          gap: space['2xl'],
        }}
      >
        <Panel
          title="Session Trend"
          subtitle="Sessions over the last 30 days"
          action={
            <span style={badge(colors.successBg, colors.success)}>Live</span>
          }
        >
          <PlaceholderBox height={220} label="Line chart will render here" />
        </Panel>

        <Panel
          title="Device Breakdown"
          subtitle="Traffic by device category"
          action={
            <span style={badge(colors.infoBg, colors.info)}>This week</span>
          }
        >
          <PlaceholderBox height={220} label="Doughnut chart will render here" />
        </Panel>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer
        style={{
          marginTop: space['4xl'],
          paddingTop: space.lg,
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: space.sm,
        }}
      >
        <span style={typography.caption}>Heatmap Analytics Dashboard · Phase 2 Shell</span>
        <span style={typography.caption}>Built with Vite + React</span>
      </footer>
    </div>
  );
}

export default App;
