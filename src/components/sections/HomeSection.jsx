import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useColors } from '@/contexts/ColorContext';
const HomeSection = ({
  onSectionChange
}) => {
  const {
    settings
  } = useSiteSettings();
  const {
    currentPalette
  } = useColors();
  const {
    homePage: homeSettings
  } = settings;
  const [characterImageIndex, setCharacterImageIndex] = useState(0);
  const sectionRef = useRef(null);
  const characterContainerRef = useRef(null);
  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);
  useEffect(() => {
    const handleMouseMove = event => {
      if (!homeSettings.characterImages || homeSettings.characterImages.length === 0 || !characterContainerRef.current) {
        if (homeSettings.characterImages && homeSettings.characterImages.length === 1) setCharacterImageIndex(0);
        return;
      }
      const rect = characterContainerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left; // x position within the element.
      const y = event.clientY - rect.top; // y position within the element.

      mouseX.set(event.clientX - (sectionRef.current?.getBoundingClientRect().left || 0));
      mouseY.set(event.clientY - (sectionRef.current?.getBoundingClientRect().top || 0));
      const normalizedX = Math.max(0, Math.min(1, x / rect.width)); // 0 (left) to 1 (right)
      const normalizedY = Math.max(0, Math.min(1, y / rect.height)); // 0 (top) to 1 (bottom)

      const totalImagesConfigured = homeSettings.characterImageCount || 1;
      const availableImages = homeSettings.characterImages.length;
      if (availableImages === 0) return;
      if (availableImages === 1) {
        setCharacterImageIndex(0);
        return;
      }
      let imageIndex = 0;
      const numHorizontalSegments = 5; // e.g., char-0 to char-5 for left/right
      const numVerticalSegments = Math.max(1, totalImagesConfigured - 2 * numHorizontalSegments - 1) / 2; // Remaining for top/bottom

      if (normalizedY < 0.33) {
        // Top part
        // Moving top: higher numbers (e.g., char-11 to char-15)
        const topRangeStart = numHorizontalSegments + 1;
        imageIndex = topRangeStart + Math.floor(normalizedX * numVerticalSegments);
      } else if (normalizedY > 0.66) {
        // Bottom part
        // Moving bottom: highest numbers (e.g., char-16 to char-20)
        const bottomRangeStart = numHorizontalSegments + numVerticalSegments + 1;
        imageIndex = bottomRangeStart + Math.floor(normalizedX * numVerticalSegments);
      } else {
        // Middle part (left/right dominant)
        if (normalizedX < 0.5) {
          // Left side
          // Moving left: increasing numbers (e.g., char-0 to char-5)
          imageIndex = Math.floor(normalizedX * 2 * numHorizontalSegments); // Map 0-0.5 to 0-numHorizontalSegments
        } else {
          // Right side
          // Moving right: increasing numbers (e.g., char-0 to char-5, could be different set)
          // For simplicity, mirroring left or using same logic.
          imageIndex = Math.floor((normalizedX - 0.5) * 2 * numHorizontalSegments);
        }
      }

      // Ensure center shows image 0
      if (normalizedX > 0.4 && normalizedX < 0.6 && normalizedY > 0.4 && normalizedY < 0.6) {
        imageIndex = 0;
      }
      setCharacterImageIndex(Math.max(0, Math.min(imageIndex, availableImages - 1)));
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
  }, [homeSettings.characterImages, homeSettings.characterImageCount, mouseX, mouseY]);
  const rotateX = useTransform(mouseY, [0, typeof window !== "undefined" ? window.innerHeight : 0], [-5, 5]);
  const rotateY = useTransform(mouseX, [0, typeof window !== "undefined" ? window.innerWidth : 0], [5, -5]);
  const currentCharacterImage = homeSettings.characterImages && homeSettings.characterImages.length > 0 ? homeSettings.characterImages[characterImageIndex] : "https://storage.googleapis.com/hostinger-horizons-assets-prod/2451f05f-3d15-44c4-9fef-627dc1d33b48/f7bc4d432c9b346302f6e423b35e5ac7.png";
  const redStripImage = homeSettings.redStripImage || "https://storage.googleapis.com/hostinger-horizons-assets-prod/2451f05f-3d15-44c4-9fef-627dc1d33b48/1a39723e752139349a4235113e10a528.svg";
  const backgroundImage = homeSettings.backgroundImage || "";
  const sectionStyle = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  } : {
    backgroundColor: currentPalette.lowValue
  };
  return <section ref={sectionRef} className="min-h-screen flex items-center justify-center relative overflow-hidden section-bg-pattern" style={sectionStyle}>
      <motion.div initial={{
      opacity: 0,
      y: 50
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.8
    }} className="relative z-10 text-center px-6 flex flex-col md:flex-row items-center justify-around w-full max-w-6xl">
        <motion.div className="md:w-1/2 text-left mb-10 md:mb-0" initial={{
        opacity: 0,
        x: -50
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: 0.2,
        duration: 0.8
      }}>
          <h1 className="text-5xl md:text-7xl font-bold mb-4" style={{
          color: currentPalette.highValue
        }}>
            Hi, I’m Muhammad Haider
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{
          color: currentPalette.primary
        }}>3D Character Artist</h2>
          <p className="text-lg md:text-xl mb-8 max-w-md" style={{
          color: currentPalette.highValue,
          whiteSpace: 'pre-wrap'
        }}>Character Artist with 2+ years of experience in AA game characters, interested in sculpting organic characters using ZBrush and Maya. Skilled in PBR and hand-painted texturing. Looking to specialise as a Character Artist.</p>
          <motion.button onClick={() => onSectionChange('projects')} className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover-glow" style={{
          backgroundColor: currentPalette.primary,
          color: currentPalette.lowValue
        }} whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }}>
            View My Work
          </motion.button>
        </motion.div>

        <motion.div ref={characterContainerRef} className="md:w-1/2 relative flex justify-center items-center" style={{
        perspective: "1000px"
      }}>
          {redStripImage && <motion.img src={redStripImage} alt="Red strip accent" className="absolute h-full w-auto md:w-1/2 object-contain z-0" style={{
          maxHeight: '80vh',
          filter: `opacity(0.8) drop-shadow(0 0 10px ${currentPalette.primary})`
        }} initial={{
          opacity: 0,
          scale: 0.8
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: 0.4,
          duration: 0.8
        }} />}
          <motion.div style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }} className="relative z-10">
            <img src={currentCharacterImage} alt="Muhammad Haider 3D Character" className="max-h-[70vh] md:max-h-[80vh] object-contain drop-shadow-2xl" />
          </motion.div>
        </motion.div>
      </motion.div>
      
      <motion.div className="absolute bottom-8 left-1/2 transform -translate-x-1/2" animate={{
      y: [0, 10, 0]
    }} transition={{
      repeat: Infinity,
      duration: 2
    }}>
        <ArrowDown style={{
        color: currentPalette.highValue
      }} size={24} />
      </motion.div>
    </section>;
};
export default HomeSection;