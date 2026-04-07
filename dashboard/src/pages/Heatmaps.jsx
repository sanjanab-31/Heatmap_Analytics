import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useHeatmapData } from '../hooks/useHeatmapData';
import HeatmapView from '../components/HeatmapView';
import FilterBar from '../components/FilterBar';

export default function Heatmaps() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    projectId: '',
    pageUrl:   '',
  });

  const { data, total, loading: hmLoading, error: hmError } = useHeatmapData(filters);

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate('/')}
            className="w-12 h-12 rounded-2xl bg-white border border-border-soft flex items-center justify-center hover:bg-slate-50 transition-all duration-300 shadow-sm hover:shadow-md text-luxury-text"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div className="flex flex-col gap-0.5">
            <h1 className="text-3xl font-bold font-heading text-luxury-text capitalize tracking-tight">
              Detailed Heatmap Analysis
            </h1>
            <p className="text-sm font-medium text-secondary italic">Visualizing Interaction Density</p>
          </div>
        </div>

        <FilterBar
          projectId={filters.projectId}
          pageUrl={filters.pageUrl}
          onFilter={(f) => setFilters(f)}
        />
      </div>

      <div className="glass-card p-10 min-h-[750px] flex flex-col relative">
        <div className="w-full h-full flex flex-col gap-10">
           <div className="flex-1 min-h-[600px]">
              <HeatmapView data={data} total={total} loading={hmLoading} error={hmError} largeHeight={600} pageUrl={filters.pageUrl} />
           </div>
           
           {/* Legend & Stats Overlay */}
           <div className="flex items-center justify-center gap-12 p-6 bg-slate-50/50 rounded-2xl border border-slate-100 self-center">
              <LegendItem color="#0066FF" label="Low Interaction" />
              <LegendItem color="#10b981" label="Active Region" />
              <LegendItem color="#f59e0b" label="Engagement Zone" />
              <LegendItem color="#ef4444" label="Extreme Hotspot" />
           </div>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2.5 group">
      <div className="relative">
         <div className="w-3 h-3 rounded-full" style={{ background: color }} />
         <div className="absolute inset-0 w-3 h-3 rounded-full animate-ping opacity-20" style={{ background: color }} />
      </div>
      <span className="text-[10px] uppercase font-black font-heading tracking-widest text-secondary group-hover:text-luxury-text transition-colors">
        {label}
      </span>
    </div>
  );
}
