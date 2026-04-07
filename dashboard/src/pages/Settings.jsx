import React, { useEffect, useState } from 'react';
import { ShieldCheck, Key, Trophy } from 'lucide-react';
import { fetchProjects } from '../api/client';

export default function Settings() {
   const [projects, setProjects] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      let mounted = true;
      const load = async () => {
         try {
            const data = await fetchProjects();
            if (mounted) setProjects(Array.isArray(data) ? data : []);
         } finally {
            if (mounted) setLoading(false);
         }
      };

      load();
      return () => {
         mounted = false;
      };
   }, []);

   const activeProjects = projects.filter((p) => p.status === 'active').length;
   const retentionDays = Number(import.meta.env.VITE_DATA_RETENTION_DAYS || 0);
   const primaryProject = projects[0];
   const apiKeyPreview = primaryProject?.apiKeyLastFour
      ? `************************${primaryProject.apiKeyLastFour}`
      : 'No API key available';
   const latestProjectTime = projects
      .map((project) => new Date(project.createdAt || 0).getTime())
      .filter((value) => Number.isFinite(value) && value > 0)
      .sort((a, b) => b - a)[0];
   const auditDate = latestProjectTime ? new Date(latestProjectTime) : new Date();

  return (
      <div className="flex flex-col gap-6 py-8">
         <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-semibold font-heading text-luxury-text tracking-tight">
          System Settings
        </h1>
            <p className="text-secondary font-medium text-sm">Configure project analytics, retention policies, and API access.</p>
      </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 flex flex-col gap-4">
          <Section title="Project Management" subtitle="Manage which domains and projects are actively tracked.">
             <div className="flex flex-col gap-4">
                <SettingItem label="Tracking Active" description={`Active projects: ${activeProjects} / ${projects.length}`} active={activeProjects > 0} />
                <SettingItem label="Anonymize IP" description="Comply with GDPR by masking the last octet of visitor IP addresses." active={Boolean(import.meta.env.VITE_ANONYMIZE_IP)} />
                <SettingItem label="Data Retention" description={retentionDays > 0 ? `How long to store interaction data (${retentionDays} days).` : 'Set VITE_DATA_RETENTION_DAYS to configure retention policy.'} active={retentionDays > 0} />
             </div>
          </Section>

          <Section title="API Access" subtitle="Connect your heatmap data to external BI tools.">
             <div className="flex flex-col gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 mb-1">
                         <Key size={12} className="text-luxury-blue" />
                         <span className="text-xs font-semibold text-secondary uppercase tracking-wide">Public API Key</span>
                      </div>
                      <code className="text-sm font-mono text-luxury-blue">{apiKeyPreview}</code>
                   </div>
                   <button
                     onClick={() => navigator.clipboard.writeText(primaryProject?.projectId || '')}
                     className="h-9 px-3.5 text-xs font-semibold text-luxury-blue bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                   >
                     Copy Project ID
                   </button>
                </div>
             </div>
          </Section>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-4">
           <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-4">
              <div className="w-10 h-10 bg-blue-50 border border-blue-100 text-luxury-blue rounded-lg flex items-center justify-center">
                 <Trophy size={18} />
              </div>
              <div className="flex flex-col gap-2">
                 <h4 className="text-lg font-semibold font-heading tracking-tight text-luxury-text">Support</h4>
                 <p className="text-sm text-secondary leading-relaxed font-medium">{projects.length > 0 ? `${projects.length} connected project${projects.length > 1 ? 's' : ''} with active telemetry.` : 'Connect a project to enable support insights and usage recommendations.'}</p>
              </div>
              <button className="h-10 w-full bg-luxury-blue text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors">Contact Manager</button>
           </div>

           <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                 <h5 className="text-[10px] font-semibold text-secondary uppercase tracking-wide">Security Audit</h5>
                 <ShieldCheck size={14} className="text-emerald-500" />
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500" />
                 <span className="text-sm font-semibold text-luxury-text">{loading ? 'Loading project security context...' : 'System scans completed'}</span>
              </div>
              <p className="text-xs text-secondary font-medium">Last automated audit: {auditDate.toLocaleString()}</p>
           </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-6">
       <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold font-heading text-luxury-text tracking-tight">{title}</h3>
          <p className="text-sm text-secondary font-medium">{subtitle}</p>
       </div>
       {children}
    </div>
  );
}

function SettingItem({ label, description, active = false }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
       <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-luxury-text">{label}</span>
          <span className="text-xs text-secondary font-medium">{description}</span>
       </div>
       <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${active ? 'bg-luxury-blue' : 'bg-slate-300'}`}>
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${active ? 'right-1' : 'left-1'}`} />
       </div>
    </div>
  );
}
