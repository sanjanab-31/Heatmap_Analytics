import { useState } from 'react';
import { colors, typography, space, radius, shadows, transition } from '../styles';

const CARDS = [
  { key: 'totalClicks',        emoji: '🖱️', label: 'Total Clicks',        suffix: '' },
  { key: 'totalScrollEvents',  emoji: '📜', label: 'Scroll Events',        suffix: '' },
  { key: 'avgScrollDepth',     emoji: '📊', label: 'Avg Scroll Depth',    suffix: '%' },
  { key: 'maxScrollDepth',     emoji: '⬇️',  label: 'Max Scroll Depth',   suffix: '%' },
];

function StatCard({ emoji, label, value, suffix, accent = colors.primary, accentBg = colors.primaryGhost }) {
  const [hovered, setHovered] = useState(false);
  const display = value === null || value === undefined ? '—' : `${value}${suffix}`;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: '1 1 160px',
        background: '#fff',
        borderRadius: radius.md,
        boxShadow: hovered ? shadows.md : shadows.card,
        border: `1px solid ${colors.border}`,
        borderLeft: `3px solid ${accent}`,
        padding: `${space.xl}px ${space['2xl']}px`,
        transition: transition.normal,
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        cursor: 'default',
        minWidth: 150,
      }}
    >
      <div style={{ fontSize: '1.5rem', marginBottom: space.sm }}>{emoji}</div>
      <p style={typography.label}>{label}</p>
      <p style={{ ...typography.value, marginTop: space.xs, color: accent }}>{display}</p>
    </div>
  );
}

/**
 * StatsCards — four KPI cards.
 *
 * Props:
 *   analytics {Object|null}
 *   loading   {boolean}
 */
export default function StatsCards({ analytics, loading }) {
  const ACCENTS = [colors.primary, colors.success, colors.warning, colors.info];
  const ACCENT_BGS = [colors.primaryGhost, colors.successBg, colors.warningBg, colors.infoBg];

  return (
    <div style={{ display: 'flex', gap: space['2xl'], flexWrap: 'wrap' }}>
      {CARDS.map(({ key, emoji, label, suffix }, i) => (
        <StatCard
          key={key}
          emoji={emoji}
          label={label}
          suffix={suffix}
          value={loading || !analytics ? null : analytics[key]}
          accent={ACCENTS[i]}
          accentBg={ACCENT_BGS[i]}
        />
      ))}
    </div>
  );
}
