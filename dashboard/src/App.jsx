import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Heatmaps from './pages/Heatmaps';
import Analytics from './pages/Analytics';
import Recordings from './pages/Recordings';
import Settings from './pages/Settings';
import Projects from './pages/Projects';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/heatmaps" element={<Heatmaps />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/recordings" element={<Recordings />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
