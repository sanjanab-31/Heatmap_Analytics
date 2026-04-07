import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { colors, typography } from '../styles';

// Registration is safe to call multiple times — Chart.js deduplicates
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

/**
 * ScrollChart — horizontal bar chart showing avg vs max scroll depth.
 *
 * Props:
 *   analytics {Object|null}
 *   loading   {boolean}
 */
export default function ScrollChart({ analytics, loading }) {
  if (!analytics || loading) {
    return <EmptyState label={loading ? 'Loading chart…' : 'No data yet'} />;
  }

  const avg = analytics.avgScrollDepth ?? 0;
  const max = analytics.maxScrollDepth ?? 0;

  const chartData = {
    labels:   ['Average Scroll Depth', 'Maximum Scroll Depth'],
    datasets: [
      {
        label:           'Scroll Depth (%)',
        data:             [avg, max],
        backgroundColor: [
          'rgba(26, 86, 219, 0.75)',
          'rgba(59, 130, 246, 0.45)',
        ],
        borderRadius:    4,
        borderSkipped:  false,
      },
    ],
  };

  const options = {
    indexAxis:           'y',  // horizontal bars
    responsive:          true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text:    'Scroll Depth Analysis',
        color:   colors.text,
        font:    { size: 13, weight: '600', family: "'Inter', sans-serif" },
        padding: { bottom: 12 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.x.toFixed(1)}%`,
        },
      },
    },
    scales: {
      x: {
        min:         0,
        max:         100,
        grid:        { color: colors.borderLight },
        ticks: {
          color:     colors.textMuted,
          font:      { size: 11 },
          callback:  (v) => `${v}%`,
        },
      },
      y: {
        grid:  { display: false },
        ticks: { color: colors.textMuted, font: { size: 11 } },
      },
    },
  };

  return (
    <div style={{ height: 150 }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div
      style={{
        height:          150,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        background:      '#fafafa',
        borderRadius:     6,
        border:          `1px dashed ${colors.border}`,
      }}
    >
      <span style={typography.caption}>{label}</span>
    </div>
  );
}
