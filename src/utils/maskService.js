/**
 * File: src/utils/maskService.js
 * Purpose: Provide utilities for mask data and previews
 * Dependencies:
 * - Used by MaskSelector.jsx and potentially the main card renderer
 *
 * This utility provides functions to retrieve mask data.
 */

/**
 * Get a list of all available masks
 * @returns {Array} Array of mask objects with id, name, description, and previewUrl
 */
export const getAllMasks = () => {
  // NOTE: The 'id' paths MUST correspond to files located in the `public` directory
  // e.g., id: 'img/masks/mask1.png' requires the file public/img/masks/mask1.png
  return [
    {
      id: '', // Represents the default (likely clip-path handled elsewhere)
      name: 'Default Diagonal',
      description: 'Classic diagonal split between types',
      // You might want a specific preview for the default, or generate one
      previewUrl: '/assets/maskPreviews/default.png' // Assuming a default preview exists in public/assets/maskPreviews
    },
    {
      id: '/img/masks/mask1.png', // Use leading '/' for absolute path from root
      name: 'Horizontal Split',
      description: 'Horizontal division between types',
      previewUrl: '/img/masks/mask1.png' // Use the mask itself as the preview
    },
    {
      id: '/img/masks/mask2.png',
      name: 'Vertical Split',
      description: 'Vertical division between types',
      previewUrl: '/img/masks/mask2.png'
    },
    {
      id: '/img/masks/mask3.png',
      name: 'Wave Pattern',
      description: 'Flowing wave-like division',
      previewUrl: '/img/masks/mask3.png'
    },
    {
      id: '/img/masks/mask4.png',
      name: 'Circle Blend',
      description: 'Circular blend between types',
      previewUrl: '/img/masks/mask4.png'
    },
    {
      id: '/img/masks/mask5.png',
      name: 'Flame Pattern',
      description: 'Flame-like integration of types',
      previewUrl: '/img/masks/mask5.png'
    },
    {
      id: '/img/masks/mask6.png',
      name: 'Zig-Zag',
      description: 'Zig-zag pattern between types',
      previewUrl: '/img/masks/mask6.png'
    }
    // Add other masks following the same pattern
  ];
};

// You might still need type color logic if the main preview canvas is used,
// otherwise it can be removed from this specific service file.
export const getTypeColor = (typeName) => {
    const typeColors = {
      water: '#6390F0', fire: '#EE8130', grass: '#7AC74C',
      electric: '#F7D02C', psychic: '#F95587', fighting: '#C22E28',
      dark: '#705746', metal: '#B7B7CE', normal: '#A8A77A',
      fairy: '#D685AD', dragon: '#6F35FC', poison: '#A33EA1',
      ground: '#E2BF65', rock: '#B6A136', ghost: '#735797',
      ice: '#96D9D6', flying: '#A98FF3', bug: '#A6B91A'
      // Add other types if needed
    };
    return typeColors[typeName] || '#888888'; // Default grey
};


// Optional: If you want to keep the canvas preview generation as a fallback or main method
// This function should ideally use the ACTUAL mask image for the preview if possible,
// which requires loading the image asynchronously. The simple switch statement is less accurate.
// For now, let's comment out the complex preview generation, assuming grid previews are sufficient.
/*
export const createMaskPreviewOnCanvas = async (canvas, maskIdUrl, color1, color2) => {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw primary color
  ctx.fillStyle = color1;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!maskIdUrl) { // Default diagonal split (clip-path equivalent)
     ctx.fillStyle = color2;
     ctx.beginPath();
     ctx.moveTo(0, 0);
     ctx.lineTo(canvas.width, 0);
     ctx.lineTo(0, canvas.height);
     ctx.closePath();
     ctx.fill();
     return;
  }

  // Attempt to load the actual mask image and use it
  try {
    const maskImage = await loadImage(maskIdUrl); // Need an async image loading helper

    // Draw secondary color to an offscreen canvas
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    const offCtx = offscreenCanvas.getContext('2d');
    offCtx.fillStyle = color2;
    offCtx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply mask
    offCtx.globalCompositeOperation = 'destination-in';
    offCtx.drawImage(maskImage, 0, 0, canvas.width, canvas.height);

    // Draw result back onto the main preview canvas
    ctx.drawImage(offscreenCanvas, 0, 0);

  } catch (error) {
    console.error("Failed to load mask for preview:", maskIdUrl, error);
    // Fallback drawing if image load fails (optional)
    ctx.fillStyle = color2;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Preview Error', canvas.width / 2, canvas.height / 2);
  }
};

// Helper to load images asynchronously
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};
*/