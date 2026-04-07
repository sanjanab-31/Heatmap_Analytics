import { useEffect, useState } from 'react';
import { RefreshCw, Fingerprint, Globe } from 'lucide-react';

export default function FilterBar({ projectId, pageUrl, onFilter }) {
  const [pId, setPId] = useState(projectId || '');
  const [url, setUrl] = useState(pageUrl || '');

  useEffect(() => {
    setPId(projectId || '');
  }, [projectId]);

  useEffect(() => {
    setUrl(pageUrl || '');
  }, [pageUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ projectId: pId, pageUrl: url });
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="w-full lg:w-auto flex items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-xl shadow-sm"
    >
      <div className="flex flex-col px-3 py-1.5 border-r border-slate-200 min-w-[180px]">
        <label className="text-[10px] uppercase font-semibold text-slate-500 tracking-[0.08em] mb-0.5 flex items-center gap-1">
          <Fingerprint size={10} />
          Project ID
        </label>
        <input
          type="text"
          value={pId}
          onChange={(e) => setPId(e.target.value)}
          className="w-full text-sm font-semibold text-luxury-text bg-transparent border-none focus:outline-none p-0 placeholder:text-slate-300"
          placeholder="id-123..."
        />
      </div>

      <div className="flex flex-col px-3 py-1.5 flex-1 min-w-[240px]">
        <label className="text-[10px] uppercase font-semibold text-slate-500 tracking-[0.08em] mb-0.5 flex items-center gap-1">
          <Globe size={10} />
          Target Page
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full text-sm font-semibold text-luxury-text bg-transparent border-none focus:outline-none p-0 placeholder:text-slate-300"
          placeholder="https://your-domain.com/page"
        />
      </div>

      <button
        type="submit"
        className="h-10 w-[132px] box-border border border-transparent rounded-lg shadow-sm bg-luxury-blue text-white text-xs font-semibold leading-none tracking-wide flex items-center justify-center gap-1.5 whitespace-nowrap hover:bg-blue-700 transition-colors"
      >
        <span className="uppercase">Refresh Data</span>
        <RefreshCw size={12} />
      </button>
    </form>
  );
}
