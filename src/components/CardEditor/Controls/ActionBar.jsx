/**
 * File: src/components/CardEditor/Controls/ActionBar.jsx
 * Purpose: Action buttons for card operations
 * Dependencies:
 *   - React
 *   - src/services/exportService.js
 *   - src/store/cardStore.js
 * 
 * This component provides action buttons for downloading,
 * saving templates, and resetting the card.
 */

import React, { useRef } from 'react';
import { useCardStore } from '../../../store/cardStore';
import { exportCardAsPNG, exportCardWithMasks, exportCardSheet } from '../../../services/exportService';
import { FaDownload, FaSave, FaTrash, FaShareAlt, FaCopy } from 'react-icons/fa';
import './ActionBar.css';

const ActionBar = () => {
  // Reference to canvas
  const canvasRef = useRef(null);
  
  // Get state from store
  const { name, resetCard, isDualType } = useCardStore();
  
  // Generate filename from card name
  const getFilename = () => {
    return name.trim() ? `${name.trim().toLowerCase().replace(/\s+/g, '-')}` : 'pokemon-card';
  };
  
  // Handle download
  const handleDownload = () => {
    // Get the canvas element
    const canvas = document.querySelector('canvas.upper-canvas');
    
    // Choose export method based on dual-type setting
    if (isDualType) {
      // Use html2canvas for dual-type cards to preserve masks
      const cardElement = document.getElementById('card-container');
      if (cardElement) {
        exportCardWithMasks(cardElement, getFilename());
      } else {
        alert('Card element not found!');
      }
    } else {
      // Use standard Fabric.js export for single-type cards
      if (canvas && canvas.__fabric) {
        exportCardAsPNG(canvas.__fabric, getFilename());
      } else {
        alert('Canvas not available for export!');
      }
    }
  };
  
  // Handle export sheet (multiple copies for printing)
  const handleExportSheet = () => {
    const canvas = document.querySelector('canvas.upper-canvas');
    if (canvas && canvas.__fabric) {
      exportCardSheet(canvas.__fabric, 3, 3); // 3x3 grid
    } else {
      alert('Canvas not available for export!');
    }
  };
  
  // Handle save as template
  const handleSaveTemplate = () => {
    // Implementation would save current card state as a template
    // This would typically involve a modal dialog to name the template
    alert('Save as template functionality would be implemented here');
  };
  
  // Handle reset
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the card? All unsaved changes will be lost.')) {
      resetCard();
    }
  };
  
  // Handle share
  const handleShare = () => {
    // Implementation would allow sharing card (e.g., via URL with encoded state)
    alert('Share functionality would be implemented here');
  };
  
  return (
    <div className="action-bar">
      <button 
        className="action-button primary"
        onClick={handleDownload}
        title="Download Card"
      >
        <FaDownload /> Download
      </button>
      
      <button
        className="action-button"
        onClick={handleExportSheet}
        title="Export as Sheet"
      >
        <FaCopy /> Print Sheet
      </button>
      
      <button
        className="action-button"
        onClick={handleSaveTemplate}
        title="Save as Template"
      >
        <FaSave /> Save Template
      </button>
      
      <button
        className="action-button"
        onClick={handleShare}
        title="Share Card"
      >
        <FaShareAlt /> Share
      </button>
      
      <button
        className="action-button danger"
        onClick={handleReset}
        title="Reset Card"
      >
        <FaTrash /> Reset
      </button>
    </div>
  );
};

export default ActionBar;