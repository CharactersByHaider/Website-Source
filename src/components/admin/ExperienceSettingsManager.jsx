import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Plus, Trash2, Edit } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useToast } from '@/components/ui/use-toast';
import { useColors } from '@/contexts/ColorContext';

const ExperienceSettingsManager = () => {
  const { settings, updateSettings } = useSiteSettings();
  const { toast } = useToast();
  const { currentPalette } = useColors();

  const [experiences, setExperiences] = useState(() => {
    const saved = localStorage.getItem('experiences'); 
    return saved ? JSON.parse(saved) : [];
  });
  const [lengthToYearRatio, setLengthToYearRatio] = useState(settings.experienceSettings?.lengthToYearRatio || 10);
  
  const [editingExperience, setEditingExperience] = useState(null);
  const [newExperience, setNewExperience] = useState({
    title: '', company: '', period: '', location: '', description: '', achievements: [''], years: 1
  });

  const handleSaveSettings = () => {
    updateSettings('experienceSettings', 'lengthToYearRatio', Number(lengthToYearRatio));
    localStorage.setItem('experiences', JSON.stringify(experiences));
    toast({ title: "Experience Settings Saved", description: "Configuration and entries updated.", duration: 3000 });
  };

  const handleAddExperience = () => {
    if (!newExperience.title) {
      toast({ title: "Error", description: "Title is required for new experience.", duration: 2000});
      return;
    }
    setExperiences(prev => [...prev, { ...newExperience, id: Date.now(), achievements: newExperience.achievements.filter(a => a.trim() !== '') }]);
    setNewExperience({ title: '', company: '', period: '', location: '', description: '', achievements: [''], years: 1 });
  };

  const handleUpdateExperience = () => {
    if (!editingExperience.title) {
       toast({ title: "Error", description: "Title is required for experience.", duration: 2000});
      return;
    }
    setExperiences(prev => prev.map(exp => exp.id === editingExperience.id ? {...editingExperience, achievements: editingExperience.achievements.filter(a => a.trim() !== '')} : exp));
    setEditingExperience(null);
  };

  const handleRemoveExperience = (id) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id));
  };
  
  const addAchievementField = (isEditing = false) => {
    if (isEditing) {
      setEditingExperience(prev => ({ ...prev, achievements: [...prev.achievements, '']}));
    } else {
      setNewExperience(prev => ({ ...prev, achievements: [...prev.achievements, '']}));
    }
  };

  const removeAchievementField = (index, isEditing = false) => {
     if (isEditing) {
      setEditingExperience(prev => ({ ...prev, achievements: prev.achievements.filter((_, i) => i !== index)}));
    } else {
      setNewExperience(prev => ({ ...prev, achievements: prev.achievements.filter((_, i) => i !== index)}));
    }
  };
  
  const updateAchievement = (index, value, isEditing = false) => {
    if (isEditing) {
      setEditingExperience(prev => ({ ...prev, achievements: prev.achievements.map((ach, i) => i === index ? value : ach)}));
    } else {
      setNewExperience(prev => ({ ...prev, achievements: prev.achievements.map((ach, i) => i === index ? value : ach)}));
    }
  };

  const ExperienceForm = ({ experienceData, setExperienceData, onSave, formTitle, isEditing }) => (
    <div className="space-y-3 p-4 rounded-md" style={{ border: `1px solid rgba(var(--color-primary-rgb),0.3)`}}>
      <h4 className="text-lg font-medium">{formTitle}</h4>
      <input type="text" placeholder="Title" value={experienceData.title} onChange={e => setExperienceData({...experienceData, title: e.target.value})} className="w-full input-admin" />
      <input type="text" placeholder="Company" value={experienceData.company} onChange={e => setExperienceData({...experienceData, company: e.target.value})} className="w-full input-admin" />
      <input type="text" placeholder="Period (e.g., 2020-Present)" value={experienceData.period} onChange={e => setExperienceData({...experienceData, period: e.target.value})} className="w-full input-admin" />
      <input type="text" placeholder="Location" value={experienceData.location} onChange={e => setExperienceData({...experienceData, location: e.target.value})} className="w-full input-admin" />
      <textarea placeholder="Description" value={experienceData.description} onChange={e => setExperienceData({...experienceData, description: e.target.value})} className="w-full input-admin" rows="3" style={{ whiteSpace: 'pre-wrap' }} />
      <input type="number" placeholder="Duration in Years (for visual length)" value={experienceData.years} onChange={e => setExperienceData({...experienceData, years: Number(e.target.value)})} className="w-full input-admin" min="0.1" step="0.1" />
      <div>
        <label className="block text-sm mb-1">Achievements:</label>
        {experienceData.achievements.map((ach, idx) => (
          <div key={idx} className="flex items-center space-x-2 mb-1">
            <input type="text" value={ach} onChange={e => updateAchievement(idx, e.target.value, isEditing)} className="w-full input-admin text-sm" placeholder={`Achievement ${idx + 1}`} />
            {experienceData.achievements.length > 1 && <button onClick={() => removeAchievementField(idx, isEditing)} className="text-red-500 text-xs">Remove</button>}
          </div>
        ))}
        <button onClick={() => addAchievementField(isEditing)} className="text-color-secondary text-xs mt-1">Add Achievement</button>
      </div>
      <button onClick={onSave} className="btn-secondary px-3 py-1.5 rounded text-sm">{isEditing ? "Update Experience" : "Add Experience"}</button>
      {isEditing && <button onClick={() => setEditingExperience(null)} className="ml-2 px-3 py-1.5 rounded text-sm border border-color-high-value">Cancel</button>}
    </div>
  );

  return (
    <div className="space-y-8 text-color-high-value">
      <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
        <Settings size={24} />
        <span>Experience Section Configuration</span>
      </h2>

      <div className="p-6 rounded-lg" style={{ backgroundColor: `rgba(var(--color-primary-rgb), 0.05)`}}>
        <h3 className="text-xl font-semibold mb-4">Display Settings</h3>
        <div>
          <label className="block mb-1 text-sm">Length-to-Year Ratio (px per year)</label>
          <input type="number" value={lengthToYearRatio} onChange={(e) => setLengthToYearRatio(e.target.value)} className="w-full md:w-1/3 input-admin" />
          <p className="text-xs mt-1 opacity-60">Controls the visual length of experience items on the timeline based on years.</p>
        </div>
      </div>

      <div className="p-6 rounded-lg" style={{ backgroundColor: `rgba(var(--color-primary-rgb), 0.05)`}}>
        <h3 className="text-xl font-semibold mb-4">Manage Experience Entries</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium mb-2">Existing Experiences</h4>
            {experiences.length === 0 && <p className="text-sm opacity-70">No experiences added yet.</p>}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {experiences.map(exp => (
                <div key={exp.id} className="p-3 rounded-md border" style={{borderColor: `rgba(var(--color-primary-rgb),0.2)`}}>
                  <p className="font-semibold">{exp.title} at {exp.company}</p>
                  <p className="text-xs opacity-70">{exp.period} - {exp.years} years</p>
                  <div className="mt-1 space-x-2">
                    <button onClick={() => setEditingExperience(exp)} className="text-blue-500 hover:text-blue-700 text-xs"><Edit size={14}/></button>
                    <button onClick={() => handleRemoveExperience(exp.id)} className="text-red-500 hover:text-red-700 text-xs"><Trash2 size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            {editingExperience ? (
              <ExperienceForm experienceData={editingExperience} setExperienceData={setEditingExperience} onSave={handleUpdateExperience} formTitle="Edit Experience" isEditing={true} />
            ) : (
              <ExperienceForm experienceData={newExperience} setExperienceData={setNewExperience} onSave={handleAddExperience} formTitle="Add New Experience" isEditing={false} />
            )}
          </div>
        </div>
      </div>
       <style jsx>{`
        .input-admin {
          background-color: rgba(var(--color-low-value-rgb, 255,255,255), 0.1);
          border: 1px solid rgba(var(--color-high-value-rgb, 128,128,128), 0.3);
          color: var(--text-high-value);
          padding: 0.5rem 0.75rem;
          border-radius: 0.375rem;
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
        onClick={handleSaveSettings}
        className="w-full btn-primary px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover-glow flex items-center justify-center space-x-2 mt-8"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Save size={18} />
        <span>Save Experience Settings & Entries</span>
      </motion.button>
    </div>
  );
};

export default ExperienceSettingsManager;