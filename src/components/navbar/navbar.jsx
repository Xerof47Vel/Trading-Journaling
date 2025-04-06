import React, { useState, useEffect } from 'react';
import { 
  Search, Home, ChartBar, Users, FileText, Settings, 
  HelpCircle, LogOut, Menu, X, Moon, Sun, ChevronLeft, ChevronRight
} from 'lucide-react';
import Img1 from '../../assets/profile.jpg';
import Img2 from '../../assets/newLogo.png';

const Navigation = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Check if screen is mobile size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    // Initial check
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    // In a real app, you would also update the document class or CSS variables
    document.documentElement.classList.toggle('dark');
  };

  const menuItems = [
    { icon: <Home size={20} />, title: 'Dashboard', active: true },
    { icon: <ChartBar size={20} />, title: 'Analytics' },
    { icon: <Users size={20} />, title: 'Customers' },
    { icon: <FileText size={20} />, title: 'Reports' },
  ];

  const bottomItems = [
    { icon: <Settings size={20} />, title: 'Settings' },
    { icon: <HelpCircle size={20} />, title: 'Help Center' },
  ];

  // Conditional classes based on theme
  const bgColor = isDark ? 'bg-gray-900' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-800';
  // const borderColor = isDark ? 'border-gray-800' : 'border-gray-100';
  const inputBgColor = isDark ? 'bg-gray-800' : 'bg-gray-50';
  const inputTextColor = isDark ? 'text-gray-300' : 'text-gray-600';
  const hoverBgColor = isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const iconColor = isDark ? 'text-gray-400' : 'text-gray-500';
  const linkColor = isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600';

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button 
        className={`fixed top-4 left-4 z-30 md:hidden p-2 rounded-full shadow-md ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
        onClick={toggleSidebar}
        aria-label="Toggle navigation"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed md:relative h-screen ${bgColor} ${textColor} shadow-lg transition-all duration-300 ease-in-out z-30 flex flex-col
          ${isMobile 
            ? isOpen ? 'left-0' : '-left-full'
            : collapsed ? 'w-20' : 'w-64'
          }`}
      >
        {/* Close Button (Mobile) */}
        {isMobile && (
          <button 
            className="absolute top-4 right-4 p-1 rounded-full bg-opacity-20 bg-gray-500"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        )}

        {/* Desktop Toggle Button */}
        {!isMobile && (
          <button 
            className={`absolute -right-3 top-20 p-1.5 rounded-full shadow-md ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}
            onClick={toggleSidebar}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}

        {/* Logo */}
        <div className={`flex items-center justify-center py-6`}>
          {collapsed ? (
            <img 
              src={Img2} 
              alt="JOT Logo" 
              className="w-10 h-10 rounded-full shadow-md object-cover"
            />
          ) : (
            <div className="flex items-center">
              <img 
                src={Img2} 
                alt="JOT Logo" 
                className="w-10 h-10 rounded-full shadow-md object-cover"
              />
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className={`px-4 py-2`}>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={16} className={iconColor} />
            </span>
            {!collapsed && (
              <input
                type="text"
                placeholder="Search..."
                className={`w-full py-2 pl-10 pr-4 ${inputBgColor} rounded-lg text-sm ${inputTextColor} focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all`}
              />
            )}
            {collapsed && (
              <button className={`w-full flex justify-center py-2 ${inputBgColor} rounded-lg`}>
                <Search size={18} className={iconColor} />
              </button>
            )}
          </div>
        </div>

        {/* Menu Items - Main navigation */}
        <div className="flex-grow px-3 py-6">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    item.active
                      ? 'bg-blue-600 text-white shadow-md'
                      : `${isDark ? 'text-gray-300' : 'text-gray-600'} ${hoverBgColor} hover:text-${isDark ? 'white' : 'gray-900'}`
                  }`}
                >
                  <span className="flex items-center justify-center">{item.icon}</span>
                  {!collapsed && <span className="ml-3 font-medium">{item.title}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Secondary Navigation and Settings */}
        <div className="px-3 py-2">
          {/* Settings & Help */}
          <ul className="space-y-1">
            {bottomItems.map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  className={`flex items-center px-3 py-2.5 rounded-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} ${hoverBgColor} hover:text-${isDark ? 'white' : 'gray-900'} transition-colors duration-200`}
                >
                  <span className="flex items-center justify-center">{item.icon}</span>
                  {!collapsed && <span className="ml-3 font-medium">{item.title}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Theme Toggle */}
        <button 
          className={`flex items-center justify-center ${!collapsed ? 'w-full' : ''} px-3 py-2.5 rounded-lg ${hoverBgColor} transition-colors duration-200 mb-2`}
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <span className="flex items-center justify-center text-blue-400">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </span>
          {!collapsed && <span className="ml-3 font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* User Profile*/}
        <div className="mt-auto px-3 py-4">
          {/* For desktop and expanded view */}
          {!collapsed && !isMobile && (
            <div className="flex items-center p-2 mt-4 space-x-4">
              <img
                src={Img1}
                alt="User Profile"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold">John Doe</h2>
                <span className="flex items-center space-x-1">
                  <a rel="noopener noreferrer" href="#" className={`text-xs hover:underline ${linkColor}`}>View profile</a>
                </span>
              </div>
            </div>
          )}
          
          {/* For collapsed sidebar on desktop */}
          {collapsed && !isMobile && (
            <div className="flex justify-center p-2 mt-4">
              <img
                src={Img1}
                alt="User Profile"
                className="w-12 h-12 rounded-lg object-cover"
              />
            </div>
          )}
          
          {/* For mobile view */}
          {isMobile && (
            <div className="flex justify-center p-2 mt-4">
              <img
                src={Img1}
                alt="User Profile"
                className="w-12 h-12 rounded-lg object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navigation;