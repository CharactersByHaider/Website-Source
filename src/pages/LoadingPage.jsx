
import React from 'react';
import { motion } from 'framer-motion';
import { useColors } from '@/contexts/ColorContext';
import { Helmet } from 'react-helmet';

const LoadingPage = () => {
  const { currentPalette } = useColors();

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    },
  };

  const dotVariants = {
    initial: { y: 0, opacity: 0.5 },
    animate: {
      y: [0, -15, 0],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Loading Portfolio...</title>
        <meta name="description" content="Please wait while the portfolio loads." />
      </Helmet>
      <div 
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ backgroundColor: currentPalette.lowValue }}
      >
        <motion.div 
          className="flex items-center justify-center space-x-3"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-5 h-5 rounded-full"
              style={{ backgroundColor: currentPalette.primary }}
              variants={dotVariants}
              custom={index}
            />
          ))}
        </motion.div>
        <motion.p 
          className="mt-6 text-lg font-semibold"
          style={{ color: currentPalette.highValue }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Loading Portfolio...
        </motion.p>
      </div>
    </>
  );
};

export default LoadingPage;
