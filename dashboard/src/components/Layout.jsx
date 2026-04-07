import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-luxury-bg font-body antialiased overflow-hidden">
      
      {/* Sidebar - Fixed Position */}
      <aside className="hidden lg:flex flex-col w-72 h-full bg-white border-r border-border-soft p-8 z-50 shrink-0">
        
        {/* Brand/Logo */}
        <div className="flex items-center gap-3 mb-10 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-luxury-blue to-blue-700 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-luxury-blue/20 group-hover:scale-105 transition-all duration-300">
            H
          </div>
          <span className="text-xl font-bold font-heading text-luxury-text tracking-tight group-hover:text-luxury-blue transition-colors">
            Heatwave
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5 flex-1">
          <NavItem active label="Dashboard" icon={<LayoutIcon size={20} />} />
          <NavItem label="Heatmaps" icon={<MapIcon size={20} />} />
          <NavItem label="Analytics" icon={<ChartIcon size={20} />} />
          <NavItem label="Recordings" icon={<VideoIcon size={20} />} />
          <NavItem label="Settings" icon={<SettingsIcon size={20} />} />
        </nav>

        {/* Bottom Card - Premium Upgrade */}
        <div className="p-6 mt-auto rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col gap-3 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase font-bold tracking-widest text-secondary">Current Plan</p>
            <span className="px-2 py-0.5 bg-blue-100 text-[10px] font-bold text-luxury-blue rounded-full">PRO</span>
          </div>
          <p className="text-sm font-bold text-luxury-text">Enterprise Elite</p>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-luxury-blue rounded-full shadow-[0_0_8px_rgba(0,102,255,0.4)]" />
          </div>
          <p className="text-[10px] text-secondary font-medium">75% of data limit used</p>
        </div>
      </aside>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Header - Glassmorphism */}
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-border-soft px-10 flex items-center justify-between shrink-0 z-40">
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-luxury-text uppercase tracking-widest">Platform Overview</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)] animate-pulse" />
              <p className="text-xs text-secondary font-medium">All systems operational</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors relative">
               <span className="text-lg">🔔</span>
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </div>
            
            <div className="h-10 w-[1px] bg-slate-200" />
            
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-luxury-text group-hover:text-luxury-blue transition-colors">Admin Portal</span>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-tight">Super Admin</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 border-2 border-white shadow-premium flex items-center justify-center text-sm font-black text-slate-500">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - Scroll Holder */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto premium-gradient custom-scrollbar relative">
           <div className="p-10 max-w-[1600px] mx-auto animate-fade-in">
              {children}
           </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ label, icon, active = false }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group ${
      active 
        ? 'bg-luxury-blue/10 text-luxury-blue shadow-[inset_0_0_0_1px_rgba(0,102,255,0.1)]' 
        : 'text-secondary hover:bg-slate-50 hover:text-luxury-text'
    }`}>
      <span className={`transition-all duration-300 ${active ? 'scale-110 text-luxury-blue' : 'group-hover:scale-110 group-hover:text-luxury-text'}`}>
        {icon}
      </span>
      <span className={`text-sm font-semibold tracking-tight ${active ? 'font-bold' : ''}`}>
        {label}
      </span>
      {active && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-luxury-blue shadow-[0_0_8px_rgba(0,102,255,0.4)]" />
      )}
    </div>
  );
}

// Minimalist Icons
const LayoutIcon = ({ size }) => <span style={{ fontSize: size }}>📊</span>;
const MapIcon    = ({ size }) => <span style={{ fontSize: size }}>🔥</span>;
const ChartIcon  = ({ size }) => <span style={{ fontSize: size }}>📈</span>;
const VideoIcon  = ({ size }) => <span style={{ fontSize: size }}>🎥</span>;
const SettingsIcon = ({ size }) => <span style={{ fontSize: size }}>⚙️</span>;
