import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, UserCircle, Mail, Home as HomeIconLucide, Settings } from 'lucide-react';
import { useColors } from '@/contexts/ColorContext';
import { useNavigate } from 'react-router-dom';

const Navigation = ({ activeSection, onSectionChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hideTimeout, setHideTimeout] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { currentPalette } = useColors();
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIconLucide, action: () => onSectionChange('home') },
    { id: 'projects', label: 'Projects', icon: Briefcase, action: () => onSectionChange('projects') },
    { id: 'experience', label: 'Experience', icon: UserCircle, action: () => onSectionChange('experience') },
    { id: 'contact', label: 'Contact Me', icon: Mail, action: () => onSectionChange('contact') }
  ];

  const adminNavItem = { id: 'admin', label: 'Settings', icon: Settings, action: () => navigate('/admin') };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) return; 
    const handleMouseMove = (e) => {
      if (e.clientX <= 50) { // Show nav if mouse is on the left edge
        setIsVisible(true);
        if (hideTimeout) {
          clearTimeout(hideTimeout);
          setHideTimeout(null);
        }
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [hideTimeout, isMobile]);

  const handleMouseLeave = () => {
    if (isMobile) return;
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 2000); 
    setHideTimeout(timeout);
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    setIsVisible(true); 
  };

  const navVariants = isMobile 
    ? {
        initial: { y: -100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -100, opacity: 0 }
      }
    : {
        initial: { x: -300, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -300, opacity: 0 }
      };

  const navClasses = isMobile
    ? "fixed top-0 left-0 z-50 w-full glass-effect"
    : "fixed left-0 top-0 z-50 h-screen w-64 glass-effect flex flex-col justify-between";

  return (
    <AnimatePresence>
      {(isVisible || isMobile) && (
        <motion.nav
          initial={navVariants.initial}
          animate={navVariants.animate}
          exit={navVariants.exit}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={navClasses}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
        >
          <div className={`p-4 ${isMobile ? 'flex justify-between items-center' : ''}`}>
            {!isMobile && (
              <motion.h2 
                className={`text-xl font-bold mb-8`}
                style={{ color: currentPalette.highValue }} 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Muhammad Haider
              </motion.h2>
            )}
            
            <ul className={isMobile ? 'flex space-x-2 sm:space-x-4' : 'space-y-2'}>
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={item.id}
                    initial={isMobile ? {opacity:0, y: -10} : { opacity: 0, x: -20 }}
                    animate={isMobile ? {opacity:1, y: 0} : { opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <button
                      onClick={item.action}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                        activeSection === item.id 
                          ? 'shadow-lg' 
                          : 'hover:bg-white/20'
                      }`}
                      style={{
                        backgroundColor: activeSection === item.id ? currentPalette.primary : 'transparent',
                        color: activeSection === item.id ? currentPalette.lowValue : currentPalette.highValue,
                      }}
                    >
                      <Icon size={isMobile ? 16 : 20} />
                      <span className={`font-medium ${isMobile ? 'text-xs sm:text-sm' : ''}`}>{item.label}</span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </div>
          
          {!isMobile && (
            <div className="p-4">
              <motion.ul className="space-y-2">
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + navItems.length * 0.05 }}
                >
                  <button
                    onClick={adminNavItem.action}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/20`}
                    style={{
                      color: currentPalette.highValue,
                    }}
                  >
                    <adminNavItem.icon size={20} />
                    <span className="font-medium">{adminNavItem.label}</span>
                  </button>
                </motion.li>
              </motion.ul>
            </div>
          )}
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default Navigation;