import { useState } from 'react';

export default function FilterBar({ projectId, pageUrl, onFilter }) {
  const [pId, setPId] = useState(projectId);
  const [url, setUrl] = useState(pageUrl);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ projectId: pId, pageUrl: url });
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="glass-card flex items-center p-2 gap-3 self-end shadow-sm"
    >
      <div className="flex flex-col px-3">
        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Project ID</label>
        <input
          type="text"
          value={pId}
          onChange={(e) => setPId(e.target.value)}
          className="text-sm font-bold text-luxury-text bg-transparent border-none focus:ring-0 w-32 p-0"
          placeholder="Project ID..."
        />
      </div>

      <div className="w-[1px] h-8 bg-slate-200" />

      <div className="flex flex-col px-3">
        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target Page</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="text-sm font-bold text-luxury-text bg-transparent border-none focus:ring-0 w-64 p-0 shrink"
          placeholder="Ex: /home"
        />
      </div>

      <button
        type="submit"
        className="btn-primary py-2 px-5 text-xs flex items-center gap-2 group whitespace-nowrap"
      >
        <span>Refresh Analytics</span>
        <span className="group-hover:rotate-180 transition-transform duration-500">🔄</span>
      </button>
    </form>
  );
}
