import React from 'react';

export default function Recordings() {
  return (
    <div className="flex flex-col gap-10 animate-fade-in py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold font-heading text-gradient tracking-tight">
          Session Recordings
        </h1>
        <p className="text-secondary font-medium italic">Playback real-world user interactions</p>
      </div>

      <div className="glass-card p-20 flex flex-col items-center justify-center text-center gap-10 bg-white/40">
        <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-5xl grayscale opacity-30 shadow-inner">
          🎥
        </div>
        
        <div className="flex flex-col gap-3 max-w-xl">
          <h2 className="text-3xl font-bold font-heading text-luxury-text tracking-tight">Enterprise Replay Engine</h2>
          <p className="text-secondary leading-relaxed font-medium">
            Session recordings are currently being encrypted and indexed for your projects. This feature will allow you to watch exactly how users navigate your interface in real-time.
          </p>
        </div>

        <div className="flex items-center gap-4">
           <button className="btn-primary opacity-50 cursor-not-allowed">Enable Recordings</button>
           <button className="px-6 py-2.5 text-sm font-bold text-luxury-blue bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">Documentation</button>
        </div>
      </div>
    </div>
  );
}
