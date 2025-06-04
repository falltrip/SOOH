import React from "react";
import { motion } from "framer-motion";
import { Menu, Bot } from "lucide-react"; // Removed Shield
import { Link } from "react-router-dom";

// Removed User from firebase/auth as currentUser is removed from props

interface NavbarProps {
  sections: Array<{
    id: string;
    title: string;
    icon: React.ElementType;
  }>;
  activeSection: string;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  // currentUser and isAdmin removed as they are no longer used
}

const Navbar = ({ sections, activeSection, toggleSidebar, isSidebarOpen }: NavbarProps) => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-40 w-full backdrop-blur-md bg-white/80 shadow-lg"
    >
      {/* Changed justify-between to justify-center and added relative for positioning context */}
      <div className="h-20 flex items-center justify-center relative px-6">
        {/* Left side: Toggle button, Bot icon, and new title. Positioned absolutely to the left. */}
        {/* Added top-1/2 and transform -translate-y-1/2 to vertically center the absolute element */}
        <div className="flex items-center space-x-3 absolute left-6 top-1/2 transform -translate-y-1/2">
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
          <Bot size={28} className="text-purple-600" />
          {/* Wrapped "Studio" text with Link to "/" */}
          <Link to="/">
            <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Studio
            </span>
          </Link>
        </div>

        {/* Centered Navigation links */}
        {/* The parent div's justify-center will now center this ul block */}
        <ul className="flex space-x-0 items-center">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <motion.li
                key={section.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href={`/SOOH/#${section.id}`}
                  className="flex items-center space-x-1 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors relative"
                >
                  <Icon size={20} className="text-gray-600" />
                  <span className="font-medium text-gray-800">
                    {section.title}
                  </span>
                  {activeSection === section.id && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </a>
              </motion.li>
            );
          })}
          {/* Admin Page Button and its li element have been removed */}
        </ul>
      </div>
    </motion.nav>
  );
};

export default Navbar;
