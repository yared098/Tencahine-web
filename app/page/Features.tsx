"use client";
import React, { useState, useEffect } from "react";

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
  const [features, setFeatures] = useState<FeatureTab[]>([]);
  const [activeTabId, setActiveTabId] = useState("");
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchFeatures = async () => {
    // 1. Reference the base URL from your environment configuration
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      // 2. Use the dynamic apiUrl for the features endpoint
      const response = await fetch(`${apiUrl}/api/features`);
      const data = await response.json();
      
      // 3. Extract the array from the response object
      const key = Object.keys(data).find(k => Array.isArray(data[k]));
      
      if (key && data[key].length > 0) {
        setFeatures(data[key]);
        // Set the first tab (e.g., 'Mission') as active by default
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
    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Text Side */}
      <div className="w-full lg:w-1/2 order-2 lg:order-1 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-4">
           <i className="bi bi-star-fill text-[10px]"></i>
           Tenachin Goals
        </div>
        <h3 className="text-3xl md:text-4xl font-extrabold text-slate-950 mb-6 leading-tight tracking-tight">
          {tab.title}
        </h3>
        
        <div className="text-slate-700 text-lg leading-relaxed">
          {tab.highlight && (
            <p className="text-slate-800 leading-relaxed italic border-l-4 border-blue-600 pl-4 md:pl-8 py-3 bg-blue-50/50 rounded-r-2xl text-lg md:text-xl font-medium mb-6">
              {tab.highlight}
            </p>
          )}
          
          {tab.description && <p>{tab.description}</p>}

          {tab.values && (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-6">
              {tab.values.map((val, i) => (
                <li key={i} className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-blue-200 group">
                  <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center transition-transform group-hover:scale-110">
                    <i className="bi bi-check2 text-lg"></i>
                  </div>
                  <div>
                    <span className="font-bold text-slate-950 block">{val.title}</span> 
                    <span className="text-slate-500 text-xs md:text-sm">{val.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Image Side */}
      <div className="w-full lg:w-1/2 order-1 lg:order-2">
        <div className="relative group">
          <div className="absolute -inset-4 bg-blue-100/40 rounded-[3rem] rotate-3 group-hover:rotate-0 transition-transform duration-500 pointer-events-none"></div>
          <div className="relative overflow-hidden rounded-3xl md:rounded-[2.5rem] shadow-2xl border-4 md:border-[12px] border-white">
            <img src={tab.imgSrc} alt={tab.imgAlt} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading || features.length === 0) return null;

  return (
    <section id="features" className="py-20 md:py-28 bg-slate-50 overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-[128px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12 md:mb-20" data-aos="fade-up">
          <div className="w-full max-w-full overflow-x-auto no-scrollbar pb-4 flex justify-start md:justify-center">
            <div className="inline-flex p-1.5 bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-slate-100 min-w-max">
              {features.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`flex items-center gap-3 px-6 md:px-10 py-3.5 md:py-4 rounded-[1.5rem] font-bold transition-all duration-500 whitespace-nowrap tracking-tight ${
                    activeTabId === tab.id 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-[1.03]" 
                    : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <i className={`bi ${tab.icon} ${activeTabId === tab.id ? 'text-white' : 'text-blue-500'} text-xl`}></i>
                  <span className="text-base md:text-lg">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Display Content Box */}
        <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-20 shadow-2xl shadow-blue-900/5 border border-slate-50 relative" data-aos="fade-up">
          <div className="absolute top-10 right-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
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