import React, { useState, useEffect } from 'react';
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

const SESSIONS = [
  {
    id: 'sess_94k2',
    user: 'User #8421',
    duration: '04:12',
    durationSec: 252,
    interactions: 42,
    timestamp: '2 mins ago',
    location: 'New York, US',
    browser: 'Chrome',
    os: 'Windows',
    pages: 5,
    status: 'completed',
    events: [
      { id: 1, type: 'click', time: 12, label: 'Hero CTA', timestamp: '00:12' },
      { id: 2, type: 'scroll', time: 45, label: 'Scrolled 40%', timestamp: '00:45' },
      { id: 3, type: 'click', time: 65, label: 'Pricing Plan', timestamp: '01:05' },
      { id: 4, type: 'scroll', time: 120, label: 'Scrolled 80%', timestamp: '02:00' },
      { id: 5, type: 'click', time: 180, label: 'Checkout', timestamp: '03:00' },
    ]
  },
  {
    id: 'sess_12h5',
    user: 'User #9103',
    duration: '02:45',
    durationSec: 165,
    interactions: 18,
    timestamp: '15 mins ago',
    location: 'London, UK',
    browser: 'Safari',
    os: 'macOS',
    pages: 3,
    status: 'completed',
    events: [
      { id: 1, type: 'click', time: 5, label: 'Logo', timestamp: '00:05' },
      { id: 2, type: 'scroll', time: 30, label: 'Scrolled 25%', timestamp: '00:30' },
    ]
  },
  {
    id: 'sess_88m1',
    user: 'User #7721',
    duration: '08:21',
    durationSec: 501,
    interactions: 85,
    timestamp: '1 hour ago',
    location: 'Berlin, DE',
    browser: 'Firefox',
    os: 'Linux',
    pages: 12,
    status: 'completed',
    events: [
      { id: 1, type: 'click', time: 10, label: 'Search Input', timestamp: '00:10' },
    ]
  },
  {
    id: 'sess_live_1',
    user: 'User #2241',
    duration: '01:10',
    durationSec: 70,
    interactions: 12,
    timestamp: 'Live Now',
    location: 'Tokyo, JP',
    browser: 'Edge',
    os: 'Windows',
    pages: 2,
    status: 'live',
    events: []
  }
];

