"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

interface FeatureTab {
  id: string;
  label: string;
  icon: string;
  title: string;
  imgSrc: string;
  imgAlt: string;
  description?: string;
  highlight?: string;
  values?: { title: string; desc: string }[];
}

const Features: React.FC = () => {
  const { theme } = useTheme();
  const [features, setFeatures] = useState<FeatureTab[]>([]);
  const [activeTabId, setActiveTabId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      try {
        const response = await fetch(`${apiUrl}/api/features`);
        const data = await response.json();
        const key = Object.keys(data).find(k => Array.isArray(data[k]));
        
        if (key && data[key].length > 0) {
          setFeatures(data[key]);
          setActiveTabId(data[key][0].id);
        }
      } catch (error) {
        console.error("Error fetching features:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatures();
  }, []);

  const activeTab = features.find(t => t.id === activeTabId);

  const ContentWrapper = ({ tab }: { tab: FeatureTab }) => (
    <div key={tab.id} className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 animate-in fade-in duration-500">
      {/* Image Side - Updated to 1rem (rounded-2xl) */}
      <div className="w-full lg:w-1/2 order-1 lg:order-2">
        <div className="relative group">
          <div 
            className="relative overflow-hidden rounded-2xl shadow-xl border-2 transition-all duration-500 group-hover:border-opacity-50"
            style={{ borderColor: `${theme.primaryColor}40` }}
          >
            <img 
              src={tab.imgSrc} 
              alt={tab.imgAlt} 
              className="w-full h-[300px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          </div>
        </div>
      </div>

      {/* Text Side */}
      <div className="w-full lg:w-1/2 order-2 lg:order-1 text-center lg:text-left">
        <div 
          className="inline-flex items-center gap-2 px-3 py-1 rounded-md border text-[10px] font-black uppercase tracking-[0.2em] mb-6"
          style={{ 
            color: theme.primaryColor, 
            borderColor: `${theme.primaryColor}30`,
            backgroundColor: `${theme.primaryColor}10`
          }}
        >
           <i className="bi bi-cpu-fill"></i>
           System Feature
        </div>
        <h3 
          className="text-3xl md:text-5xl mb-6 leading-tight tracking-tight uppercase font-black italic"
          style={{ color: "white" }}
        >
          {tab.title}
        </h3>
        
        <div className="text-slate-400 text-base md:text-lg leading-relaxed">
          {tab.highlight && (
            <p 
              className="leading-relaxed italic border-l-4 pl-6 py-3 mb-8 bg-white/5 rounded-r-2xl"
              style={{ borderColor: theme.primaryColor, color: "white" }}
            >
              "{tab.highlight}"
            </p>
          )}
          
          {tab.description && <p className="mb-8 text-sm md:text-base opacity-90">{tab.description}</p>}

          {tab.values && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {tab.values.map((val, i) => (
                <li 
                  key={i} 
                  className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-slate-900/50 hover:bg-slate-800/50 transition-colors"
                >
                  <div 
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <i className="bi bi-check-all text-white text-lg"></i>
                  </div>
                  <div>
                    <span className="font-bold text-white block uppercase text-[11px] tracking-wide mb-1">{val.title}</span> 
                    <span className="text-slate-500 text-[12px] leading-snug block">{val.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );

  if (loading || features.length === 0) return null;

  return (
    <section 
      id="features" 
      className="py-20 md:py-32 relative"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Navigation Tabs - Updated to rounded-2xl border/container */}
        <div className="flex justify-center mb-12">
          <div className="w-full overflow-x-auto no-scrollbar">
            <div 
              className="inline-flex items-center p-1 rounded-2xl border border-white/10"
              style={{ backgroundColor: theme.cardColor }}
            >
              {features.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`flex items-center gap-3 px-6 md:px-8 py-3 rounded-2xl font-bold transition-all duration-300 whitespace-nowrap tracking-wider uppercase text-[11px]
                    ${activeTabId === tab.id ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
                  style={{ 
                    backgroundColor: activeTabId === tab.id ? theme.primaryColor : 'transparent',
                    boxShadow: activeTabId === tab.id ? `0 4px 12px ${theme.primaryColor}30` : 'none'
                  }}
                >
                  <i className={`bi ${tab.icon} text-base`}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Box - Updated to 1rem (rounded-2xl) and 2px border */}
        <div 
          className="rounded-2xl p-8 md:p-16 border-2 relative shadow-2xl" 
          style={{ 
            backgroundColor: theme.cardColor,
            borderColor: 'rgba(255, 255, 255, 0.05)'
          }}
        >
          <div className="relative z-10">
            {activeTab && <ContentWrapper tab={activeTab} />}
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default Features;
