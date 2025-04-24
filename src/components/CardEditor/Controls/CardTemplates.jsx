/**
 * File: src/components/CardEditor/Controls/CardTemplates.jsx
 * Purpose: Component for card template selection
 * Dependencies:
 *   - React
 *   - src/store/cardStore.js
 *   - src/utils/cardTemplates.js
 * 
 * This component displays available card templates for quick start.
 */

import React from 'react';
import { useCardStore } from '../../../store/cardStore';
import { cardTemplates } from '../../../utils/cardTemplates';
import './CardTemplates.css';

const CardTemplates = () => {
  const { loadCardTemplate } = useCardStore();
  
  const handleTemplateSelect = (templateKey) => {
    if (window.confirm('Loading a template will replace your current card. Continue?')) {
      loadCardTemplate(cardTemplates[templateKey]);
    }
  };
  
  return (
    <div className="card-templates">
      <h3>Card Templates</h3>
      <p className="templates-description">
        Start with a pre-configured card template
      </p>
      
      <div className="template-grid">
        <div 
          className="template-item"
          onClick={() => handleTemplateSelect('charizard')}
        >
          <div className="template-preview fire">
            <span>Fire</span>
          </div>
          <p>Charizard</p>
        </div>
        
        <div 
          className="template-item"
          onClick={() => handleTemplateSelect('blastoise')}
        >
          <div className="template-preview water">
            <span>Water</span>
          </div>
          <p>Blastoise</p>
        </div>
        
        <div 
          className="template-item"
          onClick={() => handleTemplateSelect('dualTypeExample')}
        >
          <div className="template-preview dual">
            <div className="dual-left fire"></div>
            <div className="dual-right dark"></div>
          </div>
          <p>Dual Type</p>
        </div>
      </div>
      
      <div className="template-options">
        <button className="save-current-template">
          Save Current as Template
        </button>
      </div>
    </div>
  );
};

export default CardTemplates;