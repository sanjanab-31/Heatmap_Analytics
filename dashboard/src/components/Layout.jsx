import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-luxury-bg font-body antialiased">
      {/* Sidebar - Premium Minimalist */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-200/60 p-8 flex flex-col z-50">
        <div className="flex items-center gap-3 mb-12 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-luxury-blue to-blue-700 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-luxury-blue/20 group-hover:scale-110 transition-transform duration-300">
            H
          </div>
          <span className="text-xl font-bold font-heading text-luxury-text tracking-tight group-hover:text-luxury-blue transition-colors">
            Heatwave
          </span>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <NavItem active label="Dashboard" icon="📊" />
          <NavItem label="Heatmaps" icon="🔥" />
          <NavItem label="Analytics" icon="📈" />
          <NavItem label="Recordings" icon="🎥" />
          <NavItem label="Settings" icon="⚙️" />
        </nav>

        <div className="glass-panel p-5 mt-auto rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-1 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Current Plan</p>
          <p className="text-sm font-bold text-luxury-blue">Enterprise Pro</p>
          <div className="w-full h-1 bg-slate-200 mt-2 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-luxury-blue" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-72 flex-1 relative min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/40 px-10 flex items-center justify-between z-40">
          <div className="flex flex-col">
            <h2 className="text-base font-semibold text-luxury-text">Analytics Overview</h2>
            <p className="text-xs text-luxury-secondary font-medium mt-0.5">Welcome back, Admin</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer hover:scale-110 transition-transform">
              <span className="text-xl">🔔</span>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            
            <div className="h-10 w-[1px] bg-slate-200" />
            
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-luxury-text group-hover:text-luxury-blue transition-colors">John Doe</span>
                <span className="text-[10px] font-medium text-luxury-secondary">Super Admin</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-sm font-bold text-slate-600">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-10 animate-slide-up">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ label, icon, active = false }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${
      active 
        ? 'bg-luxury-blue/10 text-luxury-blue shadow-sm' 
        : 'text-luxury-secondary hover:bg-slate-50 hover:text-luxury-text'
    }`}>
      <span className={`text-lg transition-transform duration-300 group-hover:scale-120 ${active ? 'scale-110' : ''}`}>
        {icon}
      </span>
      <span className={`text-sm font-semibold tracking-tight ${active ? 'font-bold' : ''}`}>
        {label}
      </span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-luxury-blue" />}
    </div>
  );
}
