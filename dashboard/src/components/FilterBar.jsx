import { useState } from 'react';
import {
  colors, typography, space, radius, shadows, transition, fontFamily,
} from '../styles';

/**
 * FilterBar — Controlled filter UI with explicit "Load Data" action.
 *
 * Props:
 *   projectId {string}  — controlled default for project ID input
 *   pageUrl   {string}  — controlled default for page URL input
 *   onFilter  {({ projectId, pageUrl }) => void} — fires ONLY on button click
 */

/* ── Inject keyframe animations once ─────────────────────────────────── */
if (typeof document !== 'undefined' && !document.getElementById('filterbar-keyframes')) {
  const style = document.createElement('style');
  style.id = 'filterbar-keyframes';
  style.textContent = `
    @keyframes fb-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes fb-fadeIn {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

export default function FilterBar({
  projectId: initProject,
  pageUrl: initPage,
  onFilter,
}) {
  const [localProject, setLocalProject] = useState(initProject ?? 'test-project-001');
  const [localPage, setLocalPage]       = useState(initPage ?? 'http://localhost/test');
  const [btnHover, setBtnHover]         = useState(false);
  const [btnActive, setBtnActive]       = useState(false);

  /* ── Styles ──────────────────────────────────────────────────────── */

  const wrapperStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: space.lg,
    background: colors.cardBg,
    borderRadius: radius.lg,
    boxShadow: shadows.card,
    border: `1px solid ${colors.border}`,
    padding: `${space.xl}px ${space['2xl']}px`,
    animation: 'fb-fadeIn 0.35s ease',
  };

  const fieldGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: space.xs,
    flex: 'none',
  };

  const labelStyle = {
    ...typography.label,
    display: 'block',
    userSelect: 'none',
  };

  const inputBase = {
    fontFamily,
    fontSize: '0.85rem',
    color: colors.text,
    background: '#fff',
    border: `1.5px solid ${colors.border}`,
    borderRadius: radius.sm,
    padding: `${space.sm + 1}px ${space.md}px`,
    outline: 'none',
    transition: transition.fast,
    boxSizing: 'border-box',
    lineHeight: 1.5,
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = colors.primary;
    e.target.style.boxShadow = `0 0 0 3px ${colors.primaryGhost}`;
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = colors.border;
    e.target.style.boxShadow = 'none';
  };

  const buttonStyle = {
    fontFamily,
    fontSize: '0.8rem',
    fontWeight: 600,
    letterSpacing: '0.02em',
    lineHeight: 1.4,
    color: '#ffffff',
    background: btnActive
      ? colors.primaryDark
      : btnHover
        ? `linear-gradient(135deg, ${colors.primaryDark}, ${colors.primary})`
        : `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
    border: 'none',
    borderRadius: radius.sm,
    padding: `${space.sm + 1}px ${space.xl}px`,
    cursor: 'pointer',
    transition: transition.fast,
    boxShadow: btnHover
      ? `0 4px 12px rgba(26, 86, 219, 0.35)`
      : `0 2px 6px rgba(26, 86, 219, 0.18)`,
    transform: btnActive ? 'scale(0.97)' : btnHover ? 'translateY(-1px)' : 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: space.sm,
    whiteSpace: 'nowrap',
  };

  const noteStyle = {
    ...typography.caption,
    color: colors.textMuted,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    whiteSpace: 'nowrap',
  };

  /* ── Handler ─────────────────────────────────────────────────────── */

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ projectId: localProject.trim(), pageUrl: localPage.trim() });
  };

  /* ── Render ──────────────────────────────────────────────────────── */

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Filter heatmap data"
      style={wrapperStyle}
    >
      {/* ── Project ID ──────────────────────────────────────────── */}
      <div style={fieldGroupStyle}>
        <label style={labelStyle} htmlFor="input-projectId">
          Project ID
        </label>
        <input
          id="input-projectId"
          type="text"
          autoComplete="off"
          spellCheck="false"
          value={localProject}
          onChange={(e) => setLocalProject(e.target.value)}
          placeholder="test-project-001"
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{ ...inputBase, width: 220 }}
        />
      </div>

      {/* ── Page URL ────────────────────────────────────────────── */}
      <div style={fieldGroupStyle}>
        <label style={labelStyle} htmlFor="input-pageUrl">
          Page URL
        </label>
        <input
          id="input-pageUrl"
          type="url"
          autoComplete="off"
          spellCheck="false"
          value={localPage}
          onChange={(e) => setLocalPage(e.target.value)}
          placeholder="http://localhost/test"
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{ ...inputBase, width: 300 }}
        />
      </div>

      {/* ── Load Data + note ────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.xs, alignSelf: 'flex-end' }}>
        <button
          id="btn-load-data"
          type="submit"
          style={buttonStyle}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => { setBtnHover(false); setBtnActive(false); }}
          onMouseDown={() => setBtnActive(true)}
          onMouseUp={() => setBtnActive(false)}
          aria-label="Load heatmap data"
        >
          {/* search icon */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Load Data
        </button>

        <span style={noteStyle}>
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              animation: 'fb-spin 2.5s linear infinite',
              fontSize: '0.8rem',
              lineHeight: 1,
            }}
          >
            ↻
          </span>
          Auto-refreshing every 30s
        </span>
      </div>
    </form>
  );
}
