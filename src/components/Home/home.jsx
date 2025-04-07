import React, { useState, useEffect } from 'react'
import Navigation from '../navbar/navbar.jsx'
import Dashboard from '../Dashboard/dashboard.jsx'

const Home = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  // Listen for sidebar state changes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      // Default collapsed state based on screen size
      setSidebarCollapsed(window.innerWidth < 768);
    };

    // Function to handle sidebar toggle events from Navigation
    const handleSidebarToggle = (event) => {
      if (event.detail && typeof event.detail.collapsed === 'boolean') {
        setSidebarCollapsed(event.detail.collapsed);
      }
    };

    // Initial check
    checkScreenSize();
    
    // Add event listeners
    window.addEventListener('resize', checkScreenSize);
    window.addEventListener('sidebarToggle', handleSidebarToggle);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
    };
  }, []);

  const handleNavUpdate = (darkThemeState) => {
    setIsDarkTheme(darkThemeState);
  };

  return (
    <main className={`flex h-screen ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Navigation onUpdate={handleNavUpdate} onToggle={(collapsed) => setSidebarCollapsed(collapsed)} />
      <div 
        className={`flex-1 overflow-auto transition-all duration-300 ${
          isMobile ? 'ml-0' : (sidebarCollapsed ? 'ml-20' : 'ml-64')
        }`}
      >
        <Dashboard isDark={isDarkTheme} />
      </div>
    </main>
  );
};

export default Home;