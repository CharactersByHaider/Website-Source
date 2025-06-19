import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Navigation from '@/components/Navigation';
import HomeSection from '@/components/sections/HomeSection';
import AboutSection from '@/components/sections/AboutSection'; // Assuming About section is still desired, if not, remove
import ProjectsSection from '@/components/sections/ProjectsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import ContactSection from '@/components/sections/ContactSection';
import { useColors } from '@/contexts/ColorContext';

const HomePage = () => {
  const [activeSection, setActiveSection] = useState('home');
  const { currentPalette, themeMode } = useColors(); // Get themeMode

  useEffect(() => {
    // Update body background based on themeMode and lowValue color
    let lowValue = currentPalette.lowValue;
    if (themeMode === 'switched') {
      // If theme is switched, lowValue effectively becomes the original highValue
      // So we need to find the original lowValue for body background
      const originalPalette = JSON.parse(localStorage.getItem('colorPalette')) || {};
      lowValue = originalPalette.highValue || '#808080'; // Fallback to gray
    }
    document.body.style.backgroundColor = lowValue;
    document.body.style.color = themeMode === 'switched' ? currentPalette.lowValue : currentPalette.highValue;

  }, [currentPalette, themeMode]);


  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Helmet>
        <title>Muhammad Haider - 3D Artist Portfolio</title>
        <meta name="description" content="Portfolio of Muhammad Haider, a 3D artist showcasing creative projects and professional experience." />
      </Helmet>
      
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-low-value)' }}>
        <Navigation activeSection={activeSection} onSectionChange={handleSectionChange} />
        <main>
          <div id="home"><HomeSection onSectionChange={handleSectionChange} /></div>
          {/* <div id="about"><AboutSection /></div>  If About section is needed */}
          <div id="projects"><ProjectsSection /></div>
          <div id="experience"><ExperienceSection /></div>
          <div id="contact"><ContactSection /></div>
        </main>
      </div>
    </>
  );
};

export default HomePage;