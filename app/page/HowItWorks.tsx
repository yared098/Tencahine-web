"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const HowItWorks: React.FC = () => {
  const { theme } = useTheme();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/howtouse`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch HowItWorks data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl]);

  if (loading || !data) {
    return (
      <div className="py-24 text-center text-white italic opacity-50 animate-pulse">
        LOADING PROCESS...
      </div>
    );
  }

  return (
    <section 
      id="how-it-works" 
      className="py-24 relative overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Background Glows */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-10 pointer-events-none" style={{ backgroundColor: theme.primaryColor }}></div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* 1. Section Header - Only shows if badge or title exists */}
        {(data.header?.badge || data.header?.title) && (
          <div className="max-w-3xl mx-auto text-center mb-20">
            {data.header?.badge && (
              <span 
                className="inline-block px-5 py-1.5 mb-6 text-[10px] font-black tracking-[0.3em] uppercase rounded-full border-2"
                style={{ color: theme.accentColor, borderColor: `${theme.accentColor}30`, backgroundColor: `${theme.accentColor}10` }}
              >
                {data.header.badge}
              </span>
            )}
            
            {data.header?.title && (
              <h2 className="text-4xl md:text-5xl mb-6 tracking-tighter italic uppercase text-white" style={{ fontWeight: theme.headerFontWeight }}>
                {data.header.title.split(', ').map((word: string, i: number, arr: string[]) => (
                    <React.Fragment key={i}>
                        {i === arr.length - 1 ? <span style={{ color: theme.primaryColor }}>{word}</span> : word + (i < arr.length -1 ? ", " : "")}
                    </React.Fragment>
                ))}
              </h2>
            )}

            {data.header?.description && (
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                {data.header.description}
              </p>
            )}
          </div>
        )}

        {/* 2. Step Grid */}
        {data.steps && data.steps.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative mb-32">
            <div className="hidden lg:block absolute top-[20%] left-0 w-full h-[2px] bg-white/5 -z-10"></div>

            {data.steps.map((item: any, index: number) => {
              const stepColor = 
                  index === 1 ? theme.secondaryColor : 
                  (index === 2 || index === 4) ? theme.accentColor : 
                  index === 5 ? "#f97316" : theme.primaryColor;

              return (
                <div key={index} className="relative group h-full">
                  {/* Step Number Background */}
                  {item.step && item.step !== "⏱" && (
                    <div className="absolute -top-12 -left-6 text-[120px] font-black opacity-5 group-hover:opacity-10 group-hover:-translate-y-4 transition-all duration-700 select-none -z-10 italic" style={{ color: stepColor }}>
                      {item.step}
                    </div>
                  )}

                  <div className="flex flex-col h-full p-10 rounded-2xl border-2 transition-all duration-500 hover:border-white/20 group-hover:-translate-y-2 shadow-2xl" style={{ backgroundColor: theme.cardColor, borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                    
                    {/* Icon - Hidden if not found */}
                    {item.icon && (
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl mb-10 transition-all duration-500 group-hover:scale-110" style={{ backgroundColor: stepColor, boxShadow: `0 15px 30px ${stepColor}40` }}>
                        <i className={`bi ${item.icon}`}></i>
                      </div>
                    )}

                    <div className="flex-grow">
                      {item.step && (
                        <div className="flex items-center gap-3 mb-4">
                          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: stepColor }}></span>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Step {item.step === "⏱" ? "Limit" : item.step}</span>
                        </div>
                      )}
                      
                      {item.title && (
                        <h3 className="text-2xl mb-4 uppercase italic font-bold text-white leading-tight">
                          {item.title}
                        </h3>
                      )}
                      
                      <div className="text-slate-400 text-sm leading-relaxed font-medium">
                        {/* Text/Description Logic */}
                        {(item.type === "text" || item.description || item.content) && (
                          <p>{item.description || item.content}</p>
                        )}
                        
                        {/* List Items Logic - Hidden if items array is empty */}
                        {item.type === "list" && item.items && item.items.length > 0 && (
                          <ul className="space-y-3">
                            {item.items.map((li: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <i className="bi bi-check-circle-fill text-[10px] mt-1" style={{ color: stepColor }}></i>
                                <span>{li}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Guarantee Logic - Hidden if no values */}
                        {item.type === "guarantee" && (item.emergency || item.general) && (
                          <div className="mt-2 p-4 rounded-xl border border-white/5" style={{ backgroundColor: `rgba(0,0,0,0.2)` }}>
                            {item.emergency && (
                              <div className="flex justify-between mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Emergencies</span>
                                <span className="text-xs font-black text-white">{item.emergency}</span>
                              </div>
                            )}
                            {item.general && (
                              <div className="flex justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">General</span>
                                <span className="text-xs font-black text-white">{item.general}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-10 w-12 h-1 rounded-full opacity-20 group-hover:w-full group-hover:opacity-100 transition-all duration-700" style={{ backgroundColor: stepColor }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3. Video Player - Completely hidden if videoUrl is missing */}
        {data.videoUrl && data.videoUrl.trim() !== "" && (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
                <h3 className="text-white uppercase italic font-bold tracking-widest text-sm opacity-50">Visual Guide</h3>
            </div>
            
            <div className="relative p-2 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent shadow-2xl">
                <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-black group">
                    <iframe 
                        src={data.videoUrl}
                        title="How Tenachin Works"
                        className="absolute inset-0 w-full h-full z-10"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default HowItWorks;