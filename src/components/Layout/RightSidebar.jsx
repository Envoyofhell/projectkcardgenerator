/**
 * File: src/components/CardEditor/Layout/RightSidebar.jsx
 * Purpose: Container component for right sidebar
 * Dependencies:
 *   - React
 * 
 * This component serves as a container for the right sidebar content.
 */

import React from 'react';
import '../CardEditor/CardEditor.css';

const RightSidebar = ({ children }) => {
  return (
    <div className="sidebar right-sidebar">
      {children}
    </div>
  );
};

export default RightSidebar;