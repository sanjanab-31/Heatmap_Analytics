import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { fetchProjects } from '../api/client';
import { 
  LayoutDashboard, 
  Flame, 
  BarChart3, 
  PlayCircle, 
  Settings, 
  Bell, 
  User,
  Zap,
  FolderOpen
} from 'lucide-react';

export default function Layout() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [projectStats, setProjectStats] = useState({ total: 0, active: 0 });

  useEffect(() => {
    let mounted = true;
    const loadProjects = async () => {
      const projects = await fetchProjects();
      if (!mounted) return;

      const total = projects.length;
      const active = projects.filter((project) => project.status === 'active').length;
      setProjectStats({ total, active });

      const items = projects
        .slice(0, 3)
        .map((project) => ({
          id: project._id,
          title: project.name,
          message: `${project.domain} is ${project.status}`,
          timeAgo: project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Recently',
        }));
      setNotifications(items);
    };

    loadProjects().catch(() => {
      if (mounted) {
        setProjectStats({ total: 0, active: 0 });
        setNotifications([]);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const usagePercent = projectStats.total > 0
    ? Math.round((projectStats.active / projectStats.total) * 100)
    : 0;

  return (
    <div className="flex h-screen bg-luxury-bg font-body antialiased overflow-hidden">
      
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 h-full bg-white/95 border-r border-slate-200 p-6 z-50 shrink-0">
        
        {/* Brand */}
        <NavLink to="/" className="flex items-center gap-3 mb-8 group cursor-pointer no-underline">
          <div className="w-10 h-10 bg-luxury-blue rounded-lg flex items-center justify-center text-white shadow-sm">
            <Zap size={18} fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold font-heading text-luxury-text leading-tight group-hover:text-luxury-blue transition-colors">
              Heatwave
            </span>
            <span className="text-[11px] text-secondary font-medium">Analytics Console</span>
          </div>
        </NavLink>

        <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400 font-semibold mb-3 px-3">Navigation</p>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1">
          <NavItem to="/" label="Dashboard" icon={<LayoutDashboard size={17} />} />
          <NavItem to="/projects" label="Projects" icon={<FolderOpen size={17} />} />
          <NavItem to="/heatmaps" label="Heatmaps" icon={<Flame size={17} />} />
          <NavItem to="/analytics" label="Analytics" icon={<BarChart3 size={17} />} />
          <NavItem to="/recordings" label="Recordings" icon={<PlayCircle size={17} />} />
          <NavItem to="/settings" label="Settings" icon={<Settings size={17} />} />
        </nav>

        {/* Bottom Card */}
        <div className="mt-6 p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-600">Workspace</p>
            <span className="px-2 py-0.5 bg-blue-100 text-[10px] font-semibold text-luxury-blue rounded-full">{projectStats.total > 5 ? 'PRO' : 'STARTER'}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-white border border-slate-200 p-2.5">
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Projects</p>
              <p className="text-sm font-bold text-luxury-text mt-1">{projectStats.total}</p>
            </div>
            <div className="rounded-lg bg-white border border-slate-200 p-2.5">
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Active</p>
              <p className="text-sm font-bold text-luxury-text mt-1">{projectStats.active}</p>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] text-slate-500 font-medium">Usage</p>
              <p className="text-[11px] text-slate-500 font-semibold">{usagePercent}%</p>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-luxury-blue rounded-full" style={{ width: `${usagePercent}%` }} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-18 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-40">
          <div className="flex items-center gap-5">
            <div className="flex flex-col">
              <h2 className="text-base font-semibold text-luxury-text">Platform Overview</h2>
              <p className="text-xs text-slate-500 font-medium">Monitor projects, heatmaps, and analytics</p>
            </div>
            
            {/* Divider */}
            <div className="h-8 w-px bg-slate-200 hidden md:block" />
            
            {/* Real-time Indicator */}
            <div className="hidden md:block">
              <RealTimeStatus />
            </div>
          </div>
          
          <div className="flex items-center gap-4 relative">
            {/* Notification Trigger */}
            <div 
              className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors relative group"
              onClick={() => setShowNotifications(!showNotifications)}
            >
               <Bell size={20} className={`transition-colors ${showNotifications ? 'text-luxury-blue' : 'text-secondary group-hover:text-luxury-blue'}`} />
               {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />}
            </div>
            
            {/* Notifications Dropdown Panel */}
            {showNotifications && (
              <div className="absolute top-14 right-14 w-80 bg-white border border-slate-200 rounded-xl shadow-premium overflow-hidden z-50 animate-fade-in origin-top-right">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
                  <h3 className="text-sm font-bold text-luxury-text">Notifications</h3>
                  <span className="text-[10px] font-semibold text-luxury-blue bg-blue-100 px-2 py-0.5 rounded-full">{notifications.length} New</span>
                </div>
                <div className="flex flex-col max-h-[320px] overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-secondary">No notifications yet.</div>
                  ) : (
                    notifications.map((notification) => (
                      <div key={notification.id} className="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <Bell size={14} className="text-blue-600" />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-luxury-text leading-tight">{notification.title}</p>
                          <p className="text-xs text-secondary mt-1">{notification.message}</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-2">{notification.timeAgo}</p>
                        </div>
                      </div>
                    ))
                  )}

                </div>
                <div className="p-3 border-t border-slate-200 bg-slate-50/70 text-center cursor-pointer hover:bg-slate-100 transition-colors">
                  <span className="text-xs font-semibold text-luxury-blue">Mark all as read</span>
                </div>
              </div>
            )}
            
            <div className="h-9 w-px bg-slate-200" />
            
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-luxury-text">Admin Portal</span>
                <span className="text-[10px] font-semibold text-secondary uppercase tracking-tight">Super Admin</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-slate-50 transition-colors">
                <User size={18} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - Scroll Holder */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto premium-gradient custom-scrollbar relative">
           <div className="p-10 max-w-[1600px] mx-auto animate-fade-in">
              <Outlet />
           </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, label, icon }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-200 group no-underline border ${
        isActive 
          ? 'bg-blue-50 text-luxury-blue border-blue-100' 
          : 'text-slate-600 border-transparent hover:bg-slate-50 hover:border-slate-200 hover:text-luxury-text'
      }`}
    >
      {({ isActive }) => (
        <>
          <span className={`transition-colors duration-200 ${isActive ? 'text-luxury-blue' : 'text-slate-500 group-hover:text-luxury-text'}`}>
            {icon}
          </span>
          <span className={`text-sm tracking-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>
            {label}
          </span>
          {isActive && (
            <div className="ml-auto w-1 h-5 rounded-full bg-luxury-blue/80" />
          )}
        </>
      )}
    </NavLink>
  );
}

function RealTimeStatus() {
  const [secondsSinceEvent, setSecondsSinceEvent] = useState(0);
  const [lastSyncAt, setLastSyncAt] = useState(() => new Date());

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setSecondsSinceEvent((prev) => {
        const next = prev + 1;
        if (next >= 30) {
          setLastSyncAt(new Date());
          return 0;
        }

        return next;
      });
    }, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="flex items-center gap-3 animate-fade-in">
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Live
      </span>
      <span className="text-xs text-slate-500 font-medium">
        Synced {lastSyncAt.toLocaleTimeString()} • {secondsSinceEvent === 0 ? 'just now' : `${secondsSinceEvent}s ago`}
      </span>
    </div>
  );
}
