import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const SiteSettingsContext = createContext(null);

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};

const initialSettings = {
  homePage: {
    characterImages: [],
    redStripImage: '',
    backgroundImage: '',
  },
  sectionBackgrounds: {
    home: { pc: '', mobile: '' },
    projects: { pc: '', mobile: '' },
    experience: { pc: '', mobile: '' },
    contact: { pc: '', mobile: '' },
  },
  contactLinks: {
    email: 'muhammad.haider@example.com',
    linkedin: 'https://linkedin.com/in/muhammadhaider',
    artstation: 'https://artstation.com/muhammadhaider',
    phone: '+1234567890',
  },
  experienceSettings: {
    lengthToYearRatio: 10, 
  }
};

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('siteSettings');
      try {
        return saved ? JSON.parse(saved) : initialSettings;
      } catch (error) {
        console.error("Error parsing siteSettings from localStorage:", error);
        return initialSettings;
      }
    }
    return initialSettings;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('siteSettings', JSON.stringify(settings));
    }
  }, [settings]);

  const updateSettings = useCallback((category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  }, []);
  
  const updateMultipleSettings = useCallback((category, updates) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        ...updates
      }
    }));
  }, []);

  const updateSectionBackground = useCallback((section, device, url) => {
    setSettings(prev => ({
      ...prev,
      sectionBackgrounds: {
        ...prev.sectionBackgrounds,
        [section]: {
          ...prev.sectionBackgrounds[section],
          [device]: url,
        },
      },
    }));
  }, []);

  const resetAllSiteSettings = useCallback(() => {
    setSettings(initialSettings);
    if (typeof window !== 'undefined') {
      localStorage.setItem('siteSettings', JSON.stringify(initialSettings));
    }
  }, []);

  const contextValue = useMemo(() => ({
    settings,
    updateSettings,
    updateSectionBackground,
    updateMultipleSettings,
    resetAllSiteSettings
  }), [settings, updateSettings, updateSectionBackground, updateMultipleSettings, resetAllSiteSettings]);

  return (
    <SiteSettingsContext.Provider value={contextValue}>
      {children}
    </SiteSettingsContext.Provider>
  );
};