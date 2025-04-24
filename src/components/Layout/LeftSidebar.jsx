/**
 * File: src/components/CardEditor/Layout/LeftSidebar.jsx
 * Purpose: Container component for left sidebar
 * Dependencies:
 *   - React
 * 
 * This component serves as a container for the left sidebar content.
 */

import React from 'react';
import '../CardEditor/CardEditor.css';

const LeftSidebar = ({ children }) => {
  return (
    <div className="sidebar left-sidebar">
      {children}
    </div>
  );
};

export default LeftSidebar;