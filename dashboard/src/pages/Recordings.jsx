import React, { useState, useEffect } from 'react';
import { fetchProjects, fetchRecordings } from '../api/client';
import { 
  Video, 
  Play, 
  Pause, 
  Clock, 
  Activity, 
  MapPin, 
  Monitor, 
  Globe, 
  ChevronRight, 
  X, 
  RotateCcw, 
  FastForward, 
  Maximize,
  MousePointer2,
  List
} from 'lucide-react';

const formatAgo = (date) => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return `${Math.max(1, seconds)}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
};

const REFRESH_INTERVAL_MS = 5_000;

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const normalizePlaybackPoint = (event) => {
  if (!event) {
    return { x: 50, y: 50 };
  }

  if (Number.isFinite(event.xPercent) && Number.isFinite(event.yPercent)) {
    return {
      x: Math.max(0, Math.min(100, event.xPercent)),
      y: Math.max(0, Math.min(100, event.yPercent)),
    };
  }

  if (event.type === 'scroll' && Number.isFinite(event.scrollDepth)) {
    return {
      x: 50,
      y: Math.max(0, Math.min(100, event.scrollDepth)),
    };
  }

  const x = Number.isFinite(event.x) ? (event.x / 1366) * 100 : 50;
  const y = Number.isFinite(event.y) ? (event.y / 768) * 100 : 50;

  return {
    x: Math.max(0, Math.min(100, x)),
    y: Math.max(0, Math.min(100, y)),
  };
};

export default function Recordings() {
  const [projectId, setProjectId] = useState('');
  const [pageUrl, setPageUrl] = useState('');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const selectedSession = sessions.find((session) => session.id === selectedSessionId) || null;

  useEffect(() => {
    let mounted = true;
    const preloadProject = async () => {
      const projects = await fetchProjects();
      if (!mounted || !projects.length) return;
      setProjectId(projects[0].projectId || '');
      setPageUrl((prev) => prev || '');
    };

    preloadProject().catch(() => {
      // Leave filters empty if projects are unavailable.
    });

    return () => {
      mounted = false;
    };
  }, []);

  const loadRecordings = async () => {
    if (!projectId) {
      setSessions([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetchRecordings({ projectId, pageUrl: pageUrl || undefined, limit: 20 });
      const nextSessions = Array.isArray(response?.sessions) ? response.sessions : [];
      setSessions(nextSessions);
    } catch (err) {
      setError(err.message || 'Failed to load recordings');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecordings();

    const intervalId = setInterval(() => {
      loadRecordings();
    }, REFRESH_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [projectId, pageUrl]);

  // Simulated playback timer
  useEffect(() => {
    let timer;
    if (isPlaying && selectedSession) {
      timer = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= selectedSession.durationSec) {
            setIsPlaying(false);
            return selectedSession.durationSec;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, selectedSession, playbackSpeed]);

  const formatTime = formatDuration;

  const handlePlaySession = (session) => {
    setSelectedSessionId(session.id);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const totalRecorded = sessions.length;
  const avgDurationSec = totalRecorded
    ? Math.round(sessions.reduce((sum, session) => sum + session.durationSec, 0) / totalRecorded)
    : 0;
  const avgInteractions = totalRecorded
    ? (sessions.reduce((sum, session) => sum + session.interactions, 0) / totalRecorded).toFixed(1)
    : '0.0';
  const activeRecently = sessions.filter((session) => session.status === 'live').length;
  const activePlaybackEvent = selectedSession?.events
    ?.filter((event) => event.time <= currentTime)
    .slice(-1)[0] || selectedSession?.events?.[0] || null;
  const playbackPoint = normalizePlaybackPoint(activePlaybackEvent);

  return (
    <div className="flex flex-col gap-6 py-8 relative">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold font-heading text-luxury-text tracking-tight">
            Session Recordings
          </h1>
          <p className="text-secondary font-medium text-sm">Review recorded sessions to understand user behavior and friction points.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white border border-slate-200 rounded-lg px-4 h-10 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold text-luxury-text">{activeRecently} Active</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-end gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-[10px] uppercase font-semibold text-secondary tracking-[0.08em]">Project ID</label>
          <input
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="h-10 px-3 border border-slate-200 rounded-lg text-sm font-medium"
            placeholder="Project identifier"
          />
        </div>
        <div className="flex flex-col gap-1 flex-[2]">
          <label className="text-[10px] uppercase font-semibold text-secondary tracking-[0.08em]">Page URL</label>
          <input
            value={pageUrl}
            onChange={(e) => setPageUrl(e.target.value)}
            className="h-10 px-3 border border-slate-200 rounded-lg text-sm font-medium"
            placeholder="https://your-domain.com/page"
          />
        </div>
        <button onClick={loadRecordings} className="h-10 px-4 rounded-lg bg-luxury-blue text-white text-sm font-semibold hover:bg-blue-700 transition-colors">Refresh</button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-luxury-blue">
            <Video size={18} />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-secondary uppercase tracking-wide">Total Recorded</p>
            <p className="text-xl font-semibold text-luxury-text">{totalRecorded.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500">
            <Clock size={18} />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-secondary uppercase tracking-wide">Avg. Duration</p>
            <p className="text-xl font-semibold text-luxury-text">{formatDuration(avgDurationSec)}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
            <Activity size={18} />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-secondary uppercase tracking-wide">Avg. Interactions</p>
            <p className="text-xl font-semibold text-luxury-text">{avgInteractions}</p>
          </div>
        </div>
      </div>

      {/* Session Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <h2 className="font-semibold text-slate-700 flex items-center gap-2 text-sm">
            <List size={16} />
            Recent Sessions
          </h2>
          <span className="text-xs text-secondary font-medium">{sessions.length} sessions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-semibold text-secondary uppercase tracking-wide">User</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-secondary uppercase tracking-wide">Location</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-secondary uppercase tracking-wide">Device</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-secondary uppercase tracking-wide">Activity</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-secondary uppercase tracking-wide">Time</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-secondary uppercase tracking-wide text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, idx) => (
                <tr 
                  key={session.id} 
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-semibold text-slate-500 text-xs">
                        {session.user.split('#')[1]}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-luxury-text text-sm">{session.user}</span>
                        <span className="text-[10px] text-secondary font-medium">{session.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Globe size={14} className="text-slate-400" />
                      <span className="text-sm font-medium">{session.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Monitor size={14} className="text-slate-400" />
                      <span className="text-sm font-medium">{session.browser} • {session.os}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-luxury-text">{session.duration}</span>
                        <span className="text-[10px] text-secondary uppercase font-semibold tracking-wide">Duration</span>
                      </div>
                      <div className="w-px h-6 bg-slate-100"></div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-luxury-text">{session.interactions}</span>
                        <span className="text-[10px] text-secondary uppercase font-semibold tracking-wide">Clicks</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {session.status === 'live' ? (
                       <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        LIVE
                       </span>
                    ) : (
                      <span className="text-sm font-medium text-secondary">{formatAgo(new Date(session.timestamp))}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handlePlaySession(session)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-slate-200 text-luxury-blue hover:bg-blue-50 transition-colors"
                    >
                      <Play size={16} fill="currentColor" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && !error && sessions.length === 0 && (
          <div className="p-8 text-center text-sm text-secondary">No recording data for the current filters yet.</div>
        )}
        {loading && (
          <div className="p-8 text-center text-sm text-secondary">Loading recordings...</div>
        )}
        {error && (
          <div className="p-8 text-center text-sm text-red-500">{error}</div>
        )}
      </div>

      {/* Playback Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-fade-in">
         <div className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm" onClick={() => setSelectedSessionId(null)}></div>
          
         <div className="relative w-full max-w-6xl h-full max-h-[84vh] bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-[0_24px_60px_-24px_rgba(15,23,42,0.35)] animate-scale-in">
            {/* Player Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-4">
             <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-luxury-blue">
              <Video size={18} />
                </div>
                <div>
               <h3 className="font-semibold text-luxury-text flex items-center gap-2 text-sm md:text-base">
                    {selectedSession.user} 
                <span className="text-xs font-medium text-slate-400">• {selectedSession.id}</span>
                   </h3>
               <div className="flex items-center gap-3 text-[10px] text-secondary font-semibold uppercase tracking-wide mt-0.5">
                      <span className="flex items-center gap-1"><MapPin size={10} /> {selectedSession.location}</span>
                      <span className="flex items-center gap-1"><Monitor size={10} /> {selectedSession.browser}</span>
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-50"><Maximize size={18} /></button>
                 <button 
                  onClick={() => setSelectedSessionId(null)}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                >
              <X size={20} />
                 </button>
              </div>
            </div>

            {/* Player Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Main Viewport */}
            <div className="flex-1 bg-slate-50 p-6 flex items-center justify-center relative overflow-hidden">
              <div className="w-full max-w-4xl aspect-[16/10] bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
                <div className="h-8 bg-slate-50 border-b border-slate-200 px-4 flex items-center gap-2">
                       <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                       </div>
                  <div className="flex-1 max-w-sm mx-auto h-5 bg-white rounded-md border border-slate-200 flex items-center px-3">
                    <div className="w-full h-1 bg-slate-100 rounded-full" />
                       </div>
                    </div>
                    
                    {/* Simulated Site Replay */}
                    <div className="flex-1 relative overflow-hidden bg-slate-50">
                       <div className="absolute inset-x-0 top-0 h-[200%] animate-slow-scroll opacity-40">
                          <div className="w-full h-screen bg-gradient-to-b from-blue-50/50 to-white flex items-center justify-center text-slate-200">
                             <Monitor size={120} />
                          </div>
                       </div>

                       {/* Simulated Cursor */}
                       <div 
                         className="absolute w-8 h-8 pointer-events-none transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2"
                         style={{ 
                           left: `${playbackPoint.x}%`, 
                           top: `${playbackPoint.y}%`,
                           opacity: isPlaying ? 1 : 0.5
                         }}
                       >
                          <MousePointer2 className="text-luxury-blue" size={20} fill="currentColor" />
                          <div className="w-5 h-5 bg-blue-400/20 rounded-full absolute top-0.5 left-0.5 animate-ping" />
                       </div>
                    </div>
                 </div>

                 {/* Playback Controls Overlay */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-2xl px-6 py-4 flex flex-col gap-3 min-w-[460px] shadow-[0_12px_30px_-18px_rgba(15,23,42,0.25)]">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold font-mono text-slate-500 tabular-nums">{formatTime(currentTime)}</span>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full relative overflow-hidden cursor-pointer">
                          <div 
                            className="absolute inset-y-0 left-0 bg-luxury-blue rounded-full transition-all duration-300"
                            style={{ width: `${(currentTime / selectedSession.durationSec) * 100}%` }}
                          ></div>
                          {selectedSession.events.map(event => (
                            <div 
                              key={event.id}
                              className="absolute top-0 w-1 h-full bg-amber-400 z-10 opacity-60 hover:opacity-100 transition-opacity"
                              style={{ left: `${(event.time / selectedSession.durationSec) * 100}%` }}
                              title={event.label}
                            ></div>
                          ))}
                       </div>
                          <span className="text-xs font-semibold font-mono text-slate-500 tabular-nums">{selectedSession.duration}</span>
                    </div>

                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-6">
                            <button className="text-slate-400 hover:text-luxury-blue transition-colors"><RotateCcw size={18} /></button>
                          <button 
                            onClick={() => setIsPlaying(!isPlaying)}
                             className="w-11 h-11 rounded-full bg-luxury-blue text-white flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-colors shadow-sm"
                          >
                             {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                          </button>
                            <button className="text-slate-400 hover:text-luxury-blue transition-colors"><FastForward size={18} /></button>
                       </div>

                       <div className="flex items-center gap-3">
                          {[1, 1.5, 2].map(speed => (
                            <button 
                              key={speed}
                              onClick={() => setPlaybackSpeed(speed)}
                              className={`px-3 py-1 rounded-md text-[10px] font-semibold transition-colors ${playbackSpeed === speed ? 'bg-luxury-blue text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                            >
                              {speed}x
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              {/* Event Log Sidebar */}
                    <div className="w-80 border-l border-slate-200 flex flex-col bg-white">
                      <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                        <h4 className="font-semibold text-luxury-text text-sm flex items-center gap-2">
                          <Activity size={15} className="text-luxury-blue" />
                       Event Log
                    </h4>
                        <span className="px-2 py-1 bg-blue-50 text-[10px] font-semibold text-luxury-blue rounded-md">{selectedSession.events.length}</span>
                 </div>
                      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                    {selectedSession.events.map(event => {
                      const isActive = currentTime >= event.time;
                      return (
                        <div 
                          key={event.id}
                            className={`p-3 rounded-lg border transition-colors ${isActive ? 'bg-slate-50 border-slate-200' : 'opacity-45 grayscale border-transparent'}`}
                        >
                           <div className="flex items-center justify-between mb-1">
                              <span className={`text-[10px] font-semibold uppercase ${event.type === 'click' ? 'text-blue-600' : 'text-amber-600'}`}>
                                {event.type}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">{event.timestamp}</span>
                           </div>
                            <p className="text-xs font-medium text-luxury-text">{event.label}</p>
                        </div>
                      );
                    })}
                    {selectedSession.events.length === 0 && (
                          <div className="h-full flex flex-col items-center justify-center text-center p-8 gap-3 opacity-45">
                            <Activity size={28} />
                            <p className="text-xs font-medium text-slate-500">Recording is still being indexed...</p>
                       </div>
                    )}
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add some extra animations for the scroll and scale effect
const styles = `
@keyframes slow-scroll {
  from { transform: translateY(0); }
  to { transform: translateY(-50%); }
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-slow-scroll {
  animation: slow-scroll 30s linear infinite;
  animation-play-state: var(--scroll-play-state, paused);
}

.animate-scale-in {
  animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
`;

if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = styles;
  document.head.appendChild(styleEl);
}

