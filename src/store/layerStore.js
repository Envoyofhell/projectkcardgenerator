/**
 * File: src/store/layerStore.js
 * Purpose: Zustand store for layer management
 * Dependencies:
 *   - zustand library
 *   - Used by Canvas.jsx and LayerManager.jsx
 * 
 * This store manages the layers that make up a card in the editor,
 * including selection, ordering, visibility, and manipulation.
 */

import { create } from 'zustand';

export const useLayerStore = create((set, get) => ({
  // Array of layer objects
  layers: [],
  
  // Currently selected layer ID
  selectedLayerId: null,
  
  // Replace all layers
  setLayers: (layers) => set({ layers }),
  
  // Add a new layer
  addLayer: (layer) => set((state) => ({
    layers: [...state.layers, layer]
  })),
  
  // Remove a layer by ID
  removeLayer: (id) => set((state) => ({
    layers: state.layers.filter(layer => layer.id !== id),
    // Clear selection if removing selected layer
    selectedLayerId: state.selectedLayerId === id ? null : state.selectedLayerId
  })),
  
  // Update an existing layer
  updateLayer: (id, changes) => set((state) => ({
    layers: state.layers.map(layer => 
      layer.id === id ? { ...layer, ...changes } : layer
    )
  })),
  
  // Set the selected layer
  setSelectedLayerId: (id) => set({ selectedLayerId: id }),
  
  // Get a layer by ID
  getLayerById: (id) => {
    return get().layers.find(layer => layer.id === id);
  },
  
  // Toggle layer visibility
  toggleLayerVisibility: (id) => set((state) => ({
    layers: state.layers.map(layer => 
      layer.id === id ? { ...layer, visible: !layer.visible } : layer
    )
  })),
  
  // Lock/unlock a layer
  toggleLayerLock: (id) => set((state) => ({
    layers: state.layers.map(layer => 
      layer.id === id ? { 
        ...layer, 
        selectable: !layer.selectable,
        evented: !layer.evented
      } : layer
    )
  })),
  
  // Change layer order
  moveLayerUp: (id) => set((state) => {
    const index = state.layers.findIndex(layer => layer.id === id);
    if (index >= state.layers.length - 1) return state; // Already at top
    
    const newLayers = [...state.layers];
    const temp = newLayers[index];
    newLayers[index] = newLayers[index + 1];
    newLayers[index + 1] = temp;
    
    return { layers: newLayers };
  }),
  
  moveLayerDown: (id) => set((state) => {
    const index = state.layers.findIndex(layer => layer.id === id);
    if (index <= 0) return state; // Already at bottom
    
    const newLayers = [...state.layers];
    const temp = newLayers[index];
    newLayers[index] = newLayers[index - 1];
    newLayers[index - 1] = temp;
    
    return { layers: newLayers };
  }),
  
  // Reorder layers by drag and drop
  reorderLayers: (startIndex, endIndex) => set((state) => {
    const newLayers = [...state.layers];
    const [removed] = newLayers.splice(startIndex, 1);
    newLayers.splice(endIndex, 0, removed);
    
    return { layers: newLayers };
  })
}));