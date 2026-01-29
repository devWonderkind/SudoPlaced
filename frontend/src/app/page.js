import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  IconCalendarEvent, 
  IconShare, 
  IconLayoutKanban, 
  IconBellRinging, 
  IconNotes, 
  IconTrophy 
} from "@tabler/icons-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* --- Navigation --- */}
      <nav className="flex items-center justify-center p-6 border-b border-neutral-800">
        <span className="font-bold text-xl tracking-tighter text-white">SUDO PLACED</span>
      </nav>

      {/* --- Hero Section --- */}
      <section className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl">
          This isn't outreach. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-400">
            It's matchmaking.
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-neutral-400 leading-relaxed">
          Sudo Placed is rethinking how early-stage talent tracks their journey. 
          Stop tracking apps, start building a brand.
        </p>
        <div className="mt-10">
          <Button size="lg" className="group relative bg-gradient-to-r from-neutral-100 to-neutral-300 hover:from-white hover:to-neutral-200 text-neutral-900 rounded-full px-10 py-6 text-lg font-semibold shadow-[0_8px_30px_rgba(255,255,255,0.15)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.25)] transition-all duration-300 hover:scale-[1.02]">
            <span className="relative flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Join The Waitlist
            </span>
          </Button>
        </div>
        
      
      </section>

      {/* --- Feature Grid --- */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          
          {/* Scrum Board */}
          <div className="group p-8 rounded-3xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 hover:border-neutral-700 transition-all duration-300">
            <IconLayoutKanban size={40} stroke={1.5} className="text-neutral-300 mb-6" />
            <h3 className="text-2xl font-bold mb-3 text-white">Job SCRUM Board</h3>
            <p className="text-neutral-400 leading-relaxed">
              Visualize your pipeline with a specialized board. Drag applications from 
              <span className="font-semibold text-neutral-300"> Applied </span> to <span className="font-semibold text-white">In Talks</span>.
            </p>
          </div>

          {/* Social Share */}
          <div className="group p-8 rounded-3xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 hover:border-neutral-700 transition-all duration-300">
            <IconShare size={40} stroke={1.5} className="text-neutral-300 mb-6" />
            <h3 className="text-2xl font-bold mb-3 text-white">One-Click X Sharing</h3>
            <p className="text-neutral-400 leading-relaxed">
              Turn your job hunt into content. Share milestones directly to X and build your network while you grind.
            </p>
          </div>

          {/* Interview Notes */}
          <div className="group p-8 rounded-3xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 hover:border-neutral-700 transition-all duration-300">
            <IconNotes size={40} stroke={1.5} className="text-neutral-300 mb-6" />
            <h3 className="text-2xl font-bold mb-3 text-white">Interview KeyNotes</h3>
            <p className="text-neutral-400 leading-relaxed">
              Quick-capture thoughts during calls. Record tech stacks, culture red flags, and salary details instantly.
            </p>
          </div>

          {/* Follow ups */}
          <div className="group p-8 rounded-3xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 hover:border-neutral-700 transition-all duration-300">
            <IconBellRinging size={40} stroke={1.5} className="text-neutral-300 mb-6" />
            <h3 className="text-2xl font-bold mb-3 text-white">Auto Follow-Up</h3>
            <p className="text-neutral-400 leading-relaxed">
              Our "Grind-Bot" reminds you when it's time to nudge recruiters, so you never lose momentum.
            </p>
          </div>

          {/* Calendar - Full Width */}
          <div className="md:col-span-2 group p-8 rounded-3xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 hover:border-neutral-700 transition-all duration-300 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <IconCalendarEvent size={40} stroke={1.5} className="text-neutral-300 mb-6" />
              <h3 className="text-2xl font-bold mb-3 text-white">Calendar Overview</h3>
              <p className="text-neutral-400 leading-relaxed">
                Sync your interviews and deadlines into one master view. Till you get your first $.
              </p>
            </div>
            <div className="flex-1 bg-neutral-800 p-4 rounded-xl w-full border border-neutral-700">
                <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Upcoming Week</span>
                </div>
                <div className="h-2 w-full bg-neutral-700 rounded-full overflow-hidden">
                    <div className="h-full bg-neutral-400 w-3/4"></div>
                </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- Final CTA --- */}
      <footer className="py-20 text-center border-t border-neutral-800">
        <p className="text-neutral-500 font-medium mb-4">Ready to start the journey?</p>
        <h2 className="text-3xl font-bold mb-8 text-white">Let's Grind Together.</h2>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 px-4">
          <input 
            type="email" 
            placeholder="name@email.com" 
            className="w-full max-w-xs h-12 px-4 rounded-xl border border-neutral-700 bg-neutral-900 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          />
          <Button className="w-full sm:w-auto bg-white text-neutral-900 hover:bg-neutral-200 rounded-xl h-12 px-8 transition-colors font-semibold">
            Get Early Access
          </Button>
        </div>
      </footer>
    </div>
  );
}