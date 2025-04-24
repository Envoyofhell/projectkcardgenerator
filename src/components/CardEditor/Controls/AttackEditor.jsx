/**
 * File: src/components/CardEditor/Controls/AttackEditor.jsx
 * Purpose: Component for editing Pokémon attacks
 * Dependencies:
 *   - React
 *   - src/store/cardStore.js
 *   - src/utils/typeData.js
 * 
 * This component allows editing attacks, energy costs, and damage.
 */

import React, { useState } from 'react';
import { useCardStore } from '../../../store/cardStore';
import { getAllTypes } from '../../../utils/typeData';
import './AttackEditor.css';

const AttackEditor = ({ attackIndex = 0 }) => {
  const [showEnergyCostSelector, setShowEnergyCostSelector] = useState(false);
  
  const { attacks, setAttack, setAttackEnergyCost } = useCardStore();
  const attack = attacks[attackIndex] || { name: '', damage: '', energyCost: [], text: '' };
  
  const types = getAllTypes();
  
  // Calculate total energy cost
  const totalEnergyCost = attack.energyCost.reduce((total, cost) => total + cost.amount, 0);
  
  // Group energy costs by type
  const energyCostByType = attack.energyCost.reduce((acc, cost) => {
    acc[cost.type] = (acc[cost.type] || 0) + cost.amount;
    return acc;
  }, {});
  
  // Handle energy type selection
  const handleEnergyTypeSelect = (typeId) => {
    const currentAmount = energyCostByType[typeId] || 0;
    setAttackEnergyCost(attackIndex, typeId, currentAmount + 1);
    setShowEnergyCostSelector(false);
  };
  
  // Handle energy cost removal
  const handleRemoveEnergyCost = (typeId) => {
    const currentAmount = energyCostByType[typeId] || 0;
    if (currentAmount > 0) {
      setAttackEnergyCost(attackIndex, typeId, currentAmount - 1);
    }
  };
  
  return (
    <div className="attack-editor">
      <h3>Attack {attackIndex + 1}</h3>
      
      <div className="form-group">
        <label htmlFor={`attack-name-${attackIndex}`}>Name:</label>
        <input
          id={`attack-name-${attackIndex}`}
          type="text"
          value={attack.name}
          onChange={(e) => setAttack(attackIndex, { name: e.target.value })}
          placeholder="Attack name"
          maxLength={20}
        />
      </div>
      
      <div className="energy-cost-container">
        <label>Energy Cost:</label>
        <div className="energy-cost-display">
          {Object.entries(energyCostByType).map(([typeId, amount]) => (
            amount > 0 && (
              <div key={typeId} className="energy-type-tag">
                <img 
                  src={`assets/energy/${typeId}-energy.png`}
                  alt={`${typeId} energy`}
                />
                <span>x{amount}</span>
                <button 
                  className="remove-energy"
                  onClick={() => handleRemoveEnergyCost(typeId)}
                >
                  -
                </button>
              </div>
            )
          ))}
          
          {totalEnergyCost < 4 && (
            <button 
              className="add-energy-button"
              onClick={() => setShowEnergyCostSelector(!showEnergyCostSelector)}
            >
              + Add Energy
            </button>
          )}
        </div>
        
        {showEnergyCostSelector && (
          <div className="energy-type-selector">
            {types.map((type) => (
              <div 
                key={type.id}
                className="energy-type-option"
                onClick={() => handleEnergyTypeSelect(type.id)}
              >
                <img 
                  src={`assets/energy/${type.id}-energy.png`}
                  alt={`${type.name} energy`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor={`attack-damage-${attackIndex}`}>Damage:</label>
        <input
          id={`attack-damage-${attackIndex}`}
          type="text"
          value={attack.damage}
          onChange={(e) => setAttack(attackIndex, { damage: e.target.value })}
          placeholder="e.g., 50"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor={`attack-text-${attackIndex}`}>Description:</label>
        <textarea
          id={`attack-text-${attackIndex}`}
          value={attack.text}
          onChange={(e) => setAttack(attackIndex, { text: e.target.value })}
          placeholder="Attack effect description"
          rows={3}
        />
      </div>
    </div>
  );
};

export default AttackEditor;