// ─── Phase 6: StatsCards ─────────────────────────────────────────────
// Four KPI cards: Total Clicks, Scroll Events, Avg Scroll Depth, Max Scroll Depth.
// Shows em-dash placeholders when analytics is null or loading.
// Each card uses a coloured left-accent, icon badge, large value, and small label.

import { useState } from 'react';
import {
  colors,
  fontFamily,
  typography,
  space,
  radius,
  shadows,
  transition,
} from '../styles';

// ── Card definitions ─────────────────────────────────────────────────
const CARDS = [
  {
    key: 'totalClicks',
    icon: '🖱️',
    label: 'Total Clicks',
    description: 'All recorded click events',
    suffix: '',
    accent:    colors.primary,
    accentBg:  colors.primaryGhost,
    accentRgb: '26, 86, 219',
  },
  {
    key: 'totalScrollEvents',
    icon: '📜',
    label: 'Total Scroll Events',
    description: 'Scroll interactions captured',
    suffix: '',
    accent:    colors.success,
    accentBg:  colors.successBg,
    accentRgb: '5, 150, 105',
  },
  {
    key: 'avgScrollDepth',
    icon: '📊',
    label: 'Avg Scroll Depth',
    description: 'Average page depth reached',
    suffix: '%',
    accent:    colors.warning,
    accentBg:  colors.warningBg,
    accentRgb: '217, 119, 6',
  },
  {
    key: 'maxScrollDepth',
    icon: '⬇️',
    label: 'Max Scroll Depth',
    description: 'Deepest scroll recorded',
    suffix: '%',
    accent:    colors.info,
    accentBg:  colors.infoBg,
    accentRgb: '8, 145, 178',
  },
];

// ── Shimmer keyframe injection (once, idempotent) ────────────────────
const SHIMMER_STYLE_ID = 'stats-shimmer-style';
if (!document.getElementById(SHIMMER_STYLE_ID)) {
  const style = document.createElement('style');
  style.id = SHIMMER_STYLE_ID;
  style.textContent = `
    @keyframes statsShimmer {
      0%   { background-position: -400px 0; }
      100% { background-position:  400px 0; }
    }
    @keyframes statsFadeUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

const shimmerBase = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e4e4e4 50%, #f0f0f0 75%)',
  backgroundSize: '400px 100%',
  animation: 'statsShimmer 1.4s ease-in-out infinite',
  borderRadius: radius.sm,
};

// ── Single stat card ─────────────────────────────────────────────────
function StatCard({ icon, label, description, value, suffix, accent, accentBg, accentRgb, loading, index }) {
  const [hovered, setHovered] = useState(false);

  const display =
    loading || value === null || value === undefined
      ? '—'
      : typeof value === 'number' && !Number.isInteger(value)
        ? `${value.toFixed(1)}${suffix}`
        : `${value}${suffix}`;

  const isPlaceholder = display === '—';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: '1 1 200px',
        minWidth: 180,
        maxWidth: 340,
        background: '#ffffff',
        borderRadius: radius.lg,
        boxShadow: hovered ? shadows.lg : shadows.card,
        border: `1px solid ${hovered ? accent : colors.border}`,
        borderTop: `3px solid ${accent}`,
        padding: `${space['2xl']}px ${space['2xl']}px ${space.xl}px`,
        transition: transition.smooth,
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
        animation: `statsFadeUp 0.35s ease both`,
        animationDelay: `${index * 0.07}s`,
        boxSizing: 'border-box',
      }}
    >
      {/* Subtle glow blob on hover */}
      <div
        style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 100,
          height: 100,
          background: `rgba(${accentRgb}, ${hovered ? 0.08 : 0})`,
          borderRadius: '50%',
          transition: transition.smooth,
          pointerEvents: 'none',
        }}
      />

      {/* Icon badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 38,
          height: 38,
          background: accentBg,
          borderRadius: radius.md,
          fontSize: '1.1rem',
          marginBottom: space.md,
          transition: transition.normal,
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
        }}
      >
        {icon}
      </div>

      {/* Label */}
      <p
        style={{
          fontFamily,
          fontSize: '0.7rem',
          fontWeight: 600,
          color: colors.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          margin: 0,
          marginBottom: space.xs,
        }}
      >
        {label}
      </p>

      {/* Value — shimmer while loading, em-dash if null */}
      {loading ? (
        <div
          style={{
            ...shimmerBase,
            height: 36,
            width: '70%',
            marginTop: space.sm,
            marginBottom: space.sm,
          }}
        />
      ) : (
        <p
          style={{
            fontFamily,
            fontSize: isPlaceholder ? '2rem' : '2.1rem',
            fontWeight: 700,
            color: isPlaceholder ? colors.textMuted : accent,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            margin: 0,
            marginTop: space.xs,
            marginBottom: space.xs,
            transition: `color ${transition.normal}`,
          }}
        >
          {display}
        </p>
      )}

      {/* Description caption */}
      {loading ? (
        <div style={{ ...shimmerBase, height: 12, width: '55%', marginTop: 4 }} />
      ) : (
        <p
          style={{
            fontFamily,
            fontSize: '0.72rem',
            fontWeight: 400,
            color: colors.textMuted,
            margin: 0,
            marginTop: 4,
            lineHeight: 1.4,
          }}
        >
          {description}
        </p>
      )}

      {/* Bottom accent bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `rgba(${accentRgb}, ${hovered ? 0.35 : 0.1})`,
          transition: transition.smooth,
        }}
      />
    </div>
  );
}

// ── Exported component ───────────────────────────────────────────────
/**
 * StatsCards — row of 4 KPI cards.
 *
 * Props:
 *   analytics {Object|null}  – data object with numeric keys
 *   loading   {boolean}      – show shimmer skeleton when true
 */
export default function StatsCards({ analytics, loading }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: space.xl,
        flexWrap: 'wrap',
        width: '100%',
      }}
    >
      {CARDS.map((card, i) => (
        <StatCard
          key={card.key}
          {...card}
          value={loading || !analytics ? null : analytics[card.key]}
          loading={loading}
          index={i}
        />
      ))}
    </div>
  );
}
