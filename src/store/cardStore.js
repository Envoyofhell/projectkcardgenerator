/**
 * File: src/store/cardStore.js
 * Purpose: Zustand store for Pokemon card properties
 * Dependencies:
 *   - zustand library
 *   - Used by multiple components including CardEditor.jsx and Canvas.jsx
 * 
 * This store manages the card properties like name, types, HP, etc.
 * It replaces the direct DOM manipulation from the original project.
 */

import { create } from 'zustand';

// Default values for a new card
const defaultCardData = {
  name: '',
  hp: '100',
  type: 'water',
  secondType: '',
  isDualType: false,
  maskUrl: '',
  stage: 'basic',
  evolvesFrom: '',
  pokemonImageUrl: null,
  prevolveImageUrl: null,
  category: '',
  pokedexNumber: '',
  height: { feet: '', inches: '' },
  weight: '',
  abilityName: '',
  abilityText: '',
  attacks: [
    { name: '', damage: '', energyCost: [], text: '' },
    { name: '', damage: '', energyCost: [], text: '' }
  ],
  weakness: '',
  resistance: '',
  retreatCost: 0,
  rarity: 'common',
  holographic: false
};

export const useCardStore = create((set) => ({
  // Initial state uses default values
  ...defaultCardData,
  
  // Generic setter for any card property
  setCardProperty: (key, value) => set({ [key]: value }),
  
  // Specific setters for convenience
  setName: (name) => set({ name }),
  setHP: (hp) => set({ hp }),
  
  // Type management
  setType: (type) => set({ type }),
  setSecondType: (secondType) => set({ secondType }),
  toggleDualType: () => set((state) => ({ 
    isDualType: !state.isDualType,
    // Reset secondType if disabling dual type
    secondType: !state.isDualType ? state.secondType : ''
  })),
  
  // Mask for dual-type
  setMaskUrl: (maskUrl) => set({ maskUrl }),
  
  // Card evolution
  setStage: (stage) => set({ stage }),
  setEvolvesFrom: (evolvesFrom) => set({ evolvesFrom }),
  
  // Images
  setPokemonImage: (url) => set({ pokemonImageUrl: url }),
  setPrevolveImage: (url) => set({ prevolveImageUrl: url }),
  
  // Pokemon info
  setCategory: (category) => set({ category }),
  setPokedexNumber: (pokedexNumber) => set({ pokedexNumber }),
  setHeight: (feet, inches) => set({ height: { feet, inches } }),
  setWeight: (weight) => set({ weight }),
  
  // Ability
  setAbility: (name, text) => set({ abilityName: name, abilityText: text }),
  
  // Attacks
  setAttack: (index, attack) => set((state) => {
    const newAttacks = [...state.attacks];
    newAttacks[index] = { ...newAttacks[index], ...attack };
    return { attacks: newAttacks };
  }),
  
  // Attack energy costs
  setAttackEnergyCost: (attackIndex, energyType, amount) => set((state) => {
    const newAttacks = [...state.attacks];
    const costs = [...newAttacks[attackIndex].energyCost];
    
    // Find existing cost entry or create new one
    const existingIndex = costs.findIndex(cost => cost.type === energyType);
    if (existingIndex >= 0) {
      if (amount > 0) {
        costs[existingIndex].amount = amount;
      } else {
        costs.splice(existingIndex, 1);
      }
    } else if (amount > 0) {
      costs.push({ type: energyType, amount });
    }
    
    newAttacks[attackIndex].energyCost = costs;
    return { attacks: newAttacks };
  }),
  
  // Combat stats
  setWeakness: (weakness) => set({ weakness }),
  setResistance: (resistance) => set({ resistance }),
  setRetreatCost: (retreatCost) => set({ retreatCost }),
  
  // Appearance
  setRarity: (rarity) => set({ rarity }),
  toggleHolographic: () => set((state) => ({ holographic: !state.holographic })),
  
  // Reset the entire card
  resetCard: () => set(defaultCardData),
  
  // Load a card template
  loadCardTemplate: (template) => set((state) => ({
    ...state,
    ...template
  }))
}));