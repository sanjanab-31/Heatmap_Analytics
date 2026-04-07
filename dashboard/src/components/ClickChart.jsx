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
        backgroundColor: 'rgba(0, 102, 255, 0.65)',
        hoverBackgroundColor: '#0066FF',
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 'flex',
        maxBarThickness: 16,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 12,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 10, weight: '600' } },
      },
      y: {
        grid: { color: 'rgba(226, 232, 240, 0.4)', drawTicks: false },
        ticks: { color: '#94a3b8', font: { size: 10 }, stepSize: 1 },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      {loading ? (
        <div className="flex flex-col items-center gap-4 animate-pulse">
           <div className="w-8 h-8 rounded-full border-t-luxury-blue border-transparent border-4 animate-spin" />
           <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Compiling Hourly Trends...</p>
        </div>
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
}
