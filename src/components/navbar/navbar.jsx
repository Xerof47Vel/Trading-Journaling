import React, { useState, useEffect, act } from "react";
import PropTypes from "prop-types";
import {
  Search,
  Home,
  Settings,
  HelpCircle,
  Menu,
  X,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  BookOpen,
  Wallet,
  Bot,
} from "lucide-react";
import Img1 from "../../assets/profile.jpg";
import Img2 from "../../assets/newLogo.png";

import { Link } from "react-router-dom";

const Navigation = ({ onToggle, onUpdate }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(false);
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
    window.addEventListener("resize", checkScreenSize);

    // Clean up
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (onUpdate) {
      onUpdate(isDark);
    }
  }, [isDark, onUpdate]);

  // Notify parent component whenever collapsed state changes
  useEffect(() => {
    if (onToggle) {
      onToggle(collapsed);
    }

    // Also dispatch a custom event for components that might not have direct prop access
    const event = new CustomEvent("sidebarToggle", {
      detail: { collapsed: collapsed },
    });
    window.dispatchEvent(event);
  }, [collapsed, onToggle]);

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
    document.documentElement.classList.toggle("dark");
  };

  const menuItems = [
    { icon: <Home size={20} />, title: "Dashboard", active: true, link: "/" },
    {
      icon: <BookOpen size={20} />,
      title: "Trades",
      link: "./Trades/AddTrade2.jsx",
    },
    { icon: <Wallet size={20} />, title: "Accounts", link: "/add-trade" },
    {
      icon: <BarChart2 size={20} />,
      title: "Analysis",
      link: "./Trades/AddTrade2.jsx",
    },
    { icon: <Bot size={20} />, title: "Bot", link: "./Trades/AddTrade2.jsx" },
  ];
  const bottomItems = [
    { icon: <Settings size={20} />, title: "Settings" },
    { icon: <HelpCircle size={20} />, title: "Help Center" },
  ];

  // Conditional classes based on theme
  const bgColor = isDark ? "bg-gray-900" : "bg-white";
  const textColor = isDark ? "text-white" : "text-gray-800";
  const inputBgColor = isDark ? "bg-gray-800" : "bg-gray-50";
  const inputTextColor = isDark ? "text-gray-300" : "text-gray-600";
  const hoverBgColor = isDark ? "hover:bg-gray-800" : "hover:bg-gray-50";
  const iconColor = isDark ? "text-gray-400" : "text-gray-500";
  const linkColor = isDark
    ? "text-gray-400 hover:text-blue-400"
    : "text-gray-500 hover:text-blue-600";

  // Common icon container class for consistent alignment
  const iconContainerClass = collapsed
    ? "w-full flex justify-center"
    : "w-6 flex justify-center";

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className={`fixed top-4 left-4 z-30 md:hidden p-2 rounded-full shadow-md ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
        onClick={toggleSidebar}
        aria-label="Toggle navigation"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar - Desktop and Mobile */}
      <div
        className={`fixed h-screen ${bgColor} ${textColor} shadow-lg transition-all duration-300 ease-in-out z-30 flex flex-col
          ${
            isMobile
              ? isOpen
                ? "inset-0 w-full"
                : "-left-full w-full"
              : collapsed
              ? "w-20 left-0"
              : "w-64 left-0"
          }`}
      >
        {/* Close Button (Mobile) */}
        {isMobile && (
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-opacity-20 bg-gray-500"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        )}

        {/* Desktop Toggle Button */}
        {!isMobile && (
          <button
            className={`absolute -right-3 top-20 p-1.5 rounded-full shadow-md ${
              isDark ? "bg-gray-800 text-gray-300" : "bg-white text-gray-600"
            }`}
            onClick={toggleSidebar}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}

        {/* Logo */}
        <div className="flex items-center justify-center py-6">
          <img
            src={Img2}
            alt="JOT Logo"
            className="w-10 h-10 rounded-full shadow-md object-cover"
          />
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2">
          <div className="relative">
            {(!collapsed || isMobile) && (
              <>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search size={16} className={iconColor} />
                </span>
                <input
                  type="text"
                  placeholder="Search..."
                  className={`w-full py-2 pl-10 pr-4 ${inputBgColor} rounded-lg text-sm ${inputTextColor} focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all`}
                />
              </>
            )}
            {collapsed && !isMobile && (
              <button
                className={`w-full flex justify-center py-2 ${inputBgColor} rounded-lg`}
              >
                <Search size={18} className={iconColor} />
              </button>
            )}
          </div>
        </div>


        {/* Menu Items - Main navigation */}
        <div className="flex-grow px-3 py-6">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-blue-600 text-white shadow-md"
                    : `${
                        isDark ? "text-gray-300" : "text-gray-600"
                      } ${hoverBgColor} hover:text-${
                        isDark ? "white" : "gray-900"
                      }`
                }`}
              >
                <div
                  className={
                    isMobile ? "w-6 flex justify-center" : iconContainerClass
                  }
                >
                  <Home size={20} className={iconColor} />
                </div>
                {(!collapsed || isMobile) && (
                  <span className="ml-3 font-medium">Dashboard</span>
                )}
              </Link>
            </li>
              <li>
              <Link
                to="trades"
                className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-blue-600 text-white shadow-md"
                    : `${
                        isDark ? "text-gray-300" : "text-gray-600"
                      } ${hoverBgColor} hover:text-${
                        isDark ? "white" : "gray-900"
                      }`
                }`}
              >
                <div
                  className={
                    isMobile ? "w-6 flex justify-center" : iconContainerClass
                  }
                >
                  <BarChart2 size={20} />
                  
                </div>
                {(!collapsed || isMobile) && (
                  <span className="ml-3 font-medium">Trades</span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-blue-600 text-white shadow-md"
                    : `${
                        isDark ? "text-gray-300" : "text-gray-600"
                      } ${hoverBgColor} hover:text-${
                        isDark ? "white" : "gray-900"
                      }`
                }`}
              >
                <div
                  className={
                    isMobile ? "w-6 flex justify-center" : iconContainerClass
                  }
                >
                  <Home size={20} className={iconColor} />
                </div>
                {(!collapsed || isMobile) && (
                  <span className="ml-3 font-medium">Accounts</span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-blue-600 text-white shadow-md"
                    : `${
                        isDark ? "text-gray-300" : "text-gray-600"
                      } ${hoverBgColor} hover:text-${
                        isDark ? "white" : "gray-900"
                      }`
                }`}
              >
                <div
                  className={
                    isMobile ? "w-6 flex justify-center" : iconContainerClass
                  }
                >
                  <BarChart2 size={20} />
                </div>
                {(!collapsed || isMobile) && (
                  <span className="ml-3 font-medium">Analysis</span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-blue-600 text-white shadow-md"
                    : `${
                        isDark ? "text-gray-300" : "text-gray-600"
                      } ${hoverBgColor} hover:text-${
                        isDark ? "white" : "gray-900"
                      }`
                }`}
              >
                <div
                  className={
                    isMobile ? "w-6 flex justify-center" : iconContainerClass
                  }
                >
                   <Bot size={20} />
                </div>
                {(!collapsed || isMobile) && (
                  <span className="ml-3 font-medium">Bot</span>
                )}
              </Link>
            </li>
            
           
          </ul>
        </div>

        {/* Secondary Navigation and Settings */}
        <div className="px-3 py-2">
          {/* Settings & Help */}
          <ul className="space-y-2">
            {bottomItems.map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  className={`flex items-center px-3 py-3 rounded-lg ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  } ${hoverBgColor} hover:text-${
                    isDark ? "white" : "gray-900"
                  } transition-colors duration-200`}
                >
                  <div
                    className={
                      isMobile ? "w-6 flex justify-center" : iconContainerClass
                    }
                  >
                    {item.icon}
                  </div>
                  {(!collapsed || isMobile) && (
                    <span className="ml-3 font-medium">{item.title}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Theme Toggle */}
        <button
          className={`flex items-center px-3 py-3 rounded-lg ${hoverBgColor} transition-colors duration-200 mb-2 mx-3 bg-blue-600 text-white shadow-md`}
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <div
            className={
              isMobile ? "w-6 flex justify-center" : iconContainerClass
            }
          >
            {isDark ? (
              <Moon size={18} className="text-gray-500" />
            ) : (
              <Sun size={18} className="text-orange-600" />
            )}
          </div>
          {(!collapsed || isMobile) && (
            <span className="ml-3 font-medium text-gray-300">
              {isDark ? "Dark Mode" : "Light Mode"}
            </span>
          )}
        </button>

        {/* User Profile*/}
        <div className="mt-auto px-3 py-4">
          {/* For expanded view or mobile */}
          {(!collapsed || isMobile) && (
            <div className="flex items-center p-2 mt-4 space-x-4">
              <img
                src={Img1}
                alt="User Profile"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold">John Doe</h2>
                <span className="flex items-center space-x-1">
                  <button
                    className={`text-xs hover:underline ${linkColor}`}
                    onClick={() => console.log("View profile clicked")}
                  >
                    john.doe@example.com
                  </button>
                </span>
              </div>
            </div>
          )}

          {/* For collapsed sidebar on desktop only */}
          {collapsed && !isMobile && (
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
Navigation.propTypes = {
  onToggle: PropTypes.func,
  onUpdate: PropTypes.func,
};

export default Navigation;
