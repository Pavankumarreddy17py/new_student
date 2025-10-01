import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Only show navbar on authenticated routes
  const showNavbar = !['/login', '/register', '/'].includes(location.pathname);
  
  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;