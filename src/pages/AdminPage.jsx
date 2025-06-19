
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';

const AdminPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Helmet>
        <title>Admin Panel - Portfolio Management</title>
        <meta name="description" content="Admin panel for managing portfolio content, projects, and website settings." />
      </Helmet>
      
      <div className="min-h-screen gradient-bg">
        {isAuthenticated ? <AdminDashboard /> : <AdminLogin />}
      </div>
    </>
  );
};

export default AdminPage;
