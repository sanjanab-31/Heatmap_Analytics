import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHeatmapData } from '../hooks/useHeatmapData';
import { useAnalytics }   from '../hooks/useAnalytics';
import { ArrowRight } from 'lucide-react';

import FilterBar   from '../components/FilterBar';
import ExportButton from '../components/ExportButton';
import StatsCards  from '../components/StatsCards';
import HeatmapView from '../components/HeatmapView';
import ClickChart  from '../components/ClickChart';
import ScrollChart from '../components/ScrollChart';
import TopElements from '../components/TopElements';

export default function Dashboard() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    projectId: '',
    pageUrl:   '',
  });

  const { data, total, loading: hmLoading, error: hmError } = useHeatmapData(filters);
  const { analytics,   loading: anLoading, error: anError } = useAnalytics(filters);

  return (
    <div className="flex flex-col gap-10 animate-fade-in pb-10">
      
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
        
        <div className="flex items-center gap-4">
          <ExportButton data={analytics} filename="dashboard-analytics" />
          <FilterBar
            projectId={filters.projectId}
            pageUrl={filters.pageUrl}
            onFilter={(f) => setFilters(f)}
          />
        </div>
      </div>

      {/* Stats Cards Section */}
      <StatsCards analytics={analytics} loading={anLoading} />

      {/* Top Clicked Elements Section */}
      <section className="flex flex-col gap-5">
        <TopElements loading={anLoading} data={analytics?.top_elements || []} />
      </section>

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
              onClick={() => navigate('/heatmaps')}
              className="px-4 py-2 text-xs font-bold text-luxury-blue bg-blue-50 hover:bg-luxury-blue hover:text-white rounded-xl transition-all duration-300 shadow-sm flex items-center gap-2 group"
            >
              <span>Expand view</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
              onClick={() => navigate('/analytics')}
              className="px-4 py-2 text-xs font-bold text-luxury-blue bg-blue-50 hover:bg-luxury-blue hover:text-white rounded-xl transition-all duration-300 shadow-sm flex items-center gap-2 group"
            >
              <span>Full report</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
        <div className="text-[10px] uppercase font-black tracking-widest text-secondary flex items-center gap-3">
           <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
           Precision Analytics • Heatwave Intelligence 3.0
        </div>
        <div className="text-[10px] uppercase font-black tracking-widest text-secondary text-right">
          Data Integrity Verified<br/>{new Date().toLocaleDateString(undefined, { dateStyle: 'long' })}
        </div>
      </footer>
    </div>
  );
}
