"use client"
import Navbar from "@/components/landing/nav";
import Hero from "@/components/landing/hero";
import Features from '@/components/landing/features';
import HowItWorks from '@/components/landing/working';
import Footer from '@/components/landing/footer';



export default function Layout({ children }) {
    return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
        
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <Footer />
        </div>
    );
}