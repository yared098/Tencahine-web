"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const slides = [
  {
    title: "Welcome to",
    span: "Tenachin Telehealth",
    description: "Born from deep experience and firsthand understanding of Africa’s healthcare challenges, Tenachin is not just another platform—it’s a revolution. Africa’s first multilingual, full-spectrum telehealth ecosystem.",
    btnText: "Read More",
    link: "#about"
  },
  {
    title: "World-Class",
    span: "Multi-Specialty Care",
    description: "From emergency care to lifestyle coaching, tele-ICU to mental health—we deliver expert care led by a trusted team of renowned physicians and subspecialists anytime, anywhere.",
    btnText: "Contact Us",
    link: "#contact"
  }
];

const HeroSection: React.FC = () => {
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  if (!theme) return null;

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center pt-20 overflow-hidden text-white"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      
      {/* Background Glows - Using Primary and Accent colors with low opacity */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute top-0 -left-1/4 w-1/2 h-1/2 rounded-full blur-[120px] opacity-20"
          style={{ backgroundColor: theme.primaryColor }}
        ></div>
        <div 
          className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 rounded-full blur-[120px] opacity-10"
          style={{ backgroundColor: theme.accentColor }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="relative w-full max-w-5xl mx-auto text-center">
          
          {/* Carousel Content */}
          <div className="min-h-[450px] md:min-h-[400px] flex flex-col justify-center items-center">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`transition-all duration-1000 absolute inset-0 flex flex-col items-center justify-center ${
                  index === currentSlide 
                    ? "opacity-100 translate-y-0 pointer-events-auto" 
                    : "opacity-0 translate-y-10 pointer-events-none"
                }`}
              >
                <h2 
                  className="text-4xl md:text-7xl mb-6 leading-tight"
                  style={{ fontWeight: theme.headerFontWeight }}
                >
                  {slide.title} <span style={{ color: theme.primaryColor }}>{slide.span}</span>
                </h2>
                <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed px-4">
                  {slide.description}
                </p>
                <a
                  href={slide.link}
                  className="hero-btn inline-block px-10 py-4 rounded-full font-bold text-lg transition-all shadow-lg active:scale-95"
                  style={{ 
                    backgroundColor: theme.primaryColor,
                    color: theme.backgroundColor,
                    boxShadow: `0 10px 30px ${theme.primaryColor}33`
                  }}
                >
                  {slide.btnText}
                </a>
              </div>
            ))}
          </div>

          {/* Controls */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group hidden md:flex"
          >
            <i className="bi bi-chevron-left text-2xl group-hover:-translate-x-1 transition-transform" style={{ color: theme.primaryColor }}></i>
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group hidden md:flex"
          >
            <i className="bi bi-chevron-right text-2xl group-hover:translate-x-1 transition-transform" style={{ color: theme.primaryColor }}></i>
          </button>

          {/* Indicators */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className="h-2 rounded-full transition-all"
                style={{ 
                  width: i === currentSlide ? "32px" : "8px",
                  backgroundColor: i === currentSlide ? theme.primaryColor : "rgba(255,255,255,0.2)"
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modern Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full leading-[0] z-20">
        <svg 
          className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]" 
          viewBox="0 24 150 28" 
          preserveAspectRatio="none"
        >
          <defs>
            <path id="wave-path" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="animate-wave-slow">
            <use href="#wave-path" x="50" y="3" fill="rgba(255,255,255,0.05)" />
          </g>
          <g className="animate-wave-medium">
            <use href="#wave-path" x="50" y="0" fill="rgba(255,255,255,0.1)" />
          </g>
          <g className="animate-wave-fast">
            <use href="#wave-path" x="50" y="9" fill="white" />
          </g>
        </svg>
      </div>

      <style jsx>{`
        .hero-btn:hover {
          background-color: ${theme.accentColor} !important;
          transform: translateY(-2px);
        }
        @keyframes wave {
          0% { transform: translateX(-90px); }
          100% { transform: translateX(85px); }
        }
        .animate-wave-slow use { animation: wave 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite; }
        .animate-wave-medium use { animation: wave 10s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite; }
        .animate-wave-fast use { animation: wave 7s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite; }
      `}</style>
    </section>
  );
};

export default HeroSection;