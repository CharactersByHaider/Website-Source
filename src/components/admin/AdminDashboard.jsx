import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Palette, Users, FileText, Briefcase, Settings, Image as ImageIcon, Contact as ContactIcon, RefreshCw, X, RotateCcw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import ColorPaletteManager from '@/components/admin/ColorPaletteManager';
import UserManager from '@/components/admin/UserManager';
import ContentEditor from '@/components/admin/ContentEditor';
import ProjectManager from '@/components/admin/ProjectManager';
import SiteAssetsManager from '@/components/admin/SiteAssetsManager'; 
import ExperienceSettingsManager from '@/components/admin/ExperienceSettingsManager';
import ContactLinksManager from '@/components/admin/ContactLinksManager';
import ThemeSwitcher from '@/components/admin/ThemeSwitcher';
import { useNavigate } from 'react-router-dom';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useColors } from '@/contexts/ColorContext';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('colors');
  const { logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const siteSettingsContext = useSiteSettings();
  const colorsContext = useColors();

  const tabs = [
    { id: 'colors', label: 'Color Palette', icon: Palette },
    { id: 'theme', label: 'Theme Mode', icon: RefreshCw },
    { id: 'assets', label: 'Site Assets', icon: ImageIcon },
    { id: 'projects', label: 'Project Manager', icon: Briefcase },
    { id: 'experience_settings', label: 'Experience Config', icon: Settings },
    { id: 'contact_links', label: 'Contact Links', icon: ContactIcon },
    { id: 'content', label: 'Content Editor', icon: FileText },
    { id: 'users', label: 'User Management', icon: Users },
  ];

  const handleLogout = useCallback(() => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      duration: 3000,
    });
  }, [logout, toast]);

  const handleCloseAdminPanel = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleResetAllSettings = useCallback(() => {
    if (window.confirm("Are you sure you want to reset ALL website settings to their defaults? This action cannot be undone.")) {
      let settingsResetSuccess = false;
      if (siteSettingsContext && typeof siteSettingsContext.resetAllSiteSettings === 'function') {
        siteSettingsContext.resetAllSiteSettings();
        settingsResetSuccess = true;
      } else {
        console.error("resetAllSiteSettings is not available from useSiteSettings hook or is not a function.");
        toast({
            title: "Error",
            description: "Could not reset site settings. Function not available.",
            variant: "destructive",
            duration: 5000,
        });
      }
      
      if (colorsContext && typeof colorsContext.resetColorPalette === 'function') {
        colorsContext.resetColorPalette();
      }
      if (colorsContext && typeof colorsContext.resetThemeMode === 'function') {
        colorsContext.resetThemeMode();
      }
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('aboutContent');
        localStorage.removeItem('projectsContent');
        localStorage.removeItem('experienceContent');
        localStorage.removeItem('contactContent');
        localStorage.removeItem('projects');
        localStorage.removeItem('experiences');
        localStorage.removeItem('contactLinks');
        localStorage.removeItem('experienceSettings');
      }
      
      if (settingsResetSuccess) {
        toast({
          title: "All Settings Reset",
          description: "All website settings have been reset to their default values. The page will now reload.",
          duration: 5000,
        });
        setTimeout(() => window.location.reload(), 2000);
      }
    }
  }, [siteSettingsContext, colorsContext, toast]);


  const renderTabContent = () => {
    switch (activeTab) {
      case 'colors':
        return <ColorPaletteManager />;
      case 'theme':
        return <ThemeSwitcher />;
      case 'assets':
        return <SiteAssetsManager />;
      case 'projects':
        return <ProjectManager />;
      case 'experience_settings':
        return <ExperienceSettingsManager />;
      case 'contact_links':
        return <ContactLinksManager />;
      case 'content':
        return <ContentEditor />;
      case 'users':
        return <UserManager />;
      default:
        return <ColorPaletteManager />;
    }
  };

  return (
    <div className="min-h-screen p-6 bg-color-low-value text-color-high-value">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>Admin Dashboard</h1>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={handleResetAllSettings}
              className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-white font-semibold transition-colors text-xs sm:text-sm"
              title="Reset All Website Settings"
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">Reset All</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-white font-semibold transition-colors text-xs sm:text-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <button
              onClick={handleCloseAdminPanel}
              className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-white font-semibold transition-colors text-xs sm:text-sm"
            >
              <X size={16} />
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>
        </motion.div>
        
        <div className="grid lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="p-6 rounded-2xl" style={{ backgroundColor: `rgba(var(--color-primary-rgb, 255,0,0), 0.05)`}}>
              <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-high-value)' }}>Navigation</h2>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'text-color-low-value'
                          : 'hover:bg-white/10'
                      }`}
                      style={{
                        backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                        color: activeTab === tab.id ? 'var(--color-low-value)' : 'var(--text-high-value)',
                      }}
                    >
                      <Icon size={18} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="p-6 rounded-2xl min-h-[600px]" style={{ backgroundColor: `rgba(var(--color-primary-rgb, 255,0,0), 0.05)`}}>
              {renderTabContent()}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;