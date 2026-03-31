"use client";

import React, { useState, useEffect } from "react";

interface ServiceItem {
  id: string | number;
  icon: string;
  color: string;
  title: string;
  desc: string;
}

const Services: React.FC = () => {
  const [serviceList, setServiceList] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Pointing to your Generic Route: /api/:file
        const response = await fetch("http://localhost:5000/api/services_data");
        const data = await response.json();
        
        // Your controller finds the first key that is an array
        // We find it here too to set our state
        const key = Object.keys(data).find(k => Array.isArray(data[k]));
        if (key) {
          setServiceList(data[key]);
        }
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="py-24 bg-slate-50 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-slate-500 font-medium">Loading Health Services...</p>
      </div>
    );
  }

  return (
    <section id="services" className="py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em] mb-3">
            What We Offer
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
            Comprehensive Digital Health Ecosystem
          </h3>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {serviceList.map((service, index) => (
            <div 
              key={service.id || index}
              className="group relative bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 overflow-hidden flex flex-col h-full"
            >
              {/* Animated Color Accent */}
              <div 
                className="absolute top-0 left-0 w-full h-1 transition-transform duration-500 transform -translate-x-full group-hover:translate-x-0"
                style={{ backgroundColor: service.color }}
              ></div>

              {/* Icon Container */}
              <div 
                className="relative w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:rotate-[360deg]"
                style={{ backgroundColor: `${service.color}10` }} 
              >
                <i className={`bi ${service.icon} text-2xl relative z-10`} style={{ color: service.color }}></i>
                <div 
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 animate-ping"
                  style={{ backgroundColor: service.color }}
                ></div>
              </div>

              {/* Text Content */}
              <h4 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                {service.title}
              </h4>
              <p className="text-slate-500 leading-relaxed text-sm flex-grow">
                {service.desc}
              </p>

              {/* Learn More link */}
              <div className="mt-6 flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <span>Explore Detail</span>
                <i className="bi bi-arrow-right"></i>
              </div>

              {/* Background Glow */}
              <div 
                className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full opacity-[0.03] group-hover:scale-[3] transition-transform duration-700 pointer-events-none"
                style={{ backgroundColor: service.color }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;