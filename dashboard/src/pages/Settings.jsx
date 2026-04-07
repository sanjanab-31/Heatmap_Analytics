import React, { useState } from 'react';

export default function Settings() {
  return (
    <div className="flex flex-col gap-10 animate-fade-in py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold font-heading text-gradient tracking-tight">
          System Settings
        </h1>
        <p className="text-secondary font-medium italic">Configure project analytics & API integrations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Section title="Project Management" subtitle="Manage which domains and projects are actively tracked.">
             <div className="flex flex-col gap-4">
                <SettingItem label="Tracking Active" description="Enable or disable real-time data ingestion for all projects." active />
                <SettingItem label="Anonymize IP" description="Comply with GDPR by masking the last octet of visitor IP addresses." active />
                <SettingItem label="Data Retention" description="How long to store interaction data (currently 90 days)." />
             </div>
          </Section>

          <Section title="API Access" subtitle="Connect your heatmap data to external BI tools.">
             <div className="flex flex-col gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                   <div className="flex flex-col gap-1">
                      <span className="text-xs font-black text-secondary uppercase tracking-widest">Public API Key</span>
                      <code className="text-sm font-mono text-luxury-blue">************************8fb4</code>
                   </div>
                   <button className="text-xs font-bold text-luxury-blue bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all">Copy Key</button>
                </div>
             </div>
          </Section>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-8">
           <div className="glass-card p-8 bg-gradient-to-br from-luxury-blue to-blue-700 text-white flex flex-col gap-6 border-none">
              <span className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">🏆</span>
              <div className="flex flex-col gap-2">
                 <h4 className="text-xl font-bold font-heading tracking-tight">Premium Support</h4>
                 <p className="text-sm text-white/80 leading-relaxed font-medium">As an Enterprise Elite customer, you have access to 24/7 dedicated account management.</p>
              </div>
              <button className="w-full bg-white text-luxury-blue py-3 rounded-xl font-bold font-heading text-sm shadow-xl shadow-blue-900/20 active:scale-95 transition-transform">Contact Manager</button>
           </div>

           <div className="glass-card p-6 border-slate-200 flex flex-col gap-4">
              <h5 className="text-xs font-black text-secondary uppercase tracking-widest">Security Audit</h5>
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                 <span className="text-sm font-bold text-luxury-text">System scans completed</span>
              </div>
              <p className="text-xs text-secondary font-medium">Last automated audit: Today at 04:20 AM</p>
           </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div className="glass-card p-10 flex flex-col gap-8">
       <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold font-heading text-luxury-text tracking-tight">{title}</h3>
          <p className="text-sm text-secondary font-medium">{subtitle}</p>
       </div>
       {children}
    </div>
  );
}

function SettingItem({ label, description, active = false }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
       <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-luxury-text group-hover:text-luxury-blue transition-colors">{label}</span>
          <span className="text-xs text-secondary font-medium">{description}</span>
       </div>
       <div className={`w-12 h-6 rounded-full relative transition-colors duration-500 ${active ? 'bg-luxury-blue' : 'bg-slate-200'}`}>
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${active ? 'right-1' : 'left-1'}`} />
       </div>
    </div>
  );
}
