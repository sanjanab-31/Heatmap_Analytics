import { useState } from 'react';
import { colors, typography, space, radius, shadows, transition, btnPrimary, btnGhost, fontFamily } from '../styles';

/**
 * FilterBar — project / page URL inputs + Load Data trigger.
 *
 * Props:
 *   projectId {string}
 *   pageUrl   {string}
 *   onFilter  {({ projectId, pageUrl }) => void}
 */
export default function FilterBar({ projectId: initProject, pageUrl: initPage, onFilter }) {
  const [localProject, setLocalProject] = useState(initProject ?? 'test-project-001');
  const [localPage,    setLocalPage]    = useState(initPage    ?? 'http://localhost/test');

  const inputStyle = {
    fontFamily,
    fontSize: '0.85rem',
    color: colors.text,
    background: '#fff',
    border: `1px solid ${colors.border}`,
    borderRadius: radius.sm,
    padding: `${space.sm}px ${space.md}px`,
    outline: 'none',
    transition: transition.fast,
    width: 220,
    boxSizing: 'border-box',
  };

  const labelStyle = {
    ...typography.label,
    marginBottom: space.xs,
    display: 'block',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ projectId: localProject.trim(), pageUrl: localPage.trim() });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: space.lg,
        background: '#fff',
        borderRadius: radius.md,
        boxShadow: shadows.card,
        border: `1px solid ${colors.border}`,
        padding: `${space.xl}px ${space['2xl']}px`,
      }}
    >
      {/* Project ID */}
      <div>
        <label style={labelStyle} htmlFor="input-projectId">Project ID</label>
        <input
          id="input-projectId"
          type="text"
          value={localProject}
          onChange={(e) => setLocalProject(e.target.value)}
          placeholder="test-project-001"
          style={inputStyle}
          onFocus={(e)  => (e.target.style.borderColor = colors.primary)}
          onBlur={(e)   => (e.target.style.borderColor = colors.border)}
        />
      </div>

      {/* Page URL */}
      <div>
        <label style={labelStyle} htmlFor="input-pageUrl">Page URL</label>
        <input
          id="input-pageUrl"
          type="text"
          value={localPage}
          onChange={(e) => setLocalPage(e.target.value)}
          placeholder="http://localhost/test"
          style={{ ...inputStyle, width: 300 }}
          onFocus={(e)  => (e.target.style.borderColor = colors.primary)}
          onBlur={(e)   => (e.target.style.borderColor = colors.border)}
        />
      </div>

      {/* Submit */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.xs }}>
        <button
          id="btn-load-data"
          type="submit"
          style={btnPrimary}
          onMouseEnter={(e) => (e.target.style.background = colors.primaryDark)}
          onMouseLeave={(e) => (e.target.style.background = colors.primary)}
        >
          Load Data
        </button>
        <span style={{ ...typography.caption, color: colors.textMuted }}>
          ↻ Auto-refreshing every 30s
        </span>
      </div>
    </form>
  );
}
