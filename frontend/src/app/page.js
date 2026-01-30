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
import Navbar from "@/components/landing/nav";
import Hero from "@/components/landing/hero";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* --- Navigation --- */}
      <Navbar />

      {/* --- Hero Section --- */}
      <Hero />

      {/* --- Feature Grid --- */}
      <section className="container mx-auto px-4 py-24">
       
      </section>

      {/* --- Final CTA --- */}
      <footer className="py-20 text-center border-t border-neutral-800">
        
      </footer>
    </div>
  );
}