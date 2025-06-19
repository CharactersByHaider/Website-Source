import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Contact as ContactIcon, Save, Linkedin, Mail, Phone, ExternalLink } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useToast } from '@/components/ui/use-toast';
import { useColors } from '@/contexts/ColorContext';

const ContactLinksManager = () => {
  const { settings, updateMultipleSettings } = useSiteSettings();
  const { toast } = useToast();
  const { currentPalette } = useColors();

  const [contactLinks, setContactLinks] = useState(settings.contactLinks || {
    email: '', linkedin: '', artstation: '', phone: ''
  });

  const handleChange = (key, value) => {
    setContactLinks(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateMultipleSettings('contactLinks', contactLinks);
    toast({ title: "Contact Links Updated", description: "Contact information saved successfully.", duration: 3000 });
  };

  const linkFields = [
    { key: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'your.email@example.com' },
    { key: 'linkedin', label: 'LinkedIn Profile URL', icon: Linkedin, type: 'url', placeholder: 'https://linkedin.com/in/yourprofile' },
    { key: 'artstation', label: 'ArtStation Profile URL', icon: ExternalLink, type: 'url', placeholder: 'https://artstation.com/yourprofile' },
    { key: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: '+1 234 567 8900' },
  ];

  return (
    <div className="space-y-8 text-color-high-value">
      <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
        <ContactIcon size={24} />
        <span>Contact Links Manager</span>
      </h2>

      <div className="p-6 rounded-lg" style={{ backgroundColor: `rgba(var(--color-primary-rgb), 0.05)`}}>
        <h3 className="text-xl font-semibold mb-4">Update Contact Information</h3>
        <div className="space-y-4">
          {linkFields.map(field => {
            const Icon = field.icon;
            return (
              <div key={field.key}>
                <label className="block mb-1 text-sm flex items-center">
                  <Icon size={16} className="mr-2 opacity-70" />
                  {field.label}
                </label>
                <input 
                  type={field.type} 
                  value={contactLinks[field.key]} 
                  onChange={(e) => handleChange(field.key, e.target.value)} 
                  className="w-full input-admin" 
                  placeholder={field.placeholder}
                />
              </div>
            );
          })}
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
        onClick={handleSave}
        className="w-full btn-primary px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover-glow flex items-center justify-center space-x-2 mt-8"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Save size={18} />
        <span>Save Contact Links</span>
      </motion.button>
    </div>
  );
};

export default ContactLinksManager;