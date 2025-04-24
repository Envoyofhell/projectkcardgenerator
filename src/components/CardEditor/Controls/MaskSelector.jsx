import React, { useState, useEffect } from 'react';
import { useCardStore } from '../../../store/cardStore';
// Import from the renamed service file - adjust path if necessary
import { getAllMasks, getTypeColor } from '../../../utils/maskService';

import './MaskSelector.css';

/**
 * MaskSelector component - Displays and allows selection of mask patterns
 */
const MaskSelector = () => {
  const [availableMasks, setAvailableMasks] = useState([]);

  // Get state and actions from the Zustand store
  const { isDualType, type, secondType, maskUrl, setMaskUrl } = useCardStore(
    (state) => ({
      isDualType: state.isDualType,
      type: state.type,
      secondType: state.secondType,
      maskUrl: state.maskUrl,
      setMaskUrl: state.setMaskUrl,
    })
  );

  // Load available masks on component mount
  useEffect(() => {
    setAvailableMasks(getAllMasks());
  }, []);

  // Handle mask selection click
  const handleMaskSelect = (selectedMaskId) => {
    // selectedMaskId will be '/img/masks/mask1.png' or '' for default
    setMaskUrl(selectedMaskId);
  };

  // Render nothing if not dual type
  if (!isDualType) {
    return null;
  }

  return (
    <div className="mask-selector">
      <h3>Type Mask</h3>
      <p className="mask-description">
        Select how the two type backgrounds blend.
      </p>

      {/* Mask grid - uses mask images directly as previews */}
      <div className="mask-grid">
        {availableMasks.map((mask, index) => (
          <div
            key={mask.id || index} // Use mask.id as key, fallback to index
            className={`mask-item ${mask.id === maskUrl ? 'selected' : ''}`}
            title={`${mask.name}\n${mask.description}`} // Tooltip
            onClick={() => handleMaskSelect(mask.id)}
          >
            <img
              // Use previewUrl which points to the mask file in /public
              src={mask.previewUrl}
              alt={mask.name}
              // Adjust width/height as needed for display
              width={60}
              height={80}
              loading="lazy" // Improve performance
            />
            <p className="mask-item-name">{mask.name}</p>
          </div>
        ))}
      </div>

      {/*
        Optional: If you want the larger canvas preview below the H3:
        1. Uncomment the createMaskPreviewOnCanvas and loadImage functions in maskService.js
        2. Uncomment the useEffect hook below
        3. Add the canvas JSX back under the H3
      */}
      {/*
      <div className="mask-preview">
        <canvas
          ref={previewCanvasRef}
          width={120}
          height={160}
          className="mask-preview-canvas"
        />
        <p className="mask-name">
          { availableMasks.find(m => m.id === (hoveredMaskId ?? maskUrl))?.name || 'Default Mask'}
        </p>
      </div>
      */}

    </div>
  );
};

// Optional: useEffect hook for the canvas preview (needs uncommenting above and in service)
/*
const MaskSelector = () => {
  // ... (keep other state and useEffect for getAllMasks)
  const previewCanvasRef = useRef(null);
  const [hoveredMaskId, setHoveredMaskId] = useState(null);
  const { type, secondType, maskUrl, setMaskUrl } = useCardStore(...); // get types too

  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas || !isDualType) return;

    const currentPreviewUrl = hoveredMaskId ?? maskUrl; // Use hovered or selected mask URL

    createMaskPreviewOnCanvas(
      canvas,
      currentPreviewUrl, // Pass the actual mask URL (or '' for default)
      getTypeColor(type),
      getTypeColor(secondType)
    );

  }, [hoveredMaskId, maskUrl, type, secondType, isDualType]); // Rerun when these change


  return (
    <div className="mask-selector">
      <h3>Type Mask</h3>

      <div className="mask-preview">
         <canvas
           ref={previewCanvasRef}
           width={120}
           height={160}
           className="mask-preview-canvas"
         />
         <p className="mask-name">
           { availableMasks.find(m => m.id === (hoveredMaskId ?? maskUrl))?.name || 'Default Mask'}
         </p>
      </div>

      <div className="mask-grid">
         {availableMasks.map((mask, index) => (
          <div
            key={mask.id || index}
            className={`mask-item ${mask.id === maskUrl ? 'selected' : ''}`}
            title={`${mask.name}\n${mask.description}`}
            onClick={() => handleMaskSelect(mask.id)}
            onMouseEnter={() => setHoveredMaskId(mask.id)} // Set ID on hover
            onMouseLeave={() => setHoveredMaskId(null)}   // Clear on leave
          >
            <img src={mask.previewUrl} alt={mask.name} width={60} height={80} loading="lazy"/>
             <p className="mask-item-name">{mask.name}</p>
           </div>
         ))}
       </div>
     </div>
   );
};
*/


export default MaskSelector;