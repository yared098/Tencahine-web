"use client";

import React, { useState, useEffect } from "react";

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
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  const fetchAbout = async () => {
    // Accessing the variable from .env
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
    <section id="about" className="about section py-16 lg:py-24 bg-white overflow-hidden">
      {/* Section Title */}
      <div className="container mx-auto px-4 mb-12 text-center" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-blue-600 uppercase tracking-wider relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-1 after:bg-blue-600">
          {data.title}
        </h2>
        <p className="mt-4 text-slate-500 text-lg italic">{data.subtitle}</p>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-wrap lg:flex-nowrap gap-8 lg:gap-12">
          
          {/* Left Content */}
          <div 
            className="w-full lg:w-1/2" 
            data-aos="fade-up" 
            data-aos-delay="100"
          >
            <p className="text-slate-700 leading-relaxed text-lg mb-6">
              {data.mainDescription}
            </p>

            <ul className="space-y-4 list-none p-0">
              {data.bullets.map((bullet, index) => (
                <li key={index} className="flex items-start gap-3">
                  <i className="bi bi-check2-circle text-blue-600 text-xl mt-1"></i>
                  <span className="text-slate-700 font-medium italic">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Content */}
          <div 
            className="w-full lg:w-1/2" 
            data-aos="fade-up" 
            data-aos-delay="200"
          >
            <p className="text-slate-600 leading-relaxed border-l-4 border-blue-100 pl-6 italic">
              {data.highlightText}
            </p>
            
            <div className="mt-8">
              <a 
                href={data.ctaLink} 
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
              >
                {data.ctaText}
                <i className="bi bi-arrow-right"></i>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;