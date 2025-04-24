/**
 * File: src/components/CardEditor/Canvas.jsx
 * Purpose: Fabric.js canvas wrapper component for the card editor
 * Dependencies:
 *   - fabric.js library
 *   - src/store/cardStore.js (Zustand store)
 *   - src/store/layerStore.js (Zustand store)
 *   - src/services/layerManager.js (for creating layer objects)
 *   - src/services/maskSystem.js (for applying masks)
 * 
 * This component initializes and manages the Fabric.js canvas,
 * handling layer rendering and interaction events.
 */

import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useCardStore } from '../../store/cardStore';
import { useLayerStore } from '../../store/layerStore';
import { createCardLayers } from '../../services/layerManager';
import { applyMask } from '../../services/maskSystem';

/**
 * Canvas component - Renders and manages the Fabric.js canvas
 */
const Canvas = () => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  
  // Get state from stores
  const cardData = useCardStore();
  const { layers, setLayers, selectedLayerId, setSelectedLayerId } = useLayerStore();
  
  // Initialize Fabric.js canvas
  useEffect(() => {
    fabricRef.current = new fabric.Canvas(canvasRef.current, {
      width: 747,  // Standard Pokémon card width
      height: 1038, // Standard Pokémon card height
      preserveObjectStacking: true,
      selection: false, // Disable group selection
      backgroundColor: '#f5f5f5'
    });
    
    // Generate initial layers
    const initialLayers = createCardLayers(cardData);
    setLayers(initialLayers);
    
    // Object selection event
    fabricRef.current.on('selection:created', (e) => {
      if (e.selected && e.selected[0]) {
        setSelectedLayerId(e.selected[0].id);
      }
    });
    
    fabricRef.current.on('selection:cleared', () => {
      setSelectedLayerId(null);
    });
    
    // Cleanup on unmount
    return () => {
      fabricRef.current.dispose();
    };
  }, []);
  
  // Update canvas when layers or card properties change
  useEffect(() => {
    if (!fabricRef.current) return;
    
    // Clear canvas
    fabricRef.current.clear();
    
    // Generate current layers
    const currentLayers = createCardLayers(cardData);
    
    // Render each layer
    currentLayers.forEach(async (layer) => {
      let fabricObject;
      
      // Create different fabric objects based on layer type
      switch (layer.type) {
        case 'image':
          if (!layer.src) return;
          
          await new Promise((resolve) => {
            fabric.Image.fromURL(layer.src, (img) => {
              img.id = layer.id;
              img.selectable = layer.selectable;
              img.evented = layer.evented;
              
              // Apply mask if present
              if (layer.mask) {
                applyMask(img, layer.mask).then((maskProps) => {
                  Object.assign(img, maskProps);
                  fabricRef.current.add(img);
                  resolve();
                });
              } else {
                fabricRef.current.add(img);
                resolve();
              }
            });
          });
          break;
          
        case 'text':
          fabricObject = new fabric.Text(layer.text || '', {
            id: layer.id,
            left: layer.left || 0,
            top: layer.top || 0,
            fontFamily: layer.fontFamily || 'Arial',
            fontSize: layer.fontSize || 20,
            fill: layer.fill || '#000',
            selectable: layer.selectable,
            evented: layer.evented
          });
          fabricRef.current.add(fabricObject);
          break;
          
        default:
          console.warn(`Unknown layer type: ${layer.type}`);
      }
    });
    
    // Make sure objects are in the right z-order
    fabricRef.current.discardActiveObject();
    fabricRef.current.renderAll();
    
  }, [cardData, layers]);
  
  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Canvas;