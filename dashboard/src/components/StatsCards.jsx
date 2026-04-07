import React from 'react';
import { 
  Users, 
  MousePointer2, 
  TrendingUp, 
  ScrollText 
} from 'lucide-react';

export default function StatsCards({ analytics, loading }) {
  const clickRate = Number(analytics?.click_rate || 0);
  const trendText = clickRate > 0 ? `${clickRate.toFixed(1)}% CTR` : 'No trend yet';
  const updatedAtLabel = analytics
    ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Waiting for data';

  const stats = [
    { label: 'Total Visits', value: analytics?.total_sessions || 0, icon: <Users size={18} />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Total Clicks', value: analytics?.total_clicks || 0, icon: <MousePointer2 size={18} />, color: 'text-luxury-blue', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Click Rate', value: `${analytics?.click_rate?.toFixed(1) || 0}%`, icon: <TrendingUp size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Avg Scroll', value: `${analytics?.avg_scroll?.toFixed(0) || 0}%`, icon: <ScrollText size={18} />, color: 'text-secondary', bg: 'bg-slate-100', border: 'border-slate-200' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div 
          key={idx} 
          className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
             <div className={`w-10 h-10 rounded-lg ${stat.bg} ${stat.border} border flex items-center justify-center ${stat.color}`}>
                {stat.icon}
             </div>
             {loading ? (
               <div className="w-4 h-4 border-2 border-slate-200 border-t-luxury-blue rounded-full animate-spin" />
             ) : (
               <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{trendText}</span>
             )}
          </div>
          
          <div className="flex flex-col gap-1">
             <span className="text-[11px] uppercase font-semibold text-secondary tracking-wide">{stat.label}</span>
             <h4 className="text-2xl font-bold text-luxury-text font-heading">
                {stat.value}
             </h4>
          </div>

          <div className="text-[11px] text-secondary font-medium">Updated {updatedAtLabel}</div>
        </div>
      ))}
    </div>
  );
}
