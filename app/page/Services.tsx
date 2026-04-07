"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

interface ServiceItem {
  id: string | number;
  icon: string;
  color: string;
  title: string;
  desc: string;
}

interface ServicesData {
  badge?: string;
  title?: string;
  services_list: ServiceItem[];
}

const Services: React.FC = () => {
  const { theme } = useTheme();
  const [data, setData] = useState<ServicesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/api/services_data`);
        const json = await response.json();
        
        const servicesList = json.services_data || [];
        
        setData({
          badge: json.badge || null,
          title: json.title || null,
          services_list: servicesList
        });
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (!loading && (!data || data.services_list.length === 0)) return null;

  return (
    <section 
      id="services" 
      className="py-24 md:py-32 relative overflow-hidden transition-colors duration-500 min-h-[600px] flex flex-col justify-center"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div 
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-5 pointer-events-none"
        style={{ backgroundColor: theme.primaryColor }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div 
              className="animate-spin h-12 w-12 border-t-2 border-primary rounded-full"
              style={{ borderTopColor: theme.primaryColor, borderRightColor: 'transparent' }}
            ></div>
            <p className="mt-6 text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">
              Loading Services...
            </p>
          </div>
        ) : (
          <>
            {(data?.title || data?.badge) && (
              <div className="max-w-3xl mx-auto text-center mb-24">
                {data?.badge && (
                  <span 
                    className="inline-block px-5 py-2 rounded-sm font-black uppercase tracking-[0.4em] mb-6 border border-white/10"
                    style={{ 
                      /* DYNAMIC CHANGES START HERE */
                      color: theme.accentColor, 
                      fontSize: theme.fontSizeBase, // Uses your "16px"
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      fontWeight: theme.headerFontWeight || '900'
                      /* DYNAMIC CHANGES END HERE */
                    }}
                  >
                    {data.badge}
                  </span>
                )}

                {data?.title && (
                  <h2 className="text-5xl md:text-7xl mb-8 tracking-tighter uppercase italic font-black text-white">
                    {data.title.split(' ').map((word, i, arr) => (
                      <React.Fragment key={i}>
                        {i === arr.length - 1 ? (
                          <span style={{ color: theme.primaryColor }}>{word}</span>
                        ) : (
                          word + " "
                        )}
                      </React.Fragment>
                    ))}
                  </h2>
                )}

                <div 
                  className="w-20 h-1 mx-auto"
                  style={{ backgroundColor: theme.primaryColor }}
                ></div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data?.services_list.map((service, index) => (
                service.title && (
                  <div 
                    key={service.id || index}
                    className="group relative p-8 rounded-sm border border-white/5 transition-all duration-700 hover:border-white/20 flex flex-col h-full overflow-hidden"
                    style={{ backgroundColor: theme.cardColor }}
                  >
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                      style={{ 
                        background: `radial-gradient(circle at top right, ${service.color || theme.primaryColor}15, transparent 70%)` 
                      }}
                    ></div>

                    <div 
                      className="absolute top-0 left-0 w-0 h-1 transition-all duration-500 group-hover:w-full"
                      style={{ backgroundColor: service.color || theme.primaryColor }}
                    ></div>

                    {service.icon && (
                      <div className="w-14 h-14 rounded-sm flex items-center justify-center mb-8 border border-white/5 bg-white/[0.02] transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110">
                        <i 
                          className={`bi ${service.icon} text-2xl`} 
                          style={{ color: service.color || theme.primaryColor }}
                        ></i>
                      </div>
                    )}

                    <h4 className="text-lg font-black text-white mb-4 uppercase italic tracking-tight">
                      {service.title}
                    </h4>
                    
                    {service.desc && (
                      <p className="text-slate-400 leading-relaxed text-sm font-medium flex-grow mb-10 group-hover:text-slate-300 transition-colors">
                        {service.desc}
                      </p>
                    )}

                    <div 
                      className="flex items-center gap-2 font-black text-[9px] uppercase tracking-[0.2em] mt-auto transition-all duration-500 group-hover:gap-4"
                      style={{ color: service.color || theme.primaryColor }}
                    >
                      <span className="opacity-60 group-hover:opacity-100">Details</span>
                      <i className="bi bi-arrow-right text-lg"></i>
                    </div>
                  </div>
                )
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Services;