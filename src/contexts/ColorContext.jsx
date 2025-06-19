import React, { createContext, useContext, useState, useEffect } from 'react';

const ColorContext = createContext();

export const useColors = () => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useColors must be used within a ColorProvider');
  }
  return context;
};

const defaultPalette = {
  name: 'Default Red Theme',
  primary: '#FF0000', // Red
  secondary: '#008000', // Green
  highValue: '#808080', // Gray
  lowValue: '#FFFFFF', // White
};

const defaultPalettes = [defaultPalette];

export const ColorProvider = ({ children }) => {
  const [currentPalette, setCurrentPalette] = useState(() => {
    const saved = localStorage.getItem('colorPalette');
    return saved ? JSON.parse(saved) : defaultPalette;
  });

  const [customPalettes, setCustomPalettes] = useState(() => {
    const saved = localStorage.getItem('customPalettes');
    return saved ? JSON.parse(saved) : [];
  });

  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'default'; // 'default' or 'switched'
  });

  useEffect(() => {
    const primary = currentPalette.primary;
    const secondary = currentPalette.secondary;
    let highValue = currentPalette.highValue;
    let lowValue = currentPalette.lowValue;

    if (themeMode === 'switched') {
      [highValue, lowValue] = [lowValue, highValue];
    }
    
    document.documentElement.style.setProperty('--color-primary', primary);
    document.documentElement.style.setProperty('--color-secondary', secondary);
    document.documentElement.style.setProperty('--color-high-value', highValue);
    document.documentElement.style.setProperty('--color-low-value', lowValue);
    
    document.documentElement.style.setProperty('--text-high-value', highValue);
    document.documentElement.style.setProperty('--bg-low-value', lowValue);
    document.documentElement.style.setProperty('--text-primary', primary);


    const primaryRGB = primary.match(/\w\w/g).map(x => parseInt(x, 16)).join(',');
    document.documentElement.style.setProperty('--color-primary-rgb', primaryRGB);
    
    localStorage.setItem('colorPalette', JSON.stringify(currentPalette));
    localStorage.setItem('themeMode', themeMode);

  }, [currentPalette, themeMode]);

  useEffect(() => {
    localStorage.setItem('customPalettes', JSON.stringify(customPalettes));
  }, [customPalettes]);

  const updatePalette = (palette) => {
    setCurrentPalette(palette);
  };

  const addCustomPalette = (palette) => {
    setCustomPalettes(prev => [...prev, palette]);
  };

  const removeCustomPalette = (index) => {
    setCustomPalettes(prev => prev.filter((_, i) => i !== index));
  };

  const getAllPalettes = () => [...defaultPalettes, ...customPalettes];

  const switchThemeMode = () => {
    setThemeMode(prev => prev === 'default' ? 'switched' : 'default');
  };

  return (
    <ColorContext.Provider value={{
      currentPalette,
      updatePalette,
      addCustomPalette,
      removeCustomPalette,
      getAllPalettes,
      defaultPalettes,
      customPalettes,
      themeMode,
      switchThemeMode,
    }}>
      {children}
    </ColorContext.Provider>
  );
};