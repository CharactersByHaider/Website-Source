import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ColorProvider } from '@/contexts/ColorContext';
import { AuthProvider } from '@/contexts/AuthContext';
import HomePage from '@/pages/HomePage';
import AdminPage from '@/pages/AdminPage';
import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext';
import Footer from '@/components/Footer';

function App() {
  return (
    <SiteSettingsProvider>
      <ColorProvider>
        <AuthProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <div className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/admin" element={<AdminPage />} />
                </Routes>
              </div>
              <Footer />
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </ColorProvider>
    </SiteSettingsProvider>
  );
}

export default App;