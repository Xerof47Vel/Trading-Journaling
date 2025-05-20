import React from "react";
import { Home, User, Briefcase, Settings, LogOut } from "lucide-react";

const HomeBeta = () => {
  const menuItems = [
    { label: "Home", icon: <Home />, link: "/home" },
    { label: "Profile", icon: <User />, link: "/profile" },
    { label: "Work", icon: <Briefcase />, link: "/work" },
    { label: "Settings", icon: <Settings />, link: "/settings" },
    { label: "Logout", icon: <LogOut />, link: "/logout" },
  ];

  const settingItems = [
    { label: "Dashboard", icon: <Home />, link: "/dashboard" },
    { label: "Account", icon: <User />, link: "/account" },
    { label: "Projects", icon: <Briefcase />, link: "/projects" },
  ];

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-slate-800 text-white py-4 px-6 flex flex-wrap items-center justify-between shadow-md">
        <div className="text-lg font-bold">
          <h1>JOT</h1>
        </div>

        {/* Menu Items */}
        <div className="flex flex-wrap space-x-4 items-center">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="flex items-center m-1 px-4 py-2 bg-slate-700 hover:text-gray-400 rounded-lg text-sm sm:text-base"
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </a>
          ))}
        </div>

        {/* Setting Items */}
        <div className="flex flex-wrap space-x-4 items-center">
          {settingItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="flex items-center m-1 px-4 py-2 bg-slate-700 hover:text-gray-400 rounded-lg text-sm sm:text-base"
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </a>
          ))}
        </div>
      </nav>
    </>
  );
};

export default HomeBeta;
