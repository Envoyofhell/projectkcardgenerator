/**
 * File: src/components/CardEditor/Controls/TypeSelector.jsx
 * Purpose: UI component for selecting card types
 * Dependencies:
 *   - React
 *   - src/store/cardStore.js
 *   - src/utils/typeData.js (for type information)
 * 
 * This component displays the available Pokemon types and
 * allows selecting primary and secondary types.
 */

import React from 'react';
import { useCardStore } from '../../../store/cardStore';
import { getAllTypes } from '../../../utils/typeData';

import './TypeSelector.css';

/**
 * TypeSelector component - Displays and allows selection of Pokemon types
 * @param {Object} props - Component props
 * @param {string} props.mode - 'primary' or 'secondary' type selection mode
 */
const TypeSelector = ({ mode = 'primary' }) => {
  // Get types list
  const types = getAllTypes();
  
  // Get state and actions from store
  const { 
    type, 
    secondType, 
    isDualType,
    setType, 
    setSecondType 
  } = useCardStore();
  
  // Select the current type based on mode
  const selectedType = mode === 'primary' ? type : secondType;
  
  // Handle type selection
  const handleTypeSelect = (typeId) => {
    if (mode === 'primary') {
      setType(typeId);
    } else {
      setSecondType(typeId);
    }
  };
  
  if (mode === 'secondary' && !isDualType) {
    return null; // Don't render secondary selector if dual type is disabled
  }
  
  return (
    <div className="type-selector">
      <h3>{mode === 'primary' ? 'Primary Type' : 'Secondary Type'}</h3>
      
      <div className="type-grid">
        {types.map((typeObj) => (
          <div 
            key={typeObj.id}
            className={`type-item ${typeObj.id === selectedType ? 'selected' : ''}`}
            onClick={() => handleTypeSelect(typeObj.id)}
          >
            <img 
              src={typeObj.iconUrl} 
              alt={typeObj.name}
              title={typeObj.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TypeSelector;