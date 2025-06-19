import React from 'react';
import { useColors } from '@/contexts/ColorContext';

const Footer = () => {
  const { currentPalette } = useColors();
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="py-6 text-center"
      style={{ 
        backgroundColor: `rgba(${currentPalette.primary === '#FF0000' ? '255,0,0' : '128,128,128'}, 0.1)`, // Slight primary color tint
        color: currentPalette.highValue 
      }}
    >
      <div className="container mx-auto px-4">
        <p className="text-sm">
          &copy; {currentYear} Muhammad Haider. All rights reserved.
        </p>
        <p className="text-xs mt-1 opacity-75">
          Portfolio Website
        </p>
      </div>
    </footer>
  );
};

export default Footer;