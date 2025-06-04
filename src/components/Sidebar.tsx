import React from 'react';
import { motion } from 'framer-motion';
import { Bot, LogIn, LogOut, Menu } from 'lucide-react';
import { auth } from '../firebaseClient';
import { signOut, User } from 'firebase/auth'; // Import User type

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  openSignInModal: () => void;
  currentUser: User | null; // Updated type
  isAdmin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, openSignInModal, currentUser, isAdmin }) => {
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
        {/* New Top Area: Close Button, Bot Icon, and "Studio" Text */}
        <div className="flex items-center space-x-3 mb-10 pr-2">
          <button
            onClick={toggleSidebar}
            className="p-1 text-gray-300 hover:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500" // Removed lg:hidden
            aria-label="Close sidebar"
          >
            <Menu size={24} />
          </button>
          <Bot size={32} className="text-purple-400 flex-shrink-0" />
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 truncate">
            Studio
          </span>
        </div>

        {/* Sign In / Sign Out Button */}
        {currentUser ? (
          <button
            onClick={async () => {
              try {
                await signOut(auth);
                // console.log("User signed out");
                // toggleSidebar(); // Optionally close sidebar on sign out
              } catch (error) {
                console.error("Sign out error:", error);
              }
            }}
            className="flex items-center justify-center w-full p-2 mb-10 bg-red-600 hover:bg-red-700 rounded-lg text-white"
          >
            <LogOut size={20} className="mr-2" />
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => {
              openSignInModal();
              // toggleSidebar(); // Optionally close sidebar when opening modal
            }}
            className="flex items-center justify-center w-full p-2 mb-10 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
          >
            <LogIn size={20} className="mr-2" />
            Sign In
          </button>
        )}

        {/* Bottom Visitor Stats */}
        <div className="flex-grow mt-auto">
          {/* Added flex-grow to the bottom stats to push it down, effectively replacing the old flex-grow div */}
          <p className="text-sm text-gray-400">Today's Visitors: 0</p>
          <p className="text-sm text-gray-400">Total Visitors: 0</p>
        </div>

        {/* The old SVG close button has been removed and replaced by the Menu button in the new top area */}
      </motion.div>
    </>
  );
};

export default Sidebar;
