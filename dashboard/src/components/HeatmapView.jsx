import { useEffect, useRef } from 'react';
import h337 from 'heatmap.js';
import { colors, typography, space, radius } from '../styles';

/**
 * HeatmapView — the centrepiece heatmap canvas.
 *
 * Props:
 *   data    {Array<{ x, y, value }>}
 *   total   {number}
 *   loading {boolean}
 *   error   {string|null}
 */
export default function HeatmapView({ data = [], total = 0, loading = false, error = null }) {
  const containerRef    = useRef(null);
  const heatmapInstance = useRef(null);

  // ── Create heatmap instance once on mount ─────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    heatmapInstance.current = h337.create({
      container:  containerRef.current,
      maxOpacity: 0.8,
      radius:     30,
      blur:       0.75,
    });

    // Expose test helper on window for console-based QA
    window.__testHeatmap = (points) => {
      if (!heatmapInstance.current) return;
      heatmapInstance.current.setData({
        max:  5,
        data: points.map((p) => ({
          x:     Math.round(p.x),
          y:     Math.round(p.y),
          value: p.value,
        })),
      });
    };

    return () => {
      delete window.__testHeatmap;
    };
  }, []);

  // ── Update heatmap when data prop changes ─────────────────────────
  useEffect(() => {
    if (!heatmapInstance.current) return;
    heatmapInstance.current.setData({
      max:  5,
      data: data.map((p) => ({
        x:     Math.round(p.x),
        y:     Math.round(p.y),
        value: p.value,
      })),
    });
  }, [data]);

  const isEmpty = !loading && !error && data.length === 0;

  return (
    <div>
      {/* ── Canvas container ────────────────────────────────────── */}
      <div
        ref={containerRef}
        style={{
          width:        '100%',
          height:        500,
          position:     'relative',
          background:   '#f8f8f8',
          borderRadius:  radius.md,
          border:       `1px solid ${colors.border}`,
          overflow:     'hidden',
        }}
      >
        {/* Loading overlay */}
        {loading && (
          <div style={centreOverlay}>
            <Spinner />
            <span style={{ ...typography.caption, marginTop: space.md }}>Loading heatmap…</span>
          </div>
        )}

        {/* Error overlay */}
        {error && !loading && (
          <div style={{ ...centreOverlay, flexDirection: 'column', gap: space.sm }}>
            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
            <span style={{ ...typography.body, color: colors.danger }}>{error}</span>
          </div>
        )}

        {/* Empty state */}
        {isEmpty && (
          <div style={centreOverlay}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: space.md }}>🖱️</span>
              <p style={{ ...typography.body, color: colors.textSecondary }}>
                No click data yet
              </p>
              <p style={{ ...typography.caption, marginTop: space.xs }}>
                Interact with the tracked page to see results
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer row ───────────────────────────────────────────── */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          marginTop:       space.md,
          flexWrap:       'wrap',
          gap:             space.sm,
        }}
      >
        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: space.xl }}>
          <LegendItem color="#ff0000" label="High activity" />
          <LegendItem color="#0000ff" label="Low activity"  />
        </div>

        {/* Count */}
        <span style={typography.caption}>
          {loading ? 'Loading…' : `Showing ${total.toLocaleString()} click event${total !== 1 ? 's' : ''}`}
        </span>
      </div>
    </div>
  );
}

// ── Internal helpers ──────────────────────────────────────────────────

const centreOverlay = {
  position:       'absolute',
  inset:           0,
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  flexDirection:  'column',
};

function LegendItem({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 12, height: 12, borderRadius: '50%', background: color, display: 'inline-block' }} />
      <span style={{ ...({ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#6B7280' }) }}>{label}</span>
    </div>
  );
}

function Spinner() {
  return (
    <div
      style={{
        width:        36,
        height:       36,
        border:       `3px solid ${colors.border}`,
        borderTop:    `3px solid ${colors.primary}`,
        borderRadius: '50%',
        animation:    'spin 0.8s linear infinite',
      }}
    />
  );
}

// Inject keyframes once
if (typeof document !== 'undefined' && !document.getElementById('heatmap-spin-style')) {
  const style = document.createElement('style');
  style.id = 'heatmap-spin-style';
  style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(style);
}
