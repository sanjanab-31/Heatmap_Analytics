import React from 'react';

export default function StatsCards({ analytics, loading }) {
  const stats = [
    { label: 'Total Visits', value: analytics?.total_sessions || 0, icon: '👣', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Clicks', value: analytics?.total_clicks || 0, icon: '🖱️', color: 'text-luxury-blue', bg: 'bg-luxury-blue/10' },
    { label: 'Click Rate', value: `${analytics?.click_rate?.toFixed(1) || 0}%`, icon: '📈', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Avg Scroll', value: `${analytics?.avg_scroll?.toFixed(0) || 0}%`, icon: '↕️', color: 'text-slate-600', bg: 'bg-slate-100' },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <div 
          key={idx} 
          className="glass-card p-6 flex flex-col gap-3 group relative overflow-hidden"
        >
          {/* Animated Background Accent */}
          <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-2xl ${stat.bg}`} />
          
          <div className="flex items-center justify-between">
             <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center text-xl`}>
                {stat.icon}
             </div>
             {loading && (
               <div className="w-4 h-4 border-2 border-slate-200 border-t-luxury-blue rounded-full animate-spin" />
             )}
          </div>
          
          <div className="flex flex-col gap-0.5 relative z-10">
             <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{stat.label}</span>
             <span className="text-2xl font-bold text-luxury-text font-heading group-hover:scale-105 transition-transform duration-300 origin-left">
                {stat.value}
             </span>
          </div>

          <div className="flex items-center gap-1.5 mt-1">
             <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
             <span className="text-[10px] font-bold text-slate-400">Stable Activity</span>
          </div>
        </div>
      ))}
    </div>
  );
}
