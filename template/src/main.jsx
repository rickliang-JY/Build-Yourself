import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import { CONFIG } from './config.js';

document.title = CONFIG.appTitle.zh || CONFIG.appTitle.en || '成长计划';

createRoot(document.getElementById('root')).render(<App />);
