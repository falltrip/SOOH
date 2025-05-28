import React from "react";
import { motion } from "framer-motion";

interface NavbarProps {
  sections: Array<{
    id: string;
    title: string;
    icon: React.ElementType;
  }>;
  activeSection: string;
}

const Navbar = ({ sections, activeSection }: NavbarProps) => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 z-40 w-full backdrop-blur-md bg-white/80 shadow-lg"
    >
      <div className="h-20 flex items-center justify-center px-6">
        <ul className="flex space-x-0 items-center">
          <li className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Portfolio
          </li>
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
        </ul>
      </div>
    </motion.nav>
  );
};

export default Navbar;
