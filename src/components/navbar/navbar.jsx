import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaChartLine, FaCog, FaBook, FaMoon, FaSun, FaQuestionCircle } from "react-icons/fa";
import Logo from "../../assets/logoTradingJournal.png"; 
import LogoMobile from "../../assets/logoTradingJournalMobile.png";

function Navigation() {
  document.title = "The Journal";
  const [isDark, setIsDark] = useState(false);
  const [isMobileSidebarCollapsed, setIsMobileSidebarCollapsed] = useState(false);
  const [userFullName] = useState("John Doe");
  const [userRole] = useState("Trader");
  const location = useLocation();

  // Check if current route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Function to toggle dark mode
  const toggleDark = () => {
    setIsDark(!isDark);
  };


  // Check window size and update sidebar state
  const checkWindowSize = () => {
    setIsMobileSidebarCollapsed(window.innerWidth < 1024);
  };

  useEffect(() => {
    checkWindowSize();
    window.addEventListener("resize", checkWindowSize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkWindowSize);
    };
  }, []);

  // Get avatar label from user's name
  const getAvatarLabel = () => {
    return userFullName ? userFullName.charAt(0).toUpperCase() : "T";
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div 
        className={`h-screen transition-all duration-300 ease-in-out flex flex-col justify-between p-4 ${
          isMobileSidebarCollapsed ? "w-20" : "w-64"
        } ${isDark ? "bg-neutral-950 text-white" : "bg-white text-black"}`}
      >
        {/* Top section - Logo */}
        <div>
          <div className={`flex ${isMobileSidebarCollapsed ? "flex-col items-center" : "flex-row items-baseline"}`}>
            <div className="logo-container">
              {isMobileSidebarCollapsed ? (
                <img
                  src={LogoMobile}
                  alt="TJ Logo"
                  className="mr-4 mt-2"
                />
              ) : (
                <img
                  src={Logo}
                  alt="The Journal Logo"
                  className="mr-4 mt-2 ml-2"
                />
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className={`mt-8 ${isDark ? "text-white" : "text-black"}`}>
            <ul>
              {/* Home */}
              <li className="mb-2">
                <Link 
                  to="/" 
                  className={`flex items-center h-12 px-4 rounded-xl ${
                    isActive("/") 
                      ? isDark 
                        ? "bg-neutral-800 text-white" 
                        : "bg-gray-200 text-black"
                      : "hover:bg-gray-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  <FaHome className="text-lg" />
                  {!isMobileSidebarCollapsed && <span className="ml-4">Home</span>}
                </Link>
              </li>

              {/* Trade Log */}
              <li className="mb-2">
                <Link 
                  to="/addtrade" 
                  className={`flex items-center h-12 px-4 rounded-xl ${
                    isActive("/addtrade") 
                      ? isDark 
                        ? "bg-neutral-800 text-white" 
                        : "bg-gray-200 text-black"
                      : "hover:bg-gray-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  <FaBook className="text-lg" />
                  {!isMobileSidebarCollapsed && <span className="ml-4">Trade Log</span>}
                </Link>
              </li>

              {/* Statistics */}
              <li className="mb-2">
                <Link 
                  to="/statistics" 
                  className={`flex items-center h-12 px-4 rounded-xl ${
                    isActive("/statistics") 
                      ? isDark 
                        ? "bg-neutral-800 text-white" 
                        : "bg-gray-200 text-black"
                      : "hover:bg-gray-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  <FaChartLine className="text-lg" />
                  {!isMobileSidebarCollapsed && <span className="ml-4">Statistics</span>}
                </Link>
              </li>
            </ul>

            {/* Additional options */}
            <div className="mt-12 pt-4 border-t border-gray-200 dark:border-neutral-800">
              <ul>
                {/* Dark/Light Mode Toggle */}
                <li className="mb-2">
                  <button 
                    onClick={toggleDark} 
                    className="flex items-center w-full h-12 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800"
                  >
                    {isDark ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
                    {!isMobileSidebarCollapsed && (
                      <span className="ml-4">{isDark ? "Light Mode" : "Dark Mode"}</span>
                    )}
                  </button>
                </li>

                {/* Help */}
                <li className="mb-2">
                  <button 
                    className="flex items-center w-full h-12 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800"
                  >
                    <FaQuestionCircle className="text-lg" />
                    {!isMobileSidebarCollapsed && <span className="ml-4">Help</span>}
                  </button>
                </li>

                {/* Settings */}
                <li className="mb-2">
                  <button 
                    onClick="/setting" 
                    className="flex items-center w-full h-12 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800"
                  >
                    <FaCog className="text-lg" />
                    {!isMobileSidebarCollapsed && <span className="ml-4">Settings</span>}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom section - User info */}
        <div className="mt-auto">
          <div className={`flex items-center p-4 rounded-xl ${isDark ? "bg-neutral-900" : "bg-gray-100"}`}>
            <div className={`w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 ${isDark ? "border border-neutral-700" : "border border-gray-300"}`}>
              {getAvatarLabel()}
            </div>
            {!isMobileSidebarCollapsed && (
              <div className="ml-3 transition-opacity duration-300">
                <div className="font-bold">{userFullName}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{userRole}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content container */}
      <div className="flex-1 min-h-screen">
        {/* Your page content would go here */}
      </div>
    </div>
  );
}

export default Navigation;