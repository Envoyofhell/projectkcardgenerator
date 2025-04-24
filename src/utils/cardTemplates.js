/**
 * File: src/utils/cardTemplates.js
 * Purpose: Provide card templates and background utilities
 * Dependencies:
 *   - Used by layerManager.js and various components
 * 
 * This utility provides functions to get card backgrounds,
 * templates, and standard card assets based on type and stage.
 */

// Type name formatting for file paths
const formatTypeName = (type) => {
    switch(type) {
      case 'normal': return 'Colorless';
      case 'electric': return 'Lightning';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  // Stage name formatting for file paths
  const formatStageName = (stage) => {
    switch(stage) {
      case 'basic': return 'Basic';
      case 'stage-1': return 'Stage 1';
      case 'stage-2': return 'Stage 2';
      default: return 'Basic';
    }
  };
  
  // Gets card background image URL based on type and stage
  export const getCardBackground = (type, stage) => {
    const typeFormatted = formatTypeName(type);
    const stageFormatted = formatStageName(stage);
    const stageClass = stageFormatted.replace(' ', '');
    
    return `assets/backgrounds/SS_${stageClass}_${typeFormatted}.png`;
  };
  
  // Gets energy image URL for attack costs
  export const getEnergyImage = (type) => {
    return `assets/energy/${type}-energy.png`;
  };
  
  // Card templates for quick start
  export const cardTemplates = {
    charizard: {
      name: 'Charizard',
      hp: '220',
      type: 'fire',
      stage: 'stage-2',
      evolvesFrom: 'Charmeleon',
      category: 'Flame',
      pokedexNumber: '6',
      height: { feet: '5', inches: '7' },
      weight: '199.5',
      abilityName: 'Fire Aura',
      abilityText: 'Once during your turn, you may attach a Fire Energy card from your hand to 1 of your Pokémon.',
      attacks: [
        {
          name: 'Fire Spin',
          damage: '120',
          energyCost: [
            { type: 'fire', amount: 3 }
          ],
          text: 'Discard 2 Energy attached to this Pokémon.'
        },
        {
          name: 'Inferno Wing',
          damage: '220',
          energyCost: [
            { type: 'fire', amount: 4 },
            { type: 'normal', amount: 1 }
          ],
          text: 'This Pokémon does 30 damage to itself.'
        }
      ],
      weakness: 'water',
      resistance: 'fighting',
      retreatCost: 3
    },
    
    blastoise: {
      name: 'Blastoise',
      hp: '210',
      type: 'water',
      stage: 'stage-2',
      evolvesFrom: 'Wartortle',
      category: 'Shellfish',
      pokedexNumber: '9',
      height: { feet: '5', inches: '3' },
      weight: '188.5',
      abilityName: 'Deluge',
      abilityText: 'As often as you like during your turn, you may attach a Water Energy card from your hand to 1 of your Pokémon.',
      attacks: [
        {
          name: 'Hydro Pump',
          damage: '130',
          energyCost: [
            { type: 'water', amount: 3 }
          ],
          text: 'This attack does 30 more damage for each Water Energy attached to this Pokémon beyond 3.'
        },
        {
          name: '',
          damage: '',
          energyCost: [],
          text: ''
        }
      ],
      weakness: 'electric',
      resistance: 'fire',
      retreatCost: 3
    },
    
    // Additional templates can be added here
    dualTypeExample: {
      name: 'Charizard GX',
      hp: '250',
      type: 'fire',
      secondType: 'dark',
      isDualType: true,
      maskUrl: 'assets/masks/mask1.png',
      stage: 'stage-2',
      evolvesFrom: 'Charmeleon',
      category: 'Flame',
      pokedexNumber: '6',
      height: { feet: '5', inches: '7' },
      weight: '199.5',
      abilityName: 'Burning Road',
      abilityText: 'When you attach a Fire Energy card from your hand to this Pokémon, you may search your deck for up to 2 Fire Energy cards and attach them to this Pokémon. Then, shuffle your deck.',
      attacks: [
        {
          name: 'Crimson Storm',
          damage: '200',
          energyCost: [
            { type: 'fire', amount: 3 },
            { type: 'dark', amount: 1 }
          ],
          text: 'Discard 3 Energy from this Pokémon.'
        },
        {
          name: 'Raging Out-GX',
          damage: '300',
          energyCost: [
            { type: 'fire', amount: 3 },
            { type: 'dark', amount: 2 }
          ],
          text: 'You can\'t use more than 1 GX attack in a game.'
        }
      ],
      weakness: 'water',
      resistance: 'fighting',
      retreatCost: 3,
      holographic: true
    }
  };