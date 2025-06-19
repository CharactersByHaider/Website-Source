
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';
import { useColors } from '@/contexts/ColorContext';
import { Helmet } from 'react-helmet';

const NotFoundPage = () => {
  const { currentPalette } = useColors();

  return (
    <>
      <Helmet>
          <title>404 - Page Not Found</title>
          <meta name="description" content="The page you are looking for does not exist." />
      </Helmet>
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
        style={{ backgroundColor: currentPalette.lowValue, color: currentPalette.highValue }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
          className="glass-effect p-8 sm:p-12 rounded-2xl shadow-xl max-w-lg w-full"
          style={{ '--glass-color-primary-rgb': currentPalette.primaryRgb }}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
            className="inline-block mb-6"
          >
            <AlertTriangle size={80} style={{ color: currentPalette.primary }} />
          </motion.div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={{ color: currentPalette.primary }}>
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6" style={{ color: currentPalette.highValue }}>
            Oops! Page Not Found
          </h2>
          <p className="text-base sm:text-lg mb-8" style={{ color: currentPalette.highValue, opacity: 0.8 }}>
            The page you're looking for seems to have taken a detour into the digital unknown. Don't worry, it happens to the best of us!
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover-glow"
              style={{ backgroundColor: currentPalette.primary, color: currentPalette.lowValue }}
            >
              <Home size={20} className="mr-2" />
              Go Back Home
            </Link>
          </motion.div>
        </motion.div>
        <style jsx global>{`
          .glass-effect {
            background: rgba(var(--glass-color-primary-rgb, 255, 0, 0), 0.1); /* Fallback if variables not set */
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(var(--glass-color-primary-rgb, 255, 0, 0), 0.2);
          }
          .hover-glow:hover {
            box-shadow: 0 0 15px 0px ${currentPalette.primary};
          }
        `}</style>
      </div>
    </>
  );
};

export default NotFoundPage;
