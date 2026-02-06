"use client"
import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  IconClipboardCheck, 
  IconAdjustmentsAlt, 
  IconMessageDots, 
  IconConfetti 
} from '@tabler/icons-react';

const Step = ({ number, title, desc, icon: Icon, isLast }) => {
  return (
    <div className="relative flex gap-8 md:gap-12 pb-20 group">
      {/* Connecting Line Logic */}
      {!isLast && (
        <div className="absolute left-7 top-14 bottom-0 w-[2px] bg-neutral-800 group-hover:bg-neutral-700 transition-colors" />
      )}

      {/* Number Circle */}
      <motion.div 
        whileInView={{ scale: [0.9, 1.1, 1], opacity: 1 }}
        initial={{ opacity: 0 }}
        className="relative z-10 flex-shrink-0 w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white font-mono font-bold group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-500"
      >
        {number}
      </motion.div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="pt-2"
      >
        <div className="flex items-center gap-3 mb-3">
          <Icon className="text-blue-500" size={24} stroke={1.5} />
          <h3 className="text-2xl font-semibold text-white tracking-tight">{title}</h3>
        </div>
        <p className="text-neutral-400 leading-relaxed max-w-xl text-lg">
          {desc}
        </p>
      </motion.div>
    </div>
  );
};

export default function HowItWorks() {
  const steps = [
    {
      title: "Centralize Your Search",
      desc: "Import jobs from LinkedIn, Indeed, or X with a single click. No more messy bookmarks or lost tabs.",
      icon: IconClipboardCheck,
    },
    {
      title: "Organize the Sprint",
      desc: "Move applications through your custom SCRUM board. Drag cards to update statuses and stay focused on what's next.",
      icon: IconAdjustmentsAlt,
    },
    {
      title: "Master the Interview",
      desc: "Use the integrated KeyNotes to store technical prep and post-call feedback. Set auto-reminders to nudge recruiters.",
      icon: IconMessageDots,
    },
    {
      title: "Secure the $",
      desc: "Track your offers, compare benefits, and share your success journey with your community. The grind ends here.",
      icon: IconConfetti,
    }
  ];

  return (
    <section className="bg-neutral-950 py-10 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-24">
          <motion.span 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      className="text-blue-500 text-sm font-mono tracking-widest uppercase"
                    >
                      // How it works
                    </motion.span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-6">
            Four steps to <br />
            <span className="text-neutral-500">end the job search chaos.</span>
          </h2>
          <div className="h-1 w-20 bg-blue-600 rounded-full" />
        </div>

        {/* Steps Container */}
        <div className="relative">
          {steps.map((step, index) => (
            <Step 
              key={index}
              number={`0${index + 1}`}
              title={step.title}
              desc={step.desc}
              icon={step.icon}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}