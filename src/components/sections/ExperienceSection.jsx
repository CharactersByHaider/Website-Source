import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Briefcase } from 'lucide-react';
import { useColors } from '@/contexts/ColorContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const ExperienceSection = () => {
  const { currentPalette } = useColors();
  const { settings } = useSiteSettings();
  const { experienceSettings } = settings;

  const [experiences, setExperiences] = useState(() => {
    const saved = localStorage.getItem('experiences');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Senior 3D Artist', company: 'Game Studio X', period: '2021-2024', location: 'Virtual Office', description: 'Led a team of artists, developed key assets for AAA titles, and optimized 3D pipelines.', achievements: ['Shipped 2 major titles', 'Mentored junior artists', 'Improved asset creation speed by 20%'], years: 3 },
      { id: 2, title: '3D Modeler', company: 'Animation Inc.', period: '2019-2021', location: 'Remote', description: 'Created high-quality 3D models for animated series and commercials.', achievements: ['Worked on 5+ series', 'Specialized in character modeling', 'Met tight deadlines consistently'], years: 2 },
    ];
  });

  const [experienceContent, setExperienceContent] = useState(() => {
    const saved = localStorage.getItem('experienceContent');
    return saved ? JSON.parse(saved) : {
      title: 'Professional Experience',
      subtitle: 'My journey in the world of 3D art and design.'
    };
  });

  const sectionStyle = settings.sectionBackgrounds.experience.pc 
    ? { backgroundImage: `url(${settings.sectionBackgrounds.experience.pc})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
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
            {experienceContent.title}
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: currentPalette.highValue, whiteSpace: 'pre-wrap' }}>
            {experienceContent.subtitle}
          </p>
        </motion.div>
        
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 rounded-full" style={{ backgroundColor: currentPalette.primary, opacity: 0.3 }}></div>
          
          <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-1 gap-x-12">
            {experiences.map((exp, index) => {
              const itemHeight = exp.years * (experienceSettings.lengthToYearRatio || 10) + 120; 
              const isEven = index % 2 === 0;
              return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className={`relative group mb-8 md:mb-0`}
                style={{ minHeight: `${itemHeight}px` }}
              >
                <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 shadow-lg ${isEven ? 'left-1/2 -translate-x-[calc(100%+8px)] md:-translate-x-[calc(50%+2rem)]' : 'left-1/2 translate-x-8 md:translate-x-[calc(50%+2rem-8px)]'}`} style={{ backgroundColor: currentPalette.secondary, borderColor: currentPalette.lowValue }}></div>
                
                <motion.div
                  whileHover={{ scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 15 } }}
                  className={`p-6 rounded-2xl shadow-xl md:w-[calc(50%-2rem)] ${isEven ? 'md:mr-auto' : 'md:ml-auto'}`}
                  style={{ backgroundColor: `rgba(${currentPalette.primary === '#FF0000' ? '255,0,0' : '128,128,128'}, 0.05)` }}
                >
                  <div className="flex flex-wrap items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold" style={{ color: currentPalette.primary }}>{exp.title}</h3>
                    <div className="flex items-center space-x-2" style={{ color: currentPalette.secondary }}>
                      <Calendar size={16} />
                      <span className="font-semibold text-sm">{exp.period}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-3">
                    <Briefcase size={16} style={{ color: currentPalette.highValue }} />
                    <h4 className="text-lg font-semibold" style={{ color: currentPalette.highValue }}>{exp.company}</h4>
                  </div>
                  <div className="flex items-center space-x-3 mb-4 text-sm" style={{ color: currentPalette.highValue }}>
                    <MapPin size={14} />
                    <span>{exp.location}</span>
                  </div>
                  
                  <p className="mb-4 leading-relaxed text-sm" style={{ color: currentPalette.highValue, whiteSpace: 'pre-wrap' }}>{exp.description}</p>
                  
                  {exp.achievements && exp.achievements.length > 0 && (
                  <div className="space-y-1">
                    <h5 className="font-semibold mb-1 text-sm" style={{ color: currentPalette.secondary }}>Key Achievements:</h5>
                    <ul className="space-y-1 text-xs list-disc list-inside" style={{ color: currentPalette.highValue }}>
                      {exp.achievements.map((achievement, achIndex) => (
                        <li key={achIndex}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                  )}
                </motion.div>
              </motion.div>
            )})}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;