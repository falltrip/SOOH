import React from 'react';
import { Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-gray-300 py-12 px-6 sm:px-8 lg:px-16">
      <div className="container mx-auto">
        {/* Top Part (Three Sections Wrapper) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Studio SOOH Section (First Column) */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Studio SOOH</h3>
            <p className="text-sm leading-relaxed">
              We maximize data utilization for individuals and businesses with AI-based automated data onboarding solutions.
            </p>
          </div>

          {/* Quick Links Section (Second Column) */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-purple-400 transition-colors text-sm">Key Features</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors text-sm">How it Works</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors text-sm">Pricing Policy</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors text-sm">Blog</a></li>
            </ul>
          </div>

          {/* Contact Us Section (Third Column) */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <p className="text-sm mb-1">Email: contact@futureflow.ai</p>
            <p className="text-sm mb-3">Address: 253 Teheran-ro, Gangnam-gu, Seoul, 06124, South Korea, Studio SOOH Bd</p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook">
                <Facebook size={20} className="hover:text-purple-400 transition-colors" />
              </a>
              <a href="#" aria-label="Twitter">
                <Twitter size={20} className="hover:text-purple-400 transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <hr className="border-gray-700 my-8" />

        {/* Bottom Part (Copyright & Legal Links) */}
        <div className="text-center md:flex md:justify-between md:items-center text-sm">
          <p className="mb-2 md:mb-0">
            © 2025 FutureFlow AI. All rights reserved.
          </p>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
