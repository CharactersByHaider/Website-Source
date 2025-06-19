import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Linkedin, Send, ExternalLink } from 'lucide-react'; // Using ExternalLink for ArtStation
import { useToast } from '@/components/ui/use-toast';
import { useColors } from '@/contexts/ColorContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const ContactSection = () => {
  const { toast } = useToast();
  const { currentPalette } = useColors();
  const { settings } = useSiteSettings();
  const { contactLinks, sectionBackgrounds } = settings;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [contactContent, setContactContent] = useState(() => {
    const saved = localStorage.getItem('contactContent');
    return saved ? JSON.parse(saved) : {
      title: 'Get In Touch',
      subtitle: 'Let\'s create something amazing together',
    };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:${contactLinks.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
    window.open(mailtoLink, '_blank');
    toast({
      title: "Message Prepared",
      description: "Your email client should open to send the message.",
      duration: 5000,
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const sectionStyle = sectionBackgrounds.contact.pc 
    ? { backgroundImage: `url(${sectionBackgrounds.contact.pc})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
    : { backgroundColor: currentPalette.lowValue };

  return (
    <section 
      className="min-h-screen py-20 px-6 section-bg-pattern"
      style={sectionStyle}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-shadow" style={{ color: currentPalette.primary }}>
            {contactContent.title}
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: currentPalette.highValue }}>
            {contactContent.subtitle}
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="p-8 rounded-2xl" style={{ backgroundColor: `rgba(${currentPalette.primary === '#FF0000' ? '255,0,0' : '128,128,128'}, 0.05)` }}>
              <h3 className="text-2xl font-bold mb-6" style={{ color: currentPalette.highValue }}>Contact Information</h3>
              
              <div className="space-y-6">
                <a href={`mailto:${contactLinks.email}`} className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 group-hover:filter group-hover:brightness-110" style={{backgroundColor: currentPalette.primary}}>
                    <Mail style={{ color: currentPalette.lowValue }} size={20} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: currentPalette.highValue }}>Email</p>
                    <p className="font-semibold" style={{ color: currentPalette.highValue }}>{contactLinks.email}</p>
                  </div>
                </a>
                
                <a href={`tel:${contactLinks.phone}`} className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 group-hover:filter group-hover:brightness-110" style={{backgroundColor: currentPalette.secondary}}>
                    <Phone style={{ color: currentPalette.lowValue }} size={20} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: currentPalette.highValue }}>Phone</p>
                    <p className="font-semibold" style={{ color: currentPalette.highValue }}>{contactLinks.phone}</p>
                  </div>
                </a>
                
                <a href={contactLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 group-hover:filter group-hover:brightness-110" style={{backgroundColor: currentPalette.highValue}}>
                    <Linkedin style={{ color: currentPalette.lowValue }} size={20} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: currentPalette.highValue }}>LinkedIn</p>
                    <p className="font-semibold" style={{ color: currentPalette.highValue }}>View Profile</p>
                  </div>
                </a>

                <a href={contactLinks.artstation} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 group-hover:filter group-hover:brightness-110" style={{backgroundColor: currentPalette.highValue}}>
                    <ExternalLink style={{ color: currentPalette.lowValue }} size={20} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: currentPalette.highValue }}>ArtStation</p>
                    <p className="font-semibold" style={{ color: currentPalette.highValue }}>View Portfolio</p>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="p-8 rounded-2xl" style={{ backgroundColor: `rgba(${currentPalette.primary === '#FF0000' ? '255,0,0' : '128,128,128'}, 0.05)` }}>
              <h3 className="text-2xl font-bold mb-6" style={{ color: currentPalette.highValue }}>Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm" style={{ color: currentPalette.highValue }}>Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-white/5 border rounded-lg placeholder-white/30 focus:outline-none focus:border-color-primary transition-colors" style={{ borderColor: currentPalette.highValue, color: currentPalette.highValue }} placeholder="Your name" required />
                </div>
                <div>
                  <label className="block mb-1 text-sm" style={{ color: currentPalette.highValue }}>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 bg-white/5 border rounded-lg placeholder-white/30 focus:outline-none focus:border-color-primary transition-colors" style={{ borderColor: currentPalette.highValue, color: currentPalette.highValue }} placeholder="your@email.com" required />
                </div>
                 <div>
                  <label className="block mb-1 text-sm" style={{ color: currentPalette.highValue }}>Subject</label>
                  <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-2 bg-white/5 border rounded-lg placeholder-white/30 focus:outline-none focus:border-color-primary transition-colors" style={{ borderColor: currentPalette.highValue, color: currentPalette.highValue }} placeholder="Subject" required />
                </div>
                <div>
                  <label className="block mb-1 text-sm" style={{ color: currentPalette.highValue }}>Message</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-4 py-2 bg-white/5 border rounded-lg placeholder-white/30 focus:outline-none focus:border-color-primary transition-colors resize-none" style={{ borderColor: currentPalette.highValue, color: currentPalette.highValue }} placeholder="Your message..." required></textarea>
                </div>
                <motion.button
                  type="submit"
                  className="w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover-glow flex items-center justify-center space-x-2 btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send size={18} />
                  <span>Send Message via Gmail</span>
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;