/**
 * File: src/components/CardEditor/CardEditor.jsx
 * Purpose: Main component for the card editor interface
 * Dependencies:
 *   - src/components/CardEditor/Layout/* (LeftSidebar, MainContent, RightSidebar)
 *   - src/components/CardEditor/Canvas.jsx
 *   - src/components/CardEditor/Controls/* (various control components)
 *   - src/store/cardStore.js (Zustand store)
 *   - src/store/layerStore.js (Zustand store)
 * 
 * This component serves as the main layout for the card editor,
 * organizing the editor into sidebars and main content area.
 */

import React from 'react';
import { useCardStore } from '../../store/cardStore';
import { useLayerStore } from '../../store/layerStore';

// Layout components
import LeftSidebar from '../Layout/LeftSidebar';
import MainContent from '../Layout/MainContent';
import RightSidebar from '../Layout/RightSidebar';

// Main canvas component
import Canvas from './canvas';
import ActionBar from './Controls/ActionBar';

// Left sidebar components
import CardProperties from './Controls/CardProperties';
import TypeSelector from './Controls/TypeSelector';
import DualTypeToggle from './Controls/DualTypeToggle';
import MaskSelector from './Controls/MaskSelector';

// Right sidebar components
import LayerManager from './Controls/LayerManager';
import BackgroundOptions from './Controls/BackgroundOptions';
import CardTemplates from './Controls/CardTemplates';

import './CardEditor.css';

/**
 * CardEditor component - Main interface for the card editor
 * Organizes the layout into sidebars and content areas
 */
const CardEditor = () => {
  // Get relevant state from stores
  const { isDualType, toggleDualType } = useCardStore();
  const { layers } = useLayerStore();

  return (
    <div className="editor-container">
      <LeftSidebar>
        <CardProperties />
        <TypeSelector />
        <DualTypeToggle 
          isDualType={isDualType} 
          onToggle={toggleDualType} 
        />
        {isDualType && <MaskSelector />}
      </LeftSidebar>
      
      <MainContent>
        <Canvas />
        <ActionBar />
      </MainContent>
      
      <RightSidebar>
        <LayerManager layers={layers} />
        <BackgroundOptions />
        <CardTemplates />
      </RightSidebar>
    </div>
  );
};

export default CardEditor;