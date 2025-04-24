/**
 * File: src/components/CardEditor/Controls/MaskSelector.jsx
 * Purpose: UI component for selecting dual-type mask patterns
 * Dependencies:
 *   - React
 *   - src/store/cardStore.js
 *   - src/services/maskSystem.js
 * 
 * This component displays available mask patterns and allows
 * the user to select one for their dual-type card.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useCardStore } from '../../../store/cardStore';
import { getAvailableMasks, createMaskPreview } from '../../../services/maskSystem';

import './MaskSelector.css';

/**
 * MaskSelector component - Displays and allows selection of mask patterns
 */
const MaskSelector = () => {
  const [masks, setMasks] = useState([]);
  const [hoveredMask, setHoveredMask] = useState(null);
  const previewCanvasRef = useRef(null);
  
  // Get state and actions from store
  const { type, secondType, maskUrl, setMaskUrl } = useCardStore();
  
  // Load available masks
  useEffect(() => {
    setMasks(getAvailableMasks());
  }, []);
  
  // Convert type names to CSS color values for preview
  const getTypeColor = (typeName) => {
    const typeColors = {
      water: '#6390F0',
      fire: '#EE8130',
      grass: '#7AC74C',
      electric: '#F7D02C',
      psychic: '#F95587',
      fighting: '#C22E28',
      dark: '#705746',
      metal: '#B7B7CE',
      normal: '#A8A77A',
      fairy: '#D685AD',
      dragon: '#6F35FC',
      poison: '#A33EA1',
      ground: '#E2BF65',
      rock: '#B6A136',
      ghost: '#735797',
      ice: '#96D9D6',
      flying: '#A98FF3',
      bug: '#A6B91A'
    };
    
    return typeColors[typeName] || '#888888';
  };
  
  // Generate preview when hovering over a mask
  useEffect(() => {
    if (!previewCanvasRef.current || hoveredMask === null) return;
    
    const canvas = previewCanvasRef.current;
    const previewMaskUrl = hoveredMask !== null ? masks[hoveredMask]?.id : maskUrl;
    
    // Draw preview with type colors
    createMaskPreview(
      canvas,
      previewMaskUrl,
      getTypeColor(type),
      getTypeColor(secondType)
    );
  }, [hoveredMask, type, secondType, maskUrl, masks]);
  
  // Handle mask selection
  const handleMaskSelect = (index) => {
    setMaskUrl(masks[index]?.id || '');
  };
  
  return (
    <div className="mask-selector">
      <h3>Type Mask</h3>
      
      {/* Mask preview */}
      <div className="mask-preview">
        <canvas 
          ref={previewCanvasRef}
          width={120}
          height={160}
          className="mask-preview-canvas"
        />
        <p className="mask-name">
          {hoveredMask !== null ? 
            masks[hoveredMask]?.name : 
            masks.find(m => m.id === maskUrl)?.name || 'Default Mask'}
        </p>
      </div>
      
      {/* Mask grid */}
      <div className="mask-grid">
        {masks.map((mask, index) => (
          <div 
            key={index}
            className={`mask-item ${mask.id === maskUrl ? 'selected' : ''}`}
            onClick={() => handleMaskSelect(index)}
            onMouseEnter={() => setHoveredMask(index)}
            onMouseLeave={() => setHoveredMask(null)}
          >
            <img 
              src={mask.previewUrl} 
              alt={mask.name}
              title={mask.name}
              width={60}
              height={80}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaskSelector;