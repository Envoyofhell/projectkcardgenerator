/**
 * File: src/components/CardEditor/Controls/BackgroundOptions.jsx
 * Purpose: Component for controlling background styles
 * Dependencies:
 *   - React
 * 
 * This component provides controls for the Three.js background.
 */

import React from 'react';
import './BackgroundOptions.css';

const BackgroundOptions = () => {
  // State for background mode
  const [backgroundMode, setBackgroundMode] = React.useState('normal');
  
  // Handle background mode change
  const handleBackgroundChange = (mode) => {
    setBackgroundMode(mode);
    
    // Dispatch custom event for background.js
    const event = new CustomEvent('background-state-change', {
      detail: { state: mode }
    });
    document.dispatchEvent(event);
  };
  
  return (
    <div className="background-options">
      <h3>Background Style</h3>
      
      <div className="background-mode-selector">
        <button 
          className={`mode-button ${backgroundMode === 'normal' ? 'active' : ''}`}
          onClick={() => handleBackgroundChange('normal')}
        >
          Normal
        </button>
        
        <button 
          className={`mode-button ${backgroundMode === 'rave' ? 'active' : ''}`}
          onClick={() => handleBackgroundChange('rave')}
        >
          Enhanced
        </button>
        
        <button 
          className={`mode-button ${backgroundMode === 'techno' ? 'active' : ''}`}
          onClick={() => handleBackgroundChange('techno')}
        >
          Techno
        </button>
      </div>
      
      <div className="background-color-theme">
        <label htmlFor="theme-toggle">Dark Theme</label>
        <div className="toggle-switch small">
          <input 
            type="checkbox" 
            id="theme-toggle"
            checked={true}
            onChange={() => alert('Theme switching would be implemented here')}
          />
          <span className="toggle-slider"></span>
        </div>
      </div>
    </div>
  );
};

export default BackgroundOptions;