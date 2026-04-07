import { useEffect, useRef } from 'react';
import h337 from 'heatmap.js';
import { colors, typography, space, radius, card, shadows, transition } from '../styles';

/**
 * HeatmapView — A robust, premium heatmap visualization component.
 * 
 * Props:
 *   data    {Array<{ x, y, value }>} - List of click events
 *   total   {number}                 - Total count for display
 *   loading {boolean}                - Loading state toggle
 *   error   {string|null}            - Error message if any
 */
export default function HeatmapView({ data = [], total = 0, loading = false, error = null }) {
  const containerRef = useRef(null);
  const heatmapInstance = useRef(null);

  // ── Initialize Heatmap Instance ────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    // Create the instance once on mount
    heatmapInstance.current = h337.create({
      container: containerRef.current,
      maxOpacity: 0.8,
      radius: 30,
      blur: 0.75,
    });

    // Expose global test helper for manual injection
    window.__testHeatmap = (points) => {
      if (!heatmapInstance.current) return;
      heatmapInstance.current.setData({
        max: 5,
        data: (points || []).map(p => ({
          x: Math.round(p.x),
          y: Math.round(p.y),
          value: p.value || 1,
        })),
      });
    };

    // Cleanup on unmount
    return () => {
      if (window.__testHeatmap) delete window.__testHeatmap;
    };
  }, []);

  // ── Update Data ───────────────────────────────────────────────────
  useEffect(() => {
    if (!heatmapInstance.current) return;

    const safeData = Array.isArray(data) ? data : [];
    
    heatmapInstance.current.setData({
      max: 5,
      data: safeData.map(p => ({
        x: Math.round(p.x),
        y: Math.round(p.y),
        value: p.value || 1,
      })),
    });
  }, [data]);

  const isEmpty = !loading && !error && (!data || data.length === 0);

  return (
    <div style={{ position: 'relative' }}>
      {/* ── Main Canvas Container ────────────────────────────────────── */}
      <div
        ref={containerRef}
        id="heatmap-canvas-container"
        style={{
          width: '100%',
          height: 500,
          background: '#fcfcfc',
          borderRadius: radius.md,
          border: `1px solid ${colors.border}`,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
        }}
      >
        {/* Loading Overlay */}
        {loading && (
          <div style={overlayStyles}>
            <div className="spinner" style={spinnerStyles} />
            <p style={{ ...typography.caption, marginTop: space.sm }}>Loading Analytics...</p>
          </div>
        )}

        {/* Empty State Overlay */}
        {isEmpty && (
          <div style={overlayStyles}>
            <div style={{ textAlign: 'center', opacity: 0.6 }}>
              <div style={{ fontSize: '2rem', marginBottom: space.sm }}>🖱️</div>
              <p style={typography.body}>No click data for this selection</p>
              <p style={typography.caption}>Try selecting a different page or date range</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Legend & Info Row ───────────────────────────────────────── */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginTop: space.md,
        padding: `0 ${space.xs}px`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: space.xl }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
            <div style={{ ...legendDot, background: '#ff0000', boxShadow: '0 0 8px rgba(255,0,0,0.3)' }} />
            <span style={typography.caption}>High Activity</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
            <div style={{ ...legendDot, background: '#0000ff', boxShadow: '0 0 8px rgba(0,0,255,0.2)' }} />
            <span style={typography.caption}>Low Activity</span>
          </div>
        </div>

        <span style={{ ...typography.caption, fontWeight: 600, color: colors.primary }}>
          {loading ? 'Refreshing...' : `Showing ${total.toLocaleString()} click events`}
        </span>
      </div>

      {/* ── Local Styles (Spinner Animation) ─────────────────────────── */}
      <style>{`
        @keyframes hmap-spin {
          to { transform: rotate(360deg); }
        }
        .spinner {
          animation: hmap-spin 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
}

// ── Shared Overlay Styles ─────────────────────────────────────────────
const overlayStyles = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(2px)',
  zIndex: 10,
};

const spinnerStyles = {
  width: 32,
  height: 32,
  border: `3px solid ${colors.border}`,
  borderTop: `3px solid ${colors.primary}`,
  borderRadius: '50%',
};

const legendDot = {
  width: 10,
  height: 10,
  borderRadius: '50%',
};
