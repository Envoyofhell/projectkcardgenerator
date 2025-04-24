/**
 * File: src/components/CardEditor/Controls/CardProperties.jsx
 * Purpose: Input form for card properties like name, HP, etc.
 * Dependencies:
 *   - React
 *   - src/store/cardStore.js
 * 
 * This component provides input fields for basic card properties
 * including name, HP, stage, and evolution.
 */

import React from 'react';
import { useCardStore } from '../../../store/cardStore';
import './CardProperties.css';

const CardProperties = () => {
  const { 
    name, setName,
    hp, setHP,
    stage, setStage,
    evolvesFrom, setEvolvesFrom,
    category, setCategory,
    pokedexNumber, setPokedexNumber,
    height, setHeight,
    weight, setWeight,
    holographic, toggleHolographic
  } = useCardStore();

  return (
    <div className="card-properties">
      <h3>Card Properties</h3>
      
      <div className="form-group">
        <label htmlFor="card-name">Name:</label>
        <input
          id="card-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Pokémon name"
          maxLength={20}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="card-hp">HP:</label>
        <input
          id="card-hp"
          type="number"
          value={hp}
          onChange={(e) => setHP(e.target.value)}
          placeholder="10-340"
          min={10}
          max={340}
          step={10}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="card-stage">Stage:</label>
        <select
          id="card-stage"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
        >
          <option value="basic">Basic</option>
          <option value="stage-1">Stage 1</option>
          <option value="stage-2">Stage 2</option>
        </select>
      </div>
      
      {stage !== 'basic' && (
        <div className="form-group">
          <label htmlFor="card-evolves-from">Evolves from:</label>
          <input
            id="card-evolves-from"
            type="text"
            value={evolvesFrom}
            onChange={(e) => setEvolvesFrom(e.target.value)}
            placeholder="Pre-evolution name"
          />
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="card-category">Category:</label>
        <input
          id="card-category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="E.g., Flame Pokémon"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="card-pokedex">Pokédex #:</label>
        <input
          id="card-pokedex"
          type="number"
          value={pokedexNumber}
          onChange={(e) => setPokedexNumber(e.target.value)}
          placeholder="Pokédex number"
        />
      </div>
      
      <div className="form-row">
        <div className="form-group half">
          <label>Height:</label>
          <div className="height-inputs">
            <input
              type="number"
              value={height.feet}
              onChange={(e) => setHeight(e.target.value, height.inches)}
              placeholder="Feet"
              min={0}
            />
            <span>'</span>
            <input
              type="number"
              value={height.inches}
              onChange={(e) => setHeight(height.feet, e.target.value)}
              placeholder="Inches"
              min={0}
              max={11}
            />
            <span>"</span>
          </div>
        </div>
        
        <div className="form-group half">
          <label htmlFor="card-weight">Weight:</label>
          <div className="weight-input">
            <input
              id="card-weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Weight"
              min={0}
            />
            <span>lbs.</span>
          </div>
        </div>
      </div>
      
      <div className="form-group checkbox">
        <label htmlFor="card-holographic">
          <input
            id="card-holographic"
            type="checkbox"
            checked={holographic}
            onChange={() => toggleHolographic()}
          />
          Holographic Effect
        </label>
      </div>
    </div>
  );
};

export default CardProperties;