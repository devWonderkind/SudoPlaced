"use client";

import React, { useEffect, useState } from 'react';
import TextZRotate from "@/components/pixel-perfect/text-z-rotate";
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconLayoutDashboard,
  IconBriefcase,
  IconNotes,
  IconBell,
  IconSettings,
  IconSearch,
  IconPlus,
  IconDotsVertical,
  IconArrowUpRight,
  IconCalendar,
  IconUser,
  IconTarget
} from '@tabler/icons-react';


/* ── Animated Dashboard Wireframe ── */
const DashboardPreview = () => {
  const [mounted, setMounted] = useState(false);
  const [activeNav, setActiveNav] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => { setMounted(true); }, []);

  const sidebarItems = [
    { icon: IconLayoutDashboard, label: 'Dashboard', active: true },
    { icon: IconBriefcase, label: 'Pipeline' },
    { icon: IconNotes, label: 'KeyNotes' },
    { icon: IconBell, label: 'Reminders' },
    { icon: IconSettings, label: 'Settings' },
  ];

  const columns = [
    {
      title: 'Applied', color: 'bg-blue-500', count: 3,
      cards: [
        { company: 'Stripe', role: 'Frontend Eng.', time: '2d ago', color: 'border-l-blue-500' },
        { company: 'Vercel', role: 'Full-Stack Dev', time: '3d ago', color: 'border-l-cyan-500' },
        { company: 'Linear', role: 'React Dev', time: '5d ago', color: 'border-l-violet-500' },
      ]
    },
    {
      title: 'Interview', color: 'bg-yellow-500', count: 2,
      cards: [
        { company: 'Figma', role: 'Product Design', time: '1d ago', color: 'border-l-pink-500' },
        { company: 'Notion', role: 'Frontend Eng.', time: '4d ago', color: 'border-l-orange-500' },
      ]
    },
    {
      title: 'Offer', color: 'bg-green-500', count: 1,
      cards: [
        { company: 'Raycast', role: 'Software Eng.', time: 'Today', color: 'border-l-green-500' },
      ]
    },
  ];

  const stats = [
    { label: 'Total', value: '24', trend: '+3' },
    { label: 'Active', value: '6', trend: '+1' },
    { label: 'Response', value: '42%', trend: '+8%' },
  ];

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } }
  };
  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
  };

  return (
    <motion.div
      initial="hidden"
      animate={mounted ? "show" : "hidden"}
      variants={container}
      className="w-full rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/80 backdrop-blur-sm shadow-2xl shadow-black/50 select-none"
    >
      {/* Top reflection */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />

      <div className="flex h-[280px] sm:h-[380px] md:h-[480px]">
        {/* ── Sidebar ── */}
        <motion.div variants={item} className="hidden sm:flex flex-col w-14 md:w-48 bg-neutral-950/80 border-r border-white/5 py-3 px-2 md:px-3 flex-shrink-0">
          {/* Logo */}
          <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2 group cursor-pointer">
                     <div className="w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center">
                       <IconTarget className="w-2 h-2 sm:w-4 sm:h-4 text-white" stroke={2.5} />
                     </div>
                     <span className="font-bold text-base sm:text-md tracking-tight text-white">
                       sudoplaced
                     </span>
                   </div>
                 </div>

          {/* Nav Items */}
          <div className="space-y-0.5 flex-1">
            {sidebarItems.map((nav, i) => {
              const NavIcon = nav.icon;
              return (
                <motion.div
                  key={i}
                  variants={item}
                  onClick={() => setActiveNav(i)}
                  className={`flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    activeNav === i
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
                  }`}
                >
                  <NavIcon size={16} stroke={1.5} />
                  <span className="hidden md:block text-[11px] font-medium">{nav.label}</span>
                </motion.div>
              );
            })}
          </div>

          {/* User */}
          <motion.div variants={item} className="flex items-center gap-2 px-2 py-2 rounded-lg bg-white/5 mt-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <IconUser size={12} className="text-white" stroke={2} />
            </div>
            <div className="hidden md:block">
              <div className="text-[10px] text-white font-medium leading-tight">Aakanksha Chahal.</div>
              <div className="text-[8px] text-neutral-500">Pro Plan</div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Main Content ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <motion.div variants={item} className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <h2 className="text-white text-xs sm:text-sm font-semibold">Dashboard</h2>
              <span className="text-neutral-500 text-[10px] hidden sm:inline">6 active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5">
                <IconSearch size={12} className="text-neutral-500" stroke={1.5} />
                <span className="text-[10px] text-neutral-600">Search...</span>
              </div>
              <motion.div
                animate={{ boxShadow: ['0 0 0px rgba(59,130,246,0)', '0 0 12px rgba(59,130,246,0.3)', '0 0 0px rgba(59,130,246,0)'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 cursor-pointer hover:bg-blue-500 transition-colors"
              >
                <IconPlus size={12} className="text-white" stroke={2} />
                <span className="text-[10px] text-white font-medium hidden sm:inline">Add</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div variants={item} className="flex gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-3">
            {stats.map((s, i) => (
              <div key={i} className="flex-1 px-2 sm:px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-[8px] sm:text-[9px] text-neutral-500 uppercase tracking-wider">{s.label}</div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-white text-sm sm:text-base font-bold">{s.value}</span>
                  <span className="text-green-400 text-[8px] sm:text-[9px] font-medium">{s.trend}</span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Kanban Board */}
          <div className="flex-1 flex gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 pb-4 overflow-hidden">
            {columns.map((col, ci) => (
              <motion.div key={ci} variants={item} className="flex-1 flex flex-col min-w-0">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${col.color}`} />
                    <span className="text-[10px] sm:text-[11px] text-neutral-400 font-semibold">{col.title}</span>
                    <span className="text-[9px] text-neutral-600 bg-white/5 px-1.5 py-0.5 rounded-full">{col.count}</span>
                  </div>
                  <IconDotsVertical size={12} className="text-neutral-600" stroke={1.5} />
                </div>

                {/* Cards */}
                <div className="space-y-2 flex-1">
                  {col.cards.map((card, cardIdx) => {
                    const globalIdx = ci * 10 + cardIdx;
                    return (
                      <motion.div
                        key={cardIdx}
                        variants={item}
                        onHoverStart={() => setHoveredCard(globalIdx)}
                        onHoverEnd={() => setHoveredCard(null)}
                        animate={hoveredCard === globalIdx ? { y: -2, transition: { duration: 0.2 } } : { y: 0 }}
                        className={`bg-white/[0.03] border border-white/5 border-l-2 ${card.color} rounded-lg p-2 sm:p-2.5 cursor-pointer hover:bg-white/[0.06] hover:border-white/10 transition-colors`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="min-w-0">
                            <div className="text-[10px] sm:text-[11px] text-white font-medium truncate">{card.company}</div>
                            <div className="text-[8px] sm:text-[9px] text-neutral-500 truncate mt-0.5">{card.role}</div>
                          </div>
                          <IconArrowUpRight size={10} className="text-neutral-600 flex-shrink-0 ml-1" stroke={1.5} />
                        </div>
                        <div className="flex items-center gap-1 mt-1.5">
                          <IconCalendar size={8} className="text-neutral-600" stroke={1.5} />
                          <span className="text-[7px] sm:text-[8px] text-neutral-600">{card.time}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};


export default function Hero() {
  
  return (
    <section className="relative flex flex-col items-center justify-center px-4 pt-24 pb-24 md:pt-40 md:pb-32 text-center overflow-hidden">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 rounded-full blur-3xl -z-10" />

      {/* Main Heading */}
      <div className='flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2'>
      <h1 className="max-w-6xl text-2xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
        Your career journey,
      </h1>
        <TextZRotate className="text-2xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight" text="Organized" />
    </div>

      {/* Subheading */}
      <p className="mt-6 max-w-3xl text-base sm:text-lg text-neutral-400">
        Everything you need to navigate the job market in one place. Manage your pipeline with ease, never miss a follow-up, and turn your job search into a science. The grind is better together.
      </p>

      {/* Interactive Dashboard Preview */}
      <div className="relative mt-8 md:mt-12 w-full max-w-5xl mx-auto overflow-visible">
        {/* Gradient glow blobs behind dashboard */}
        <div className="absolute -top-24 -left-20 w-[350px] h-[350px] md:w-[500px] md:h-[500px] bg-gradient-to-br from-purple-600/20 via-violet-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-gradient-to-bl from-blue-600/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[400px] h-[250px] md:w-[600px] md:h-[350px] bg-gradient-to-t from-orange-500/10 via-pink-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <DashboardPreview />
          {/* Bottom fade overlay */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent z-10 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
