
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, X, UploadCloud } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ProjectManagerForm = ({ projectData, setProjectData, onSave, onCancel, isEditing, formTitle }) => {
  const { toast } = useToast();
  
  const imageFileInputRefs = useRef([]);
  if (!projectData.images) {
    projectData.images = []; 
  }
  if (imageFileInputRefs.current.length !== projectData.images.length) {
    imageFileInputRefs.current = Array(projectData.images.length).fill(null).map((_, i) => imageFileInputRefs.current[i] || React.createRef());
  }
  
  const handleChange = (key, value) => {
    setProjectData(prev => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (index, value, isFileUpload = false) => {
    if (isFileUpload) {
      const file = value;
      if (file) {
        if (file.size > 2 * 1024 * 1024) { 
          toast({ title: "File Too Large", description: "Please upload images smaller than 2MB.", variant: "destructive", duration: 4000 });
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          const images = [...projectData.images];
          images[index] = reader.result;
          setProjectData(prev => ({ ...prev, images }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      const images = [...projectData.images];
      images[index] = value;
      setProjectData(prev => ({ ...prev, images }));
    }
  };

  const addImageField = () => {
    imageFileInputRefs.current.push(React.createRef());
    setProjectData(prev => ({ ...prev, images: [...(prev.images || []), ''] }));
  };

  const removeImageField = (index) => {
    imageFileInputRefs.current.splice(index, 1);
    setProjectData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleTextSectionChange = (index, field, value) => {
    const textSections = [...projectData.textSections];
    if (field === 'content') {
      textSections[index].content = value;
    } else { 
      textSections[index].position = { ...textSections[index].position, [field]: value };
    }
    setProjectData(prev => ({ ...prev, textSections }));
  };

  const addTextSectionField = () => {
    setProjectData(prev => ({ ...prev, textSections: [...(prev.textSections || []), { content: '', position: { x: 0, y: 0 } }] }));
  };

  const removeTextSectionField = (index) => {
    setProjectData(prev => ({ ...prev, textSections: prev.textSections.filter((_, i) => i !== index) }));
  };

  return (
    <div className="space-y-4 bg-white/5 border border-white/20 rounded-lg p-4 text-color-high-value">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{formTitle}</h3>
        {isEditing && (
          <button onClick={onCancel} className="text-white/70 hover:text-white transition-colors"><X size={18} /></button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Project Title</label>
          <input type="text" value={projectData.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full input-admin" placeholder="Enter project title" />
        </div>
        <div>
          <label className="block text-sm mb-1">Layout Position</label>
          <select value={projectData.layout} onChange={(e) => handleChange('layout', e.target.value)} className="w-full input-admin">
            <option value="left">Image Left, Text Right</option>
            <option value="right">Image Right, Text Left</option>
            <option value="center">Image Center, Text Below/Around</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea value={projectData.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} className="w-full input-admin" placeholder="Enter project description" style={{ whiteSpace: 'pre-wrap' }} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm">Images</label>
          <button type="button" onClick={addImageField} className="text-xs flex items-center space-x-1" style={{color: 'var(--color-secondary)'}}><Plus size={14} /><span>Add</span></button>
        </div>
        {(projectData.images || []).map((image, index) => {
          if (!imageFileInputRefs.current[index]) {
            imageFileInputRefs.current[index] = React.createRef();
          }
          return (
          <div key={index} className="space-y-1 mb-2">
            <div className="flex space-x-2">
              <input type="url" value={image && image.startsWith('http') ? image : ''} onChange={(e) => handleImageChange(index, e.target.value)} className="flex-1 input-admin text-sm" placeholder="Image URL" />
              <button type="button" onClick={() => imageFileInputRefs.current[index] && imageFileInputRefs.current[index].current && imageFileInputRefs.current[index].current.click()} className="btn-secondary p-1.5 rounded-md text-xs"><UploadCloud size={14} /></button>
              <input type="file" accept="image/*" ref={imageFileInputRefs.current[index]} onChange={(e) => handleImageChange(index, e.target.files[0], true)} className="hidden" />
              {(projectData.images || []).length > 1 && <button type="button" onClick={() => removeImageField(index)} className="text-red-500 text-xs p-1"><Trash2 size={14} /></button>}
            </div>
            {image && !image.startsWith('http') && image.length > 50 && (
              <div className="flex items-center space-x-1">
                <img src={image} alt="Preview" className="h-8 w-8 object-cover rounded" />
                <span className="text-xs opacity-60">Uploaded: {image.substring(0,25)}...</span>
              </div>
            )}
          </div>
        )})}
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm">Text Sections</label>
          <button type="button" onClick={addTextSectionField} className="text-xs flex items-center space-x-1" style={{color: 'var(--color-secondary)'}}><Plus size={14} /><span>Add</span></button>
        </div>
        {(projectData.textSections || []).map((section, index) => (
          <div key={index} className="p-2 border rounded-md mb-2" style={{borderColor: 'rgba(var(--color-primary-rgb),0.2)'}}>
            <div className="flex justify-end"><button type="button" onClick={() => removeTextSectionField(index)} className="text-red-500 text-xs p-1"><Trash2 size={14} /></button></div>
            <textarea value={section.content} onChange={(e) => handleTextSectionChange(index, 'content', e.target.value)} rows={2} className="w-full input-admin text-sm mb-1" placeholder="Text content" style={{ whiteSpace: 'pre-wrap' }} />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs mb-0.5">X Pos (0-100)</label>
                <input type="number" min="0" max="100" value={section.position.x} onChange={(e) => handleTextSectionChange(index, 'x', parseInt(e.target.value) || 0)} className="w-full input-admin text-xs" />
              </div>
              <div>
                <label className="block text-xs mb-0.5">Y Pos (0-100)</label>
                <input type="number" min="0" max="100" value={section.position.y} onChange={(e) => handleTextSectionChange(index, 'y', parseInt(e.target.value) || 0)} className="w-full input-admin text-xs" />
              </div>
            </div>
          </div>
        ))}
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
      <motion.button onClick={onSave} className="w-full btn-primary px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center space-x-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Save size={16} />
        <span>{isEditing ? 'Update Project' : 'Add Project'}</span>
      </motion.button>
    </div>
  );
};

export default ProjectManagerForm;
