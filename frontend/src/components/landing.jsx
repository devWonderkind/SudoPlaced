"use client"
import Navbar from "@/components/landing/nav";
import Hero from "@/components/landing/hero";
import Features from '@/components/landing/features';
import HowItWorks from '@/components/landing/working';
import FAQ from '@/components/landing/faq';
import Footer from '@/components/landing/footer';



export default function Layout({ children }) {

    return (
        <div className="landing-page min-h-screen bg-gray-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontWeight: 300 }}>
            <div className="relative z-10">
                <Navbar />
                <Hero />
                <Features />
                <HowItWorks />
                <FAQ />
                <Footer />
            </div>
        </div>
    );
}