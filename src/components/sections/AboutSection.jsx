import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => {
  const [aboutContent, setAboutContent] = useState(() => {
    const saved = localStorage.getItem('aboutContent');
    return saved ? JSON.parse(saved) : {
      title: 'About Me',
      content: 'I am a passionate creative professional with expertise in design and development. My journey spans across various disciplines, always striving to create meaningful and impactful experiences.'
    };
  });

  return (
    <section className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 text-shadow">
            {aboutContent.title}
          </h2>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass-effect p-8 rounded-2xl">
              <p className="text-lg text-white/90 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                {aboutContent.content}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-effect p-6 rounded-xl text-center">
                <h3 className="text-2xl font-bold color-primary mb-2">5+</h3>
                <p className="text-white/80">Years Experience</p>
              </div>
              <div className="glass-effect p-6 rounded-xl text-center">
                <h3 className="text-2xl font-bold color-secondary mb-2">50+</h3>
                <p className="text-white/80">Projects Completed</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="glass-effect p-8 rounded-2xl">
              <img 
                src="https://storage.googleapis.com/hostinger-horizons-assets-prod/2451f05f-3d15-44c4-9fef-627dc1d33b48/579ee2b323efa8db4087163bc65af3f6.jpg"
                alt="Professional portrait"
                className="w-full h-96 object-cover rounded-xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;