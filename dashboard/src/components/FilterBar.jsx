import { useState } from 'react';
import { RefreshCw, Fingerprint, Globe } from 'lucide-react';

export default function FilterBar({ projectId, pageUrl, onFilter }) {
  const [pId, setPId] = useState(projectId || '');
  const [url, setUrl] = useState(pageUrl || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ projectId: pId, pageUrl: url });
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="glass-card flex items-center p-1.5 gap-2 shadow-sm bg-white/80 border-slate-200/60 transition-all duration-300 hover:border-luxury-blue/30"
    >
      <div className="flex flex-col px-4 py-1 group border-r border-slate-100">
        <label className="text-[10px] uppercase font-black text-secondary tracking-[0.1em] mb-0.5 transition-colors group-focus-within:text-luxury-blue flex items-center gap-1.5">
          <Fingerprint size={10} />
          Project ID
        </label>
        <input
          type="text"
          value={pId}
          onChange={(e) => setPId(e.target.value)}
          className="text-sm font-bold text-luxury-text bg-transparent border-none focus:ring-0 w-32 p-0 placeholder:text-slate-300"
          placeholder="id-123..."
        />
      </div>

      <div className="flex flex-col px-4 py-1 group flex-1">
        <label className="text-[10px] uppercase font-black text-secondary tracking-[0.1em] mb-0.5 transition-colors group-focus-within:text-luxury-blue flex items-center gap-1.5">
          <Globe size={10} />
          Target Page
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="text-sm font-bold text-luxury-text bg-transparent border-none focus:ring-0 w-64 p-0 placeholder:text-slate-300"
          placeholder="https://your-domain.com/page"
        />
      </div>

      <button
        type="submit"
        className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2 group whitespace-nowrap ml-2"
      >
        <span className="tracking-tight uppercase font-black">Refresh Data</span>
        <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
      </button>
    </form>
  );
}
