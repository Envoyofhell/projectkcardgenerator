/**
 * File: src/services/exportService.js
 * Purpose: Handle card export functionality
 * Dependencies:
 *   - fabric.js library (used via canvas reference)
 *   - html2canvas (for card download)
 * 
 * This service handles exporting cards as images and providing
 * download functionality, replacing the earlier implementation.
 */

/**
 * Export the card as a PNG image
 * @param {fabric.Canvas} canvas - Fabric.js canvas instance
 * @param {string} filename - Name for the downloaded file
 */
export const exportCardAsPNG = (canvas, filename = 'pokemon-card') => {
    if (!canvas) {
      console.error('Canvas is not available for export');
      return;
    }
    
    // Create a clean filename
    const cleanFilename = filename.trim() 
      ? `${filename.trim().replace(/[^\w\-. ]/g, '')}.png` 
      : 'pokemon-card.png';
    
    // Get the data URL from canvas
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1.0,
      multiplier: 2 // 2x resolution for better quality
    });
    
    // Create a download link
    const link = document.createElement('a');
    link.download = cleanFilename;
    link.href = dataURL;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  /**
   * Export card with high quality rendering for dual-type cards
   * Uses html2canvas for consistent rendering of masks
   * @param {HTMLElement} cardElement - DOM element containing the card
   * @param {string} filename - Name for the downloaded file
   */
  export const exportCardWithMasks = async (cardElement, filename = 'pokemon-card') => {
    try {
      // Dynamically import html2canvas
      const html2canvas = await import('html2canvas').then(module => module.default);
      
      // Create a clean filename
      const cleanFilename = filename.trim() 
        ? `${filename.trim().replace(/[^\w\-. ]/g, '')}.png` 
        : 'pokemon-card.png';
      
      // Capture the card with html2canvas
      const canvas = await html2canvas(cardElement, {
        scale: 2, // 2x resolution for better quality
        useCORS: true, // Allow cross-origin images
        allowTaint: true,
        backgroundColor: null // Transparent background
      });
      
      // Convert to data URL and download
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = cleanFilename;
      link.href = dataURL;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error exporting card with masks:', error);
      // Fallback to normal export if html2canvas fails
      const fabricCanvas = document.querySelector('canvas.upper-canvas');
      if (fabricCanvas) {
        exportCardAsPNG(fabricCanvas.__fabric, filename);
      }
    }
  };
  
  /**
   * Generate and download a printable sheet of cards
   * @param {fabric.Canvas} canvas - Fabric.js canvas instance
   * @param {number} columns - Number of columns in the sheet
   * @param {number} rows - Number of rows in the sheet
   */
  export const exportCardSheet = (canvas, columns = 3, rows = 3) => {
    if (!canvas) {
      console.error('Canvas is not available for export');
      return;
    }
    
    // Create a large canvas for the sheet
    const cardWidth = 747;
    const cardHeight = 1038;
    const padding = 30;
    
    const sheetWidth = (cardWidth * columns) + (padding * (columns + 1));
    const sheetHeight = (cardHeight * rows) + (padding * (rows + 1));
    
    // Create a new canvas for the sheet
    const sheetCanvas = document.createElement('canvas');
    sheetCanvas.width = sheetWidth;
    sheetCanvas.height = sheetHeight;
    const ctx = sheetCanvas.getContext('2d');
    
    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, sheetWidth, sheetHeight);
    
    // Get card image data
    const cardDataURL = canvas.toDataURL({
      format: 'png',
      multiplier: 1
    });
    
    // Create image element from card data
    const img = new Image();
    img.onload = () => {
      // Draw cards in a grid
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const x = padding + (col * (cardWidth + padding));
          const y = padding + (row * (cardHeight + padding));
          
          ctx.drawImage(img, x, y, cardWidth, cardHeight);
        }
      }
      
      // Download the sheet
      const sheetDataURL = sheetCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'pokemon-card-sheet.png';
      link.href = sheetDataURL;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    
    img.src = cardDataURL;
  };