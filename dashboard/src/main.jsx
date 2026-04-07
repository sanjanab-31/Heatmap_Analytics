import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Chart as ChartJS } from 'chart.js';
import App from './App';
import './index.css';

ChartJS.defaults.font.family = "'Poppins', 'Segoe UI', system-ui, -apple-system, sans-serif";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
