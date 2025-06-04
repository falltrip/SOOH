import React from 'react';
import { motion } from 'framer-motion';
import { Bot, LogIn, LogOut, Menu, Shield } from 'lucide-react'; // Added Shield
import { Link } from 'react-router-dom'; // Added Link
import { auth } from '../firebaseClient';
import { signOut, User } from 'firebase/auth';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  openSignInModal: () => void;
  currentUser: User | null;
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
            className="p-1 text-gray-300 hover:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Close sidebar"
          >
            <Menu size={24} />
          </button>
          <Bot size={32} className="text-purple-400 flex-shrink-0" />
          <Link to="/">
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 truncate">
              Studio
            </span>
          </Link>
        </div>

        {/* Sign In / Sign Out Button */}
        {currentUser ? (
          <button
            onClick={async () => {
              try {
                await signOut(auth);
              } catch (error) {
                console.error("Sign out error:", error);
              }
            }}
            className="flex items-center justify-center w-full p-2 mb-6 bg-red-600 hover:bg-red-700 rounded-lg text-white" // Adjusted mb-6
          >
            <LogOut size={20} className="mr-2" />
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => {
              openSignInModal();
            }}
            className="flex items-center justify-center w-full p-2 mb-6 bg-purple-600 hover:bg-purple-700 rounded-lg text-white" // Adjusted mb-6
          >
            <LogIn size={20} className="mr-2" />
            Sign In
          </button>
        )}

        {/* Admin Page Button */}
        {isAdmin && currentUser && (
          <Link
            to="/admin"
            onClick={toggleSidebar} // Close sidebar on click
            className="flex items-center justify-center w-full p-2 mb-6 bg-green-600 hover:bg-green-700 rounded-lg text-white" // Changed color for distinction, adjusted mb-6
          >
            <Shield size={20} className="mr-2" />
            Admin Page
          </Link>
        )}

        {/* Spacer div to push visitor stats to the bottom if no admin button is present, or after admin button */}
        <div className="flex-grow"></div>


        {/* Bottom Visitor Stats - Ensured it's the last element group before closing motion.div */}
        <div className="mt-auto pt-6 border-t border-gray-700"> {/* Added pt-6 and border-t for separation */}
          <p className="text-sm text-gray-400">Today's Visitors: 0</p>
          <p className="text-sm text-gray-400">Total Visitors: 0</p>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
