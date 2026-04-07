import React, { useEffect, useState } from 'react';
import { useHeatmapData } from '../hooks/useHeatmapData';
import HeatmapView from '../components/HeatmapView';
import FilterBar from '../components/FilterBar';
import { fetchProjects } from '../api/client';

export default function Heatmaps() {
  const [filters, setFilters] = useState({
    projectId: '',
    pageUrl:   '',
  });

  const { data, total, loading: hmLoading, error: hmError } = useHeatmapData(filters);

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
              Detailed Heatmap Analysis
            </h1>
            <p className="text-sm font-medium text-secondary">Visualizing user interaction intensity across the selected page.</p>
          </div>
        </div>

        <FilterBar
          projectId={filters.projectId}
          pageUrl={filters.pageUrl}
          onFilter={(f) => setFilters(f)}
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 min-h-[680px] flex flex-col relative">
        <div className="w-full h-full flex flex-col gap-6">
          <div className="flex-1 min-h-[560px]">
            <HeatmapView data={data} total={total} loading={hmLoading} error={hmError} largeHeight={560} pageUrl={filters.pageUrl} />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg self-center">
            <LegendItem color="#2563eb" label="Low" />
            <LegendItem color="#16a34a" label="Medium" />
            <LegendItem color="#d97706" label="High" />
            <LegendItem color="#dc2626" label="Hotspot" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      <span className="text-[11px] uppercase font-semibold tracking-wide text-secondary">
        {label}
      </span>
    </div>
  );
}
