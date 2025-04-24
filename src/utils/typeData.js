/**
 * File: src/utils/typeData.js
 * Purpose: Provide data and utilities for Pokémon types
 * Dependencies:
 *   - Used by TypeSelector.jsx and other components
 * 
 * This utility contains type information including icons,
 * colors, and relationships for the card editor.
 */

// Type definitions
const types = [
    { id: '', name: 'Water', iconUrl: 'assets/types/water.png', color: '#6390F0' },
    { id: 'fire', name: 'Fire', iconUrl: 'assets/types/fire.png', color: '#EE8130' },
    { id: 'grass', name: 'Grass', iconUrl: 'assets/types/grass.png', color: '#7AC74C' },
    { id: 'electric', name: 'Electric', iconUrl: 'assets/types/electric.png', color: '#F7D02C' },
    { id: 'psychic', name: 'Psychic', iconUrl: 'assets/types/psychic.png', color: '#F95587' },
    { id: 'fighting', name: 'Fighting', iconUrl: 'assets/types/fighting.png', color: '#C22E28' },
    { id: 'dark', name: 'Dark', iconUrl: 'assets/types/dark.png', color: '#705746' },
    { id: 'metal', name: 'Metal', iconUrl: 'assets/types/metal.png', color: '#B7B7CE' },
    { id: 'normal', name: 'Normal', iconUrl: 'assets/types/normal.png', color: '#A8A77A' },
    { id: 'fairy', name: 'Fairy', iconUrl: 'assets/types/fairy.png', color: '#D685AD' }
  ];
  
  // Get all available types
  export const getAllTypes = () => types;
  
  // Get type data by ID
  export const getTypeById = (typeId) => {
    return types.find(type => type.id === typeId) || null;
  };
  
  // Get type color
  export const getTypeColor = (typeId) => {
    const type = getTypeById(typeId);
    return type ? type.color : '#888888';
  };
  
  // Type effectiveness relationships
  const typeEffectiveness = {
    water: { weaknesses: ['electric', 'grass'], resistances: ['fire', 'water', 'ice', 'steel'] },
    fire: { weaknesses: ['water', 'rock', 'ground'], resistances: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'] },
    grass: { weaknesses: ['fire', 'ice', 'poison', 'flying', 'bug'], resistances: ['water', 'electric', 'grass', 'ground'] },
    electric: { weaknesses: ['ground'], resistances: ['electric', 'flying', 'steel'] },
    psychic: { weaknesses: ['bug', 'ghost', 'dark'], resistances: ['fighting', 'psychic'] },
    fighting: { weaknesses: ['flying', 'psychic', 'fairy'], resistances: ['rock', 'bug', 'dark'] },
    dark: { weaknesses: ['fighting', 'bug', 'fairy'], resistances: ['ghost', 'dark', 'psychic'] },
    metal: { weaknesses: ['fire', 'fighting', 'ground'], resistances: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'] },
    normal: { weaknesses: ['fighting'], resistances: [] },
    fairy: { weaknesses: ['poison', 'steel'], resistances: ['fighting', 'bug', 'dark', 'dragon'] }
  };
  
  // Get type weaknesses
  export const getTypeWeaknesses = (typeId) => {
    if (!typeEffectiveness[typeId]) return [];
    return typeEffectiveness[typeId].weaknesses;
  };
  
  // Get type resistances
  export const getTypeResistances = (typeId) => {
    if (!typeEffectiveness[typeId]) return [];
    return typeEffectiveness[typeId].resistances;
  };
  
  // Suggest weaknesses/resistances for dual type
  export const suggestDualTypeEffectiveness = (primaryType, secondaryType) => {
    if (!typeEffectiveness[primaryType] || !typeEffectiveness[secondaryType]) {
      return { suggestedWeakness: '', suggestedResistance: '' };
    }
    
    // Get primary and secondary weaknesses
    const primaryWeaknesses = new Set(typeEffectiveness[primaryType].weaknesses);
    const secondaryWeaknesses = new Set(typeEffectiveness[secondaryType].weaknesses);
    
    // Get primary and secondary resistances
    const primaryResistances = new Set(typeEffectiveness[primaryType].resistances);
    const secondaryResistances = new Set(typeEffectiveness[secondaryType].resistances);
    
    // Find common weakness (if any)
    let suggestedWeakness = '';
    for (const weakness of primaryWeaknesses) {
      if (secondaryWeaknesses.has(weakness)) {
        suggestedWeakness = weakness;
        break;
      }
    }
    
    // Find common resistance (if any)
    let suggestedResistance = '';
    for (const resistance of primaryResistances) {
      if (secondaryResistances.has(resistance)) {
        suggestedResistance = resistance;
        break;
      }
    }
    
    return { suggestedWeakness, suggestedResistance };
  };