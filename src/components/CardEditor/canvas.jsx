/**
 * File: src/components/CardEditor/Canvas.jsx
 * Purpose: Fabric.js canvas wrapper component for the card editor
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { fabric } from 'fabric';
import { useCardStore } from '../../store/cardStore';
import { createCardLayers } from '../../services/layerManager'; // Verify path
import { applyFabricMask } from '../../services/maskSystem'; // Verify path

// --- Constants ---
// Ensure these match the dimensions used in layerManager.js
const CARD_WIDTH = 747;
const CARD_HEIGHT = 1038;

const Canvas = () => {
  const canvasElRef = useRef(null); // Ref for the <canvas> element
  const fabricCanvasRef = useRef(null); // Ref for the Fabric Canvas instance

  // --- State Selection ---
  // Select ALL properties from cardStore that influence ANY visual layer
  const cardStateForRendering = useCardStore(state => ({
      type: state.type,
      secondType: state.secondType,
      isDualType: state.isDualType,
      maskUrl: state.maskUrl,
      stage: state.stage,
      pokemonImageUrl: state.pokemonImageUrl,
      prevolveImageUrl: state.prevolveImageUrl, // Added prevolve image
      name: state.name,
      hp: state.hp,
      rarity: state.rarity,
      // Add other relevant state properties:
      // attacks: state.attacks,
      // abilityName: state.abilityName, abilityText: state.abilityText,
      // weakness: state.weakness, resistance: state.resistance, retreatCost: state.retreatCost,
      // category: state.category, pokedexNumber: state.pokedexNumber, height: state.height, weight: state.weight,
      // etc...
  }),
  // Using a selector function like this makes Zustand perform shallow comparison,
  // which is usually sufficient if your state structure isn't deeply nested in complex ways.
  );

  // --- Canvas Rendering Logic ---
  const renderCanvasContent = useCallback(async () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
        console.error("[Canvas] Fabric canvas instance not available for rendering.");
        return;
    }

    console.log("[Canvas] === Starting Canvas Render ===");
    console.log("[Canvas] Current card state for render:", cardStateForRendering);

    try {
        // 1. Clear Canvas
        canvas.clear();
        console.log("[Canvas] Cleared previous objects.");

        // 2. Generate Layer Definitions
        // This function MUST return definitions with correct 'src', 'mask', 'text', positions, styles etc.
        const layerDefinitions = createCardLayers(cardStateForRendering);
        console.log(`[Canvas] Generated ${layerDefinitions.length} layer definitions.`);
        if (layerDefinitions.length === 0) {
             console.warn("[Canvas] No layer definitions generated. Canvas will be blank.");
             canvas.backgroundColor = '#ffdddd'; // Set a visible background if empty
             canvas.renderAll();
             return;
        } else {
             canvas.backgroundColor = '#dddddd'; // Reset background
        }


        // 3. Create Fabric Objects Asynchronously
        // We use Promise.all to wait for all images to load before adding
        const fabricObjectsPromises = layerDefinitions.map(async (layer, index) => {
            console.log(`[Canvas] Processing layer definition ${index}: id=${layer.id}, type=${layer.type}`);
            try {
                let fabricObject = null;
                switch (layer.type) {
                    case 'image': {
                        if (!layer.src) {
                            console.warn(`[Canvas] Skipping image layer ${layer.id}: missing src.`);
                            return null; // Skip if no source URL
                        }
                        // Ensure URLs from public start with '/'
                        const absoluteSrc = layer.src.startsWith('/') ? layer.src : `/${layer.src}`;

                        // Create a promise for image loading
                        fabricObject = await new Promise((resolve, reject) => {
                            console.log(`[Canvas] Loading image for layer ${layer.id}: ${absoluteSrc}`);
                            fabric.Image.fromURL(absoluteSrc, (imgObj, isError) => {
                                if (isError || !imgObj) {
                                    console.error(`[Canvas] FAILED to load image for layer ${layer.id}: ${absoluteSrc}`);
                                    reject(new Error(`Failed to load image: ${absoluteSrc}`));
                                } else {
                                    console.log(`[Canvas] Image loaded for layer ${layer.id}.`);
                                    // Set common properties
                                    imgObj.set({
                                        id: layer.id, name: layer.name || layer.id, // Use name from definition or ID
                                        selectable: layer.selectable ?? false,
                                        evented: layer.evented ?? false,
                                        visible: layer.visible ?? true,
                                        left: layer.left ?? 0, top: layer.top ?? 0,
                                        originX: layer.originX || 'left', originY: layer.originY || 'top',
                                        scaleX: layer.scaleX || 1, scaleY: layer.scaleY || 1,
                                        // Apply width/height AFTER loading if specified, otherwise use natural size
                                        ...(layer.width && { width: layer.width }),
                                        ...(layer.height && { height: layer.height }),
                                    });
                                    resolve(imgObj); // Resolve the promise with the loaded image object
                                }
                            }, { crossOrigin: 'anonymous' });
                        });

                        // Apply mask AFTER image is loaded, only if mask property exists
                        // The 'mask' property comes from the layer definition generated by createCardLayers
                        if (layer.mask !== undefined && layer.mask !== null) {
                            console.log(`[Canvas] Layer ${layer.id} has mask property: '${layer.mask}'. Applying mask...`);
                            try {
                                // applyFabricMask returns a promise resolving with { clipPath: fabricImageOrPolygon }
                                const maskProps = await applyFabricMask(fabricObject, layer.mask, CARD_WIDTH, CARD_HEIGHT);
                                // Set the clipPath property on the loaded image object
                                fabricObject.set('clipPath', maskProps.clipPath || null);
                                console.log(`[Canvas] Applied mask result to layer ${layer.id}. ClipPath set:`, !!maskProps.clipPath);
                            } catch (maskError) {
                                console.error(`[Canvas] Error applying mask ${layer.mask} to layer ${layer.id}:`, maskError);
                                fabricObject.set('clipPath', null); // Ensure no clipPath on error
                            }
                        } else {
                            // Ensure no clipPath if layer.mask is not defined or null
                            fabricObject.set('clipPath', null);
                        }
                        break; // End case 'image'
                    }
                    case 'text': {
                        console.log(`[Canvas] Creating text layer ${layer.id}: "${layer.text?.substring(0, 30)}..."`);
                        fabricObject = new fabric.Text(layer.text ?? '', {
                            id: layer.id, name: layer.name || layer.id,
                            selectable: layer.selectable ?? false, evented: layer.evented ?? false,
                            visible: layer.visible ?? true,
                            left: layer.left ?? 0, top: layer.top ?? 0,
                            originX: layer.originX || 'left', originY: layer.originY || 'top',
                            fontFamily: layer.fontFamily || 'Arial',
                            fontSize: layer.fontSize || 20,
                            fill: layer.fill || '#000',
                            // Add other text properties from layer definition if needed:
                            // width: layer.width, // For text wrapping
                            // textAlign: layer.textAlign,
                            // fontWeight: layer.fontWeight,
                            // etc...
                        });
                        break; // End case 'text'
                    }
                    default:
                        console.warn(`[Canvas] Unknown layer type encountered: ${layer.type} for layer ${layer.id}`);
                        return null; // Skip unknown types
                }
                return fabricObject; // Return the created Fabric object (or null)
            } catch (error) {
                console.error(`[Canvas] Error processing layer definition ${index} (id: ${layer.id}, type: ${layer.type}):`, error);
                return null; // Return null for layers that failed
            }
        });

        // 4. Wait for all objects to be created/loaded
        const createdObjects = await Promise.all(fabricObjectsPromises);
        const validObjects = createdObjects.filter(obj => obj !== null);
        console.log(`[Canvas] Finished processing promises. ${validObjects.length} valid Fabric objects created.`);

        // 5. Add valid objects to canvas
        canvas.discardActiveObject(); // Deselect any active object first
        validObjects.forEach(obj => {
            // console.log(`[Canvas] Adding object: ${obj.id} (${obj.type})`);
            canvas.add(obj);
        });

        // 6. Ensure Correct Stacking Order (Optional but Recommended)
        // Fabric adds objects sequentially. If layerDefinitions array was ordered bottom-to-top,
        // the stacking should be correct. You can force specific objects to front/back if needed.
        // Example: Bring frame to front
        // const frameObject = canvas.getObjects().find(o => o.id === 'frame');
        // if (frameObject) canvas.bringToFront(frameObject);

        // 7. Render All
        canvas.renderAll();
        console.log("[Canvas] === Canvas Render Complete ===");

    } catch (error) {
        console.error("[Canvas] Uncaught error during canvas rendering process:", error);
        // Optionally display an error message to the user
    }
  }, [cardStateForRendering]); // Dependency is the selected state object

  // --- Initialize Fabric.js canvas on mount ---
  useEffect(() => {
    if (!fabricCanvasRef.current && canvasElRef.current) {
      console.log("[Canvas] Initializing Fabric canvas...");
      try {
          fabricCanvasRef.current = new fabric.Canvas(canvasElRef.current, {
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            preserveObjectStacking: true, // Important for layer order
            selection: false, // Typically disable group selection for card editors
            backgroundColor: '#cccccc' // Initial background color
          });
          console.log("[Canvas] Fabric canvas initialized successfully.");
          // Initial render after setup
          renderCanvasContent();
      } catch (error) {
          console.error("[Canvas] Error initializing Fabric canvas:", error);
      }
    }

    // Cleanup function on component unmount
    return () => {
      if (fabricCanvasRef.current) {
        console.log("[Canvas] Disposing Fabric canvas.");
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // --- Re-render canvas when relevant card state changes ---
  useEffect(() => {
    // This effect runs AFTER the initial mount effect and whenever renderCanvasContent changes
    // (which happens when cardStateForRendering changes)
    if (fabricCanvasRef.current) { // Only render if canvas exists
        console.log("[Canvas] Card state changed, triggering canvas re-render.");
        renderCanvasContent();
    }
  }, [renderCanvasContent]); // Dependency is the memoized render function

  // --- JSX ---
  return (
    // Ensure the container has a defined size, otherwise canvas might collapse
    <div className="canvas-container" style={{ width: CARD_WIDTH, height: CARD_HEIGHT, margin: 'auto', border: '1px solid #888' }}>
      {/* The actual canvas element Fabric will attach to */}
      <canvas ref={canvasElRef} width={CARD_WIDTH} height={CARD_HEIGHT} />
    </div>
  );
};

export default Canvas;
