/**
 * File: src/index.js
 * Purpose: Main entry point for the application
 * Dependencies:
 *   - React
 *   - ReactDOM
 *   - App component
 *   - Global styles
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../App';
import './index.css';

// Initialize background if present
import './assets/background';

// Mount the application to the DOM
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);