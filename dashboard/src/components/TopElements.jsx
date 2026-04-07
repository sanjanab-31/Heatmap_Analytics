import React from 'react';
import { MousePointer2, ExternalLink } from 'lucide-react';

export default function TopElements({ loading, data = [] }) {
  const isEmpty = !loading && (!data || data.length === 0);

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 h-56 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-luxury-blue rounded-full animate-spin" />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center text-center gap-3">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-luxury-blue">
          <MousePointer2 size={22} />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-slate-500 font-heading">No data available yet</h3>
          <p className="text-xs text-slate-400 font-medium">Interact with the website to generate element insights.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-slate-200 pb-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold font-heading text-luxury-text flex items-center gap-2 tracking-tight">
            <div className="w-7 h-7 rounded-md bg-blue-50 text-luxury-blue flex items-center justify-center border border-blue-100">
               <MousePointer2 size={16} />
            </div>
            Top Clicked Elements
          </h3>
          <p className="text-xs text-secondary font-medium">Most interacted elements in the selected range.</p>
        </div>
        <span className="text-[10px] uppercase font-semibold tracking-wide text-secondary bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
          Last 30 Days
        </span>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {data.map((el, index) => (
          <div key={el.id} className="flex flex-col gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border text-[11px] font-semibold ${index === 0 ? 'bg-amber-50 text-amber-600 border-amber-200' : index === 1 ? 'bg-slate-100 text-slate-500 border-slate-300' : index === 2 ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                  {index + 1}
                </span>
                <span className="font-semibold text-luxury-text text-sm">
                  {el.label}
                </span>
                <span className="hidden sm:flex text-[10px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200 items-center gap-1">
                  {el.name} <ExternalLink size={10} />
                </span>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div className="flex flex-col items-end">
                   <span className="text-[9px] uppercase font-semibold tracking-wide text-slate-400">Interactions</span>
                   <span className="font-semibold text-slate-800 tabular-nums">{el.clicks.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[9px] uppercase font-semibold tracking-wide text-slate-400">Share</span>
                   <span className="text-sm font-semibold text-luxury-blue w-12 bg-blue-50 py-0.5 rounded text-center border border-blue-100">{el.percentage}%</span>
                </div>
              </div>
            </div>
            
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 ease-out ${index === 0 ? 'bg-gradient-to-r from-luxury-blue to-blue-400' : 'bg-luxury-blue/80'}`}
                style={{ width: `${el.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
