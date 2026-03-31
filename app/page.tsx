"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Import components
import HeroSection from "./page/HeroSection";
import PartnerSection from "./page/PartnerSection";
import About from "./page/About";
import Features from "./page/Features";
import Services from "./page/Services";
import HowItWorks from "./page/HowItWorks";
import CallToAction from "./page/CallToAction";
import ClinicalTeam from "./page/ClinicalTeam";
import Testimonials from "./page/Testimonials";
import Faq from "./page/Faq";
import Contacts from "./page/contacts";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Standard logical order for Navigation
  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Team", href: "#clinical-team" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <div className="index-page bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      
      {/* --- HEADER --- */}
      <header 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled 
          ? "bg-white/90 backdrop-blur-lg shadow-sm h-16" 
          : "bg-transparent h-24"
        }`}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:rotate-6 transition-transform">
              <span className="text-white font-black text-xl">T</span>
            </div>
            <h1 className={`text-2xl font-bold tracking-tight transition-colors ${
              isScrolled ? "text-slate-900" : "text-white"
            }`}>
              Tenachin
            </h1>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`text-sm font-semibold transition-colors hover:text-blue-500 ${
                  isScrolled ? "text-slate-600" : "text-slate-200"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="#contact" 
              className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/10"
            >
              Book Now
            </Link>
          </nav>

          <button 
            className="lg:hidden text-2xl p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className={`bi ${mobileMenuOpen ? 'bi-x' : 'bi-list'} ${isScrolled ? 'text-slate-900' : 'text-white'}`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 bg-slate-900/95 z-[110] flex flex-col items-center justify-center gap-8 transition-transform duration-500 lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}>
           <button className="absolute top-6 right-6 text-white text-4xl" onClick={() => setMobileMenuOpen(false)}>
            <i className="bi bi-x"></i>
          </button>
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-bold text-white hover:text-blue-400 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link href="#contact" onClick={() => setMobileMenuOpen(false)} className="mt-4 px-10 py-4 bg-blue-600 text-white rounded-full text-lg font-bold">
            Contact Us
          </Link>
        </div>
      </header>

      {/* --- MAIN CONTENT (STANDARD ARRANGEMENT) --- */}
      <main className="main">
        
        {/* 1. Hero: The Hook */}
        <div id="hero">
          <HeroSection />
        </div>

        {/* 2. Partners: Immediate Trust/Authority */}
        <div id="partner" className="py-10 bg-white border-b border-slate-50">
          <PartnerSection />
        </div>
        
        {/* 3. About: Who we are */}
        <div id="about" className="scroll-mt-24">
          <About />
        </div>

        {/* 4. Features: Why choose us */}
        <div className="bg-slate-50">
          <Features />
        </div>
        
        {/* 5. Services: What we provide */}
        <div id="services" className="scroll-mt-24">
          <Services />
        </div>

        {/* 6. Process: How it works (Educational) */}
        <div id="how-it-works" className="scroll-mt-24 py-12 lg:py-24">
            <HowItWorks />
        </div>

        {/* 7. Call To Action: Urgency Intermission */}
        <CallToAction />
        
        {/* 8. Clinical Team: Humanizing the service */}
        <div id="clinical-team" className="scroll-mt-24 bg-slate-50/50">
          <ClinicalTeam />
        </div>

        {/* 9. Testimonials: Social Proof */}
        <Testimonials />
        
        {/* 10. FAQ: Removing friction/doubts */}
        <div id="faq" className="scroll-mt-24 bg-white border-y border-slate-100">
            <Faq />
        </div>
        
        {/* 11. Contact: Final Conversion Point */}
        <div id="contact" className="scroll-mt-24 bg-slate-900">
          <Contacts />
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-16 bg-slate-950 text-white border-t border-white/5">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-bold text-blue-500 mb-4">Tenachin</h3>
            <p className="text-slate-400 text-sm leading-relaxed text-center md:text-left">
              Revolutionizing healthcare in Africa through expert-led digital innovation. 
              Quality care, anytime, anywhere.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="font-bold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm text-slate-400 items-center">
              <Link href="#about" className="hover:text-blue-400 transition-colors">About Us</Link>
              <Link href="#services" className="hover:text-blue-400 transition-colors">Services</Link>
              <Link href="#how-it-works" className="hover:text-blue-400 transition-colors">How it Works</Link>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end">
             <h4 className="font-bold mb-4">Connect</h4>
             <div className="flex gap-4">
               <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-all"><i className="bi bi-facebook"></i></a>
               <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-all"><i className="bi bi-linkedin"></i></a>
               <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-all"><i className="bi bi-telegram"></i></a>
             </div>
          </div>
        </div>
        <div className="container mx-auto px-4 pt-8 border-t border-white/5 text-center">
            <p className="text-xs text-slate-500 font-medium">
              © {new Date().getFullYear()} Tenachin Telehealth Center. Proudly based in Ethiopia.
            </p>
        </div>
      </footer>
    </div>
  );
}