/**
 * File: src/services/maskSystem.js
 * Purpose: Handle mask application for dual-type cards using Fabric.js
 * Dependencies:
 * - fabric.js library
 * - Used by the main Fabric.js canvas logic (e.g., Canvas.jsx, layerManager.js)
 *
 * This service applies masks to Fabric.js objects.
 */

import { fabric } from 'fabric';
// Note: We removed the import from maskService here as this file
// primarily CONSUMES maskUrls, it doesn't need to provide the list or previews itself.
// Preview generation for the UI (MaskSelector) can stay in maskService or here,
// but keep it consistent. Let's keep the preview logic here for now.

/**
 * Apply a mask to a Fabric.js object using clipPath.
 * Returns an object with properties to set on the target Fabric object.
 * @param {fabric.Object} targetObject - Fabric.js object to mask (e.g., an Image).
 * @param {string} maskUrl - URL to mask image (e.g., '/img/masks/mask1.png'), or empty/null for default clip path.
 * @param {number} cardWidth - The original width of the card template being masked.
 * @param {number} cardHeight - The original height of the card template being masked.
 * @returns {Promise<{ clipPath: fabric.Image | fabric.Polygon | null }>} Object containing the clipPath property.
 */
export const applyFabricMask = (targetObject, maskUrl, cardWidth, cardHeight) => {
  return new Promise((resolve) => {
    // Use default diagonal clip-path if no mask specified
    if (!maskUrl || maskUrl === '') {
      console.log("Applying default Fabric polygon clipPath");
      resolve({
        clipPath: new fabric.Polygon(
          [ // Points defining the top-left triangle
            { x: 0, y: 0 },
            { x: targetObject.width, y: 0 },
            { x: 0, y: targetObject.height },
          ],
          {
            // Position the clip path relative to the object's center
            left: -targetObject.width / 2,
            top: -targetObject.height / 2,
            absolutePositioned: true, // Make sure it clips correctly regardless of object transform
          }
        ),
      });
      return;
    }

    // Use image mask
    console.log("Applying Fabric image clipPath:", maskUrl);
    // Ensure the URL starts with '/' if it's coming from the public dir root
    const absoluteMaskUrl = maskUrl.startsWith('/') ? maskUrl : `/${maskUrl}`;

    fabric.Image.fromURL(
      absoluteMaskUrl,
      (img) => {
        if (!img) {
           console.error("Fabric.js failed to load mask image:", absoluteMaskUrl);
           // Fallback to default or resolve with no clipPath
           resolve({ clipPath: null }); // Or resolve with default polygon?
           return;
        }

        // Scale the mask image to fit the target object's dimensions
        img.set({
          left: -targetObject.width / 2,
          top: -targetObject.height / 2,
          originX: 'left',
          originY: 'top',
          // Ensure the mask image itself isn't cliped by something else
          clipPath: undefined,
        });
         // Scale mask image to match the card dimensions it was designed for,
         // then let Fabric handle scaling it with the target object if needed.
        img.scaleToWidth(targetObject.width);
        //img.scaleToHeight(targetObject.height); // scaleToWidth usually preserves aspect ratio

        resolve({
          clipPath: img, // Use the loaded Fabric Image as the clipPath
        });
      },
      { // Options object for fromURL
        // Handle potential CORS issues if masks are hosted elsewhere (unlikely for public/)
        crossOrigin: 'anonymous'
      }
    );
  });
};


/**
 * Draw a preview of the mask effect onto an HTML Canvas.
 * @param {HTMLCanvasElement} canvas - Canvas element to draw the preview on.
 * @param {string} maskUrl - URL to the mask image (e.g., '/img/masks/mask1.png') or empty/null for default.
 * @param {string} primaryColor - CSS color string for the primary type.
 * @param {string} secondaryColor - CSS color string for the secondary type.
 */
export const createMaskPreview = (canvas, maskUrl, primaryColor, secondaryColor) => {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Clear previous drawing
  ctx.clearRect(0, 0, width, height);
  // Reset composite operation
  ctx.globalCompositeOperation = 'source-over';

  // Fill with primary color (bottom layer)
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, width, height);

  // Draw secondary color (top layer)
  ctx.fillStyle = secondaryColor;
  ctx.fillRect(0, 0, width, height); // Fill entirely first

  // Apply mask or default clip
  if (!maskUrl || maskUrl === '') {
    // Draw default diagonal clip-path preview by erasing the top-right part
    console.log("Drawing default diagonal preview");
    ctx.globalCompositeOperation = 'destination-out'; // Erase where we draw
    ctx.beginPath();
    ctx.moveTo(width, 0); // Top-right corner
    ctx.lineTo(width, height); // Bottom-right corner
    ctx.lineTo(0, height); // Bottom-left corner
    ctx.closePath();
    ctx.fill(); // Erase the bottom-right triangle, leaving the top-left (secondary color)

  } else {
    // Load mask image and use it to clip the secondary color
    console.log("Drawing image mask preview for:", maskUrl);
    const maskImg = new Image();
    // Ensure the URL starts with '/' if it's coming from the public dir root
    const absoluteMaskUrl = maskUrl.startsWith('/') ? maskUrl : `/${maskUrl}`;

    maskImg.onload = () => {
      // Use the mask image to define where the secondary color (already drawn) is kept
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(maskImg, 0, 0, width, height);

      // Reset composite operation for subsequent draws (important!)
      ctx.globalCompositeOperation = 'source-over';
    };
    maskImg.onerror = () => {
        console.error("Failed to load mask image for preview:", absoluteMaskUrl);
        // Optionally draw an error state on the preview canvas
        ctx.globalCompositeOperation = 'source-over'; // Reset
        ctx.fillStyle = 'red';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Error', width / 2, height / 2);
    };
    maskImg.src = absoluteMaskUrl;
  }

   // Reset composite operation just in case
   ctx.globalCompositeOperation = 'source-over';
};