"use client";

import React, { useState, useEffect } from "react";

interface CTAData {
  title: string;
  description: string;
  buttonText: string;
  downloadUrl: string;
  showAnimation: boolean;
}

const CallToAction: React.FC = () => {
  const [data, setData] = useState<CTAData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCTA = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      try {
        const response = await fetch(`${apiUrl}/api/cta`, { 
          cache: 'no-store' // Prevents old data from sticking
        });
        const result = await response.json();
        
        // Match the data structure from your backend presets
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

  // Prevent layout shift: show a simple dark placeholder while loading
  if (loading) return <div className="py-20 bg-slate-900"></div>;
  if (!data) return null;

  return (
    <section 
      id="call-to-action" 
      className="relative py-24 bg-slate-900 overflow-hidden"
    >
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div 
          className="flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left"
          data-aos="fade-up" // Simpler mobile animation than zoom-in
        >
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
              {data.title}
            </h3>
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto lg:mx-0">
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
                font-black text-white transition-all duration-300 
                bg-blue-600 rounded-2xl hover:bg-blue-500 hover:scale-105 
                shadow-2xl shadow-blue-600/30 active:scale-95
                ${data.showAnimation ? 'animate-pulse' : ''}
              `}
            >
              <span className="tracking-widest uppercase text-xs">{data.buttonText}</span>
              <i className="bi bi-arrow-right-circle-fill ml-3 text-xl group-hover:translate-x-1 transition-transform"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;