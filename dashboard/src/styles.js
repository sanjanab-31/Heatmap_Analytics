// ─── Design System: Heatmap Dashboard ───────────────────────────────
// All visual tokens live here so every component draws from one source.

// ── Color Palette ────────────────────────────────────────────────────
export const colors = {
  // Backgrounds
  pageBg:       '#f8fafc',
  cardBg:       '#ffffff',
  cardBgHover:  '#fafbfc',

  // Brand
  primary:      '#0066FF',
  primaryLight: '#3B82F6',
  primaryDark:  '#1E40AF',
  primaryGhost: 'rgba(0, 102, 255, 0.05)',

  // Semantic
  success:      '#10b981',
  successBg:    'rgba(16, 185, 129, 0.08)',
  warning:      '#f59e0b',
  warningBg:    'rgba(245, 158, 11, 0.08)',
  danger:       '#ef4444',
  dangerBg:     'rgba(239, 68, 68, 0.08)',
  info:         '#0ea5e9',
  infoBg:       'rgba(14, 165, 233, 0.08)',

  // Neutrals
  text:         '#0f172a',
  textSecondary:'#64748b',
  textMuted:    '#94a3b8',
  border:       '#e2e8f0',
  borderLight:  'rgba(226, 232, 240, 0.4)',
  divider:      'rgba(226, 232, 240, 0.6)',
};

// ── Typography ───────────────────────────────────────────────────────
export const fontFamily = "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif";
export const headingFont = "'Outfit', sans-serif";

export const typography = {
  pageTitle: {
    fontFamily: headingFont,
    fontSize: '2rem',
    fontWeight: 700,
    color: colors.text,
    letterSpacing: '-0.03em',
    lineHeight: 1.1,
    margin: 0,
  },
  pageSubtitle: {
    fontFamily,
    fontSize: '0.95rem',
    fontWeight: 500,
    color: colors.textSecondary,
    lineHeight: 1.5,
    margin: 0,
    marginTop: 6,
  },
  sectionTitle: {
    fontFamily: headingFont,
    fontSize: '1.25rem',
    fontWeight: 600,
    color: colors.text,
    letterSpacing: '-0.015em',
    lineHeight: 1.3,
    margin: 0,
  },
  sectionSubtitle: {
    fontFamily,
    fontSize: '0.85rem',
    fontWeight: 400,
    color: colors.textMuted,
    lineHeight: 1.4,
    margin: 0,
    marginTop: 4,
  },
  label: {
    fontFamily,
    fontSize: '0.75rem',
    fontWeight: 600,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    lineHeight: 1.4,
    margin: 0,
  },
  value: {
    fontFamily: headingFont,
    fontSize: '1.75rem',
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
  '2xl': 24,
  full: 9999,
};

// ── Shadows ──────────────────────────────────────────────────────────
export const shadows = {
  sm:   '0 1px 2px rgba(0,0,0,0.03)',
  premium: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
  luxury: '0 25px 50px -12px rgba(0, 0, 0, 0.04)',
  glow: '0 0 25px rgba(0, 102, 255, 0.12)',
};

// ── Transitions ──────────────────────────────────────────────────────
export const transition = {
  fast:    'all 0.15s ease',
  normal:  'all 0.25s ease',
  smooth:  'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
};

// ── Reusable Component Styles ────────────────────────────────────────

/** Standard luxury card panel */
export const card = {
  background: colors.cardBg,
  borderRadius: radius.xl,
  boxShadow: shadows.premium,
  border: `1px solid ${colors.border}`,
  padding: space['3xl'],
  transition: transition.smooth,
};

/** Card header row — title left, optional action right */
export const cardHeader = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: space.xl,
};

/** Primary filled button */
export const btnPrimary = {
  fontFamily: headingFont,
  fontSize: '0.85rem',
  fontWeight: 600,
  color: '#ffffff',
  background: colors.primary,
  border: 'none',
  borderRadius: radius.lg,
  padding: `${space.md}px ${space.xl}px`,
  cursor: 'pointer',
  transition: transition.normal,
  letterSpacing: '0.01em',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

/** Ghost button */
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
  padding: `4px 12px`,
  display: 'inline-block',
  lineHeight: 1,
});

/** Divider line */
export const divider = {
  height: 1,
  background: colors.divider,
  border: 'none',
  margin: `${space.xl}px 0`,
};

// ── Layout Helpers ───────────────────────────────────────────────────

/** Page-level wrapper */
export const pageWrapper = {
  maxWidth: 1600,
  margin: '0 auto',
  padding: `${space['4xl']}px ${space['5xl']}px`,
  minHeight: '100vh',
  background: colors.pageBg,
  boxSizing: 'border-box',
};

/** Responsive grid */
export const grid = (columns = 2, gap = space['3xl']) => ({
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
