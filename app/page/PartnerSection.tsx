"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import { useTheme } from ".././context/ThemeContext";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";

const PartnerSection: React.FC = () => {
  const { theme } = useTheme();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      try {
        const response = await fetch(`${apiUrl}/api/partners`);
        const result = await response.json();
        // Handle both nested and direct JSON structures
        setData(result.partnerData || result);
      } catch (error) {
        console.error("Error fetching partner data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  if (loading || !data) return null;

  return (
    <section 
      id="partner" 
      className="relative py-24 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Mesh Background */}
      <div 
        className="absolute inset-0 z-0 opacity-10" 
        style={{ 
          backgroundImage: `radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)`, 
          backgroundSize: '40px 40px' 
        }}
      ></div>

      {/* --- Header Section --- */}
      {(data.title || data.subtitle) && (
        <div className="container mx-auto px-4 text-center mb-20 relative z-10" data-aos="fade-up">
          {data.badge && (
            <span 
              className="font-black uppercase tracking-[0.4em] text-[10px] mb-4 block"
              style={{ color: theme.accentColor }}
            >
              {data.badge}
            </span>
          )}
          
          {data.title && (
            <h2 
              className="text-4xl md:text-6xl tracking-tighter mb-6 uppercase italic"
              style={{ color: "white", fontWeight: theme.headerFontWeight }}
            >
              {data.title}
            </h2>
          )}

          {data.subtitle && (
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
              {data.subtitle}
            </p>
          )}
        </div>
      )}

      {/* --- Category Grid --- */}
      <div className="container mx-auto px-4 mb-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.items?.map((partner: any, index: number) => (
            <div key={index} data-aos="fade-up" data-aos-delay={partner.delay || index * 50}>
              <div 
                className="group h-full p-8 rounded-2xl border-2 transition-all duration-500 hover:border-white/20 shadow-2xl"
                style={{ 
                  backgroundColor: theme.cardColor,
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 shadow-lg"
                  style={{ 
                    backgroundColor: `${partner.color || theme.primaryColor}15`, 
                    color: partner.color || theme.primaryColor 
                  }}
                >
                  <i className={`bi ${partner.icon} text-2xl`}></i>
                </div>
                <h3 className="text-xl font-black text-white mb-3 uppercase italic tracking-tight">
                  {partner.title}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  {partner.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- HORIZONTAL SLIDER --- */}
      {data.hospitals && data.hospitals.length > 0 && (
        <div 
          className="relative z-10 py-16 border-y border-white/5"
          style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
        >
          <div className="container mx-auto px-4 mb-12 text-center">
              <h3 
                className="text-xl md:text-2xl font-black uppercase tracking-[0.2em]"
                style={{ color: "white" }}
              >
                  {data.hospitalSectionTitle || "Our Partners"}
              </h3>
              <div 
                className="w-20 h-1.5 mx-auto mt-4 rounded-full"
                style={{ backgroundColor: theme.primaryColor }}
              ></div>
          </div>

          <div className="px-4 md:px-10">
            <Swiper
              modules={[Autoplay, FreeMode]}
              spaceBetween={25}
              slidesPerView={2}
              loop={true}
              freeMode={true}
              speed={5000}
              autoplay={{
                delay: 1,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: { slidesPerView: 3, spaceBetween: 30 },
                1024: { slidesPerView: 4, spaceBetween: 40 },
                1280: { slidesPerView: 5, spaceBetween: 50 },
              }}
              className="partner-swiper pointer-events-none md:pointer-events-auto"
            >
              {data.hospitals.map((hospital: any, idx: number) => (
                <SwiperSlide key={idx}>
                  <div 
                    className="group/hosp border-2 p-8 rounded-2xl flex flex-col items-center text-center justify-center gap-5 transition-all duration-500 hover:border-white/20 min-h-[180px] shadow-xl"
                    style={{ 
                      backgroundColor: theme.cardColor,
                      borderColor: 'rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <div className="w-24 h-24 rounded-2xl bg-white/5 group-hover/hosp:bg-white p-4 flex items-center justify-center transition-all duration-700 overflow-hidden">
                      {hospital.image ? (
                        <img 
                          src={hospital.image} 
                          alt={hospital.name} 
                          className="w-full h-full object-contain grayscale opacity-60 group-hover/hosp:grayscale-0 group-hover/hosp:opacity-100 transition-all duration-700" 
                        />
                      ) : (
                        <i 
                          className="bi bi-hospital text-4xl opacity-30 group-hover/hosp:opacity-100 transition-all"
                          style={{ color: theme.primaryColor }}
                        ></i>
                      )}
                    </div>
                    <span className="text-[10px] md:text-xs font-black text-slate-500 group-hover/hosp:text-white transition-colors uppercase tracking-widest leading-tight">
                      {hospital.name}
                    </span>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      {/* --- Dynamic Call to Action --- */}
      {data.ctaText && (
        <div className="container mx-auto px-4 mt-24 text-center relative z-10" data-aos="fade-up">
          <div className="inline-block group">
              <a 
                href={data.ctaLink || "#contact"} 
                className="flex items-center gap-4 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95"
                style={{ 
                  backgroundColor: theme.primaryColor, 
                  color: theme.backgroundColor,
                  boxShadow: `0 20px 40px ${theme.primaryColor}30`
                }}
              >
                  {data.ctaText}
                  <i className="bi bi-arrow-right text-lg group-hover:translate-x-2 transition-transform"></i>
              </a>
          </div>
        </div>
      )}

      <style jsx global>{`
        .partner-swiper .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </section>
  );
};

export default PartnerSection;