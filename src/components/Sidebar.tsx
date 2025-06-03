import React from 'react';
import { motion } from 'framer-motion';
import { Bot, LogIn } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Overlay to close sidebar on click */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? "0%" : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 bottom-0 w-64 bg-gray-800 text-white shadow-lg z-50 flex flex-col p-5"
      >
        {/* Top Icon */}
        <div className="mb-10">
          <Bot size={40} className="text-purple-400" />
        </div>

        {/* Sign In Button */}
        <button
          onClick={() => console.log("Sign in clicked")} // Replace with actual sign-in logic
          className="flex items-center justify-center w-full p-2 mb-10 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
        >
          <LogIn size={20} className="mr-2" />
          Sign In
        </button>

        {/* Bottom Visitor Stats */}
        <div className="flex-grow mt-auto">
          {/* Added flex-grow to the bottom stats to push it down, effectively replacing the old flex-grow div */}
          <p className="text-sm text-gray-400">Today's Visitors: 0</p>
          <p className="text-sm text-gray-400">Total Visitors: 0</p>
        </div>

        {/* Optional: Close button inside the sidebar for mobile */}
        <button
            onClick={toggleSidebar}
            className="lg:hidden absolute top-4 right-4 text-gray-300 hover:text-white"
            aria-label="Close sidebar"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </motion.div>
    </>
  );
};

export default Sidebar;
