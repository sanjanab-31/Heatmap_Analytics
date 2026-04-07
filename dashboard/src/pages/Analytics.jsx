import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, PieChart, FlaskConical } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import ClickChart from '../components/ClickChart';
import ScrollChart from '../components/ScrollChart';
import FilterBar from '../components/FilterBar';

const DEFAULT_PROJECT = 'test-project-001';
const DEFAULT_PAGE    = 'http://localhost/test';

export default function Analytics() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    projectId: DEFAULT_PROJECT,
    pageUrl:   DEFAULT_PAGE,
  });

  const { analytics, loading: anLoading, error: anError } = useAnalytics(filters);

  return (
    <div className="flex flex-col gap-10 animate-fade-in">
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
              Behavioral Analytics
            </h1>
            <p className="text-sm font-medium text-secondary italic">Deep-dive interaction analysis</p>
          </div>
        </div>

        <FilterBar
          projectId={filters.projectId}
          pageUrl={filters.pageUrl}
          onFilter={(f) => setFilters(f)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-10 flex flex-col gap-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-luxury-blue">
               <BarChart3 size={20} />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-xl font-bold font-heading text-luxury-text">Click Engagement</h3>
              <p className="text-xs text-secondary font-medium">Hourly interaction volume trends</p>
            </div>
          </div>
          <ClickChart analytics={analytics} loading={anLoading} />
        </div>

        <div className="glass-card p-10 flex flex-col gap-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
               <PieChart size={20} />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-xl font-bold font-heading text-luxury-text">Scroll Performance</h3>
              <p className="text-xs text-secondary font-medium">Retention and page-vertical drop-off</p>
            </div>
          </div>
          <ScrollChart analytics={analytics} loading={anLoading} />
        </div>
      </div>
      
      <div className="glass-card p-12 text-center flex flex-col items-center gap-6 bg-slate-50/40">
        <div className="w-16 h-16 bg-white border border-slate-100 rounded-3xl flex items-center justify-center text-3xl text-slate-300 shadow-sm transition-transform hover:rotate-12 duration-500">
          <FlaskConical size={32} />
        </div>
        <div className="flex flex-col gap-2 max-w-lg">
          <h4 className="text-2xl font-bold font-heading text-luxury-text">Enterprise Data Visualization</h4>
          <p className="text-secondary leading-relaxed font-medium text-sm">
            We are working on bringing advanced cohort analysis and multi-project comparison tools to the analytics dashboard. Stay tuned for more insights.
          </p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="btn-primary px-10"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
