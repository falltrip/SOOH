import React from "react";
import { motion } from "framer-motion";
import { Menu, Bot, Shield } from "lucide-react"; // Added Bot import
import { Link } from "react-router-dom"; // Import Link

import { User } from "firebase/auth";

interface NavbarProps {
  sections: Array<{
    id: string;
    title: string;
    icon: React.ElementType;
  }>;
  activeSection: string;
  toggleSidebar: () => void; // Added toggleSidebar
  isSidebarOpen: boolean;    // Added isSidebarOpen
  currentUser?: User | null;
  isAdmin?: boolean;
}

const Navbar = ({ sections, activeSection, toggleSidebar, isSidebarOpen, currentUser, isAdmin }: NavbarProps) => { // Added props
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-40 w-full backdrop-blur-md bg-white/80 shadow-lg" // Added left-0 for full width consistency
    >
      <div className="h-20 flex items-center justify-between px-6"> {/* Changed justify-center to justify-between */}
        {/* Left side: Toggle button, Bot icon, and new title */}
        <div className="flex items-center space-x-3"> {/* Adjusted spacing to space-x-3 */}
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
          <Bot size={28} className="text-purple-600" /> {/* Added Bot icon */}
          <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Studio {/* Changed text to Studio */}
          </span>
        </div>

        {/* Right side: Navigation links */}
        <ul className="flex space-x-0 items-center">
          {/* Removed the old "Portfolio" li item */}
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <motion.li
                key={section.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href={`#${section.id}`}
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
          {/* Admin Page Button */}
          {isAdmin && currentUser && (
            <motion.li
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/admin"
                className="flex items-center space-x-1 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors relative"
              >
                <Shield size={20} className="text-white" />
                <span className="font-medium">Admin Page</span>
              </Link>
            </motion.li>
          )}
        </ul>
      </div>
    </motion.nav>
  );
};

export default Navbar;
