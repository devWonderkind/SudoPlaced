"use client"

import React from 'react';
import { motion } from 'framer-motion';
import {
  IconBrandX,
  IconBrandGithub,
  IconBrandLinkedin,
  IconTerminal2,
  IconCircleFilled,
  IconTarget
} from '@tabler/icons-react';

// Reuse your MagneticIcon wrapper for the social links
const SocialIcon = ({ icon: Icon, href }) => (
  <a
    href={href}
    className="w-10 h-10 rounded-full bg-white border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:border-neutral-400 dark:hover:text-white dark:hover:border-neutral-600 transition-all duration-300"
  >
    <Icon size={20} />
  </a>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-neutral-950 pt-24 pb-12 px-6 border-t border-neutral-200 dark:border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

          {/* Brand Column */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-200">
                  <IconTarget className="w-5 h-5 text-white" stroke={2.5} />
                </div>
                <span className="font-bold text-lg tracking-tight text-neutral-900 dark:text-white hidden sm:block">
                  sudoplaced
                </span>
              </div>
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
              The ultimate workspace for the modern job seeker. From first application to first paycheck.
            </p>
            <div className="flex gap-3">
              <SocialIcon icon={IconBrandX} href="#" />
              <SocialIcon icon={IconBrandGithub} href="#" />
              <SocialIcon icon={IconBrandLinkedin} href="#" />
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-neutral-900 dark:text-white font-medium text-sm">Product</h4>
            <ul className="text-neutral-500 text-sm space-y-3">
              <li className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">SCRUM Board</li>
              <li className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">KeyNotes</li>
              <li className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">Calender</li>
            </ul>
          </div>


          {/* Newsletter / CTA Column */}
          <div className="md:col-span-4 space-y-6">
            <h4 className="text-neutral-900 dark:text-white font-medium text-sm">Stay in the Loop</h4>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 rounded-xl py-3 px-4 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button className="absolute right-2 top-1.5 bg-neutral-900 text-white dark:bg-white dark:text-black text-xs font-bold px-4 py-2.5 rounded-md hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors">
                Join
              </button>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-200 dark:border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-400 dark:text-neutral-600 text-xs font-mono">
            © {currentYear} sudoplaced. SHIFTING CAREERS INTERNALLY.
          </p>
          <div className="flex gap-6 text-neutral-400 dark:text-neutral-600 text-xs font-mono">
            <span className="hover:text-neutral-900 dark:hover:text-white cursor-pointer transition-colors">PRIVACY</span>
            <span className="hover:text-neutral-900 dark:hover:text-white cursor-pointer transition-colors">TERMS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}