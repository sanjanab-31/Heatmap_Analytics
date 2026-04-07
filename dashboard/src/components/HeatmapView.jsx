import { useEffect, useRef } from 'react';
import { AlertTriangle, MousePointer2, Flame } from 'lucide-react';

/**
 * HeatmapView — A premium, Tailwind-integrated heatmap visualization.
 */
export default function HeatmapView({ data = [], total = 0, loading = false, error = null, largeHeight = 440, pageUrl }) {
  const containerRef = useRef(null);
  const heatmapInstance = useRef(null);

  // ── Initialize Heatmap Instance ────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    if (!window.h337) return;

    // Create the instance once on mount
    heatmapInstance.current = window.h337.create({
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
      const dataPoints = Array.isArray(points) ? points : [];

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

  // Calculate the top hotspot
  const topHotspot = data && data.length > 0 
    ? [...data].sort((a, b) => (b.value || 1) - (a.value || 1))[0] 
    : null;

  return (
    <div className="relative w-full h-full flex flex-col group/heatmap">
      {/* ── Main Canvas Container ────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="w-full relative overflow-hidden transition-all duration-700 bg-slate-900 rounded-xl shadow-inner border border-slate-200"
        style={{ height: largeHeight }}
      >
        {/* Background Website Representation */}
        {pageUrl ? (
          <div className="absolute inset-0 z-0 bg-white">
            <div className="w-full h-8 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="mx-auto w-1/2 max-w-sm h-5 bg-white rounded-md border border-slate-200 flex items-center px-3 text-[10px] text-slate-400 font-mono truncate">
                {pageUrl}
              </div>
            </div>
            <iframe 
              src={pageUrl} 
              title="Site Background"
              className="w-full h-[calc(100%-2rem)] border-none opacity-40 grayscale pointer-events-none"
            />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-slate-50 opacity-50 diagram-pattern" />
        )}

        {/* Top Hotspot Label */}
        {topHotspot && !loading && !error && (
          <div 
            className="absolute z-40 bg-red-600 text-white text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-lg shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 animate-bounce"
            style={{ left: topHotspot.x, top: topHotspot.y }}
          >
            #1 Hotspot
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-red-600" />
          </div>
        )}

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
                 <AlertTriangle size={28} className="text-red-500" />
                 <p className="text-xs font-bold text-red-500">{error}</p>
                 <button onClick={() => window.location.reload()} className="text-[10px] uppercase font-bold text-luxury-blue underline">Retry Connection</button>
               </>
             )}
          </div>
        )}

        {/* Empty State */}
        {isEmpty && !loading && !error && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50/50 backdrop-blur-[1px]">
             <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-luxury-blue mb-4 group-hover/heatmap:scale-110 transition-transform">
               <MousePointer2 size={28} />
             </div>
             <p className="text-sm font-bold text-slate-400 font-heading">No data available yet</p>
             <p className="text-[10px] text-slate-300 font-medium uppercase tracking-tighter">Start interacting with your website to generate insights</p>
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

        <div className="flex items-center gap-6">
           <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Total Interactions</span>
              <span className="text-lg font-black text-space-900 tabular-nums">{total.toLocaleString()}</span>
           </div>
           
           <div className="h-8 w-[1px] bg-slate-200" />
           
           <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                 <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Peak Density</span>
                 {topHotspot ? (
                   <span className="text-sm font-bold text-red-500 tabular-nums">
                     ({topHotspot.x}x, {topHotspot.y}y)
                   </span>
                 ) : (
                   <span className="text-sm font-bold text-slate-400">N/A</span>
                 )}
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 border border-red-100">
                  <Flame size={18} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
