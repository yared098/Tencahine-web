"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

interface CTAData {
  title: string;
  description: string;
  buttonText: string;
  downloadUrl: string;
  showAnimation: boolean;
}

const CallToAction: React.FC = () => {
  const { theme } = useTheme();
  const [data, setData] = useState<CTAData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCTA = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      try {
        const response = await fetch(`${apiUrl}/api/cta`, { 
          cache: 'no-store' 
        });
        const result = await response.json();
        
        if (result.presets && result.activeID) {
          const active = result.presets.find((p: any) => p.id === result.activeID);
          setData(active || result.presets[0]);
        } else {
          setData(result.ctaData || result);
        }
      } catch (error) {
        console.error("Error fetching CTA data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCTA();
  }, []);

  if (loading) return <div className="py-24" style={{ backgroundColor: theme.backgroundColor }}></div>;
  if (!data) return null;

  return (
    <section 
      id="call-to-action" 
      className="relative py-20 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Thematic Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div 
          className="absolute -top-48 -left-48 w-[500px] h-[500px] rounded-full blur-[150px]"
          style={{ backgroundColor: theme.primaryColor }}
        ></div>
        <div 
          className="absolute -bottom-48 -right-48 w-[500px] h-[500px] rounded-full blur-[150px]"
          style={{ backgroundColor: theme.accentColor }}
        ></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div 
          className="flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left p-10 md:p-16 border border-white/10 backdrop-blur-md rounded-sm"
          style={{ backgroundColor: `${theme.cardColor}90` }}
          data-aos="fade-up"
        >
          {/* Content */}
          <div className="flex-1">
            <h3 
              className="text-4xl md:text-5xl mb-6 tracking-tighter leading-tight italic uppercase font-black"
              style={{ color: "white" }}
            >
              {data.title.split(' ').map((word, i) => (
                <span key={i} style={{ color: i % 2 !== 0 ? theme.primaryColor : "white" }}>
                  {word}{" "}
                </span>
              ))}
            </h3>
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium tracking-tight">
              {data.description}
            </p>
          </div>

          {/* Action */}
          <div className="flex-shrink-0">
            <a 
              href={data.downloadUrl}
              target="_blank"
              rel="noopener noreferrer" 
              className={`
                group relative inline-flex items-center justify-center px-12 py-5 
                text-white transition-all duration-300 rounded-sm
                hover:brightness-110 active:scale-95 shadow-2xl
                ${data.showAnimation ? 'animate-pulse' : ''}
              `}
              style={{ 
                backgroundColor: theme.primaryColor,
                boxShadow: `0 10px 30px ${theme.primaryColor}30`,
              }}
            >
              <span 
                className="tracking-[0.3em] uppercase text-[11px] font-black"
                style={{ color: theme.backgroundColor }}
              >
                {data.buttonText}
              </span>
              <div 
                className="ml-5 w-8 h-8 rounded-sm flex items-center justify-center transition-transform group-hover:translate-y-1"
                style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
              >
                <i 
                   className="bi bi-download text-lg"
                   style={{ color: theme.backgroundColor }}
                ></i>
              </div>
            </a>
            
            {/* Secondary Badge */}
            <div className="mt-6 flex items-center justify-center lg:justify-start gap-3 opacity-60">
               <span className="w-4 h-[2px]" style={{ backgroundColor: theme.accentColor }}></span>
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Secure Environment</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
