import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHeatmapData } from '../hooks/useHeatmapData';
import { useAnalytics }   from '../hooks/useAnalytics';
import { ArrowRight } from 'lucide-react';
import { fetchProjects } from '../api/client';

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

  useEffect(() => {
    let mounted = true;

    const preloadFilters = async () => {
      const projects = await fetchProjects();
      if (!mounted || !Array.isArray(projects) || projects.length === 0) {
        return;
      }

      const first = projects[0];
      setFilters((prev) => {
        if (prev.projectId && prev.pageUrl) {
          return prev;
        }

        return {
          projectId: prev.projectId || first.projectId || '',
          pageUrl: prev.pageUrl || '',
        };
      });
    };

    preloadFilters().catch(() => {
      // Keep manual filter entry available if preload fails.
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-8">
      
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold font-heading text-luxury-text tracking-tight">Dashboard</h1>
          <p className="text-sm text-secondary font-medium">A clear view of traffic, clicks, and engagement trends.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <FilterBar
            projectId={filters.projectId}
            pageUrl={filters.pageUrl}
            onFilter={(f) => setFilters(f)}
          />
          <ExportButton data={analytics} filename="dashboard-analytics" />
        </div>
      </div>

      {/* Stats Cards Section */}
      <StatsCards analytics={analytics} loading={anLoading} />

      {/* Top Clicked Elements Section */}
      <section className="flex flex-col gap-4">
        <TopElements loading={anLoading} data={analytics?.top_elements || []} />
      </section>

      {/* Main Grid: Heatmap & Click Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Heatmap Preview Card */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-end justify-between px-2">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-lg font-semibold text-luxury-text font-heading">Heatmap Preview</h3>
              <p className="text-xs text-secondary font-medium">Interaction intensity for the selected page.</p>
            </div>
            <button 
              onClick={() => navigate('/heatmaps')}
              className="px-3.5 py-2 text-xs font-semibold text-luxury-blue bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 flex items-center gap-2 group"
            >
              <span>Open heatmaps</span>
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 h-[520px] overflow-hidden">
            <HeatmapView data={data} total={total} loading={hmLoading} error={hmError} />
          </div>
        </section>

        {/* Click Distribution Card */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-end justify-between px-2">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-lg font-semibold text-luxury-text font-heading">Clicks by Hour</h3>
              <p className="text-xs text-secondary font-medium">Hourly click distribution and peaks.</p>
            </div>
            <button 
              onClick={() => navigate('/analytics')}
              className="px-3.5 py-2 text-xs font-semibold text-luxury-blue bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <span>Open analytics</span>
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 h-[520px] overflow-hidden">
            <ClickChart analytics={analytics} loading={anLoading} />
          </div>
        </section>
      </div>

      {/* Scroll Analysis Section */}
      <section className="flex flex-col gap-4 mb-8">
        <div className="px-2">
          <h3 className="text-lg font-semibold text-luxury-text font-heading">Scroll Depth</h3>
          <p className="text-xs text-secondary font-medium">Retention across page sections from top to bottom.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 min-h-[320px]">
          <ScrollChart analytics={analytics} loading={anLoading} />
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-slate-200 flex items-center justify-between">
        <div className="text-xs text-secondary font-medium">UXRay Dashboard</div>
        <div className="text-xs text-secondary font-medium text-right">
          Updated {new Date().toLocaleDateString(undefined, { dateStyle: 'medium' })}
        </div>
      </footer>
    </div>
  );
}
