"use client";

import React from 'react';
import { IconTarget } from '@tabler/icons-react';
// import { IconRocket } from '@tabler/icons-react';


export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center bg-neutral-950">
      <nav className="flex items-center justify-between gap-8 px-6 py-3 border-b border-neutral-800  w-full ">
        
        {/* Logo */}
          <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-200">
              <IconTarget className="w-5 h-5 text-white" stroke={2.5} />
            </div>
            <span className="font-bold text-lg tracking-tight text-white hidden sm:block">
              sudoplaced
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          <a href="#features" className="px-4 py-2 text-neutral-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 text-sm font-medium">
            Features
          </a>
          <a href="#how-it-works" className="px-4 py-2 text-neutral-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 text-sm font-medium">
            How It Works
          </a>
        </div>
      </nav>
    </div>
  );
}
