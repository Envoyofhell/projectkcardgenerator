/**
 * File: src/components/CardEditor/Layout/MainContent.jsx
 * Purpose: Container component for main content area
 * Dependencies:
 *   - React
 * 
 * This component serves as a container for the main content area.
 */

import React from 'react';
import '../CardEditor/CardEditor.css';

const MainContent = ({ children }) => {
  return (
    <div className="main-content">
      {children}
    </div>
  );
};

export default MainContent;