import React, { useState, useRef, useEffect } from 'react';
import { Download, FileJson, FileSpreadsheet, ChevronDown } from 'lucide-react';

export default function ExportButton({ data, filename = "export" }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const downloadFile = (content, mimeType, extension) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    // Format current date as YYYY-MM-DD
    const dateStr = new Date().toISOString().split('T')[0];
    link.download = `${filename}-${dateStr}.${extension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const handleExportJSON = () => {
    if (!data) return;
    const jsonString = JSON.stringify(data, null, 2);
    downloadFile(jsonString, "application/json", "json");
  };

  const handleExportCSV = () => {
    if (!data) return;
    
    const rows = [];
    
    // 1. Top-Level Metrics
    rows.push(["Metric", "Value"]);
    Object.entries(data).forEach(([key, val]) => {
      // Exclude arrays/nested objects for the top-level rundown
      if (val !== null && typeof val !== 'object') {
        rows.push([key, val]);
      }
    });
    
    // 2. Clicks Per Hour (if array exists)
    if (Array.isArray(data.clicksPerHour) && data.clicksPerHour.length > 0) {
      rows.push([]);
      rows.push(["Hour", "Clicks"]);
      data.clicksPerHour.forEach(item => {
        rows.push([item.hour, item.count]);
      });
    }

    // 3. Top Pages (if array exists)
    if (Array.isArray(data.topPages) && data.topPages.length > 0) {
      rows.push([]);
      rows.push(["Page URL", "Clicks"]);
      data.topPages.forEach(item => {
        rows.push([item.pageUrl, item.clicks]);
      });
    }

    // Build the CSV string
    const csvContent = rows
      .map(row => {
        // Simple escaping for CSV cells
        return row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",");
      })
      .join("\n");
      
    downloadFile(csvContent, "text/csv;charset=utf-8;", "csv");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={!data}
        className="flex items-center gap-2 px-4 py-[11px] bg-white border border-border-soft rounded-2xl text-sm font-bold text-luxury-text hover:bg-slate-50 transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed h-[46px]"
      >
        <Download size={16} />
        Export
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-border-soft rounded-xl shadow-lg flex flex-col p-1.5 z-50 animate-fade-in">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-luxury-text hover:bg-slate-50 rounded-lg transition-colors text-left"
          >
            <FileSpreadsheet size={16} className="text-emerald-600" />
            Basic CSV
          </button>
          <button 
            onClick={handleExportJSON}
            className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-luxury-text hover:bg-slate-50 rounded-lg transition-colors text-left"
          >
            <FileJson size={16} className="text-luxury-blue" />
            Raw JSON
          </button>
        </div>
      )}
    </div>
  );
}
