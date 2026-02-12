"use client"
import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  IconClipboardCheck, 
  IconAdjustmentsAlt, 
  IconMessageDots, 
  IconConfetti,
  IconBriefcase,
  IconLink,
  IconUser,
  IconBuildingSkyscraper,
  IconCheck,
  IconShare
} from '@tabler/icons-react';


/* ─── Utilities ─── */
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const easeOut = (x) => 1 - Math.pow(1 - x, 4);


/* ─────────────────────────────────────────────
   UNIFIED MICRO-INTERACTION DEMO
   Single component cycling through 4 phases:
   1. Dashboard Form (auto-typing)
   2. Scrum Board (card movement)
   3. KeyNotes (typing notes)
   4. Offer Tracker (salary counter)
   ───────────────────────────────────────────── */
const UnifiedDemo = ({ activeStep }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <div ref={ref} className="relative w-full h-full">
      <div className="bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 h-full flex flex-col">
        {/* Window Chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800/80 bg-neutral-900/60">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={activeStep}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-[10px] text-neutral-500 font-mono ml-2"
            >
              {['+ New Application', 'Pipeline Board', 'Interview KeyNotes', 'Offer Tracker'][activeStep]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Demo Body — swap panels */}
        <div className="relative flex-1 min-h-[340px]">
          <AnimatePresence mode="wait">
            {activeStep === 0 && <FormPanel key="form" isInView={isInView} />}
            {activeStep === 1 && <BoardPanel key="board" isInView={isInView} />}
            {activeStep === 2 && <NotesPanel key="notes" isInView={isInView} />}
            {activeStep === 3 && <OfferPanel key="offer" isInView={isInView} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};


/* ── Panel 1: Dashboard Form ── */
const FormPanel = ({ isInView }) => {
  const [typed, setTyped] = useState({ company: '', role: '', source: '' });
  const [phase, setPhase] = useState(0);
  const fields = [
    { key: 'company', icon: IconBuildingSkyscraper, value: 'Stripe', placeholder: 'Company...' },
    { key: 'role', icon: IconBriefcase, value: 'Frontend Eng.', placeholder: 'Role...' },
    { key: 'source', icon: IconLink, value: 'LinkedIn', placeholder: 'Source...' },
  ];

  useEffect(() => {
    if (!isInView) return;
    let c = false;
    (async () => {
      await sleep(400);
      for (let i = 0; i < fields.length; i++) {
        if (c) return;
        setPhase(i + 1);
        for (let j = 0; j <= fields[i].value.length; j++) {
          if (c) return;
          setTyped(p => ({ ...p, [fields[i].key]: fields[i].value.slice(0, j) }));
          await sleep(55 + Math.random() * 35);
        }
        await sleep(250);
      }
      if (!c) setPhase(4);
    })();
    return () => { c = true; };
  }, [isInView]);

  const active = phase >= 1 && phase <= 3 ? phase - 1 : -1;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5 md:p-6 space-y-3 flex flex-col justify-center h-full">
      {fields.map((f, i) => {
        const Icon = f.icon;
        const isActive = active === i;
        const filled = phase > i + 1;
        return (
          <motion.div key={f.key} animate={{ opacity: phase >= i + 1 ? 1 : 0.35, scale: isActive ? 1.02 : 1 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
              isActive ? 'border-blue-500/50 bg-blue-500/5' : filled ? 'border-neutral-700/40 bg-neutral-800/40' : 'border-neutral-800/30 bg-neutral-800/20'
            }`}>
            <Icon size={16} className={isActive ? 'text-blue-400' : 'text-neutral-600'} stroke={1.5} />
            <div className="flex-1 text-sm text-white font-medium flex items-center">
              {typed[f.key] || <span className="text-neutral-600 text-xs">{f.placeholder}</span>}
              {isActive && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }} className="w-[1px] h-3 bg-blue-400 ml-px" />}
            </div>
            {filled && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><IconCheck size={11} className="text-green-500" stroke={2} /></motion.div>}
          </motion.div>
        );
      })}
      <motion.div animate={{ boxShadow: phase === 4 ? '0 0 20px rgba(59,130,246,0.3)' : 'none' }}
        className={`w-full py-3 rounded-xl text-sm font-semibold text-center mt-2 transition-all ${phase === 4 ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-500'}`}>
        {phase === 4 ? <span className="flex items-center justify-center gap-1"><IconCheck size={13} stroke={2} /> Added!</span> : 'Add Application'}
      </motion.div>
    </motion.div>
  );
};


/* ── Panel 2: Scrum Board ── */
const BoardPanel = ({ isInView }) => {
  const [stage, setStage] = useState(0);
  const cols = ['Applied', 'Interview', 'Offer'];
  const cards = [
    { id: 1, label: 'Stripe', sub: 'Frontend', border: 'border-l-blue-500' },
    { id: 2, label: 'Figma', sub: 'Design', border: 'border-l-purple-500' },
    { id: 3, label: 'Vercel', sub: 'Full-Stack', border: 'border-l-cyan-500' },
  ];
  const dots = ['bg-blue-500', 'bg-yellow-500', 'bg-green-500'];

  const layout = (ci) => {
    if (stage === 0) return ci === 0 ? [0, 1, 2] : [];
    if (stage === 1) return ci === 0 ? [1, 2] : ci === 1 ? [0] : [];
    if (stage === 2) return ci === 0 ? [2] : ci === 1 ? [0, 1] : [];
    if (stage === 3) return ci === 0 ? [2] : ci === 1 ? [1] : [0];
    return ci === 0 ? [0, 1, 2] : [];
  };

  useEffect(() => {
    if (!isInView) return;
    let c = false;
    (async () => {
      setStage(0); await sleep(900);
      if (c) return; setStage(1); await sleep(1200);
      if (c) return; setStage(2); await sleep(1200);
      if (c) return; setStage(3);
    })();
    return () => { c = true; };
  }, [isInView]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-3 gap-3 p-5 md:p-6 h-full">
      {cols.map((col, ci) => (
        <div key={col} className="space-y-1.5">
          <div className="flex items-center gap-1 mb-1">
            <div className={`w-1.5 h-1.5 rounded-full ${dots[ci]}`} />
            <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">{col}</span>
          </div>
          <div className="min-h-[200px] rounded-lg bg-neutral-800/30 border border-neutral-800/30 p-2 space-y-2">
            <AnimatePresence mode="popLayout">
              {layout(ci).map(idx => (
                <motion.div key={cards[idx].id} layout
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className={`bg-neutral-800/80 border border-neutral-700/40 border-l-2 ${cards[idx].border} rounded-lg px-3 py-2.5`}>
                  <div className="text-xs text-white font-medium">{cards[idx].label}</div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">{cards[idx].sub}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </motion.div>
  );
};


/* ── Panel 3: KeyNotes ── */
const NotesPanel = ({ isInView }) => {
  const [lines, setLines] = useState([]);
  const [curLine, setCurLine] = useState(-1);
  const notes = [
    { t: '→ System Design: Rate Limiter', hl: true },
    { t: '  • Token bucket approach', hl: false },
    { t: '  • Discussed Redis caching ✓', hl: false },
    { t: '→ Behavioral: Leadership', hl: true },
    { t: '  • Used STAR method', hl: false },
    { t: '→ Follow up: Thank-you email', hl: true },
  ];

  useEffect(() => {
    if (!isInView) return;
    let c = false;
    (async () => {
      setLines([]); setCurLine(-1);
      await sleep(400);
      for (let li = 0; li < notes.length; li++) {
        if (c) return;
        setCurLine(li);
        for (let ci = 0; ci <= notes[li].t.length; ci++) {
          if (c) return;
          setLines(p => { const cp = [...p]; cp[li] = notes[li].t.slice(0, ci); return cp; });
          await sleep(25 + Math.random() * 20);
        }
        await sleep(180);
      }
      if (!c) setCurLine(-1);
    })();
    return () => { c = true; };
  }, [isInView]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5 md:p-6 font-mono text-xs space-y-1 flex flex-col justify-center h-full">
      {lines.map((line, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`flex items-start gap-1.5 py-1 px-2 rounded ${notes[i]?.hl ? 'bg-blue-500/10 border-l-2 border-l-blue-500/50' : ''}`}>
          <span className={notes[i]?.hl ? 'text-blue-300 whitespace-pre' : 'text-neutral-400 whitespace-pre'}>{line}</span>
          {i === curLine && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.4, repeat: Infinity, repeatType: 'reverse' }} className="w-[1.5px] h-4 bg-blue-400 mt-0.5" />}
        </motion.div>
      ))}
      {lines.length === 0 && (
        <div className="flex items-center justify-center h-[240px]">
          <motion.span animate={{ opacity: [0.3, 0.6] }} transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }} className="text-neutral-600 text-[10px]">Starting session...</motion.span>
        </div>
      )}
    </motion.div>
  );
};


/* ── Panel 4: Offer Tracker ── */
const OfferPanel = ({ isInView }) => {
  const [salary, setSalary] = useState(0);
  const [phase, setPhase] = useState(0);
  const TARGET = 185000;

  useEffect(() => {
    if (!isInView) return;
    let c = false;
    (async () => {
      setSalary(0); setPhase(0);
      await sleep(600);
      if (c) return; setPhase(1);
      for (let i = 0; i <= 35; i++) {
        if (c) return;
        setSalary(Math.floor(easeOut(i / 35) * TARGET));
        await sleep(45);
      }
      setSalary(TARGET);
      if (c) return; setPhase(2);
      await sleep(1200);
      if (c) return; setPhase(3);
    })();
    return () => { c = true; };
  }, [isInView]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5 md:p-6 flex flex-col justify-center h-full">
      <div className="text-center mb-4">
        <motion.div animate={phase >= 2 ? { scale: [1, 1.05, 1] } : {}}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-green-400 font-medium">Offer Received</span>
        </motion.div>
        <div className="text-neutral-500 text-[10px] uppercase tracking-wider mb-1">Total Compensation</div>
        <motion.div className="text-4xl font-bold tabular-nums" animate={{ color: phase >= 2 ? '#4ade80' : '#fff' }}>
          ${salary.toLocaleString()}
        </motion.div>
        <div className="text-neutral-600 text-[10px] mt-1">per year · Stripe</div>
      </div>

      {/* Confetti */}
      <AnimatePresence>
        {phase >= 2 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div key={i}
                initial={{ opacity: 1, x: '50%', y: '40%', scale: 0 }}
                animate={{ opacity: [1, 0], x: `${50 + (Math.random() - 0.5) * 80}%`, y: `${20 + Math.random() * 60}%`, scale: [0, 1], rotate: Math.random() * 360 }}
                transition={{ duration: 1.3, delay: i * 0.04 }}
                className={`absolute w-1.5 h-1.5 rounded-full ${['bg-blue-400', 'bg-purple-400', 'bg-green-400', 'bg-yellow-400', 'bg-pink-400'][i % 5]}`} />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Breakdown */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[{ l: 'Base', v: '$165K' }, { l: 'Equity', v: '$15K' }, { l: 'Bonus', v: '$5K' }].map((item, i) => (
          <motion.div key={item.l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 8 }}
            transition={{ delay: i * 0.1 + 0.2 }}
            className="text-center p-2.5 rounded-lg bg-neutral-800/50 border border-neutral-800/40">
            <div className="text-[9px] text-neutral-600 uppercase">{item.l}</div>
            <div className="text-sm text-white font-semibold mt-0.5">{item.v}</div>
          </motion.div>
        ))}
      </div>

      {/* Share */}
      <motion.div animate={{ boxShadow: phase === 3 ? ['0 0 0px rgba(59,130,246,0)', '0 0 18px rgba(59,130,246,0.4)', '0 0 0px rgba(59,130,246,0)'] : 'none' }}
        transition={{ duration: 1.5, repeat: phase === 3 ? Infinity : 0 }}
        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${phase >= 3 ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-500'}`}>
        <IconShare size={14} stroke={1.5} /><span>Share Journey on 𝕏</span>
      </motion.div>
    </motion.div>
  );
};


/* ─────────────────────────────────────────────
   STEP Component (left side only)
   ───────────────────────────────────────────── */
const Step = ({ number, title, desc, icon: Icon, isLast, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex gap-6 md:gap-8 pb-12 group cursor-pointer transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-50 hover:opacity-75'}`}
    >
      {/* Connecting Line */}
      {!isLast && (
        <div className={`absolute left-7 top-14 bottom-0 w-[2px] transition-colors duration-500 ${isActive ? 'bg-blue-500/40' : 'bg-neutral-800'}`} />
      )}

      {/* Number Circle */}
      <motion.div 
        animate={isActive ? { scale: [0.95, 1.05, 1], borderColor: 'rgba(59,130,246,0.5)' } : { scale: 1, borderColor: 'rgba(38,38,38,1)' }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex-shrink-0 w-14 h-14 rounded-2xl bg-neutral-900 border flex items-center justify-center text-white font-mono font-bold transition-all duration-500"
        style={isActive ? { boxShadow: '0 0 20px rgba(59,130,246,0.2)' } : {}}
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
        <div className="flex items-center gap-3 mb-2">
          <Icon className={`transition-colors duration-300 ${isActive ? 'text-blue-500' : 'text-neutral-600'}`} size={22} stroke={1.5} />
          <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight">{title}</h3>
        </div>
        <p className="text-neutral-400 leading-relaxed max-w-md text-base md:text-lg">
          {desc}
        </p>
      </motion.div>
    </div>
  );
};


/* ─────────────────────────────────────────────
   Main Section
   ───────────────────────────────────────────── */
export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  // Auto-cycle through steps
  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(interval);
  }, [isInView, activeStep]);

  const steps = [
    {
      title: "Centralize Your Search",
      desc: "Import jobs from LinkedIn, Indeed, or X with a single click. No more messy bookmarks or lost tabs.",
      icon: IconClipboardCheck,
    },
    {
      title: "Organize the Sprint",
      desc: "Move applications through your custom SCRUM board. Drag cards to update statuses and stay focused.",
      icon: IconAdjustmentsAlt,
    },
    {
      title: "Master the Interview",
      desc: "Use integrated KeyNotes to store technical prep and post-call feedback. Set auto-reminders for follow-ups.",
      icon: IconMessageDots,
    },
    {
      title: "Secure the $",
      desc: "Track offers, compare benefits, and share your success journey. The grind ends here.",
      icon: IconConfetti,
    }
  ];

  return (
    <section id='how-it-works' ref={sectionRef} className="bg-neutral-950 py-10 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-20 md:mb-24">
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

        {/* Two-column: Steps + Demo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-stretch">
          {/* Left: Steps */}
          <div className="relative">
            {steps.map((step, index) => (
              <Step 
                key={index}
                number={`0${index + 1}`}
                title={step.title}
                desc={step.desc}
                icon={step.icon}
                isLast={index === steps.length - 1}
                isActive={activeStep === index}
                onClick={() => setActiveStep(index)}
              />
            ))}

            {/* Step Progress Dots */}
            <div className="flex gap-2 mt-4 ml-4">
              {steps.map((_, i) => (
                <button key={i} onClick={() => setActiveStep(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${activeStep === i ? 'w-8 bg-blue-500' : 'w-3 bg-neutral-700 hover:bg-neutral-600'}`}
                />
              ))}
            </div>
          </div>

          {/* Right: Unified Demo (sticky, matched height) */}
          <div className="md:sticky md:top-28 flex flex-col">
            <UnifiedDemo activeStep={activeStep} />
          </div>
        </div>
      </div>
    </section>
  );
}