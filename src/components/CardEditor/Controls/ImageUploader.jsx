/**
 * File: src/components/CardEditor/Controls/ImageUploader.jsx
 * Purpose: Handles image uploading for card images
 * Dependencies:
 *   - React
 *   - src/store/cardStore.js
 * 
 * This component provides a drag-and-drop and file selector
 * interface for uploading Pokemon and pre-evolution images.
 */

import React, { useState, useRef } from 'react';
import { useCardStore } from '../../../store/cardStore';
import './ImageUploader.css';

const ImageUploader = ({ type = 'pokemon' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  const { 
    pokemonImageUrl, setPokemonImage,
    prevolveImageUrl, setPrevolveImage,
    stage
  } = useCardStore();
  
  // Set the current image URL based on type
  const currentImageUrl = type === 'pokemon' ? pokemonImageUrl : prevolveImageUrl;
  
  // Set the correct setter based on type
  const setImageUrl = type === 'pokemon' ? setPokemonImage : setPrevolveImage;
  
  // Don't render prevolve uploader for basic stage cards
  if (type === 'prevolve' && stage === 'basic') {
    return null;
  }
  
  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };
  
  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    processFile(file);
  };
  
  // Process and validate the selected file
  const processFile = (file) => {
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, or GIF).');
      return;
    }
    
    // Read file and convert to data URL
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="image-uploader">
      <h3>{type === 'pokemon' ? 'Pokémon Image' : 'Pre-evolution Image'}</h3>
      
      <div 
        className={`upload-area ${isDragging ? 'dragging' : ''} ${currentImageUrl ? 'has-image' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {currentImageUrl ? (
          <img 
            src={currentImageUrl} 
            alt={type === 'pokemon' ? 'Pokémon' : 'Pre-evolution'} 
            className="preview-image"
          />
        ) : (
          <div className="placeholder">
            <span className="upload-icon">+</span>
            <p>{isDragging ? 'Drop Image Here' : 'Drop Image or Click to Upload'}</p>
          </div>
        )}
        
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/jpeg,image/png,image/gif"
          style={{ display: 'none' }}
        />
      </div>
      
      {currentImageUrl && (
        <button 
          className="remove-image"
          onClick={(e) => {
            e.stopPropagation();
            setImageUrl(null);
          }}
        >
          Remove Image
        </button>
      )}
    </div>
  );
};

export default ImageUploader;