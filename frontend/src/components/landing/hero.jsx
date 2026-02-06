"use client";

import React from 'react';
import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Hero() {
  // hero text animation
  const container = useRef(null);
  
  useGSAP(() => {
    const scrambledText = 'ornagiedz';
    const correctText = 'organized';
    
    const wrapper = container.current.querySelector('.scramble-wrapper');
    
    // Create initial scrambled letters
    wrapper.innerHTML = scrambledText
      .split('')
      .map((char, index) => {
        return `<span class="inline-block relative">
          <span class="char-old inline-block">${char}</span>
          <span class="char-new inline-block absolute left-0 top-0">${correctText[index]}</span>
        </span>`;
      })
      .join('');

    const tl = gsap.timeline({ delay: 0.5 });

    // Animate each character
    scrambledText.split('').forEach((char, index) => {
      const charWrapper = wrapper.children[index];
      const oldChar = charWrapper.querySelector('.char-old');
      const newChar = charWrapper.querySelector('.char-new');

      // Set initial positions
      gsap.set(newChar, { y: -50, opacity: 0 });

      // Animate at staggered timing
      tl.to(oldChar, {
        y: 50,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in"
      }, index * 0.1)
      .to(newChar, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      }, index * 0.1);
    });

  }, { scope: container });

  
  return (
    <section className="relative flex flex-col items-center justify-center px-4 pt-24 pb-24 md:pt-40 md:pb-32 text-center overflow-hidden">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 rounded-full blur-3xl -z-10" />

      {/* Main Heading */}
      <div ref={container}>
      <h1 className="max-w-6xl text-2xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
        Your career journey, <span className="scramble-wrapper inline-block">ornagiedz</span>
      </h1>
    </div>

      {/* Subheading */}
      <p className="mt-6 max-w-3xl text-base sm:text-lg text-neutral-400">
        Everything you need to navigate the job market in one place. Manage your pipeline with ease, never miss a follow-up, and turn your job search into a science. The grind is better together.
      </p>

      {/* Waitlist Input */}
      <div className="mt-6 relative flex flex-col sm:flex-row items-center w-full max-w-lg
        bg-white/5 backdrop-blur-md
        border border-white/10 
        rounded-2xl sm:rounded-full
        p-2 sm:p-1.5
        gap-2 sm:gap-0
        transition-all duration-300">
        <input 
          type="email" 
          placeholder="Enter your email" 
          className="w-full sm:flex-1 h-11 px-4 sm:px-5 bg-transparent
            text-white placeholder:text-neutral-500 
            focus:outline-none
            text-sm sm:text-base
            text-center sm:text-left"
        />
        <button 
          className="relative w-full sm:w-auto h-11 px-5 sm:px-6 rounded-xl sm:rounded-full whitespace-nowrap
            bg-gradient-to-b from-white/95 via-white/85 to-white/75
            text-neutral-900 font-semibold text-sm
            border border-white/50
            shadow-[0_2px_16px_rgba(255,255,255,0.2),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(0,0,0,0.1)]
            active:scale-[0.98]
            transition-all duration-300 ease-out
            cursor-pointer
            overflow-hidden
            group"
        >
          {/* Shine effect */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
          <span className="relative">Get Early Access</span>
        </button>
      </div>

      {/* Dashboard Preview with Animated Background */}
      <div className="relative mt-8 md:mt-12 w-full max-w-5xl mx-auto overflow-visible">
        {/* Animated gradient background using Motion - Sunset Style */}
        <div className="absolute -inset-8 md:-inset-16 z-0 overflow-visible pointer-events-none">
          {/* Main warm glow - bottom center (orange/amber horizon) */}
          <motion.div
            className="absolute bottom-0 left-1/2 w-[120%] h-[60%] bg-gradient-to-t from-orange-500/40 via-amber-500/25 to-transparent rounded-full blur-3xl"
            animate={{
              x: ["-50%", "-48%", "-52%", "-50%"],
              y: ["10%", "5%", "15%", "10%"],
              scale: [1, 1.05, 0.98, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Left warm glow (orange/red) */}
          <motion.div
            className="absolute bottom-1/4 -left-[10%] w-[50%] h-[70%] bg-gradient-to-tr from-orange-600/35 via-red-500/20 to-transparent rounded-full blur-3xl"
            animate={{
              x: ["0%", "5%", "-5%", "0%"],
              y: ["0%", "-10%", "5%", "0%"],
              scale: [1, 1.1, 0.95, 1],
              opacity: [0.7, 0.9, 0.6, 0.7],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Right warm glow (orange/amber) */}
          <motion.div
            className="absolute bottom-1/4 -right-[10%] w-[50%] h-[70%] bg-gradient-to-tl from-amber-500/35 via-orange-500/20 to-transparent rounded-full blur-3xl"
            animate={{
              x: ["0%", "-5%", "5%", "0%"],
              y: ["0%", "5%", "-10%", "0%"],
              scale: [1, 0.95, 1.1, 1],
              opacity: [0.7, 0.6, 0.9, 0.7],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Top blue glow (cool contrast) */}
          <motion.div
            className="absolute top-0 left-1/2 w-[80%] h-[50%] bg-gradient-to-b from-blue-600/25 via-indigo-500/15 to-transparent rounded-full blur-3xl"
            animate={{
              x: ["-50%", "-45%", "-55%", "-50%"],
              y: ["0%", "5%", "-5%", "0%"],
              scale: [1, 1.08, 0.95, 1],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Center blend glow (warm/cool transition) */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-[60%] h-[40%] bg-gradient-to-r from-orange-500/15 via-transparent to-blue-500/15 rounded-full blur-3xl"
            animate={{
              x: ["-50%", "-45%", "-55%", "-50%"],
              y: ["-50%", "-55%", "-45%", "-50%"],
              scale: [1, 1.15, 0.9, 1],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Image container */}
        <div className="relative z-10">
          {/* Main image wrapper */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/50 backdrop-blur-sm shadow-2xl shadow-black/50">
            {/* Top reflection */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            
            {/* Dashboard image with blur */}
            <img 
              src="/dashboard-prototype.png" 
              alt="Sudo Placed Dashboard Preview" 
              className="w-full h-auto object-cover blur-[6px] sm:blur-[8px]"
            />
            
            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/30">
              <div className="relative">
                {/* Glow effect behind text */}
                <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-orange-500/40 via-pink-500/40 to-purple-500/40 scale-150" />
                
                {/* Main text container */}
                <div className="relative px-4 sm:px-10 py-2 sm:py-4 rounded-2xl sm:rounded-3xl backdrop-blur-md">
                  <span className="text-md sm:text-2xl md:text-xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-orange-200 to-white bg-clip-text text-transparent">
                    Coming Soon
                  </span>
                  
                  {/* Animated dots */}
                  <span className="inline-flex ml-1 sm:ml-2">
                    <span className="animate-pulse text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-orange-500" style={{ animationDelay: '0ms' }}>.</span>
                    <span className="animate-pulse text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-orange-500" style={{ animationDelay: '200ms' }}>.</span>
                    <span className="animate-pulse text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-orange-500" style={{ animationDelay: '400ms' }}>.</span>
                  </span>
                </div>
              </div>
            </div>
            
            {/* Bottom fade overlay */}
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
