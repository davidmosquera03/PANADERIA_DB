import React from 'react';
import ReactDOM from 'react-dom';
import StatsPanel from './StatsPanel.jsx';

ReactDOM.createRoot(document.getElementById('admin-stats')).render(
  <React.StrictMode>
    <StatsPanel />
  </React.StrictMode>
);