export default function Recordings() {
  const [selectedSession, setSelectedSession] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlaySession = (session) => {
    setSelectedSession(session);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in py-10 relative">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold font-heading text-gradient tracking-tight">
            Session Recordings
          </h1>
          <p className="text-secondary font-medium italic">Understand exactly how your users experience your product</p>
        </div>
        
        <div className="flex gap-4">
          <div className="glass-card px-6 py-3 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-bold text-luxury-text">124 Active Recently</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-luxury-blue">
            <Video size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-secondary uppercase tracking-wider">Total Recorded</p>
            <p className="text-2xl font-bold text-luxury-text">1,284</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-secondary uppercase tracking-wider">Avg. Duration</p>
            <p className="text-2xl font-bold text-luxury-text">04:32</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-secondary uppercase tracking-wider">Avg. Interactions</p>
            <p className="text-2xl font-bold text-luxury-text">24.5</p>
          </div>
        </div>
      </div>

      {/* Session Table */}
      <div className="glass-card overflow-hidden">
        <div className="bg-slate-50/50 border-b border-white px-8 py-4 flex items-center justify-between">
          <h2 className="font-bold text-slate-700 flex items-center gap-2">
            <List size={18} />
            Recent Sessions
          </h2>
          <div className="flex gap-2">
             <button className="px-4 py-1.5 text-xs font-bold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">Filters</button>
             <button className="px-4 py-1.5 text-xs font-bold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">Export</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100/50">
                <th className="px-8 py-5 text-xs font-bold text-secondary uppercase tracking-widest">User</th>
                <th className="px-8 py-5 text-xs font-bold text-secondary uppercase tracking-widest">Location</th>
                <th className="px-8 py-5 text-xs font-bold text-secondary uppercase tracking-widest">Device</th>
                <th className="px-8 py-5 text-xs font-bold text-secondary uppercase tracking-widest">Activity</th>
                <th className="px-8 py-5 text-xs font-bold text-secondary uppercase tracking-widest">Time</th>
                <th className="px-8 py-5 text-xs font-bold text-secondary uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {SESSIONS.map((session, idx) => (
                <tr 
                  key={session.id} 
                  className={`border-b border-slate-100/50 hover:bg-blue-50/20 transition-colors group animate-slide-up`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-100 to-white border border-slate-200 flex items-center justify-center font-bold text-slate-400 text-xs shadow-sm">
                        {session.user.split('#')[1]}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-luxury-text text-sm">{session.user}</span>
                        <span className="text-[10px] text-secondary font-medium uppercase tracking-tighter">{session.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Globe size={14} className="text-slate-400" />
                      <span className="text-sm font-medium">{session.location}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Monitor size={14} className="text-slate-400" />
                      <span className="text-sm font-medium">{session.browser} • {session.os}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-luxury-text">{session.duration}</span>
                        <span className="text-[10px] text-secondary uppercase font-bold tracking-tighter">Duration</span>
                      </div>
                      <div className="w-px h-6 bg-slate-100"></div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-luxury-text">{session.interactions}</span>
                        <span className="text-[10px] text-secondary uppercase font-bold tracking-tighter">Clicks</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {session.status === 'live' ? (
                       <span className="flex items-center gap-2 text-xs font-bold text-emerald-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        LIVE
                       </span>
                    ) : (
                      <span className="text-sm font-medium text-secondary italic">{session.timestamp}</span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => handlePlaySession(session)}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-luxury-blue shadow-sm hover:bg-luxury-blue hover:text-white hover:scale-110 transition-all duration-300"
                    >
                      <Play size={18} fill="currentColor" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Playback Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedSession(null)}></div>
          
          <div className="relative w-full max-w-6xl h-full max-h-[85vh] glass-card overflow-hidden flex flex-col bg-white border-none shadow-2xl animate-scale-in">
            {/* Player Header */}
            <div className="flex items-center justify-between px-8 py-4 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-luxury-blue">
                  <Video size={20} />
                </div>
                <div>
                   <h3 className="font-bold text-luxury-text flex items-center gap-2">
                    {selectedSession.user} 
                    <span className="text-xs font-medium text-slate-400">• {selectedSession.id}</span>
                   </h3>
                   <div className="flex items-center gap-3 text-[10px] text-secondary font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1"><MapPin size={10} /> {selectedSession.location}</span>
                      <span className="flex items-center gap-1"><Monitor size={10} /> {selectedSession.browser}</span>
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                 <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><Maximize size={20} /></button>
                 <button 
                  onClick={() => setSelectedSession(null)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X size={24} />
                 </button>
              </div>
            </div>

            {/* Player Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Main Viewport */}
              <div className="flex-1 bg-slate-100/50 p-8 flex items-center justify-center relative overflow-hidden">
                 <div className="w-full max-w-4xl aspect-[16/10] bg-white rounded-2xl shadow-2xl border border-white flex flex-col overflow-hidden">
                    <div className="h-8 bg-slate-50 border-b border-slate-100 px-4 flex items-center gap-2">
                       <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                       </div>
                       <div className="flex-1 max-w-sm mx-auto h-5 bg-white rounded-md border border-slate-100 flex items-center px-3">
                          <div className="w-full h-1 bg-slate-50 rounded-full"></div>
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
                           left: `${30 + (currentTime % 40)}%`, 
                           top: `${40 + (currentTime % 30)}%`,
                           opacity: isPlaying ? 1 : 0.5
                         }}
                       >
                          <MousePointer2 className="text-luxury-blue shadow-lg" size={24} fill="currentColor" />
                          <div className="w-6 h-6 bg-blue-400/20 rounded-full absolute top-0 left-0 animate-ping"></div>
                       </div>
                    </div>
                 </div>

                 {/* Playback Controls Overlay */}
                 <div className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-card px-8 py-4 flex flex-col gap-3 min-w-[500px]">
                    <div className="flex items-center gap-4">
                       <span className="text-xs font-bold font-mono text-secondary">{formatTime(currentTime)}</span>
                       <div className="flex-1 h-1.5 bg-slate-100 rounded-full relative overflow-hidden group cursor-pointer">
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
                       <span className="text-xs font-bold font-mono text-secondary">{selectedSession.duration}</span>
                    </div>

                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-6">
                          <button className="text-slate-400 hover:text-luxury-blue transition-colors"><RotateCcw size={20} /></button>
                          <button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-12 h-12 rounded-full bg-luxury-blue text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
                          >
                            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                          </button>
                          <button className="text-slate-400 hover:text-luxury-blue transition-colors"><FastForward size={20} /></button>
                       </div>

                       <div className="flex items-center gap-3">
                          {[1, 1.5, 2].map(speed => (
                            <button 
                              key={speed}
                              onClick={() => setPlaybackSpeed(speed)}
                              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${playbackSpeed === speed ? 'bg-luxury-blue text-white' : 'bg-slate-100 text-secondary hover:bg-slate-200'}`}
                            >
                              {speed}x
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              {/* Event Log Sidebar */}
              <div className="w-80 border-l border-slate-100 flex flex-col bg-slate-50/30">
                 <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                    <h4 className="font-bold text-luxury-text text-sm flex items-center gap-2">
                       <Activity size={16} className="text-luxury-blue" />
                       Event Log
                    </h4>
                    <span className="px-2 py-1 bg-blue-50 text-[10px] font-bold text-luxury-blue rounded-md">{selectedSession.events.length}</span>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                    {selectedSession.events.map(event => {
                      const isActive = currentTime >= event.time;
                      return (
                        <div 
                          key={event.id}
                          className={`p-3 rounded-xl border transition-all ${isActive ? 'bg-white border-blue-100 shadow-sm' : 'opacity-40 grayscale border-transparent'}`}
                        >
                           <div className="flex items-center justify-between mb-1">
                              <span className={`text-[10px] font-bold uppercase ${event.type === 'click' ? 'text-blue-500' : 'text-amber-500'}`}>
                                {event.type}
                              </span>
                              <span className="text-[10px] font-mono text-secondary">{event.timestamp}</span>
                           </div>
                           <p className="text-xs font-semibold text-luxury-text">{event.label}</p>
                        </div>
                      );
                    })}
                    {selectedSession.events.length === 0 && (
                       <div className="h-full flex flex-col items-center justify-center text-center p-8 gap-3 opacity-40 italic">
                          <Activity size={32} />
                          <p className="text-xs font-medium">Recording is still being indexed...</p>
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

