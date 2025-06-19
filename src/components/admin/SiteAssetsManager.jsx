
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Save, UploadCloud, Trash2 } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useToast } from '@/components/ui/use-toast';
import { useColors } from '@/contexts/ColorContext';

const sectionsForBackgrounds = ['home', 'projects', 'experience', 'contact'];

const SiteAssetsManager = () => {
  const { settings, updateSettings, updateSectionBackground, updateMultipleSettings } = useSiteSettings();
  const { toast } = useToast();
  const { currentPalette } = useColors();

  const [homePageAssets, setHomePageAssets] = useState(settings.homePage || { characterImages: [], redStripImage: '', backgroundImage: '' });
  const [sectionBackgrounds, setSectionBackgrounds] = useState(settings.sectionBackgrounds || { home: {}, projects: {}, experience: {}, contact: {} });

  const fileInputRefs = useRef({
    homeBackground: React.createRef(),
    homeRedStrip: React.createRef(),
    homeCharacter: (settings.homePage?.characterImages || []).map(() => React.createRef()),
    sectionBgs: sectionsForBackgrounds.reduce((acc, section) => {
      acc[`${section}_pc`] = React.createRef();
      acc[`${section}_mobile`] = React.createRef();
      return acc;
    }, {})
  });


  const handleFileUpload = (file, callback) => {
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({ title: "File Too Large", description: "Please upload images smaller than 2MB.", variant: "destructive", duration: 4000 });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHomePageAssetChange = (key, value, index = -1, isFileUpload = false) => {
    if (isFileUpload) {
      handleFileUpload(value, (base64) => {
        if (key === 'characterImages') {
          const updatedImages = [...homePageAssets.characterImages];
          if (index >= 0 && index < updatedImages.length) {
            updatedImages[index] = base64;
          }
          setHomePageAssets(prev => ({ ...prev, characterImages: updatedImages }));
        } else {
          setHomePageAssets(prev => ({ ...prev, [key]: base64 }));
        }
      });
    } else {
       if (key === 'characterImages') {
        const updatedImages = [...homePageAssets.characterImages];
        if (index >= 0 && index < updatedImages.length) {
          updatedImages[index] = value;
        }
        setHomePageAssets(prev => ({ ...prev, characterImages: updatedImages }));
      } else {
        setHomePageAssets(prev => ({ ...prev, [key]: value }));
      }
    }
  };

  const addCharacterImageField = () => {
    fileInputRefs.current.homeCharacter.push(React.createRef());
    setHomePageAssets(prev => ({ ...prev, characterImages: [...prev.characterImages, ''] }));
  };

  const removeCharacterImageField = (index) => {
    fileInputRefs.current.homeCharacter.splice(index, 1);
    setHomePageAssets(prev => ({ ...prev, characterImages: prev.characterImages.filter((_, i) => i !== index) }));
  };

  const handleSectionBgChange = (section, device, value, isFileUpload = false) => {
    if (isFileUpload) {
      handleFileUpload(value, (base64) => {
        setSectionBackgrounds(prev => ({
          ...prev,
          [section]: { ...prev[section], [device]: base64 }
        }));
      });
    } else {
      setSectionBackgrounds(prev => ({
        ...prev,
        [section]: { ...prev[section], [device]: value }
      }));
    }
  };

  const handleSave = () => {
    updateMultipleSettings('homePage', homePageAssets);
    Object.keys(sectionBackgrounds).forEach(section => {
      if (sectionBackgrounds[section].pc) updateSectionBackground(section, 'pc', sectionBackgrounds[section].pc);
      if (sectionBackgrounds[section].mobile) updateSectionBackground(section, 'mobile', sectionBackgrounds[section].mobile);
    });
    toast({ title: "Assets Updated", description: "Site assets saved successfully.", duration: 3000 });
  };
  
  const renderImageInput = (label, value, onChangeUrl, onChangeFile, fileInputRefCurrent, placeholder) => (
    <div>
      <label className="block mb-1 text-sm">{label}</label>
      <div className="flex items-center space-x-2">
        <input type="url" value={value && value.startsWith('http') ? value : ''} onChange={(e) => onChangeUrl(e.target.value)} className="w-full input-admin" placeholder={`${placeholder} URL`} />
        <button type="button" onClick={() => fileInputRefCurrent && fileInputRefCurrent.current && fileInputRefCurrent.current.click()} className="btn-secondary p-2 rounded-md">
          <UploadCloud size={18} />
        </button>
        <input type="file" accept="image/*" ref={fileInputRefCurrent} onChange={(e) => onChangeFile(e.target.files[0])} className="hidden" />
      </div>
      {value && !value.startsWith('http') && value.length > 50 && (
        <div className="mt-2 flex items-center space-x-2">
          <img src={value} alt="Preview" className="h-10 w-10 object-cover rounded" />
          <span className="text-xs opacity-70">Uploaded: {value.substring(0,30)}...</span>
        </div>
      )}
    </div>
  );


  return (
    <div className="space-y-8 text-color-high-value">
      <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
        <ImageIcon size={24} />
        <span>Site Assets Manager</span>
      </h2>

      <div className="p-6 rounded-lg" style={{ backgroundColor: `rgba(var(--color-primary-rgb), 0.05)`}}>
        <h3 className="text-xl font-semibold mb-4">Home Page Assets</h3>
        <div className="space-y-4">
          {renderImageInput("Background Image", homePageAssets.backgroundImage, 
            (val) => handleHomePageAssetChange('backgroundImage', val),
            (file) => handleHomePageAssetChange('backgroundImage', file, -1, true),
            fileInputRefs.current.homeBackground, "Home page background"
          )}
          {renderImageInput("Red Strip Image (Middle Accent)", homePageAssets.redStripImage,
            (val) => handleHomePageAssetChange('redStripImage', val),
            (file) => handleHomePageAssetChange('redStripImage', file, -1, true),
            fileInputRefs.current.homeRedStrip, "Red strip image"
          )}
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm">Character Images (for 3D hover effect)</label>
              <button onClick={addCharacterImageField} className="btn-secondary text-xs px-2 py-1 rounded">Add Image</button>
            </div>
            {homePageAssets.characterImages.map((imgUrl, index) => {
              if (!fileInputRefs.current.homeCharacter[index]) {
                fileInputRefs.current.homeCharacter[index] = React.createRef();
              }
              return (
              <div key={index} className="mb-2">
                {renderImageInput(`Character Image ${index + 1}`, imgUrl,
                  (val) => handleHomePageAssetChange('characterImages', val, index),
                  (file) => handleHomePageAssetChange('characterImages', file, index, true),
                  fileInputRefs.current.homeCharacter[index], `Character image ${index + 1}`
                )}
                <button onClick={() => removeCharacterImageField(index)} className="text-red-500 hover:text-red-700 text-xs p-1 rounded mt-1 flex items-center"><Trash2 size={12} className="mr-1"/>Remove</button>
              </div>
            )})}
            {homePageAssets.characterImages.length === 0 && <p className="text-xs opacity-70">Add at least one image for the character display.</p>}
             <p className="text-xs mt-1 opacity-60">For 3D effect: Provide multiple images from different angles. If one image, it will be static.</p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-lg" style={{ backgroundColor: `rgba(var(--color-primary-rgb), 0.05)`}}>
        <h3 className="text-xl font-semibold mb-4">Section Backgrounds</h3>
        <div className="space-y-6">
          {sectionsForBackgrounds.map(section => (
            <div key={section}>
              <h4 className="text-lg font-medium mb-2 capitalize">{section} Section</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {renderImageInput("PC Background", sectionBackgrounds[section]?.pc || '',
                  (val) => handleSectionBgChange(section, 'pc', val),
                  (file) => handleSectionBgChange(section, 'pc', file, true),
                  fileInputRefs.current.sectionBgs[`${section}_pc`], "PC background"
                )}
                <p className="text-xs mt-1 opacity-60 md:col-span-2">Recommended Aspect Ratio for PC: 16:9</p>
                
                {renderImageInput("Mobile Background", sectionBackgrounds[section]?.mobile || '',
                  (val) => handleSectionBgChange(section, 'mobile', val),
                  (file) => handleSectionBgChange(section, 'mobile', file, true),
                  fileInputRefs.current.sectionBgs[`${section}_mobile`], "Mobile background"
                )}
                <p className="text-xs mt-1 opacity-60 md:col-span-2">Recommended Aspect Ratio for Mobile: 9:16</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .input-admin {
          background-color: rgba(var(--color-low-value-rgb, 255,255,255), 0.1);
          border: 1px solid rgba(var(--color-high-value-rgb, 128,128,128), 0.3);
          color: var(--text-high-value);
          padding: 0.5rem 0.75rem;
          border-radius: 0.375rem;
          flex-grow: 1;
        }
        .input-admin:focus {
          outline: none;
          border-color: var(--color-primary);
        }
        .input-admin::placeholder {
          color: rgba(var(--color-high-value-rgb, 128,128,128), 0.5);
        }
      `}</style>
      
      <motion.button
        onClick={handleSave}
        className="w-full btn-primary px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover-glow flex items-center justify-center space-x-2 mt-8"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Save size={18} />
        <span>Save All Assets</span>
      </motion.button>
    </div>
  );
};

export default SiteAssetsManager;
