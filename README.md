markdown# Pokémon Card Maker - Enhanced Dual Type Edition

A modern web application for creating custom Pokémon cards with support for dual-type cards, custom masks, and interactive editing.

## Features

- Create custom Pokémon cards with all standard fields
- Dual-type support with customizable type masks
- Interactive drag-and-drop layer management
- Card templates for quick start
- Multiple export options (PNG, card sheets)
- Live preview with Fabric.js canvas engine
- Animated Three.js background

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or pnpm package manager

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/pokemon-card-maker.git
   cd pokemon-card-maker

Install dependencies
bashnpm install
# or using pnpm
pnpm install

Start the development server
bashnpm start
# or using pnpm
pnpm start

Open your browser to http://localhost:5173

Project Structure
The application follows a modern React application structure:

src/components - React components
src/store - Zustand state management
src/services - Service modules for card operations
src/utils - Utility functions and data
src/assets - Static assets (images, backgrounds, etc.)

Built With

React - UI framework
Fabric.js - Canvas manipulation
Zustand - State management
Three.js - 3D background effects
html2canvas - HTML to canvas export
react-beautiful-dnd - Drag and drop for layers

Acknowledgments

Pokémon is a trademark of Nintendo, Game Freak, and The Pokémon Company
This project is for educational and personal use only
Original dual-type-cardmaker project for inspiration

License
This project is licensed under the MIT License - see the LICENSE file for details.

# File 39: vite.config.js

```javascript
/**
 * File: vite.config.js
 * Purpose: Vite configuration for the application
 * Dependencies:
 *   - vite
 *   - @vitejs/plugin-react
 * 
 * This file configures the Vite build system for the application.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@store': path.resolve(__dirname, './src/store'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
      },
    },
  },
});