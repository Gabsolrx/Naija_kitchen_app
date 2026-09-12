import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { AdminRecipeForm } from './AdminRecipeForm';
import { AdminAboutForm } from './AdminAboutForm';

export function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_auth') === 'true';
  });

  const login = (password: string) => {
    if (password === 'Gabsol') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />;
  }

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-gray-50 overflow-y-auto pb-20">
      <Routes>
        <Route path="/" element={<AdminDashboard onLogout={logout} />} />
        <Route path="/new" element={<AdminRecipeForm />} />
        <Route path="/edit/:id" element={<AdminRecipeForm />} />
        <Route path="/about" element={<AdminAboutForm />} />
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </div>
  );
}
