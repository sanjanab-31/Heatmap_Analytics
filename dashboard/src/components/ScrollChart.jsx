import { Bar } from 'react-chartjs-2';
import { ScrollText } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ScrollChart({ analytics, loading }) {
  const scrollData = analytics?.scroll_depth || [0, 0, 0, 0, 0];
  const labels = ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Retention Rate (%)',
        data: scrollData,
        backgroundColor: 'rgba(0, 102, 255, 0.4)',
        hoverBackgroundColor: '#0066FF',
        borderRadius: 12,
        barThickness: 40,
        maxBarThickness: 50,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 14,
        titleFont: { size: 12, weight: '900', family: "'Poppins', sans-serif" },
        bodyFont: { size: 11, weight: '500', family: "'Poppins', sans-serif" },
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          label: (context) => ` ${context.parsed.x}% Retention`
        }
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(226, 232, 240, 0.5)', drawTicks: false },
        ticks: { color: '#94a3b8', font: { size: 9, weight: '700' }, padding: 8 },
        min: 0,
        max: 100,
        title: { display: true, text: 'VISITOR COMPLETION %', color: '#94a3b8', font: { size: 9, weight: '900', family: "'Poppins', sans-serif" }, padding: 10 },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#0f172a', font: { size: 11, weight: '700', family: "'Poppins', sans-serif" }, padding: 12 },
        border: { display: false }
      },
    },
  };

  const isEmpty = !loading && (!analytics || !analytics.scroll_depth || analytics.scroll_depth.every(v => v === 0));

  return (
    <div className="relative w-full h-[300px] flex items-center justify-center">
      {loading ? (
        <div className="flex flex-col items-center gap-3">
           <div className="w-7 h-7 rounded-full border-2 border-slate-200 border-t-luxury-blue animate-spin" />
           <span className="text-xs font-medium text-secondary">Loading chart data...</span>
        </div>
      ) : isEmpty ? (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50/70 rounded-xl text-center px-4">
          <div className="w-12 h-12 bg-white rounded-full border border-slate-200 flex items-center justify-center text-luxury-blue mb-3">
            <ScrollText size={22} />
           </div>
           <p className="text-sm font-semibold text-slate-500 font-heading">No data available yet</p>
           <p className="text-xs text-slate-400 font-medium mt-1">Scroll behavior will appear once users interact with your pages.</p>
        </div>
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
}
