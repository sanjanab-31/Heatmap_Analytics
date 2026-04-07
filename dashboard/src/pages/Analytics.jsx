import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, PieChart, FlaskConical } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import ClickChart from '../components/ClickChart';
import ScrollChart from '../components/ScrollChart';
import FilterBar from '../components/FilterBar';
import ExportButton from '../components/ExportButton';
import { fetchProjects } from '../api/client';

export default function Analytics() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    projectId: '',
    pageUrl:   '',
  });

  const { analytics, loading: anLoading, error: anError } = useAnalytics(filters);

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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold font-heading text-luxury-text tracking-tight">
              Behavioral Analytics
            </h1>
            <p className="text-sm font-medium text-secondary">Analyze click behavior and scroll performance trends.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ExportButton data={analytics} filename="behavioral-analytics" />
          <FilterBar
            projectId={filters.projectId}
            pageUrl={filters.pageUrl}
            onFilter={(f) => setFilters(f)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-luxury-blue">
               <BarChart3 size={18} />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-lg font-semibold font-heading text-luxury-text">Click Engagement</h3>
              <p className="text-xs text-secondary font-medium">Hourly interaction volume trends</p>
            </div>
          </div>
          <ClickChart analytics={analytics} loading={anLoading} />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
               <PieChart size={18} />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-lg font-semibold font-heading text-luxury-text">Scroll Performance</h3>
              <p className="text-xs text-secondary font-medium">Retention and page-vertical drop-off</p>
            </div>
          </div>
          <ScrollChart analytics={analytics} loading={anLoading} />
        </div>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
          <FlaskConical size={22} />
        </div>
        <div className="flex flex-col gap-1.5 max-w-xl">
          <h4 className="text-xl font-semibold font-heading text-luxury-text">More Insights Coming Soon</h4>
          <p className="text-secondary leading-relaxed font-medium text-sm">
            Advanced cohort analysis and multi-project comparison are in progress.
          </p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="h-10 px-5 bg-luxury-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
