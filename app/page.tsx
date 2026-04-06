"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

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
  const [activeSection, setActiveSection] = useState("hero");
  
  // Dynamic Data States
  const [contactData, setContactData] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch both Config and Contact Data
  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      try {
        const [configRes, contactRes] = await Promise.all([
          fetch(`${apiUrl}/api/config`),
          fetch(`${apiUrl}/api/contact`)
        ]);

        const configJson = await configRes.json();
        const contactJson = await contactRes.json();

        setConfig(configJson);
        setContactData(contactJson.contactData || contactJson);
      } catch (error) {
        console.error("Error fetching site data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const sectionIds = ["hero", "about", "services", "how-it-works", "clinical-team", "faq"];
      let currentSection = "hero";

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) currentSection = id;
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper to get theme values with fallbacks
  const theme = config?.theme || {
    primaryColor: "#1FB5A8",
    backgroundColor: "#0B1C2C",
    accentColor: "#2ED1B2",
    headerFontWeight: "900"
  };

  const siteTitle = config?.siteSettings?.title || "Tenachin";

  if (loading) return <div className="min-h-screen bg-[#0B1C2C] flex items-center justify-center text-white italic font-black animate-pulse">LOADING...</div>;

  return (
    <div 
      className="index-page min-h-screen selection:bg-opacity-30 scroll-smooth"
      style={{ 
        backgroundColor: theme.backgroundColor, 
        color: "#FFFFFF",
        // @ts-ignore
        "--selection-bg": theme.primaryColor 
      }}
    >
      {/* --- HEADER --- */}
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled ? "backdrop-blur-xl shadow-2xl h-20" : "bg-transparent h-24"
        }`}
        style={{ 
          backgroundColor: isScrolled ? `${theme.backgroundColor}CC` : "transparent",
          borderBottom: isScrolled ? `1px solid ${theme.primaryColor}33` : "none" 
        }}
      >
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-white/10 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              <Image src="/logo.jpeg" alt="Logo" fill className="object-cover" priority />
            </div>
            <h1 
                className="text-2xl tracking-tighter uppercase italic bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent"
                style={{ fontWeight: theme.headerFontWeight }}
            >
              {siteTitle}
            </h1>
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {["Home", "About", "Services", "How it Works", "Team", "FAQ"].map((name) => {
              const href = name.toLowerCase().replace(/ /g, "-").replace("home", "hero").replace("team", "clinical-team");
              const isActive = activeSection === href;
              return (
                <Link
                  key={name}
                  href={`#${href}`}
                  className="relative text-[11px] font-bold uppercase tracking-[0.2em] transition-all py-2"
                  style={{ color: isActive ? theme.accentColor : "#cbd5e1" }}
                >
                  {name}
                  <span 
                    className={`absolute bottom-0 left-0 h-[2px] transition-all duration-300`}
                    style={{ 
                        backgroundColor: theme.primaryColor,
                        width: isActive ? "100%" : "0",
                        opacity: isActive ? 1 : 0,
                        boxShadow: `0 0 8px ${theme.primaryColor}`
                    }}
                  />
                </Link>
              );
            })}
            
            <Link
              href="#contact"
              className="ml-4 px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg"
              style={{ 
                backgroundColor: theme.primaryColor, 
                color: theme.backgroundColor,
                boxShadow: `0 10px 20px ${theme.primaryColor}33`
              }}
            >
              Book Now
            </Link>
          </nav>

          <button
            className="lg:hidden text-3xl p-2 transition-transform active:scale-90"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: theme.primaryColor }}
          >
            <i className={`bi ${mobileMenuOpen ? 'bi-x' : 'bi-distribute-vertical'}`}></i>
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="main">
        <section id="hero"><HeroSection /></section>
        <div id="partner" className="py-12 bg-black/40 border-y border-white/5 backdrop-blur-sm">
          <PartnerSection />
        </div>
        <section id="about" className="scroll-mt-24"><About /></section>
        <section className="py-20 border-y border-white/5" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
          <Features />
        </section>
        <section id="services" className="scroll-mt-24"><Services /></section>
        <section id="how-it-works" className="scroll-mt-24 py-16 lg:py-28"><HowItWorks /></section>
        <CallToAction />
        <section id="clinical-team" className="scroll-mt-24 bg-black/40 py-20">
          <ClinicalTeam />
        </section>
        <Testimonials />
        <section id="faq" className="scroll-mt-24 border-y border-white/5"><Faq /></section>
        <section id="contact" className="scroll-mt-32 pb-20">
          <Contacts />
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-16 border-t border-white/5 bg-black/60 backdrop-blur-md">
        <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
                    © 2026 {siteTitle.toUpperCase()}. ALL RIGHTS RESERVED.
                </div>
                
                <div className="flex gap-10">
                    <button onClick={() => setShowLegalModal(true)} className="text-[10px] font-bold uppercase tracking-widest hover:opacity-70 transition-colors" style={{ color: theme.accentColor }}>Privacy</button>
                    <button onClick={() => setShowLegalModal(true)} className="text-[10px] font-bold uppercase tracking-widest hover:opacity-70 transition-colors" style={{ color: theme.accentColor }}>Terms</button>
                </div>

                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.primaryColor }}></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Addis Ababa, Ethiopia</span>
                </div>
            </div>
        </div>
      </footer>

      {/* --- LEGAL MODAL --- */}
      {showLegalModal && contactData && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div 
            className="w-full max-w-2xl max-h-[80vh] rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl"
            style={{ backgroundColor: theme.backgroundColor }}
          >
            <div className="p-8 border-b border-white/10 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black uppercase italic text-white leading-none mb-1">Legal Protocols</h3>
                <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: theme.primaryColor }}>Platform Security & Compliance</p>
              </div>
              <button onClick={() => setShowLegalModal(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white"><i className="bi bi-x-lg"></i></button>
            </div>

            <div className="p-8 overflow-y-auto space-y-6 custom-scrollbar">
              {contactData.terms?.map((term: any) => (
                <div key={term.id} className={`p-5 rounded-2xl border ${term.isEmergency ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-white/5'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span 
                      className={`text-[10px] font-black px-2 py-1 rounded`}
                      style={{ 
                        backgroundColor: term.isEmergency ? '#ef4444' : theme.primaryColor,
                        color: term.isEmergency ? '#fff' : theme.backgroundColor
                      }}
                    >
                      {term.id}
                    </span>
                    <h4 className={`text-sm font-black uppercase tracking-tight ${term.isEmergency ? 'text-red-400' : 'text-white'}`}>
                      {term.title}
                    </h4>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed font-medium">{term.content}</p>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-white/10 text-center" style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
              <button 
                onClick={() => setShowLegalModal(false)} 
                className="px-12 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
                style={{ backgroundColor: theme.primaryColor, color: theme.backgroundColor }}
              >
                Close Agreement
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${theme.primaryColor}; border-radius: 10px; }
      `}</style>
    </div>
  );
}