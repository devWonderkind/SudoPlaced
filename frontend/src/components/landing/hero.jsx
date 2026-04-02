"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import TextZRotate from "@/components/pixel-perfect/text-z-rotate";


export default function Hero() {

  return (
    <section className="relative flex flex-col items-center justify-center px-6 sm:px-12 lg:px-24 pt-20 pb-20 md:pt-44 md:pb-36 text-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-gray-50 dark:from-neutral-950 to-transparent z-10">
        <div
          className="absolute inset-0 opacity-30 dark:opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(200, 200, 200, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(200, 200, 200, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '90px 90px'
          }}
        />
      </div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-pink-500/20 dark:via-pink-300/30 dark:to-pink-700/30 blur-[140px] rounded-2xl" />
      </div>
      {/* Main Heading */}
      <div className='flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3'>
        <h1 className="max-w-6xl text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-neutral-900 dark:text-white" style={{ letterSpacing: '-0.03em', lineHeight: '1.15' }}>
          Your career journey,
        </h1>
        <TextZRotate className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight" style={{ letterSpacing: '-0.03em', lineHeight: '1.15' }} text="Organized" />
      </div>

      {/* Subheading */}
      <p className="mt-8 max-w-2xl sm:text-lg text-neutral-500 dark:text-white font-light" style={{ lineHeight: '1.75', letterSpacing: '0.01em' }}>
        Track applications, nail interviews, and follow up on time — all in one place. Turn the grind into a system.
      </p>

      {/* Dashboard Preview */}
      <div className="relative mt-8 md:mt-12 w-full max-w-5xl mx-auto p-10">
        {/* Main border container */}
        <div className="relative p-8">

          {/* Corners */}
          {/* Top-left corner */}
          <div className="absolute -top-[1px] -left-[1px] w-10 h-10 border-t-[3px] border-l-[3px] border-neutral-300/50  pointer-events-none z-20" />

          {/* Top-right corner */}
          <div className="absolute -top-[1px] -right-[1px] w-10 h-10 border-t-[3px] border-r-[3px] border-neutral-300/50 pointer-events-none z-20" />

          {/* Bottom-left corner */}
          <div className="absolute -bottom-[1px] -left-[1px] w-10 h-10 border-b-[3px] border-l-[3px] border-neutral-300/50 pointer-events-none z-20" />

          {/* Bottom-right corner */}
          <div className="absolute -bottom-[1px] -right-[1px] w-10 h-10 border-b-[3px] border-r-[3px] border-neutral-300/50 pointer-events-none z-20" />

          {/* Dashboard content */}
          <div className="relative z-10">
            <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-gray-50 dark:from-neutral-950 to-transparent z-10 pointer-events-none" />
            <Image src="/dashboard-wireframe.png" alt="Dashboard" width={1000} height={1000} />
            <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-gray-50 dark:from-neutral-950 to-transparent z-10 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
