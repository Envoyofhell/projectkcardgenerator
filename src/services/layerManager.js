/**
 * File: src/services/layerManager.js
 * Purpose: Generates layer definitions for the Fabric.js canvas based on card state.
 */

// --- Helper Function Imports ---
// !! IMPORTANT: Make sure this path points to where getCardBackground is defined !!
import { getCardBackground } from '../utils/cardTemplates'; // OR '../utils/cardUtils' OR '../utils/maskService' etc.

// --- Constants (Define or import these based on your layout) ---
const CARD_WIDTH = 747;
const CARD_HEIGHT = 1038;

// Example Positions & Styles (Replace with your actual values)
const POS = {
    NAME: { left: 60, top: 55, fontSize: 42, fill: '#000000', fontFamily: 'Lato Bold', originX: 'left', originY: 'top'},
    HP: { left: 680, top: 58, fontSize: 30, fill: '#000000', fontFamily: 'Lato Bold', originX: 'right', originY: 'top'},
    HP_LABEL: { left: 620, top: 65, fontSize: 12, fill: '#000000', fontFamily: 'Lato Bold', originX: 'left', originY: 'top'},
    POKEMON_IMG: { left: CARD_WIDTH / 2, top: 280, width: 587, height: 340, originX: 'center', originY: 'center' }, // Example using origin
    FRAME: { left: 0, top: 0, width: CARD_WIDTH, height: CARD_HEIGHT, originX: 'left', originY: 'top'},
    PREVOLVE_IMG: { left: 90, top: 115, scale: 0.2, originX: 'left', originY: 'top' },
    // Add positions/styles for attacks, ability, weakness, etc.
    ATTACK1_COST: { left: 60, top: 650 },
    ATTACK1_NAME: { left: 180, top: 650, fontSize: 30 },
    ATTACK1_DMG: { left: 680, top: 650, fontSize: 30, originX: 'right' },
    ATTACK1_TEXT: { left: 60, top: 690, fontSize: 24, width: CARD_WIDTH - 120 }, // Example width for wrapping

};

// --- Helper Function for Frames ---
// !! IMPORTANT: Ensure this returns paths starting with '/' pointing to public/assets/frames/ !!
const getFrameUrl = (type, secondType, rarity, stage) => {
    const typePart = secondType ? 'dual' : type || 'normal';
    const rarityPart = rarity || 'common';
    console.log(`Generating frame URL for type=${typePart}, rarity=${rarityPart}`); // Debug log
    // !! CHECK if this path format matches your actual files in public/assets/frames/ !!
    return `/assets/frames/${typePart}_${rarityPart}.png`;
};


// --- Main Layer Generation Function ---
export function createCardLayers(cardData) {
    console.log("Generating layers. Current maskUrl:", cardData.maskUrl);
    const layers = [];
    const addLayer = (layerDef) => {
        layers.push({
            selectable: false, evented: false, visible: true,
            originX: 'left', originY: 'top', // Default origin
            ...layerDef
        });
    };

    // --- Layer Order Matters (Bottom Layer First) ---

    // 1. Base Background
    addLayer({
        id: 'baseBg', name: 'Background (Primary)', type: 'image',
        src: getCardBackground(cardData.type, cardData.stage),
        width: CARD_WIDTH, height: CARD_HEIGHT,
    });

    // 2. Secondary Background (Conditional + Mask)
    if (cardData.isDualType && cardData.secondType) {
        addLayer({
            id: 'secondaryBg', name: 'Background (Secondary)', type: 'image',
            src: getCardBackground(cardData.secondType, cardData.stage),
            mask: cardData.maskUrl, // Assigns the selected maskUrl
            width: CARD_WIDTH, height: CARD_HEIGHT,
        });
    }

    // 3. Pokémon Image
    if (cardData.pokemonImageUrl) {
        addLayer({
            id: 'pokemonImage', name: 'Pokemon Art', type: 'image',
            src: cardData.pokemonImageUrl,
            left: POS.POKEMON_IMG.left, top: POS.POKEMON_IMG.top,
            width: POS.POKEMON_IMG.width, height: POS.POKEMON_IMG.height, // Optional: if you want to force size
            originX: POS.POKEMON_IMG.originX, originY: POS.POKEMON_IMG.originY,
            selectable: true, evented: true,
        });
    }

    // 4. Frame
    addLayer({
        id: 'frame', name: 'Card Frame', type: 'image',
        src: getFrameUrl(cardData.type, cardData.secondType, cardData.rarity, cardData.stage),
        width: CARD_WIDTH, height: CARD_HEIGHT,
    });

     // 5. Pre-evolution Image (Conditional)
    if (cardData.stage !== 'basic' && cardData.prevolveImageUrl) {
        addLayer({
            id: 'prevolveImage', name: 'Pre-evolution', type: 'image',
            src: cardData.prevolveImageUrl,
            left: POS.PREVOLVE_IMG.left, top: POS.PREVOLVE_IMG.top,
            scaleX: POS.PREVOLVE_IMG.scale, scaleY: POS.PREVOLVE_IMG.scale,
            originX: POS.PREVOLVE_IMG.originX, originY: POS.PREVOLVE_IMG.originY,
            selectable: true, evented: true,
        });
    }

    // 6. Text Layers
    addLayer({
        id: 'nameText', name: 'Name', type: 'text',
        text: cardData.name || 'Pokemon Name',
        left: POS.NAME.left, top: POS.NAME.top,
        fontSize: POS.NAME.fontSize, fill: POS.NAME.fill, fontFamily: POS.NAME.fontFamily,
        originX: POS.NAME.originX, originY: POS.NAME.originY,
        selectable: true, evented: true,
    });
    addLayer({
        id: 'hpText', name: 'HP', type: 'text',
        text: cardData.hp || '',
        left: POS.HP.left, top: POS.HP.top,
        fontSize: POS.HP.fontSize, fill: POS.HP.fill, fontFamily: POS.HP.fontFamily,
        originX: POS.HP.originX, originY: POS.HP.originY,
    });
     addLayer({
        id: 'hpLabel', name: 'HP Label', type: 'text',
        text: cardData.hp ? 'HP' : '',
        left: POS.HP_LABEL.left, top: POS.HP_LABEL.top,
        fontSize: POS.HP_LABEL.fontSize, fill: POS.HP_LABEL.fill, fontFamily: POS.HP_LABEL.fontFamily,
        originX: POS.HP_LABEL.originX, originY: POS.HP_LABEL.originY,
    });

    // TODO: Implement details for other text layers (Ability, Attacks, etc.)
    // Example for Attack 1 Name:
    if (cardData.attacks && cardData.attacks[0]?.name) {
         addLayer({
             id: 'attack1Name', name: 'Attack 1 Name', type: 'text',
             text: cardData.attacks[0].name,
             left: POS.ATTACK1_NAME.left, top: POS.ATTACK1_NAME.top,
             fontSize: POS.ATTACK1_NAME.fontSize, // ... other style props ...
         });
         // Add layers for cost, damage, text for attack 1...
    }


    console.log("Finished generating layers:", layers.map(l => l.id));
    return layers;
}