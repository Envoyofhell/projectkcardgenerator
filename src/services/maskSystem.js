/**
 * File: src/services/maskSystem.js
 * Purpose: Handle mask application logic for Fabric.js objects
 * and generate HTML Canvas previews for the UI.
 * Dependencies:
 * - fabric.js library
 */

import { fabric } from 'fabric';

/**
 * Creates a default diagonal clip path polygon for Fabric.js objects.
 * @param {fabric.Object} targetObject - The Fabric object to calculate dimensions from.
 * @returns {fabric.Polygon | null} A Fabric Polygon object or null if dimensions invalid.
 */
const createDefaultClipPath = (targetObject) => {
    const width = targetObject.width || 0;
    const height = targetObject.height || 0;
    if (width <= 0 || height <= 0) {
        console.warn("Cannot create default clip path for object with zero dimensions:", targetObject.id);
        return null;
    }
    return new fabric.Polygon(
        [ { x: 0, y: 0 }, { x: width, y: 0 }, { x: 0, y: height } ],
        {
            left: -width / 2, // Position relative to object's center for polygon
            top: -height / 2,
            absolutePositioned: true, // Crucial for clipPath relative to bounding box
        }
    );
};

/**
 * Apply a mask to a Fabric.js object using clipPath.
 * Returns an object with the clipPath property to set on the target Fabric object.
 * @param {fabric.Object} targetObject - Fabric.js object to mask (e.g., an Image).
 * @param {string} maskUrl - URL to mask image (e.g., '/img/masks/mask1.png'), or empty/null for default clip path.
 * @param {number} cardWidth - The original width of the card template (can be used for scaling logic if needed).
 * @param {number} cardHeight - The original height of the card template (can be used for scaling logic if needed).
 * @returns {Promise<{ clipPath: fabric.Image | fabric.Polygon | null }>} Object containing the clipPath property.
 */
export const applyFabricMask = (targetObject, maskUrl, cardWidth, cardHeight) => {
    return new Promise((resolve) => {
        // Ensure target object is valid and has dimensions before proceeding
        if (!targetObject || !targetObject.width || !targetObject.height) {
             console.warn(`applyFabricMask: Target object (${targetObject?.id}) is invalid or has zero dimensions.`);
             resolve({ clipPath: null });
             return;
        }

        // Use default diagonal clip-path if no mask specified
        if (!maskUrl || maskUrl === '') {
            console.log(`Applying default Fabric polygon clipPath to ${targetObject.id}`);
            try {
                resolve({ clipPath: createDefaultClipPath(targetObject) });
            } catch (error) {
                console.error(`Error creating default polygon clipPath for ${targetObject.id}:`, error);
                resolve({ clipPath: null });
            }
            return;
        }

        // Use image mask
        console.log(`Applying Fabric image clipPath (${maskUrl}) to ${targetObject.id}`);
        const absoluteMaskUrl = maskUrl.startsWith('/') ? maskUrl : `/${maskUrl}`;

        fabric.Image.fromURL(
            absoluteMaskUrl,
            (img, isError) => {
                if (isError || !img || img.width === 0 || img.height === 0) {
                    const errorMsg = `Fabric.js failed to load mask image or image has zero dimensions: ${absoluteMaskUrl}`;
                    console.error(errorMsg);
                    resolve({ clipPath: null }); // Resolve with null on error
                    return;
                }

                console.log(`Mask image ${absoluteMaskUrl} loaded successfully for Fabric clipPath.`);
                // Position mask at the top-left relative to the target's *origin*.
                // Fabric scales the clipPath with the object it's applied to.
                img.set({
                    left: 0,
                    top: 0,
                    originX: 'center',
                    originY: 'center',
                    clipPath: undefined,
                });
                // Scale mask image initially to match the target object's current size
                img.scaleToWidth(targetObject.getScaledWidth());
                img.scaleToHeight(targetObject.getScaledHeight());

                resolve({ clipPath: img });
            },
            { crossOrigin: 'anonymous' }
        );
    });
};


/**
 * Draw a preview of the mask effect onto an HTML Canvas (for UI).
 * @param {HTMLCanvasElement} canvas - Canvas element to draw the preview on.
 * @param {string} maskUrl - URL to the mask image (e.g., '/img/masks/mask1.png') or empty/null for default.
 * @param {string} primaryColor - CSS color string for the primary type (bottom layer).
 * @param {string} secondaryColor - CSS color string for the secondary type (top layer being masked).
 */
export const createMaskPreview = (canvas, maskUrl, primaryColor, secondaryColor) => {
    if (!canvas) { console.error("createMaskPreview: Invalid canvas element provided."); return; }
    const ctx = canvas.getContext('2d');
    if (!ctx) { console.error("createMaskPreview: Failed to get 2D context."); return; }

    const width = canvas.width;
    const height = canvas.height;

    // Reset canvas state
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    // 1. Draw primary color
    ctx.fillStyle = primaryColor || '#cccccc'; // Use fallback
    ctx.fillRect(0, 0, width, height);

    // 2. Draw secondary color
    ctx.fillStyle = secondaryColor || '#aaaaaa'; // Use fallback
    ctx.fillRect(0, 0, width, height);

    // 3. Apply mask or default clip
    if (!maskUrl || maskUrl === '') {
        // Default diagonal preview (erase bottom-right)
        console.log("Drawing default diagonal preview");
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.beginPath(); ctx.moveTo(width, 0); ctx.lineTo(width, height); ctx.lineTo(0, height);
        ctx.closePath(); ctx.fill();
    } else {
        // Load mask image and use it to clip the secondary color
        console.log("Drawing image mask preview for:", maskUrl);
        const maskImg = new Image();
        const absoluteMaskUrl = maskUrl.startsWith('/') ? maskUrl : `/${maskUrl}`;

        maskImg.onload = () => {
            console.log("Mask image loaded for preview:", absoluteMaskUrl);
            ctx.globalCompositeOperation = 'destination-in'; // Keep where mask is opaque/white
            ctx.drawImage(maskImg, 0, 0, width, height);
            ctx.globalCompositeOperation = 'source-over'; // Reset
        };
        maskImg.onerror = () => {
            console.error("Failed to load mask image for preview:", absoluteMaskUrl);
            ctx.globalCompositeOperation = 'source-over'; // Reset
            ctx.fillStyle = 'red'; ctx.font = '12px sans-serif';
            ctx.textAlign = 'center'; ctx.fillText('Error', width / 2, height / 2);
        };
        maskImg.crossOrigin = 'anonymous';
        maskImg.src = absoluteMaskUrl;
    }
    // Reset composite operation after drawing
    ctx.globalCompositeOperation = 'source-over';
};