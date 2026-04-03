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

  
  // ADD THIS: This unique key will force a fresh render of the content
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Increment the key on mount to ensure mobile gets a fresh look
    setRefreshKey(Date.now());

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Team", href: "#clinical-team" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <div className="index-page bg-white text-slate-900 selection:bg-[#04ceba]/20 selection:text-[#04ceba]">

      {/* --- HEADER --- */}
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm h-16"
          : "bg-transparent h-24"
          }`}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            {/* LOGO INTEGRATION */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-100 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Image
                src="/logo.jpeg" // Points to public/logo.jpeg
                alt="Tenachin Logo"
                fill
                // object-cover is required to fill the circle completely
                className="object-cover"
                priority
              />
            </div>
            <h1 className={`text-2xl font-black tracking-tighter transition-colors duration-300 ${isScrolled ? "text-slate-900" : "text-white"
              }`}>
              Tenachin
            </h1>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors hover:text-[#04ceba] ${isScrolled ? "text-slate-600" : "text-slate-100"
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="#contact"
              className="px-7 py-3 bg-[#04ceba] text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:brightness-110 hover:shadow-xl hover:shadow-[#04ceba]/20 transition-all active:scale-95"
            >
              Book Now
            </Link>
          </nav>

          {/* MOBILE TOGGLE */}
          <button
            className="lg:hidden text-3xl p-2 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className={`bi ${mobileMenuOpen ? 'bi-x' : 'bi-list'} ${isScrolled ? 'text-slate-900' : 'text-white'}`}></i>
          </button>
        </div>

        {/* MOBILE MENU */}
        <div className={`fixed inset-0 bg-slate-950/98 z-[110] flex flex-col items-center justify-center gap-8 transition-all duration-500 lg:hidden ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible translate-x-full"
          }`}>
          <button className="absolute top-6 right-6 text-white text-5xl" onClick={() => setMobileMenuOpen(false)}>
            <i className="bi bi-x"></i>
          </button>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-3xl font-black text-white hover:text-[#04ceba] transition-colors uppercase tracking-tighter italic"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-4 px-12 py-5 bg-[#04ceba] text-white rounded-full text-lg font-black uppercase tracking-widest shadow-2xl"
          >
            Contact Us
          </Link>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="main">
        <section id="hero"><HeroSection /></section>

        <div id="partner" className="py-12 bg-white border-b border-slate-50">
          <PartnerSection />
        </div>

        <section id="about" className="scroll-mt-24">
          <About />
        </section>

        <section className="bg-slate-50">
          <Features />
        </section>

        <section id="services" className="scroll-mt-24">
          <Services />
        </section>

        <section id="how-it-works" className="scroll-mt-24 py-16 lg:py-28 bg-white">
          <HowItWorks />
        </section>

        <CallToAction />

        <section id="clinical-team" className="scroll-mt-24 bg-slate-50/50">
          <ClinicalTeam />
        </section>

        <Testimonials />

        <section id="faq" className="scroll-mt-24 bg-white border-y border-slate-100">
          <Faq />
        </section>

        <section id="contact" className="scroll-mt-24">
          <Contacts />
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-20 bg-slate-950 text-white border-t border-white/5">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 shadow-sm transition-all group-hover:scale-110">
                <Image
                  src="/logo.jpeg"
                  alt="Tenachin"
                  fill
                  className="object-cover" // Ensures the image fills the circle without gaps
                />
              </div>
              <h3 className="text-2xl font-black italic tracking-tighter text-[#04ceba]">Tenachin</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed text-center md:text-left font-medium max-w-sm">
              Revolutionizing healthcare in Ethiopia through expert-led digital innovation.
              Bridging the gap to quality care, anytime, anywhere.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Explore</h4>
            <div className="flex flex-col gap-4 text-sm font-bold items-center">
              <Link href="#about" className="hover:text-[#04ceba] transition-colors">Mission</Link>
              <Link href="#services" className="hover:text-[#04ceba] transition-colors">Services</Link>
              <Link href="#clinical-team" className="hover:text-[#04ceba] transition-colors">Our Team</Link>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Stay Connected</h4>
            <div className="flex gap-4">
              {[
                { icon: "facebook", url: "#" },
                { icon: "linkedin", url: "#" },
                { icon: "telegram", url: "https://t.me/tenachin" }
              ].map((social) => (
                <a
                  key={social.icon}
                  href={social.url}
                  className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-[#04ceba] hover:text-white transition-all duration-300 border border-white/10"
                >
                  <i className={`bi bi-${social.icon} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Tenachin Telehealth Center.
          </p>
          <div className="flex gap-6 text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#04ceba] rounded-full"></span>
              Addis Ababa, Ethiopia
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}