import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Check, Palette as PaletteIcon } from 'lucide-react';
import { useColors } from '@/contexts/ColorContext';
import { useToast } from '@/components/ui/use-toast';

const ColorPaletteManager = () => {
  const { currentPalette, getAllPalettes, updatePalette, addCustomPalette, removeCustomPalette, defaultPalettes } = useColors();
  const { toast } = useToast();
  
  const initialNewPalette = {
    name: '',
    primary: '#FF0000', // Red
    secondary: '#008000', // Green
    highValue: '#808080', // Gray
    lowValue: '#FFFFFF', // White
  };
  const [newPalette, setNewPalette] = useState(initialNewPalette);

  const handleAddPalette = (e) => {
    e.preventDefault();
    if (!newPalette.name.trim()) {
      toast({ title: "Error", description: "Please enter a palette name.", duration: 3000 });
      return;
    }
    addCustomPalette(newPalette);
    setNewPalette(initialNewPalette);
    toast({ title: "Palette Added", description: "New color palette created.", duration: 3000 });
  };

  const handleSelectPalette = (palette) => {
    updatePalette(palette);
    toast({ title: "Palette Applied", description: `${palette.name} is now active.`, duration: 3000 });
  };

  const handleRemovePalette = (paletteNameToRemove) => {
    const paletteIndex = getAllPalettes().findIndex(p => p.name === paletteNameToRemove) - defaultPalettes.length;
    if (paletteIndex >= 0) {
      removeCustomPalette(paletteIndex);
      toast({ title: "Palette Removed", description: "Custom palette deleted.", duration: 3000 });
    }
  };

  const colorFields = [
    { id: 'primary', label: 'Primary Color (e.g., Red)' },
    { id: 'secondary', label: 'Secondary Color (e.g., Green)' },
    { id: 'highValue', label: 'High Value Text/Highlight (e.g., Gray)' },
    { id: 'lowValue', label: 'Low Value Background (e.g., White)' },
  ];

  return (
    <div className="space-y-8 text-color-high-value">
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
          <PaletteIcon size={24} />
          <span>Color Palette Manager</span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Available Palettes</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
              {getAllPalettes().map((palette, index) => (
                <motion.div
                  key={`${palette.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer`}
                  style={{
                    borderColor: currentPalette.name === palette.name ? 'var(--color-primary)' : 'var(--color-high-value)',
                    backgroundColor: currentPalette.name === palette.name ? 'rgba(var(--color-primary-rgb), 0.1)' : 'transparent'
                  }}
                  onClick={() => handleSelectPalette(palette)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{palette.name}</h4>
                    <div className="flex items-center space-x-2">
                      {currentPalette.name === palette.name && (
                        <Check className="text-green-400" size={18} />
                      )}
                      {index >= defaultPalettes.length && ( // Only allow removing custom palettes
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePalette(palette.name);
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {['primary', 'secondary', 'highValue', 'lowValue'].map(colorKey => (
                       <div key={colorKey} className="flex flex-col items-center">
                        <div
                          className="w-8 h-8 rounded-full border-2"
                          style={{ backgroundColor: palette[colorKey], borderColor: 'var(--color-high-value)' }}
                          title={colorKey.charAt(0).toUpperCase() + colorKey.slice(1)}
                        ></div>
                         <span className="text-xs mt-1 opacity-70">{colorKey.charAt(0).toUpperCase()}</span>
                       </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Create New Palette</h3>
            <form onSubmit={handleAddPalette} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">Palette Name</label>
                <input
                  type="text"
                  value={newPalette.name}
                  onChange={(e) => setNewPalette({ ...newPalette, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border rounded-lg placeholder-white/30 focus:outline-none focus:border-color-primary transition-colors"
                  style={{ borderColor: 'var(--color-high-value)', color: 'var(--text-high-value)' }}
                  placeholder="Enter palette name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {colorFields.map(field => (
                  <div key={field.id}>
                    <label className="block mb-1 text-sm">{field.label}</label>
                    <div className="relative">
                      <input
                        type="color"
                        value={newPalette[field.id]}
                        onChange={(e) => setNewPalette({ ...newPalette, [field.id]: e.target.value })}
                        className="w-full h-10 rounded-lg border bg-transparent cursor-pointer"
                        style={{ borderColor: 'var(--color-high-value)' }}
                      />
                      <input
                        type="text"
                        value={newPalette[field.id]}
                        onChange={(e) => setNewPalette({ ...newPalette, [field.id]: e.target.value })}
                        className="w-full mt-1 px-2 py-1 bg-white/5 border rounded text-xs focus:outline-none focus:border-color-primary"
                        style={{ borderColor: 'var(--color-high-value)', color: 'var(--text-high-value)' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <motion.button
                type="submit"
                className="w-full btn-primary px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover-glow flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={18} />
                <span>Add Palette</span>
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPaletteManager;