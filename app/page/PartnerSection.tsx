"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";

const PartnerSection: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      try {
        const response = await fetch(`${apiUrl}/api/partners`);
        const result = await response.json();
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
    <section id="partner" className="relative py-24 bg-white overflow-hidden">
      {/* Light Mesh Background */}
      <div className="absolute inset-0 z-0 opacity-40" 
           style={{ backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`, backgroundSize: '32px 32px' }}>
      </div>

      {/* --- Header Section --- */}
      <div className="container mx-auto px-4 text-center mb-16 relative z-10" data-aos="fade-up">
        <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Ecosystem</span>
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
          {data.title}
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
          {data.subtitle}
        </p>
      </div>

      {/* --- Category Grid (Fixed) --- */}
      <div className="container mx-auto px-4 mb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.items?.map((partner: any, index: number) => (
            <div key={index} data-aos="fade-up" data-aos-delay={index * 50}>
              <div className="group h-full bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-200">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <i className={`bi ${partner.icon} text-xl`} style={{ color: partner.color }}></i>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{partner.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{partner.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- HORIZONTAL SLIDER: Leading Institutions --- */}
      <div className="relative z-10 py-12 bg-slate-50/50 border-y border-slate-100">
        <div className="container mx-auto px-4 mb-10 text-center">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-widest">
                {data.hospitalSectionTitle || "Working with Ethiopia's Leading Institutions"}
            </h3>
            <div className="w-12 h-1 bg-blue-600 mx-auto mt-3 rounded-full"></div>
        </div>

        <div className="px-4 md:px-10">
          <Swiper
            modules={[Autoplay, FreeMode]}
            spaceBetween={20}
            slidesPerView={2}
            loop={true}
            freeMode={true}
            speed={4000} // Smooth continuous scroll
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
            {data.hospitals?.map((hospital: any, idx: number) => (
              <SwiperSlide key={idx}>
                <div className="group/hosp bg-white border border-slate-200/60 p-6 rounded-3xl flex flex-col items-center text-center justify-center gap-4 transition-all hover:shadow-lg hover:border-blue-400 min-h-[160px]">
                  <div className="w-20 h-20 rounded-2xl bg-slate-50 group-hover/hosp:bg-white p-3 flex items-center justify-center transition-colors overflow-hidden">
                    {hospital.image ? (
                      <img 
                        src={hospital.image} 
                        alt={hospital.name} 
                        className="w-full h-full object-contain grayscale group-hover/hosp:grayscale-0 transition-all duration-500" 
                      />
                    ) : (
                      <i className="bi bi-hospital text-slate-300 group-hover/hosp:text-blue-600 text-3xl transition-colors"></i>
                    )}
                  </div>
                  <span className="text-[10px] md:text-xs font-black text-slate-500 group-hover/hosp:text-blue-600 transition-colors uppercase tracking-widest leading-tight">
                    {hospital.name}
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* --- Become a Partner Call to Action --- */}
      <div className="container mx-auto px-4 mt-20 text-center relative z-10" data-aos="fade-up">
        <div className="inline-block group">
            <a href="#contact" className="flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10">
                Become a Partner
                <i className="bi bi-arrow-right group-hover:translate-x-2 transition-transform"></i>
            </a>
        </div>
      </div>

      <style jsx global>{`
        .partner-swiper .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </section>
  );
};

export default PartnerSection;