import React, { useState, useEffect } from 'react';
import { 
  fetchProjects, 
  createProject, 
  updateProjectStatus, 
  deleteProject 
} from '../api/client';
import { 
  FolderPlus, 
  Trash2, 
  Copy, 
  CheckCircle2, 
  Globe, 
  Activity, 
  Key,
  Clock,
  Code,
  X,
  AlertTriangle,
  Play
} from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCodeSnippetModalOpen, setIsCodeSnippetModalOpen] = useState(false);
  
  // Selected project for modals
  const [selectedProject, setSelectedProject] = useState(null);

  // Form state
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDomain, setNewProjectDomain] = useState('');
  const [createError, setCreateError] = useState('');
  const [creating, setCreating] = useState(false);
  
  // Just-created project response to show full API key
  const [newlyCreatedApiKey, setNewlyCreatedApiKey] = useState(null);

  // Copy state
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await fetchProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreateError('');
    
    if (!newProjectName.trim() || !newProjectDomain.trim()) {
      setCreateError('Name and Domain are required.');
      return;
    }

    try {
      setCreating(true);
      const created = await createProject({ 
        name: newProjectName.trim(), 
        domain: newProjectDomain.trim().toLowerCase() 
      });
      
      setNewlyCreatedApiKey(created.rawApiKey);
      setProjects([created, ...projects]);
      
      setNewProjectName('');
      setNewProjectDomain('');
      setIsCreateModalOpen(false);
    } catch (err) {
      setCreateError(err.message || 'Failed to create project.');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (project) => {
    try {
      const newStatus = project.status === 'active' ? 'inactive' : 'active';
      // Optimistic UI update
      setProjects(projects.map(p => p._id === project._id ? { ...p, status: newStatus } : p));
      await updateProjectStatus(project._id, newStatus);
    } catch (err) {
      // Revert on error
      setProjects(projects);
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const confirmDelete = (project) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    try {
      await deleteProject(selectedProject._id);
      setProjects(projects.filter(p => p._id !== selectedProject._id));
      setIsDeleteModalOpen(false);
      setSelectedProject(null);
    } catch (err) {
      alert(`Failed to delete project: ${err.message}`);
    }
  };

  const openCodeSnippet = (project) => {
    setSelectedProject(project);
    setIsCodeSnippetModalOpen(true);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Never";
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    if (seconds < 30) return "Just now";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col">
           <h1 className="text-3xl font-black text-luxury-text font-heading flex items-center gap-3">
             Project Workspaces
           </h1>
           <p className="text-secondary mt-2 max-w-xl text-sm leading-relaxed">
             Manage your active website integrations. Unique API keys and domains enforce strict CORS rules for enterprise-grade security.
           </p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-luxury-blue text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
        >
          <FolderPlus size={18} />
          Create Project
        </button>
      </div>

      {/* Main Content Area */}
      <div className="mt-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 panel-container animate-pulse gap-3 cursor-wait">
            <div className="w-8 h-8 border-4 border-luxury-blue border-r-transparent rounded-full animate-spin"></div>
            <p className="text-secondary text-sm font-medium">Loading workspaces...</p>
          </div>
        ) : error ? (
          <div className="panel-container border-red-200 bg-red-50/50 flex flex-col items-center justify-center py-12 gap-2 text-center relative overflow-hidden">
             <AlertTriangle size={32} className="text-red-500 mb-2" />
             <p className="text-red-600 font-semibold">{error}</p>
             <button onClick={loadProjects} className="mt-4 px-4 py-2 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors text-sm">Try Again</button>
          </div>
        ) : projects.length === 0 ? (
          <div className="panel-container flex flex-col items-center justify-center text-center py-24 gap-4">
             <div className="w-16 h-16 rounded-2xl bg-luxury-blue/5 border border-luxury-blue/10 flex items-center justify-center text-luxury-blue mb-2 shadow-[0_0_20px_rgba(0,102,255,0.1)]">
                <FolderPlus size={32} />
             </div>
             <div className="flex flex-col gap-1.5">
               <h3 className="text-sm font-bold text-slate-400 font-heading">No data available yet</h3>
               <p className="text-[10px] text-slate-300 font-medium uppercase tracking-tighter">Start interacting with your website to generate insights</p>
             </div>
             <button onClick={() => setIsCreateModalOpen(true)} className="mt-4 text-luxury-blue font-bold text-sm tracking-wide uppercase hover:underline flex items-center gap-1.5 focus:outline-none">
               Create Now <Play size={14} fill="currentColor" />
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div key={project._id} className="panel-container relative group hover:border-luxury-blue/30 transition-all duration-300">
                 {/* Top row: Name & Status */}
                 <div className="flex items-center justify-between pb-4 border-b border-border-soft mb-4">
                    <div className="flex flex-col gap-1">
                       <h3 className="text-lg font-bold text-luxury-text tracking-tight">{project.name}</h3>
                       <div className="flex items-center gap-2 text-xs text-secondary font-medium">
                          <Globe size={12} />
                          <span>{project.domain}</span>
                       </div>
                    </div>
                    
                    {/* Status Toggle */}
                    <div className="flex items-center gap-3">
                       <span className={`text-xs font-bold uppercase tracking-wider ${project.status === 'active' ? 'text-emerald-500' : 'text-slate-400'}`}>
                         {project.status === 'active' ? 'Tracking Active' : 'Paused'}
                       </span>
                       <button 
                         onClick={() => handleToggleStatus(project)}
                         className={`w-12 h-6 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-luxury-blue ${project.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}
                       >
                          <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${project.status === 'active' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                       </button>
                    </div>
                 </div>

                 {/* Stats Row */}
                 <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                       <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Activity size={16} />
                       </div>
                       <div className="flex flex-col">
                          <p className="text-[10px] text-secondary font-bold uppercase tracking-wider">Sessions</p>
                          <p className="text-sm font-black text-luxury-text">{project.totalSessions.toLocaleString()}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                       <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <CheckCircle2 size={16} />
                       </div>
                       <div className="flex flex-col">
                          <p className="text-[10px] text-secondary font-bold uppercase tracking-wider">Events</p>
                          <p className="text-sm font-black text-luxury-text">{project.totalClicks.toLocaleString()}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                       <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                          <Clock size={16} />
                       </div>
                       <div className="flex flex-col">
                          <p className="text-[10px] text-secondary font-bold uppercase tracking-wider">Last Active</p>
                          <p className="text-xs font-bold text-luxury-text mt-0.5">{formatTimeAgo(project.lastEventAt)}</p>
                       </div>
                    </div>
                 </div>

                 {/* API Key Row */}
                 <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 flex flex-col gap-1">
                       <p className="text-[10px] uppercase font-black tracking-widest text-secondary pl-1">Project ID</p>
                       <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg relative group">
                          <code className="text-xs font-mono font-medium text-slate-700 select-all">{project.projectId}</code>
                          <button 
                            onClick={() => copyToClipboard(project.projectId, `id_${project._id}`)}
                            className="ml-auto text-secondary hover:text-luxury-blue transition-colors bg-white border border-slate-200 p-1.5 rounded-md shadow-sm"
                            title="Copy Project ID"
                          >
                            {copiedId === `id_${project._id}` ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          </button>
                       </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                       <p className="text-[10px] uppercase font-black tracking-widest text-secondary pl-1">API Key</p>
                       <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg relative group">
                          <Key size={14} className="text-indigo-400 shrink-0" />
                          <code className="text-xs font-mono font-medium text-slate-700">pk_••••••••••••{project.apiKeyLastFour}</code>
                       </div>
                    </div>
                 </div>

                 {/* Action Buttons Row */}
                 <div className="flex items-center justify-between border-t border-border-soft pt-4 mt-auto">
                    <button 
                       onClick={() => openCodeSnippet(project)}
                       className="flex items-center gap-2 text-sm font-semibold text-luxury-blue hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all border border-blue-100"
                    >
                       <Code size={16} /> Copy Setup Code
                    </button>
                    
                    <button 
                       onClick={() => confirmDelete(project)}
                       className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors group-hover:opacity-100 sm:opacity-50"
                       title="Delete Project"
                    >
                       <Trash2 size={18} />
                    </button>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Modals --- */}
      
      {/* 1. Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-premium border border-border-soft w-full max-w-md overflow-hidden animate-fade-in relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
             <div className="px-6 py-5 border-b border-border-soft flex items-center justify-between bg-slate-50">
               <h3 className="text-lg font-bold text-luxury-text tracking-tight flex items-center gap-2">
                 <FolderPlus size={20} className="text-luxury-blue" />
                 Create New Project
               </h3>
               <button onClick={() => setIsCreateModalOpen(false)} className="text-secondary hover:text-luxury-text transition-colors p-1 rounded-md hover:bg-slate-200">
                 <X size={20} />
               </button>
             </div>
             <form onSubmit={handleCreateProject} className="p-6">
                {createError && (
                  <div className="p-3 mb-5 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2">
                    <AlertTriangle size={16} /> {createError}
                  </div>
                )}
                
                <div className="flex flex-col gap-5">
                   <div className="flex flex-col gap-1.5">
                     <label htmlFor="name" className="text-[11px] font-black uppercase text-secondary tracking-widest pl-1">Project Name</label>
                     <input 
                       id="name"
                       type="text" 
                       required
                       placeholder="e.g. Acme Corp Main Site" 
                       className="w-full px-4 py-3 bg-slate-50 border border-border-soft rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-luxury-blue/50 focus:border-luxury-blue transition-all"
                       value={newProjectName}
                       onChange={(e) => setNewProjectName(e.target.value)}
                     />
                   </div>
                   
                   <div className="flex flex-col gap-1.5">
                     <label htmlFor="domain" className="text-[11px] font-black uppercase text-secondary tracking-widest pl-1">Authorized Domain</label>
                     <div className="relative">
                       <input 
                         id="domain"
                         type="text" 
                         required
                         placeholder="e.g. acme.com (no https://)" 
                         className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-border-soft rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-luxury-blue/50 focus:border-luxury-blue transition-all"
                         value={newProjectDomain}
                         onChange={(e) => setNewProjectDomain(e.target.value)}
                       />
                       <Globe size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                     </div>
                     <p className="text-xs text-secondary mt-1 pl-1">Only events originating from this domain will be accepted.</p>
                   </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3">
                   <button 
                     type="button" 
                     onClick={() => setIsCreateModalOpen(false)}
                     className="px-4 py-2 text-sm font-bold text-secondary hover:text-luxury-text transition-colors"
                   >
                     Cancel
                   </button>
                   <button 
                     type="submit" 
                     disabled={creating}
                     className="px-6 py-2 bg-luxury-blue text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-actions disabled:opacity-50 shadow-md hover:shadow-lg"
                   >
                     {creating ? 'Creating...' : 'Create Project'}
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* 2. New Project Key Revealed Modal (Shown right after creation) */}
      {newlyCreatedApiKey && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-premium border border-border-soft w-full max-w-lg p-8 animate-fade-in text-center relative overflow-hidden">
             
             <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-emerald-600" />
             
             <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border-2 border-emerald-100 mx-auto mb-6 text-emerald-500 shadow-inner">
               <CheckCircle2 size={32} />
             </div>
             
             <h3 className="text-2xl font-black text-luxury-text mb-2 tracking-tight">Project Created Successfully</h3>
             <p className="text-secondary text-sm mb-8 px-4">
               Please copy your API key now. For your security, <strong className="text-luxury-text">it will never be shown again</strong>.
             </p>
             
             <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 mb-8 relative flex items-center justify-between group cursor-text">
               <code className="font-mono text-sm text-slate-800 font-bold tracking-wide break-all text-left pr-4">
                 {newlyCreatedApiKey}
               </code>
               <button 
                  onClick={() => copyToClipboard(newlyCreatedApiKey, 'new_key')}
                  className="shrink-0 w-10 h-10 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center justify-center text-secondary hover:text-luxury-blue hover:border-luxury-blue transition-colors group-hover:scale-105"
               >
                 {copiedId === 'new_key' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
               </button>
             </div>

             <button 
               onClick={() => setNewlyCreatedApiKey(null)}
               className="w-full py-4 bg-luxury-blue text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-all shadow-[0_8px_20px_rgba(0,102,255,0.2)] hover:shadow-[0_8px_30px_rgba(0,102,255,0.3)] hover:-translate-y-1"
             >
               I have safely stored my API key
             </button>
          </div>
        </div>
      )}

      {/* 3. Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-premium border border-border-soft w-full max-w-sm overflow-hidden animate-fade-in relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
             <div className="p-6 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 border-4 border-red-100">
                  <AlertTriangle size={28} />
                </div>
                <h3 className="text-lg font-bold text-luxury-text mb-2">Delete {selectedProject.name}?</h3>
                <p className="text-secondary text-sm mb-6">
                  This action cannot be undone. All heatmap data and session analytics associated with this project will be permanently erased.
                </p>
                <div className="flex w-full gap-3">
                   <button 
                     onClick={() => { setIsDeleteModalOpen(false); setSelectedProject(null); }}
                     className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={handleDeleteProject}
                     className="flex-1 py-3 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors shadow-md hover:shadow-lg shadow-red-600/20"
                   >
                     Yes, Delete It
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* 4. Code Snippet Modal */}
      {isCodeSnippetModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-[0_20px_80px_-15px_rgba(0,0,0,0.5)] border border-border-soft w-full max-w-3xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
             <div className="px-8 py-5 border-b border-border-soft flex items-center justify-between bg-slate-50">
               <div>
                 <h3 className="text-xl font-bold text-luxury-text tracking-tight mb-1">Integration Setup</h3>
                 <p className="text-xs text-secondary font-medium">Add Heatwave analytics to your application</p>
               </div>
               <button onClick={() => { setIsCodeSnippetModalOpen(false); setSelectedProject(null); }} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-secondary hover:text-luxury-text rounded-full shadow-sm hover:scale-105 transition-all">
                 <X size={16} />
               </button>
             </div>
             
             <div className="p-8 overflow-y-auto custom-scrollbar flex flex-col gap-8">
               
               <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-luxury-blue text-white text-xs font-bold flex items-center justify-center shadow-md">1</div>
                    <h4 className="text-sm font-bold text-luxury-text tracking-tight">Install the tracking package</h4>
                  </div>
                  <div className="ml-9 bg-[#1E1E1E] rounded-xl p-4 flex items-center justify-between group shadow-inner">
                    <code className="text-[13px] font-mono text-emerald-400">npm <span className="text-slate-300">install</span> heatmap-tracker</code>
                    <button 
                      onClick={() => copyToClipboard('npm install heatmap-tracker', 'npm_copy')}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {copiedId === 'npm_copy' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    </button>
                  </div>
               </div>

               <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-luxury-blue text-white text-xs font-bold flex items-center justify-center shadow-md">2</div>
                    <h4 className="text-sm font-bold text-luxury-text tracking-tight">Initialize inside your main entry point</h4>
                  </div>
                  <div className="ml-9 relative group">
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                       <button 
                         onClick={() => copyToClipboard(`import { init } from 'heatmap-tracker';

// Initialize the tracker once on load
const destroy = init({
  projectId: '${selectedProject.projectId}',
  apiKey: 'YOUR_RAW_API_KEY_HERE', // Use environment variables
  endpoint: 'http://localhost:${import.meta.env.VITE_API_PORT || '3000'}/api/events'
});`, 'code_copy')}
                         className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/10 text-white rounded-lg text-xs font-bold transition-all"
                       >
                         {copiedId === 'code_copy' ? <><CheckCircle2 size={12} className="text-emerald-400" /> Copied!</> : <><Copy size={12} /> Copy code</>}
                       </button>
                    </div>
                    <pre className="bg-[#1E1E1E] rounded-xl p-5 overflow-x-auto text-[13px] font-mono leading-relaxed shadow-inner border border-slate-800">
                      <span className="text-blue-400">import</span> {'{ init }'} <span className="text-blue-400">from</span> <span className="text-orange-300">'heatmap-tracker'</span>;{'\n\n'}
                      <span className="text-emerald-600/70">// Initialize the tracker once on load</span>{'\n'}
                      <span className="text-blue-400">const</span> <span className="text-yellow-200">destroy</span> = <span className="text-yellow-200">init</span>({'{'}{'\n'}
                      {'  '}projectId: <span className="text-orange-300">'{selectedProject.projectId}'</span>,{'\n'}
                      {'  '}apiKey: <span className="text-orange-300">'YOUR_RAW_API_KEY_HERE'</span>, <span className="text-emerald-600/70">// Ensure this is secure!</span>{'\n'}
                      {'  '}endpoint: <span className="text-orange-300">'http://localhost:3000/api/events'</span>{'\n'}
                      {'}'});
                    </pre>
                  </div>
               </div>

             </div>
          </div>
        </div>
      )}

    </div>
  );
}
