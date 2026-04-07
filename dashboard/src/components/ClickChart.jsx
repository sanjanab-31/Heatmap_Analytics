import { Bar } from 'react-chartjs-2';
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

export default function ClickChart({ analytics, loading }) {
  const hourlyData = analytics?.clicks_by_hour || Array(24).fill(0);
  const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  const data = {
    labels,
    datasets: [
      {
        label: 'Interaction Volume',
        data: hourlyData,
        backgroundColor: 'rgba(0, 102, 255, 0.4)',
        hoverBackgroundColor: '#0066FF',
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 'flex',
        maxBarThickness: 14,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 10, bottom: 0 }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 14,
        titleFont: { size: 13, weight: '900', family: "'Poppins', sans-serif" },
        bodyFont: { size: 12, weight: '500', family: "'Poppins', sans-serif" },
        cornerRadius: 12,
        displayColors: false,
        caretSize: 6,
        callbacks: {
          label: (context) => ` ${context.parsed.y} Recorded Clicks`
        }
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 9, weight: '700' }, padding: 8 },
      },
      y: {
        grid: { 
          color: 'rgba(226, 232, 240, 0.5)', 
          drawTicks: false,
          borderDash: [5, 5]
        },
        ticks: { 
          color: '#94a3b8', 
          font: { size: 10, weight: '600' }, 
          padding: 10,
          callback: (value) => value.toLocaleString()
        },
        beginAtZero: true,
        border: { display: false }
      },
    },
  };

  const isEmpty = !loading && (!analytics || !analytics.clicks_by_hour || analytics.clicks_by_hour.every(v => v === 0));

  return (
    <div className="relative w-full h-[450px] flex items-center justify-center group/chart">
      {loading ? (
        <div className="flex flex-col items-center gap-5">
           <div className="w-10 h-10 rounded-2xl border-t-luxury-blue border-slate-100 border-4 animate-spin shadow-sm" />
           <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] animate-pulse">Compiling Engine...</p>
        </div>
      ) : isEmpty ? (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50/50 backdrop-blur-[1px] rounded-xl text-center px-4">
           <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-2xl mb-4 group-hover/chart:scale-110 transition-transform">
              📊
           </div>
           <p className="text-sm font-bold text-slate-400 font-heading">No data available yet</p>
           <p className="text-[10px] text-slate-300 font-medium uppercase tracking-tighter mt-1">Start interacting with your website to generate insights</p>
        </div>
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
}
