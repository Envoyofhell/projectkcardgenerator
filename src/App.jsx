/**
 * File: src/App.jsx
 * Purpose: Main application component
 * Dependencies:
 *   - React
 *   - CardEditor component
 *   - App styles
 */

import React from 'react';
import CardEditor from './components/CardEditor/CardEditor';
import './App.css';

const App = () => {
  return (
    <div className="app">
      {/* Background element for Three.js */}
      <div id="threejs-bg"></div>
      
      <header className="app-header">
        <h1>Pokémon Card Maker</h1>
        <p className="subtitle">Create custom dual-type Pokémon cards</p>
      </header>
      
      <main className="app-main">
        <CardEditor />
      </main>
      
      <footer className="app-footer">
        <p>
          Pokémon Card Maker - Enhanced Dual-Type Edition
          <br />
          <small>Pokémon and its trademarks are ©Nintendo, Game Freak, and The Pokémon Company</small>
        </p>
      </footer>
    </div>
  );
};

export default App;