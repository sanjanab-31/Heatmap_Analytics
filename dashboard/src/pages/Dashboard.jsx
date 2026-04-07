import { useState } from 'react';
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

  const anyError = hmError || anError;

  return (
    <div className="relative overflow-hidden w-full max-w-[1600px] mx-auto">
      
      {/* ── View Container (Animated Slider) ────────────────────────── */}
      <div className={`flex transition-transform duration-700 ease-in-out ${
        view === 'overview' ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* PAGE 1: OVERVIEW PAGE */}
        <div className="min-w-full flex flex-col gap-8 pr-1">
          
          {/* Header Row */}
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-luxury-text via-slate-700 to-luxury-blue pb-1">
                Executive Insights
              </h1>
              <p className="text-sm text-luxury-secondary font-medium flex items-center gap-2">
                Real-time tracking activated <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </p>
            </div>
            
            <FilterBar
              projectId={filters.projectId}
              pageUrl={filters.pageUrl}
              onFilter={(f) => setFilters(f)}
            />
          </div>

          {/* Stats Grid */}
          <StatsCards analytics={analytics} loading={anLoading} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-12 gap-8">
            
            {/* Heatmap Section */}
            <div className="col-span-7 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-luxury-text">Interactions Heatmap</h3>
                  <p className="text-xs text-luxury-secondary font-medium">Visual density of user engagement</p>
                </div>
                <button 
                  onClick={() => setView('heatmap')}
                  className="px-4 py-1.5 text-xs font-bold text-luxury-blue bg-luxury-blue/10 hover:bg-luxury-blue hover:text-white rounded-lg transition-all"
                >
                  View Detailed Map →
                </button>
              </div>
              <div className="glass-card p-6 h-[500px]">
                <HeatmapView data={data} total={total} loading={hmLoading} error={hmError} />
              </div>
            </div>

            {/* Click Chart Section */}
            <div className="col-span-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-luxury-text">Click Velocity</h3>
                  <p className="text-xs text-luxury-secondary font-medium">Hourly distribution of interactions</p>
                </div>
                <button 
                  onClick={() => setView('charts')}
                  className="px-4 py-1.5 text-xs font-bold text-luxury-blue bg-luxury-blue/10 hover:bg-luxury-blue hover:text-white rounded-lg transition-all"
                >
                  Full Report →
                </button>
              </div>
              <div className="glass-card p-6 h-[500px]">
                <ClickChart analytics={analytics} loading={anLoading} />
              </div>
            </div>
          </div>

          {/* Scroll Analysis */}
          <div className="flex flex-col gap-4 mb-10">
            <h3 className="text-lg font-bold text-luxury-text">Continuous Scroll Performance</h3>
            <div className="glass-card p-6 min-h-[300px]">
              <ScrollChart analytics={analytics} loading={anLoading} />
            </div>
          </div>
        </div>

        {/* PAGE 2: DETAILED VIEW (Currently just a placeholder for Heatmap Detail) */}
        <div className="min-w-full flex flex-col gap-8 pl-1">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('overview')}
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
            >
              ←
            </button>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-luxury-text capitalize">Detailed {view} Analysis</h1>
              <p className="text-sm text-luxury-secondary">Deep dive into project interaction metrics</p>
            </div>
          </div>

          <div className="glass-card p-10 min-h-[700px] flex items-center justify-center relative">
            {view === 'heatmap' ? (
              <div className="w-full h-full flex flex-col gap-6">
                 <HeatmapView data={data} total={total} loading={hmLoading} error={hmError} largeHeight={600} />
                 <div className="flex justify-center gap-10 mt-4">
                    <LegendItem color="#0000FF" label="Cold Zone" />
                    <LegendItem color="#00FF00" label="Active Zone" />
                    <LegendItem color="#FFFF00" label="Warm Zone" />
                    <LegendItem color="#FF0000" label="Hotspot" />
                 </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-xl font-bold text-slate-300">Detailed Chart View Coming Soon</p>
                <p className="text-sm text-slate-400 mt-2">Extended reporting and raw data exports.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-slate-200/60 flex items-center justify-between transition-opacity duration-300" 
              style={{ opacity: view === 'overview' ? 1 : 0 }}>
        <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
           Powered by Heatwave Intelligence 3.0
        </div>
        <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
          Last Backup: {new Date().toLocaleTimeString()}
        </div>
      </footer>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full" style={{ background: color, boxShadow: `0 0 10px ${color}44` }} />
      <span className="text-[10px] uppercase font-bold tracking-tighter text-slate-500">{label}</span>
    </div>
  );
}
