import React from 'react';
import { createRoot } from 'react-dom/client';
import '../css/cssPages/index.css';
import App from './app.jsx';

const container = document.getElementById('raiz');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
