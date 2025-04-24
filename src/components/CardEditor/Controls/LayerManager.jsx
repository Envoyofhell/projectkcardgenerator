/**
 * File: src/components/CardEditor/Controls/LayerManager.jsx
 * Purpose: UI for managing and reordering card layers
 * Dependencies:
 *   - React
 *   - react-beautiful-dnd
 *   - src/store/layerStore.js
 * 
 * This component displays all layers and allows reordering
 * via drag and drop, as well as toggling visibility and lock status.
 */

import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useLayerStore } from '../../../store/layerStore';
import { FaEye, FaEyeSlash, FaLock, FaLockOpen, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './LayerManager.css';

const LayerManager = () => {
  const { 
    layers, 
    selectedLayerId, 
    setSelectedLayerId,
    toggleLayerVisibility,
    toggleLayerLock,
    moveLayerUp,
    moveLayerDown,
    reorderLayers
  } = useLayerStore();
  
  // Handle drag end event from react-beautiful-dnd
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    reorderLayers(sourceIndex, destinationIndex);
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
              {layers.map((layer, index) => (
                <Draggable 
                  key={layer.id} 
                  draggableId={layer.id} 
                  index={index}
                  isDragDisabled={!layer.selectable}
                >
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`layer-item ${selectedLayerId === layer.id ? 'selected' : ''}`}
                      onClick={() => setSelectedLayerId(layer.id)}
                    >
                      {/* Drag handle */}
                      <div 
                        className="drag-handle"
                        {...provided.dragHandleProps}
                      >
                        ≡
                      </div>
                      
                      {/* Layer visibility toggle */}
                      <button 
                        className="visibility-toggle"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLayerVisibility(layer.id);
                        }}
                      >
                        {layer.visible !== false ? <FaEye /> : <FaEyeSlash />}
                      </button>
                      
                      {/* Layer name */}
                      <span className="layer-name">
                        {layer.name || layer.id}
                      </span>
                      
                      {/* Layer controls */}
                      <div className="layer-controls">
                        {/* Lock/unlock button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLayerLock(layer.id);
                          }}
                        >
                          {layer.selectable ? <FaLockOpen /> : <FaLock />}
                        </button>
                        
                        {/* Move up button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveLayerUp(layer.id);
                          }}
                          disabled={index >= layers.length - 1}
                        >
                          <FaArrowUp />
                        </button>
                        
                        {/* Move down button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveLayerDown(layer.id);
                          }}
                          disabled={index <= 0}
                        >
                          <FaArrowDown />
                        </button>
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