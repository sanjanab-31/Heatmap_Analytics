import { useState, useMemo } from 'react';
import { useHeatmapData } from '../hooks/useHeatmapData';
import { useAnalytics }   from '../hooks/useAnalytics';

import FilterBar   from '../components/FilterBar';
import StatsCards  from '../components/StatsCards';
import HeatmapView from '../components/HeatmapView';
import ClickChart  from '../components/ClickChart';
import ScrollChart from '../components/ScrollChart';

const DEFAULT_PROJECT = 'test-project-001';
const DEFAULT_PAGE    = 'http://localhost/test';

export default function Dashboard() {
  const [view, setView] = useState('overview'); // 'overview' | 'heatmap' | 'charts'
  const [filters, setFilters] = useState({
    projectId: DEFAULT_PROJECT,
    pageUrl:   DEFAULT_PAGE,
  });

  const { data, total, loading: hmLoading, error: hmError } = useHeatmapData(filters);
  const { analytics,   loading: anLoading, error: anError } = useAnalytics(filters);

  // ── Render Helpers ──────────────────────────────────────────────────

  const Overview = () => (
    <div className="flex flex-col gap-10 animate-fade-in">
      
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold font-heading text-gradient tracking-tight">
            Executive Insights
          </h1>
          <p className="text-secondary font-medium flex items-center gap-2">
            Real-time analytics engine <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          </p>
        </div>
        
        <FilterBar
          projectId={filters.projectId}
          pageUrl={filters.pageUrl}
          onFilter={(f) => setFilters(f)}
        />
      </div>

      {/* Stats Cards Section */}
      <StatsCards analytics={analytics} loading={anLoading} />

      {/* Main Grid: Heatmap & Click Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Heatmap Preview Card */}
        <section className="lg:col-span-7 flex flex-col gap-5">
          <div className="flex items-end justify-between px-2">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-xl font-bold text-luxury-text font-heading">Interaction Density</h3>
              <p className="text-xs text-secondary font-medium">Visualizing high-engagement terminal points</p>
            </div>
            <button 
              onClick={() => setView('heatmap')}
              className="px-4 py-2 text-xs font-bold text-luxury-blue bg-blue-50 hover:bg-luxury-blue hover:text-white rounded-xl transition-all duration-300 shadow-sm"
            >
              Expand view
            </button>
          </div>
          <div className="glass-card p-6 h-[550px] relative overflow-hidden">
            <HeatmapView data={data} total={total} loading={hmLoading} error={hmError} />
          </div>
        </section>

        {/* Click Distribution Card */}
        <section className="lg:col-span-5 flex flex-col gap-5">
          <div className="flex items-end justify-between px-2">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-xl font-bold text-luxury-text font-heading">Click Velocity</h3>
              <p className="text-xs text-secondary font-medium">Hourly interactions & peak periods</p>
            </div>
            <button 
              onClick={() => setView('charts')}
              className="px-4 py-2 text-xs font-bold text-luxury-blue bg-blue-50 hover:bg-luxury-blue hover:text-white rounded-xl transition-all duration-300 shadow-sm"
            >
              Full report
            </button>
          </div>
          <div className="glass-card p-6 h-[550px] relative overflow-hidden">
            <ClickChart analytics={analytics} loading={anLoading} />
          </div>
        </section>
      </div>

      {/* Scroll Analysis Section */}
      <section className="flex flex-col gap-5 mb-12">
        <div className="px-2">
          <h3 className="text-xl font-bold text-luxury-text font-heading">Conversion Funnel & Scroll Depth</h3>
          <p className="text-xs text-secondary font-medium">Tracking user retention across the page vertical</p>
        </div>
        <div className="glass-card p-8 min-h-[350px]">
          <ScrollChart analytics={analytics} loading={anLoading} />
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="pt-12 border-t border-border-soft flex items-center justify-between opacity-60">
        <div className="text-[10px] uppercase font-bold tracking-widest text-secondary flex items-center gap-3">
           <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
           Precision Analytics • Heatwave Intelligence 3.0
        </div>
        <div className="text-[10px] uppercase font-bold tracking-widest text-secondary">
          Data Integrity Verified: {new Date().toLocaleDateString()}
        </div>
      </footer>
    </div>
  );

  const DetailedView = () => (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex items-center gap-5">
        <button 
          onClick={() => setView('overview')}
          className="w-12 h-12 rounded-2xl bg-white border border-border-soft flex items-center justify-center hover:bg-slate-50 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <span className="text-lg">←</span>
        </button>
        <div className="flex flex-col gap-0.5">
          <h1 className="text-3xl font-bold font-heading text-luxury-text capitalize tracking-tight">
            Detailed {view} Analysis
          </h1>
          <p className="text-sm font-medium text-secondary italic">Project: {filters.projectId} • {filters.pageUrl}</p>
        </div>
      </div>

      <div className="glass-card p-10 min-h-[750px] flex flex-col relative">
        {view === 'heatmap' ? (
          <div className="w-full h-full flex flex-col gap-10">
             <div className="flex-1 min-h-[600px]">
                <HeatmapView data={data} total={total} loading={hmLoading} error={hmError} largeHeight={600} />
             </div>
             
             {/* Legend & Stats Overlay */}
             <div className="flex items-center justify-center gap-12 p-6 bg-slate-50/50 rounded-2xl border border-slate-100 self-center">
                <LegendItem color="#0066FF" label="Low Interaction" />
                <LegendItem color="#10b981" label="Active Region" />
                <LegendItem color="#f59e0b" label="Engagement Zone" />
                <LegendItem color="#ef4444" label="Extreme Hotspot" />
             </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto py-20">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-3xl mb-6 grayscale opacity-50">
              📊
            </div>
            <h4 className="text-2xl font-bold text-luxury-text font-heading mb-3">Extended Reporting</h4>
            <p className="text-secondary leading-relaxed font-medium">
              We are finalizing the deep-dive analytics engine for time-series comparisons and cohort analysis.
            </p>
            <button 
              onClick={() => setView('overview')}
              className="mt-8 btn-primary px-8"
            >
              Return to Insights
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto min-h-full">
      {view === 'overview' ? <Overview /> : <DetailedView />}
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
      <span className="text-[10px] uppercase font-bold tracking-widest text-secondary group-hover:text-luxury-text transition-colors">
        {label}
      </span>
    </div>
  );
}
