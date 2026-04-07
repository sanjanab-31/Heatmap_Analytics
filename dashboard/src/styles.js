// ─── Design System: Heatmap Dashboard ───────────────────────────────
// All visual tokens live here so every component draws from one source.

// ── Color Palette ────────────────────────────────────────────────────
export const colors = {
  // Backgrounds
  pageBg:       '#f3f4f6',
  cardBg:       '#ffffff',
  cardBgHover:  '#fafbfc',

  // Brand
  primary:      '#1A56DB',
  primaryLight: '#3B82F6',
  primaryDark:  '#1E40AF',
  primaryGhost: 'rgba(26, 86, 219, 0.08)',

  // Semantic
  success:      '#059669',
  successBg:    'rgba(5, 150, 105, 0.08)',
  warning:      '#D97706',
  warningBg:    'rgba(217, 119, 6, 0.08)',
  danger:       '#DC2626',
  dangerBg:     'rgba(220, 38, 38, 0.08)',
  info:         '#0891B2',
  infoBg:       'rgba(8, 145, 178, 0.08)',

  // Neutrals
  text:         '#111827',
  textSecondary:'#6B7280',
  textMuted:    '#9CA3AF',
  border:       '#E5E7EB',
  borderLight:  '#F3F4F6',
  divider:      '#E5E7EB',
};

// ── Typography ───────────────────────────────────────────────────────
export const fontFamily = "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif";

export const typography = {
  pageTitle: {
    fontFamily,
    fontSize: '1.75rem',
    fontWeight: 700,
    color: colors.text,
    letterSpacing: '-0.025em',
    lineHeight: 1.2,
    margin: 0,
  },
  pageSubtitle: {
    fontFamily,
    fontSize: '0.9rem',
    fontWeight: 400,
    color: colors.textSecondary,
    lineHeight: 1.5,
    margin: 0,
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily,
    fontSize: '1.05rem',
    fontWeight: 600,
    color: colors.text,
    letterSpacing: '-0.01em',
    lineHeight: 1.3,
    margin: 0,
  },
  sectionSubtitle: {
    fontFamily,
    fontSize: '0.8rem',
    fontWeight: 400,
    color: colors.textMuted,
    lineHeight: 1.4,
    margin: 0,
    marginTop: 2,
  },
  label: {
    fontFamily,
    fontSize: '0.75rem',
    fontWeight: 500,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    lineHeight: 1.4,
    margin: 0,
  },
  value: {
    fontFamily,
    fontSize: '1.6rem',
    fontWeight: 700,
    color: colors.text,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
    margin: 0,
  },
  body: {
    fontFamily,
    fontSize: '0.875rem',
    fontWeight: 400,
    color: colors.text,
    lineHeight: 1.6,
    margin: 0,
  },
  caption: {
    fontFamily,
    fontSize: '0.75rem',
    fontWeight: 400,
    color: colors.textMuted,
    lineHeight: 1.4,
    margin: 0,
  },
};

// ── Spacing Scale (px) ───────────────────────────────────────────────
export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

// ── Radius ───────────────────────────────────────────────────────────
export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// ── Shadows ──────────────────────────────────────────────────────────
export const shadows = {
  sm:   '0 1px 2px rgba(0,0,0,0.04)',
  card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  md:   '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
  lg:   '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)',
};

// ── Transitions ──────────────────────────────────────────────────────
export const transition = {
  fast:    'all 0.15s ease',
  normal:  'all 0.2s ease',
  smooth:  'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

// ── Reusable Component Styles ────────────────────────────────────────

/** Standard white card panel */
export const card = {
  background: colors.cardBg,
  borderRadius: radius.md,
  boxShadow: shadows.card,
  border: `1px solid ${colors.border}`,
  padding: space['2xl'],
  transition: transition.normal,
};

/** Card header row — title left, optional action right */
export const cardHeader = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: space.lg,
};

/** Primary filled button */
export const btnPrimary = {
  fontFamily,
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#ffffff',
  background: colors.primary,
  border: 'none',
  borderRadius: radius.sm,
  padding: `${space.sm}px ${space.lg}px`,
  cursor: 'pointer',
  transition: transition.fast,
  letterSpacing: '0.01em',
  lineHeight: 1.4,
};

/** Ghost / outline button */
export const btnGhost = {
  ...btnPrimary,
  color: colors.primary,
  background: 'transparent',
  border: `1px solid ${colors.border}`,
};

/** Small pill badge */
export const badge = (bg = colors.primaryGhost, fg = colors.primary) => ({
  fontFamily,
  fontSize: '0.7rem',
  fontWeight: 600,
  color: fg,
  background: bg,
  borderRadius: radius.full,
  padding: `3px 10px`,
  display: 'inline-block',
  lineHeight: 1.4,
});

/** Divider line */
export const divider = {
  height: 1,
  background: colors.divider,
  border: 'none',
  margin: `${space.lg}px 0`,
};

// ── Layout Helpers ───────────────────────────────────────────────────

/** Page-level wrapper: max-width, centered, padded */
export const pageWrapper = {
  maxWidth: 1400,
  margin: '0 auto',
  padding: space['2xl'],
  minHeight: '100vh',
  background: colors.pageBg,
  boxSizing: 'border-box',
};

/** Responsive grid — falls back to single column below 900px via JS */
export const grid = (columns = 2, gap = space['2xl']) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${columns}, 1fr)`,
  gap,
});

/** Flex row helper */
export const row = (gap = space.lg, align = 'center') => ({
  display: 'flex',
  alignItems: align,
  gap,
});

/** Flex column helper */
export const col = (gap = space.md) => ({
  display: 'flex',
  flexDirection: 'column',
  gap,
});
