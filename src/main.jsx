import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // Global styles

// Try-catch for background import
try {
  // Initialize background if present
  import('./assets/background.jpeg');
} catch (error) {
  console.warn('Background effects not loaded:', error);
}

// Mount the application to the DOM
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);