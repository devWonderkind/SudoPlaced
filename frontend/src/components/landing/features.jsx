"use client"
import { motion } from 'framer-motion';
import { 
  IconLayoutColumns, 
  IconNotes, 
  IconBellRinging, 
  IconBrandX, 
  IconCurrencyDollar 
} from '@tabler/icons-react';



// --- Feature Card Component ---
const FeatureCard = ({ title, desc, icon: Icon, className, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: delay }}
      viewport={{ once: true }}
      className={`relative group overflow-hidden p-8 rounded-[2rem] border border-neutral-800 bg-neutral-900 flex flex-col gap-6 transition-colors hover:border-neutral-700 ${className}
      `}
    >
        
      {/* Micro-interaction: Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
    
      <div className="relative z-10">
        <h3 className="text-xl font-medium text-white mb-3 tracking-tight">{title}</h3>
        <p className="text-neutral-400 text-sm leading-relaxed max-w-[280px]">
          {desc}
        </p>
      </div>

      {/* Decorative Corner Element */}
      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-30 transition-opacity">
        <Icon size={32} stroke={1}/>
      </div>
    </motion.div>
  );
};

// --- Main Section Component ---
export default function Features() {
  const features = [
    {
      title: "Scrum Pipeline",
      desc: "Visualize your hunt. Drag and drop applications from 'Applied' to 'First Check'.",
      icon: IconLayoutColumns,
      span: "md:col-span-3",
    },
    {
      title: "Interview KeyNotes",
      desc: "High-performance notes for technical rounds and post-interview debriefs.",
      icon: IconNotes,
      span: "md:col-span-3",
    },
    {
      title: "Follow-up Reminders",
      desc: "Automated pings to keep you top-of-mind with recruiters.",
      icon: IconBellRinging,
      span: "md:col-span-2",
    },
    {
      title: "Share to X",
      desc: "One-click aesthetic journey sharing to build your personal brand.",
      icon: IconBrandX,
      span: "md:col-span-2",
    },
    {
      title: "Financial Tracking",
      desc: "Manifest that first $ by tracking salary goals and real offers.",
      icon: IconCurrencyDollar,
      span: "md:col-span-2",
    }
  ];

  return (
    <section className="bg-neutral-950 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Aesthetic Header */}
        <div className="mb-20 space-y-4">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-blue-500 text-sm font-mono tracking-widest uppercase"
          >
            // System Features
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-6xl text-white font-bold tracking-tighter"
          >
            Structure the grind. <br />
            <span className="text-neutral-500 italic">Collect the win.</span>
          </motion.h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {features.map((f, i) => (
            <FeatureCard 
              key={i}
              title={f.title}
              desc={f.desc}
              icon={f.icon}
              className={f.span}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}