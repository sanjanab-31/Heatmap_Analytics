import React from 'react';

export default function StatsCards({ analytics, loading }) {
  const stats = [
    { label: 'Total Visits', value: analytics?.total_sessions || 0, icon: '👣', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Total Clicks', value: analytics?.total_clicks || 0, icon: '🖱️', color: 'text-luxury-blue', bg: 'bg-luxury-blue/10', border: 'border-blue-100' },
    { label: 'Click Rate', value: `${analytics?.click_rate?.toFixed(1) || 0}%`, icon: '📈', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Avg Scroll', value: `${analytics?.avg_scroll?.toFixed(0) || 0}%`, icon: '↕️', color: 'text-secondary', bg: 'bg-slate-100', border: 'border-slate-200' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <div 
          key={idx} 
          className="glass-card p-6 flex flex-col gap-5 group relative overflow-hidden bg-white/40"
        >
          {/* Subtle Background Glow on Hover */}
          <div className={`absolute -right-10 -bottom-10 w-40 h-40 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-700 blur-3xl ${stat.bg}`} />
          
          <div className="flex items-center justify-between relative z-10">
             <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.border} border flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                {stat.icon}
             </div>
             {loading ? (
               <div className="w-5 h-5 border-2 border-slate-100 border-t-luxury-blue rounded-full animate-spin" />
             ) : (
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">+12%</span>
                </div>
             )}
          </div>
          
          <div className="flex flex-col gap-1 relative z-10">
             <span className="text-[10px] uppercase font-bold text-secondary tracking-widest">{stat.label}</span>
             <h4 className="text-3xl font-bold text-luxury-text font-heading group-hover:translate-x-1 transition-transform duration-500">
                {stat.value}
             </h4>
          </div>

          <div className="flex items-center gap-2 relative z-10">
             <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                   <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-200" />
                ))}
             </div>
             <span className="text-[10px] font-bold text-secondary">Updated moments ago</span>
          </div>
        </div>
      ))}
    </div>
  );
}
