/**
 * File: src/services/layerManager.js
 * Purpose: Handles creation and management of card layers for Fabric.js canvas
 * Dependencies: 
 *   - src/utils/cardTemplates.js (for getCardBackground)
 *   - src/store/cardStore.js (used by components that call these functions)
 *   - fabric.js (used indirectly through Canvas component)
 * 
 * This service creates layer objects for the Fabric.js canvas, handling the
 * dual-type functionality by applying proper backgrounds and masks.
 */

import { getCardBackground } from '../utils/cardTemplates';

/**
 * Creates an array of Fabric-compatible layer objects based on card data
 * @param {Object} cardData - The card's properties from cardStore
 * @returns {Array} Array of layer objects to be rendered on canvas
 */
export const createCardLayers = (cardData) => {
  const layers = [];
  
  // Base card background
  layers.push({
    id: 'baseCard',
    type: 'image',
    src: getCardBackground(cardData.type, cardData.stage),
    selectable: false,
    evented: false,
    zIndex: 0
  });
  
  // Second type layer (if dual type)
  if (cardData.isDualType && cardData.secondType) {
    layers.push({
      id: 'secondType',
      type: 'image',
      src: getCardBackground(cardData.secondType, cardData.stage),
      mask: cardData.maskUrl || '',
      selectable: false,
      evented: false,
      zIndex: 1
    });
  }
  
  // Card frame/border
  layers.push({
    id: 'cardFrame',
    type: 'image',
    src: getCardFrame(cardData.type, cardData.rarity),
    selectable: false,
    evented: false,
    zIndex: 10
  });
  
  // Pokemon image area
  layers.push({
    id: 'pokemonImage',
    type: 'image',
    src: cardData.pokemonImageUrl || null,
    left: 373.5, // Center of card
    top: 260,    // Positioned for image area
    selectable: true,
    evented: true,
    zIndex: 5
  });
  
  // Pre-evolution image (if stage 1 or 2)
  if (cardData.stage !== 'basic' && cardData.prevolveImageUrl) {
    layers.push({
      id: 'prevolveImage',
      type: 'image',
      src: cardData.prevolveImageUrl,
      left: 90,  // Top left position
      top: 115,
      scaleX: 0.2,
      scaleY: 0.2,
      selectable: true,
      evented: true,
      zIndex: 6
    });
  }
  
  // Text elements would be added here
  // These would include name, HP, attacks, description, etc.
  
  return layers;
};

/**
 * Gets the appropriate card frame based on type and rarity
 * @param {string} type - Primary type of the card
 * @param {string} rarity - Rarity of the card
 * @returns {string} URL to the card frame image
 */
const getCardFrame = (type, rarity) => {
  // Implementation would return the correct frame image
  return `assets/frames/${type}_${rarity}.png`;
};

/**
 * Updates properties of a specific layer
 * @param {Array} layers - Current layers array
 * @param {string} layerId - ID of layer to update
 * @param {Object} properties - New properties to apply
 * @returns {Array} Updated layers array
 */
export const updateLayer = (layers, layerId, properties) => {
  return layers.map(layer => 
    layer.id === layerId ? { ...layer, ...properties } : layer
  );
};

/**
 * Reorders layers in the stack
 * @param {Array} layers - Current layers array
 * @param {number} startIndex - Current index of the layer
 * @param {number} endIndex - New index for the layer
 * @returns {Array} Reordered layers array
 */
export const reorderLayers = (layers, startIndex, endIndex) => {
  const result = [...layers];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};