import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ContentEditor = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('about');
  
  const [content, setContent] = useState({
    about: {
      title: 'About Me',
      content: 'I am a passionate creative professional with expertise in design and development. My journey spans across various disciplines, always striving to create meaningful and impactful experiences.'
    },
    projects: {
      title: 'Featured Projects',
      subtitle: 'Showcasing my latest creative works and innovations'
    },
    experience: {
      title: 'Professional Experience',
      subtitle: 'My journey through creative and professional growth'
    },
    contact: {
      title: 'Get In Touch',
      subtitle: 'Let\'s create something amazing together',
      email: 'hello@portfolio.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY'
    }
  });

  useEffect(() => {
    const savedAbout = localStorage.getItem('aboutContent');
    const savedProjects = localStorage.getItem('projectsContent');
    const savedExperience = localStorage.getItem('experienceContent');
    const savedContact = localStorage.getItem('contactContent');

    if (savedAbout) {
      setContent(prev => ({ ...prev, about: JSON.parse(savedAbout) }));
    }
    if (savedProjects) {
      setContent(prev => ({ ...prev, projects: JSON.parse(savedProjects) }));
    }
    if (savedExperience) {
      setContent(prev => ({ ...prev, experience: JSON.parse(savedExperience) }));
    }
    if (savedContact) {
      setContent(prev => ({ ...prev, contact: JSON.parse(savedContact) }));
    }
  }, []);

  const handleSave = (section) => {
    localStorage.setItem(`${section}Content`, JSON.stringify(content[section]));
    toast({
      title: "Content Saved",
      description: `${section.charAt(0).toUpperCase() + section.slice(1)} section has been updated successfully.`,
      duration: 3000,
    });
  };

  const handleContentChange = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const sections = [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' }
  ];

  const inputClass = "w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg placeholder-white/50 focus:outline-none focus:border-color-primary transition-colors";
  const labelClass = "block mb-2";

  const renderSectionEditor = () => {
    switch (activeSection) {
      case 'about':
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass} style={{ color: 'var(--text-high-value)' }}>Section Title</label>
              <input
                type="text"
                value={content.about.title}
                onChange={(e) => handleContentChange('about', 'title', e.target.value)}
                className={inputClass}
                style={{ color: 'var(--text-high-value)' }}
              />
            </div>
            <div>
              <label className={labelClass} style={{ color: 'var(--text-high-value)' }}>Content</label>
              <textarea
                value={content.about.content}
                onChange={(e) => handleContentChange('about', 'content', e.target.value)}
                rows={6}
                className={`${inputClass} resize-none`}
                style={{ color: 'var(--text-high-value)', whiteSpace: 'pre-wrap' }}
              />
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass} style={{ color: 'var(--text-high-value)' }}>Section Title</label>
              <input
                type="text"
                value={content.projects.title}
                onChange={(e) => handleContentChange('projects', 'title', e.target.value)}
                className={inputClass}
                style={{ color: 'var(--text-high-value)' }}
              />
            </div>
            <div>
              <label className={labelClass} style={{ color: 'var(--text-high-value)' }}>Subtitle</label>
              <textarea
                value={content.projects.subtitle}
                onChange={(e) => handleContentChange('projects', 'subtitle', e.target.value)}
                rows={3}
                className={`${inputClass} resize-none`}
                style={{ color: 'var(--text-high-value)', whiteSpace: 'pre-wrap' }}
              />
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass} style={{ color: 'var(--text-high-value)' }}>Section Title</label>
              <input
                type="text"
                value={content.experience.title}
                onChange={(e) => handleContentChange('experience', 'title', e.target.value)}
                className={inputClass}
                style={{ color: 'var(--text-high-value)' }}
              />
            </div>
            <div>
              <label className={labelClass} style={{ color: 'var(--text-high-value)' }}>Subtitle</label>
              <textarea
                value={content.experience.subtitle}
                onChange={(e) => handleContentChange('experience', 'subtitle', e.target.value)}
                rows={3}
                className={`${inputClass} resize-none`}
                style={{ color: 'var(--text-high-value)', whiteSpace: 'pre-wrap' }}
              />
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass} style={{ color: 'var(--text-high-value)' }}>Section Title</label>
              <input
                type="text"
                value={content.contact.title}
                onChange={(e) => handleContentChange('contact', 'title', e.target.value)}
                className={inputClass}
                style={{ color: 'var(--text-high-value)' }}
              />
            </div>
            <div>
              <label className={labelClass} style={{ color: 'var(--text-high-value)' }}>Subtitle</label>
              <textarea
                value={content.contact.subtitle}
                onChange={(e) => handleContentChange('contact', 'subtitle', e.target.value)}
                rows={3}
                className={`${inputClass} resize-none`}
                style={{ color: 'var(--text-high-value)', whiteSpace: 'pre-wrap' }}
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass} style={{ color: 'var(--text-high-value)' }}>Email</label>
                <input
                  type="email"
                  value={content.contact.email}
                  onChange={(e) => handleContentChange('contact', 'email', e.target.value)}
                  className={inputClass}
                  style={{ color: 'var(--text-high-value)' }}
                />
              </div>
              <div>
                <label className={labelClass} style={{ color: 'var(--text-high-value)' }}>Phone</label>
                <input
                  type="tel"
                  value={content.contact.phone}
                  onChange={(e) => handleContentChange('contact', 'phone', e.target.value)}
                  className={inputClass}
                  style={{ color: 'var(--text-high-value)' }}
                />
              </div>
              <div>
                <label className={labelClass} style={{ color: 'var(--text-high-value)' }}>Location</label>
                <input
                  type="text"
                  value={content.contact.location}
                  onChange={(e) => handleContentChange('contact', 'location', e.target.value)}
                  className={inputClass}
                  style={{ color: 'var(--text-high-value)' }}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2" style={{ color: 'var(--text-high-value)' }}>
          <FileText size={24} />
          <span>Content Editor</span>
        </h2>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-high-value)' }}>Sections</h3>
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                    activeSection === section.id
                      ? 'bg-color-primary text-color-low-value'
                      : 'hover:bg-white/10'
                  }`}
                  style={{ 
                    color: activeSection === section.id ? 'var(--color-low-value)' : 'var(--text-high-value)'
                  }}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-3">
            <div className="bg-white/5 border border-white/20 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold" style={{ color: 'var(--text-high-value)' }}>
                  Edit {sections.find(s => s.id === activeSection)?.label} Section
                </h3>
                <motion.button
                  onClick={() => handleSave(activeSection)}
                  className="bg-color-primary hover:bg-color-secondary px-4 py-2 rounded-lg text-color-low-value font-semibold transition-all duration-300 hover-glow flex items-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save size={16} />
                  <span>Save</span>
                </motion.button>
              </div>
              
              {renderSectionEditor()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;