
import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useColors } from '@/contexts/ColorContext';

const HomeSection = ({ onSectionChange }) => {
  const { settings } = useSiteSettings();
  const { currentPalette } = useColors();
  const { homePage: homeSettings } = settings;
  
  const [characterImageIndex, setCharacterImageIndex] = useState(0);
  const sectionRef = useRef(null);

  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);
  
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (homeSettings.characterImages && homeSettings.characterImages.length > 1) {
        const rect = sectionRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        mouseX.set(x);
        mouseY.set(y);

        const angle = Math.atan2(y - rect.height / 2, x - rect.width / 2) * (180 / Math.PI) + 180;
        const numImages = homeSettings.characterImages.length;
        const imageIndex = Math.floor((angle / 360) * numImages) % numImages;
        setCharacterImageIndex(imageIndex);
      } else if (homeSettings.characterImages && homeSettings.characterImages.length === 1) {
        setCharacterImageIndex(0);
      }
    };

    const currentSectionRef = sectionRef.current;
    if (currentSectionRef) {
      currentSectionRef.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (currentSectionRef) {
        currentSectionRef.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [homeSettings.characterImages, mouseX, mouseY]);

  const rotateX = useTransform(mouseY, [0, typeof window !== "undefined" ? window.innerHeight : 0], [-5, 5]);
  const rotateY = useTransform(mouseX, [0, typeof window !== "undefined" ? window.innerWidth : 0], [5, -5]);
  
  const currentCharacterImage = (homeSettings.characterImages && homeSettings.characterImages.length > 0) 
    ? homeSettings.characterImages[characterImageIndex] 
    : "https://storage.googleapis.com/hostinger-horizons-assets-prod/2451f05f-3d15-44c4-9fef-627dc1d33b48/f7bc4d432c9b346302f6e423b35e5ac7.png"; 

  const redStripImage = homeSettings.redStripImage || "https://storage.googleapis.com/hostinger-horizons-assets-prod/2451f05f-3d15-44c4-9fef-627dc1d33b48/1a39723e752139349a4235113e10a528.svg"; 
  const backgroundImage = homeSettings.backgroundImage || ""; 

  const sectionStyle = backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { backgroundColor: currentPalette.lowValue };

  return (
    <section 
      ref={sectionRef} 
      className="min-h-screen flex items-center justify-center relative overflow-hidden section-bg-pattern"
      style={sectionStyle}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6 flex flex-col md:flex-row items-center justify-around w-full max-w-6xl"
      >
        <motion.div 
          className="md:w-1/2 text-left mb-10 md:mb-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1 
            className="text-5xl md:text-7xl font-bold mb-4"
            style={{ color: currentPalette.highValue }}
          >
            Hi, I’m Muhammad Haider
          </h1>
          <h2 
            className="text-3xl md:text-5xl font-bold mb-6"
            style={{ color: currentPalette.primary }}
          >
            3D Artist
          </h2>
          <p 
            className="text-lg md:text-xl mb-8 max-w-md"
            style={{ color: currentPalette.highValue, whiteSpace: 'pre-wrap' }}
          >
            I create stunning 3D visuals and immersive experiences. Let's bring your ideas to life!
          </p>
          <motion.button
            onClick={() => onSectionChange('projects')}
            className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover-glow"
            style={{ backgroundColor: currentPalette.primary, color: currentPalette.lowValue }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View My Work
          </motion.button>
        </motion.div>

        <motion.div 
          className="md:w-1/2 relative flex justify-center items-center"
          style={{ perspective: "1000px" }}
        >
          {redStripImage && (
            <motion.img
              src={redStripImage}
              alt="Red strip accent"
              className="absolute h-full w-auto md:w-1/2 object-contain z-0"
              style={{ maxHeight: '80vh', filter: `opacity(0.8) drop-shadow(0 0 10px ${currentPalette.primary})` }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            />
          )}
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative z-10"
          >
            <img 
              src={currentCharacterImage}
              alt="Muhammad Haider 3D Character"
              className="max-h-[70vh] md:max-h-[80vh] object-contain drop-shadow-2xl"
             src="https://images.unsplash.com/photo-1635003913011-95971abba560" />
          </motion.div>
        </motion.div>
      </motion.div>
      
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ArrowDown style={{color: currentPalette.highValue }} size={24} />
      </motion.div>
    </section>
  );
};

export default HomeSection;
