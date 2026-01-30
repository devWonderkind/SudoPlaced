"use client";

import React from 'react';
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-4">
      <nav className="flex items-center justify-between gap-8 px-6 py-3 
        bg-white/5 backdrop-blur-md 
        border border-white/20 
        rounded-full 
        shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
        transition-all duration-300 hover:border-white/20
        max-w-3xl w-full">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          {/* <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white to-neutral-400 flex items-center justify-center">
            <span className="text-neutral-900 font-bold text-sm">SP</span>
          </div> */}
          <span className="font-bold text-lg tracking-tight text-white hidden sm:block">
            {/* SUDO PLACED */}
            .sudoplaced
          </span>
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

        {/* CTA Button */}
        {/* <Button className="bg-white text-neutral-900 hover:bg-neutral-100 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer">
          Join Waitlist
        </Button> */}
      </nav>
    </div>
  );
}
