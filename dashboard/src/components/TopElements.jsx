import React from 'react';
import { MousePointer2, ExternalLink } from 'lucide-react';

export default function TopElements({ loading, data = [] }) {
  const isEmpty = !loading && (!data || data.length === 0);

  if (loading) {
    return (
      <div className="glass-card p-6 h-64 flex items-center justify-center animate-pulse">
        <div className="w-8 h-8 border-4 border-luxury-blue border-r-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="glass-card p-12 flex flex-col items-center justify-center text-center gap-4 bg-slate-50/50 group/elements">
        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-luxury-blue mb-2 group-hover/elements:scale-110 transition-transform">
          <MousePointer2 size={28} />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold text-slate-400 font-heading">No data available yet</h3>
          <p className="text-[10px] text-slate-300 font-medium uppercase tracking-tighter">Start interacting with your website to generate insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 flex flex-col gap-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-shadow">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-border-soft pb-5">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-2xl font-bold font-heading text-luxury-text flex items-center gap-2.5 tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-luxury-blue flex items-center justify-center border border-blue-100">
               <MousePointer2 size={16} />
            </div>
            Top Clicked Elements
          </h3>
          <p className="text-xs text-secondary font-medium mt-1">Most interacted DOM elements across active active tracking sessions</p>
        </div>
        <span className="text-[10px] uppercase font-black tracking-widest text-secondary bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
          Last 30 Days
        </span>
      </div>

      {/* List */}
      <div className="flex flex-col gap-5">
        {data.map((el, index) => (
          <div key={el.id} className="flex flex-col gap-2.5 group cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3.5">
                <span className={`w-6 h-6 rounded-md flex flex-col items-center justify-center shrink-0 border text-[11px] font-black shadow-sm ${index === 0 ? 'bg-amber-50 text-amber-600 border-amber-200' : index === 1 ? 'bg-slate-100 text-slate-500 border-slate-300' : index === 2 ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                  {index + 1}
                </span>
                <span className="font-bold text-luxury-text group-hover:text-luxury-blue transition-colors text-[15px]">
                  {el.label}
                </span>
                <span className="hidden sm:flex text-[10px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200 items-center gap-1 group-hover:border-luxury-blue/30 group-hover:text-luxury-blue/70 transition-colors shadow-sm">
                  {el.name} <ExternalLink size={10} />
                </span>
              </div>
              <div className="flex items-center gap-5 text-right">
                <div className="flex flex-col items-end">
                   <span className="text-[9px] uppercase font-black tracking-widest text-slate-400">Interactions</span>
                   <span className="font-black text-slate-800 tabular-nums">{el.clicks.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[9px] uppercase font-black tracking-widest text-slate-400">Share</span>
                   <span className="text-sm font-black text-luxury-blue w-12 bg-blue-50 py-0.5 rounded text-center border border-blue-100">{el.percentage}%</span>
                </div>
              </div>
            </div>
            
            {/* Progress Bar width calculation */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:shadow-[0_0_8px_rgba(0,102,255,0.5)] ${index === 0 ? 'bg-gradient-to-r from-luxury-blue to-blue-400' : 'bg-luxury-blue/80'}`}
                style={{ width: `${el.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
