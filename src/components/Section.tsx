import React from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  id: string;
  title: string;
  description: string;
  image: string;
  Icon: React.ElementType;
}

const Section = ({ id, title, description, image, Icon }: SectionProps) => {
  return (
    <section
      id={id}
      className="min-h-screen py-20 px-4 lg:px-8 bg-gradient-to-b from-gray-50 to-white"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center mb-12">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="bg-blue-600 p-4 rounded-2xl shadow-lg mr-6"
          >
            <Icon size={32} className="text-white" />
          </motion.div>
          <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            {title}
          </h2>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-2xl text-gray-600 leading-relaxed">
              {description}
            </p>
            <motion.a
              href={`#${id}-details`}
              className="inline-flex items-center px-6 py-3 text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.a>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src={image}
                alt={title}
                className="w-full h-[400px] object-cover transform transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-purple-600/30 group-hover:opacity-0 transition-opacity duration-500" />
            </motion.div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Section;