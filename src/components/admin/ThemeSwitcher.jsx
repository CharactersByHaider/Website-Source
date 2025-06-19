import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useColors } from '@/contexts/ColorContext';
import { useToast } from '@/components/ui/use-toast';

const ThemeSwitcher = () => {
  const { themeMode, switchThemeMode, currentPalette } = useColors();
  const { toast } = useToast();

  const handleSwitchTheme = () => {
    switchThemeMode();
    toast({
      title: "Theme Switched",
      description: `Theme is now ${themeMode === 'default' ? 'Black on White' : 'White on Black'}.`,
      duration: 3000,
    });
  };

  return (
    <div className="space-y-8 text-color-high-value">
      <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
        <RefreshCw size={24} />
        <span>Theme Mode Switcher</span>
      </h2>
      <div className="p-6 rounded-lg" style={{ backgroundColor: `rgba(var(--color-primary-rgb), 0.05)`}}>
        <p className="mb-4">
          Current Mode: <span className="font-semibold" style={{color: 'var(--text-primary)'}}>{themeMode === 'default' ? 'Default (High Value Text on Low Value Background)' : 'Switched (Low Value Text on High Value Background)'}</span>
        </p>
        <button
          onClick={handleSwitchTheme}
          className="btn-primary px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover-glow flex items-center justify-center space-x-2"
        >
          Switch to {themeMode === 'default' ? 'Switched Mode' : 'Default Mode'}
        </button>
        <p className="text-xs mt-2 opacity-70">
          This swaps the High Value (Text/Highlight) and Low Value (Background) colors.
        </p>
      </div>
    </div>
  );
};

export default ThemeSwitcher;