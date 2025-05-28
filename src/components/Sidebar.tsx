import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  sections: Array<{
    id: string;
    title: string;
    icon: React.ElementType;
  }>;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ isOpen, sections, activeSection, onSectionChange }: SidebarProps) => {
  return (
    <AnimatePresence>
      {(isOpen || window.innerWidth >= 1024) && (
        <motion.aside
          initial={{ x: -264 }}
          animate={{ x: 0 }}
          exit={{ x: -264 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 z-30 w-64 h-screen bg-white shadow-lg"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Portfolio</h2>
            <nav>
              <ul className="space-y-4">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        onClick={() => onSectionChange(section.id)}
                        className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${
                          activeSection === section.id
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon size={24} />
                        <span className="font-medium">{section.title}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;