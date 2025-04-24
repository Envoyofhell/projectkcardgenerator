/**
 * File: src/utils/maskService.js
 * Purpose: Provide utilities for mask data.
 * Dependencies: Used by MaskSelector.jsx
 */

/**
 * Get a list of all available masks for the selector UI.
 * @returns {Array<{id: string, name: string, description: string, previewUrl: string}>} Array of mask objects.
 */
export const getAllMasks = () => {
  // NOTE: Ensure these paths correctly point to files within your `public` directory.
  return [
    {
      id: '', // Represents the default (diagonal split)
      name: 'Default Split',
      description: 'Classic diagonal split',
      previewUrl: '/assets/maskPreviews/default_split.png' // Ensure this exists in public/assets/maskPreviews
    },
    {
      id: '/img/masks/mask1.png',
      name: 'Horizontal',
      description: 'Horizontal division',
      previewUrl: '/img/masks/mask1.png'
    },
    {
      id: '/img/masks/mask2.png',
      name: 'Vertical',
      description: 'Vertical division',
      previewUrl: '/img/masks/mask2.png'
    },
    {
      id: '/img/masks/mask3.png',
      name: 'Wave',
      description: 'Flowing wave pattern',
      previewUrl: '/img/masks/mask3.png'
    },
    {
      id: '/img/masks/mask4.png',
      name: 'Circle',
      description: 'Circular blend',
      previewUrl: '/img/masks/mask4.png'
    },
    {
      id: '/img/masks/mask5.png',
      name: 'Flame',
      description: 'Flame-like pattern',
      previewUrl: '/img/masks/mask5.png'
    },
    {
      id: '/img/masks/mask6.png',
      name: 'Zig-Zag',
      description: 'Zig-zag pattern',
      previewUrl: '/img/masks/mask6.png'
    }
    // Add other masks as needed
  ];
};