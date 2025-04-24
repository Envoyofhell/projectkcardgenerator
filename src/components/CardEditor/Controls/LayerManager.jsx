/**
 * File: src/components/CardEditor/Controls/LayerManager.jsx
 * Purpose: UI for managing and reordering card layers
 */

import React, { useEffect } from 'react'; // Added useEffect
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useLayerStore } from '../../../store/layerStore';
import { useCardStore } from '../../../store/cardStore'; // Import cardStore
import { createCardLayers } from '../../../services/layerManager'; // Import generator
import {
  FaEye, FaEyeSlash, FaLock, FaLockOpen,
  FaArrowUp, FaArrowDown, FaImage, FaFont, FaTrash // Added icons
} from 'react-icons/fa';
import './LayerManager.css';

// Helper to get an icon based on layer type
const getLayerIcon = (type) => {
  switch (type) {
    case 'image': return <FaImage />;
    case 'text': return <FaFont />;
    // Add other types as needed
    default: return null;
  }
};

const LayerManager = () => {
  const {
    layers,           // Get layers from the store
    setLayers,        // Action to update the whole list
    selectedLayerId,
    setSelectedLayerId,
    toggleLayerVisibility,
    toggleLayerLock,
    moveLayerUp,
    moveLayerDown,
    reorderLayers,
    removeLayer       // <<< Make sure removeLayer action exists in useLayerStore
  } = useLayerStore();

  // Get current cardData to regenerate layers when it changes
  // Select only necessary fields if possible, or the whole object if simpler
  const cardData = useCardStore();

  // Effect to synchronize useLayerStore with generated layers from cardData
  useEffect(() => {
    console.log("CardData changed, regenerating layers for LayerManager UI & Store");
    const newLayerDefinitions = createCardLayers(cardData);
    setLayers(newLayerDefinitions); // Update the store with the latest definitions
    // Note: This assumes Canvas.jsx ALSO uses createCardLayers or reads from layerStore
    // For consistency, it might be best if BOTH read from useLayerStore after this update.
    // If Canvas.jsx keeps calling createCardLayers directly, ensure the logic is identical.
  }, [cardData, setLayers]); // Re-run when cardData changes

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    reorderLayers(result.source.index, result.destination.index);
  };

  // Function to determine if a layer is deletable (example logic)
  const isLayerDeletable = (layerId) => {
    // Only allow deleting certain layers, e.g., maybe user-added text/images?
    // For now, let's prevent deleting core layers like backgrounds/frames
    const coreLayerIds = ['baseBg', 'secondaryBg', 'frame', 'pokemonImage']; // Example
    return !coreLayerIds.includes(layerId);
  };


  return (
    <div className="layer-manager">
      <h3>Layers</h3>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="layers">
          {(provided) => (
            <ul
              className="layer-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {/* Render layers from the store */}
              {layers.map((layer, index) => (
                <Draggable
                  key={layer.id}
                  draggableId={layer.id}
                  index={index}
                  // Disable dragging for locked layers (optional)
                  isDragDisabled={!layer.selectable}
                >
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps} // Keep drag props here
                      className={`layer-item ${selectedLayerId === layer.id ? 'selected' : ''}`}
                      // Select on click, but allow button clicks without selecting
                      onClick={() => setSelectedLayerId(layer.id)}
                    >
                      {/* Drag handle */}
                      <div
                        className="drag-handle"
                        {...provided.dragHandleProps} // Only drag handle props here
                      >
                        {getLayerIcon(layer.type) || '≡'} {/* Show icon or default handle */}
                      </div>

                      {/* Layer visibility toggle */}
                      <button
                        title={layer.visible !== false ? 'Hide Layer' : 'Show Layer'}
                        className="visibility-toggle"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent selecting row
                          toggleLayerVisibility(layer.id);
                        }}
                      >
                        {layer.visible !== false ? <FaEye /> : <FaEyeSlash />}
                      </button>

                      {/* Layer name */}
                      <span className="layer-name" title={layer.name || layer.id}>
                        {layer.name || layer.id} {/* Display name or ID */}
                      </span>

                      {/* Layer controls */}
                      <div className="layer-controls">
                        {/* Lock/unlock button */}
                        <button
                          title={layer.selectable ? 'Unlock Layer' : 'Lock Layer'}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLayerLock(layer.id);
                          }}
                        >
                          {/* Use selectable as the indicator for locked/unlocked */}
                          {layer.selectable ? <FaLockOpen /> : <FaLock />}
                        </button>

                        {/* Move up button */}
                        <button
                          title="Move Layer Up"
                          onClick={(e) => { e.stopPropagation(); moveLayerUp(layer.id); }}
                          disabled={index <= 0} // Corrected logic: disable if already at top (index 0)
                        >
                          <FaArrowUp />
                        </button>

                        {/* Move down button */}
                        <button
                          title="Move Layer Down"
                          onClick={(e) => { e.stopPropagation(); moveLayerDown(layer.id); }}
                           // Corrected logic: disable if already at bottom
                          disabled={index >= layers.length - 1}
                        >
                          <FaArrowDown />
                        </button>

                         {/* Delete button (conditional) */}
                         {isLayerDeletable(layer.id) && (
                            <button
                              title="Delete Layer"
                              className="delete-button" // Add specific class for styling if needed
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to delete the layer "${layer.name || layer.id}"?`)) {
                                   // Ensure removeLayer action exists in your store
                                   if(removeLayer) removeLayer(layer.id);
                                }
                              }}
                            >
                              <FaTrash />
                            </button>
                         )}

                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default LayerManager;