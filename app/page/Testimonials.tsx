"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useTheme } from "../context/ThemeContext";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

interface Review {
  id: string | number;
  name: string;
  location: string;
  role: string;
  text: string;
}

const Testimonials: React.FC = () => {
  const { theme } = useTheme();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      try {
        const response = await fetch(`${apiUrl}/api/testimonials`);
        const data = await response.json();
        const key = Object.keys(data).find(k => Array.isArray(data[k]));
        if (key) setReviews(data[key]);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (!theme) return null;

  if (loading) {
    return (
      <section 
        className="py-32 text-center" 
        style={{ backgroundColor: theme.backgroundColor }}
      >
        <div 
          className="animate-pulse font-[900] tracking-[0.4em] text-xs uppercase" 
          style={{ color: theme.primaryColor }}
        >
          Loading Community Voices...
        </div>
      </section>
    );
  }

  return (
    <section 
      id="testimonials" 
      className="py-24 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* --- Header Section --- */}
      <div className="container mx-auto px-4 mb-20 text-center" data-aos="fade-up">
        <span 
          className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 block"
          style={{ color: theme.accentColor }}
        >
          Voices of Impact
        </span>
        <h2 
          className="text-4xl md:text-6xl mb-6 tracking-tighter uppercase italic"
          style={{ color: "white", fontWeight: theme.headerFontWeight }}
        >
          Community <span style={{ color: theme.primaryColor }}>Testimonials</span>
        </h2>
        <div 
          className="w-20 h-1.5 mx-auto rounded-full mt-6" 
          style={{ backgroundColor: theme.primaryColor }}
        ></div>
        <p className="text-slate-400 italic mt-8 font-medium">
          What our community is saying about Tenachin
        </p>
      </div>

      {/* --- Swiper Section --- */}
      <div className="container mx-auto px-4">
        {reviews.length > 0 && (
          <Swiper
            modules={[Autoplay, Pagination]}
            loop={reviews.length > 3}
            speed={800}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            slidesPerView={"auto"}
            pagination={{ clickable: true, el: ".custom-pagination" }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 30 },
              1200: { slidesPerView: 3, spaceBetween: 40 },
            }}
            className="pb-20"
          >
            {reviews.map((item, index) => (
              <SwiperSlide key={item.id || index}>
                {/* Card - Updated to 1rem (rounded-2xl) and 2px border */}
                <div 
                  className="p-10 rounded-2xl border-2 h-full flex flex-col justify-between transition-all duration-500 hover:border-white/20 hover:-translate-y-2 shadow-2xl"
                  style={{ 
                    backgroundColor: theme.cardColor,
                    borderColor: 'rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <div>
                    {/* Dynamic Star Rating */}
                    <div className="flex mb-6" style={{ color: theme.primaryColor }}>
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="bi bi-star-fill text-sm mr-1"></i>
                      ))}
                    </div>

                    <div className="relative">
                      <i 
                        className="bi bi-quote text-6xl absolute -top-8 -left-6 opacity-10"
                        style={{ color: theme.primaryColor }}
                      ></i>
                      <p className="text-slate-300 leading-relaxed text-lg font-medium relative z-10 italic">
                        "{item.text}"
                      </p>
                    </div>
                  </div>
                  
                  {/* User Profile Info */}
                  <div className="mt-10 pt-8 border-t border-white/5">
                    <h3 
                      className="text-xl font-black uppercase italic tracking-tight" 
                      style={{ color: "white" }}
                    >
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="font-bold text-xs uppercase tracking-widest" style={{ color: theme.primaryColor }}>
                        {item.role}
                      </p>
                      <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                      <p className="text-slate-500 text-[10px] uppercase tracking-widest">
                        {item.location}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        
        {/* Themed Pagination Dots */}
        <div className="custom-pagination flex justify-center gap-2 mt-8"></div>
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.2) !important;
          width: 8px !important;
          height: 8px !important;
          opacity: 1 !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .swiper-pagination-bullet-active {
          background: ${theme.primaryColor} !important;
          width: 32px !important;
          border-radius: 1rem !important; /* Matches your 1rem theme */
        }
      `}</style>
    </section>
  );
};

export default Testimonials;