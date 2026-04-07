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
        borderRadius: 4,
        barThickness: 32,
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
        padding: 10,
        titleFont: { weight: 'bold' },
        cornerRadius: 4,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(226, 232, 240, 0.4)' },
        ticks: { color: '#94a3b8', font: { size: 10 } },
        min: 0,
        max: 100,
        title: { display: true, text: 'Completion %', color: '#cbd5e1', font: { size: 9, weight: '700' } },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#0f172a', font: { size: 11, weight: '600' } },
      },
    },
  };

  return (
    <div className="relative w-full h-[280px] flex items-center justify-center">
      {loading ? (
        <div className="flex items-center gap-2">
           <div className="w-10 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-luxury-blue animate-[loading_1.5s_infinite]" />
           </div>
           <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Profiling Funnel...</span>
        </div>
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
}
