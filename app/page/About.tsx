"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

interface AboutData {
  title: string;
  subtitle: string;
  mainDescription: string;
  bullets: string[];
  highlightText: string;
  ctaText: string;
  ctaLink: string;
}

const About: React.FC = () => {
  const { theme } = useTheme();
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      try {
        const response = await fetch(`${apiUrl}/api/about`);
        const result = await response.json();
        
        if (result.aboutData) {
          setData(result.aboutData);
        } else {
          setData(result);
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (loading || !data) return null;

  return (
    <section 
      id="about" 
      className="about section py-16 lg:py-24 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Section Title */}
      <div className="container mx-auto px-4 mb-16 text-center" data-aos="fade-up">
        <h2 
          className="text-4xl md:text-5xl uppercase tracking-[0.2em] relative inline-block pb-6 font-black italic"
          style={{ color: theme.primaryColor }}
        >
          {data.title}
          <span 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1.5"
            style={{ backgroundColor: theme.accentColor }} 
          ></span>
        </h2>
        <p className="mt-8 text-slate-400 text-lg italic max-w-2xl mx-auto font-medium tracking-wide">
          {data.subtitle}
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-wrap lg:flex-nowrap gap-10 items-stretch">
          
          {/* Left Content Card */}
          <div 
            className="w-full lg:w-1/2 p-8 md:p-12 border border-white/5 backdrop-blur-xl rounded-sm"
            style={{ backgroundColor: theme.cardColor }}
            data-aos="fade-right" 
          >
            <p className="text-slate-200 leading-relaxed text-lg mb-10 font-medium">
              {data.mainDescription}
            </p>

            <ul className="space-y-6 list-none p-0">
              {data.bullets.map((bullet, index) => (
                <li key={index} className="flex items-start gap-4 group">
                  <div 
                    className="w-7 h-7 shrink-0 flex items-center justify-center transition-all group-hover:bg-opacity-40 rounded-sm"
                    style={{ backgroundColor: `${theme.primaryColor}20`, color: theme.primaryColor }}
                  >
                    <i className="bi bi-app-indicator text-lg"></i>
                  </div>
                  <span className="text-slate-300 font-bold leading-snug tracking-tight">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Content */}
          <div 
            className="w-full lg:w-1/2 flex flex-col justify-between" 
            data-aos="fade-left"
          >
            <div 
              className="relative p-10 border-l-4 italic shadow-2xl rounded-sm h-full"
              style={{ 
                borderLeftColor: theme.accentColor,
                backgroundColor: `${theme.cardColor}50` 
              }}
            >
              <i 
                className="bi bi-quote absolute top-4 right-6 text-6xl opacity-10"
                style={{ color: theme.primaryColor }}
              ></i>
              
              <p className="text-slate-200 leading-relaxed text-xl md:text-2xl font-light relative z-10 py-4">
                {data.highlightText}
              </p>
            </div>
            
            <div className="mt-10 flex justify-center lg:justify-start">
              <a 
                href={data.ctaLink} 
                className="group inline-flex items-center gap-6 px-12 py-5 text-white font-black uppercase tracking-[0.25em] text-xs transition-all hover:brightness-110 active:scale-95 shadow-xl rounded-sm"
                style={{ 
                  backgroundColor: theme.primaryColor,
                  color: theme.backgroundColor 
                }}
              >
                {data.ctaText}
                <i className="bi bi-chevron-right text-xl group-hover:translate-x-2 transition-transform"></i>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;