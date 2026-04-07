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

  return (
    <div className="relative w-full h-[320px] flex items-center justify-center">
      {loading ? (
        <div className="flex flex-col items-center gap-4">
           <div className="w-48 h-1.5 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-luxury-blue animate-[loading_2s_infinite]" />
           </div>
           <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Profiling Funnel Dynamics...</span>
        </div>
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
}
