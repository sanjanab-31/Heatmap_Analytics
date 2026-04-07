import { useEffect, useRef } from 'react';
import h337 from 'heatmap.js';

/**
 * HeatmapView — A premium, Tailwind-integrated heatmap visualization.
 */
export default function HeatmapView({ data = [], total = 0, loading = false, error = null, largeHeight = 440 }) {
  const containerRef = useRef(null);
  const heatmapInstance = useRef(null);

  // ── Initialize Heatmap Instance ────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    // Create the instance once on mount
    heatmapInstance.current = h337.create({
      container: containerRef.current,
      maxOpacity: 0.8,
      radius: 40,
      blur: 0.8,
      gradient: {
        '0.25': 'blue',
        '0.55': 'green',
        '0.85': 'yellow',
        '1.0': 'red'
      }
    });

    // Expose global test helper
    window.__testHeatmap = (points) => {
      if (!heatmapInstance.current) return;
      const dataPoints = points || Array.from({ length: 80 }, () => ({
        x: Math.random() * containerRef.current.offsetWidth,
        y: Math.random() * containerRef.current.offsetHeight,
        value: Math.floor(Math.random() * 5) + 1,
      }));

      heatmapInstance.current.setData({
        max: 5,
        data: dataPoints.map(p => ({
          x: Math.round(p.x),
          y: Math.round(p.y),
          value: p.value || 1,
        })),
      });
    };

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
    <div className="relative w-full h-full flex flex-col group/heatmap">
      {/* ── Main Canvas Container ────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="w-full relative overflow-hidden transition-all duration-700 bg-slate-50/30 rounded-xl"
        style={{ height: largeHeight }}
      >
        {/* Loading Overlay */}
        {(loading || error) && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-4 animate-fade-in">
             {loading && (
               <>
                 <div className="w-10 h-10 border-4 border-slate-200 border-t-luxury-blue rounded-full animate-spin" />
                 <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Collecting Signals...</p>
               </>
             )}
             {error && (
               <>
                 <span className="text-3xl">⚠️</span>
                 <p className="text-xs font-bold text-red-500">{error}</p>
                 <button onClick={() => window.location.reload()} className="text-[10px] uppercase font-bold text-luxury-blue underline">Retry Connection</button>
               </>
             )}
          </div>
        )}

        {/* Empty State */}
        {isEmpty && !loading && !error && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50/50 backdrop-blur-[1px]">
             <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-2xl mb-4 group-hover/heatmap:scale-110 transition-transform">
                🖱️
             </div>
             <p className="text-sm font-bold text-slate-400 font-heading">No Visual Data Yet</p>
             <p className="text-[10px] text-slate-300 font-medium uppercase tracking-tighter">Please initiate interaction tracking</p>
          </div>
        )}
      </div>

      {/* ── Info Bar ───────────────────────────────────────── */}
      <div className="flex items-center justify-between mt-6 px-1">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 group/legend cursor-help">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] group-hover/legend:scale-150 transition-transform" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">High Intensity</span>
           </div>
           <div className="flex items-center gap-2 group/legend cursor-help">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover/legend:scale-150 transition-transform" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Low Intensity</span>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Samples</span>
              <span className="text-sm font-bold text-luxury-blue tabular-nums">{total.toLocaleString()} Events</span>
           </div>
           <div className="w-8 h-8 rounded-lg bg-luxury-blue/10 flex items-center justify-center text-luxury-blue">
              📍
           </div>
        </div>
      </div>
    </div>
  );
}
