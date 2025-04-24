/**
 * File: src/components/CardEditor/Controls/DualTypeToggle.jsx
 * Purpose: Toggle component for enabling dual-type functionality
 * Dependencies:
 *   - React
 *   - src/store/cardStore.js
 * 
 * This component provides a toggle switch for enabling or
 * disabling the dual-type card feature.
 */

import React from 'react';
import { useCardStore } from '../../../store/cardStore';
import './DualTypeToggle.css';

const DualTypeToggle = () => {
  // Get state and actions from store
  const { isDualType, toggleDualType, secondType } = useCardStore();
  
  // Handle toggle change
  const handleToggleChange = () => {
    toggleDualType();
  };
  
  return (
    <div className="dual-type-toggle">
      <h3>Dual Type</h3>
      
      <div className="toggle-container">
        <label className="toggle-switch">
          <input 
            type="checkbox"
            checked={isDualType}
            onChange={handleToggleChange}
          />
          <span className="toggle-slider"></span>
        </label>
        <span className="toggle-label">
          {isDualType ? 'Enabled' : 'Disabled'}
        </span>
      </div>
      
      {isDualType && !secondType && (
        <p className="info-message">
          Select a secondary type below
        </p>
      )}
      
      {isDualType && (
        <div className="secondary-type-selector">
          <TypeSelector mode="secondary" />
        </div>
      )}
    </div>
  );
};

// Import here to avoid circular dependencies
import TypeSelector from './TypeSelector';

export default DualTypeToggle;