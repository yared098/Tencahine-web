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
    // 1. Get the base URL from the environment variable
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      // 2. Use the dynamic apiUrl for the request
      const response = await fetch(`${apiUrl}/api/cta`);
      const result = await response.json();
      
      // 3. Handle the response data structure
      if (result.ctaData) {
        setData(result.ctaData);
      } else {
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching CTA data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchCTA();
}, []);
  if (loading || !data) return null;

  return (
    <section 
      id="call-to-action" 
      className="relative py-20 bg-slate-900 overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-700 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div 
          className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-10" 
          data-aos="zoom-in" 
          data-aos-delay="100"
        >
          {/* Text Content */}
          <div className="w-full lg:w-3/4 text-center lg:text-left">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {data.title}
            </h3>
            <p className="text-slate-300 text-lg leading-relaxed max-w-4xl">
              {data.description}
            </p>
          </div>

          {/* Button Container */}
          <div className="w-full lg:w-1/4 flex justify-center lg:justify-end">
            <a 
              href={data.downloadUrl}
              target="_blank"
              rel="noopener noreferrer" 
              className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white transition-all duration-200 bg-blue-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-blue-500 hover:scale-105 shadow-xl shadow-blue-900/20"
              role="button"
            >
              {data.buttonText}
              <i className={`bi bi-download ml-2 ${data.showAnimation ? 'group-hover:animate-bounce' : ''}`}></i>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CallToAction;