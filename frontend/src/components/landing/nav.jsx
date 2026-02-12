"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { IconTarget, IconMenu2, IconX } from '@tabler/icons-react';

import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-neutral-950">
      <nav className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-neutral-800 w-full">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center">
              <IconTarget className="w-4 h-4 sm:w-5 sm:h-5 text-white" stroke={2.5} />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-white">
              sudoplaced
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="#features" className="px-4 py-2 text-neutral-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 text-sm font-medium">
            Features
          </Link>
          <Link href="#how-it-works" className="px-4 py-2 text-neutral-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 text-sm font-medium">
            How It Works
          </Link>
          <Link href="/login" className='cursor-pointer'>
            <Button>
              Login
            </Button>
          </Link>
    
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition-colors duration-200"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <IconX className="w-5 h-5 text-white" stroke={2} />
          ) : (
            <IconMenu2 className="w-5 h-5 text-white" stroke={2} />
          )}
        </button>
      </nav>

      {/* Mobile Navigation Drawer */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 bg-neutral-950/95 backdrop-blur-lg border-b border-neutral-800 overflow-hidden transition-all duration-300 ease-out ${
          isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col px-4 py-4 gap-2">
          <Link 
            href="#features" 
            onClick={() => setIsMenuOpen(false)}
            className="px-4 py-3 text-neutral-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 text-base font-medium"
          >
            Features
          </Link>
          <Link 
            href="#how-it-works" 
            onClick={() => setIsMenuOpen(false)}
            className="px-4 py-3 text-neutral-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 text-base font-medium"
          >
            How It Works
          </Link>

          <Link href="/login">
            <Button>
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
