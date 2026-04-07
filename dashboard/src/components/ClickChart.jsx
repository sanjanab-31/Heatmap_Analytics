import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { colors, typography, space } from '../styles';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

// Format hour numbers → "12am", "1am" … "11pm"
function formatHour(h) {
  if (h === 0)  return '12am';
  if (h < 12)   return `${h}am`;
  if (h === 12) return '12pm';
  return `${h - 12}pm`;
}

const HOUR_LABELS = Array.from({ length: 24 }, (_, i) => formatHour(i));

/**
 * ClickChart — bar chart of clicks by hour.
 *
 * Props:
 *   analytics {Object|null}
 *   loading   {boolean}
 */
export default function ClickChart({ analytics, loading }) {
  if (!analytics || loading) {
    return (
      <EmptyState label={loading ? 'Loading chart…' : 'No data yet'} />
    );
  }

  // Fill sparse clicksPerHour array into a full 24-slot array
  const counts = Array(24).fill(0);
  (analytics.clicksPerHour ?? []).forEach(({ hour, count }) => {
    if (hour >= 0 && hour < 24) counts[hour] = count;
  });

  const chartData = {
    labels:   HOUR_LABELS,
    datasets: [
      {
        label:           'Clicks',
        data:             counts,
        backgroundColor: 'rgba(26, 86, 219, 0.7)',
        borderRadius:     4,
        borderSkipped:   false,
      },
    ],
  };

  const options = {
    responsive:          true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display:  true,
        text:     'Clicks by Hour of Day',
        color:    colors.text,
        font:     { size: 13, weight: '600', family: "'Inter', sans-serif" },
        padding:  { bottom: 12 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y} clicks`,
        },
      },
    },
    scales: {
      x: {
        grid:  { display: false },
        ticks: { color: colors.textMuted, font: { size: 10 } },
      },
      y: {
        beginAtZero: true,
        grid:        { color: colors.borderLight },
        ticks:       { color: colors.textMuted, font: { size: 11 }, precision: 0 },
      },
    },
  };

  return (
    <div style={{ height: 250 }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div
      style={{
        height:         250,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     '#fafafa',
        borderRadius:    6,
        border:         `1px dashed ${colors.border}`,
      }}
    >
      <span style={typography.caption}>{label}</span>
    </div>
  );
}
