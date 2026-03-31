"use client"; 

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/testimonials");
        const data = await response.json();
        
        // Find the array inside the object based on your controller's generic logic
        const key = Object.keys(data).find(k => Array.isArray(data[k]));
        if (key) {
          setReviews(data[key]);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-slate-50 text-center">
        <div className="animate-pulse text-slate-400">Loading Testimonials...</div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-20 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4 mb-12 text-center">
        <h2 className="text-3xl font-bold text-slate-900">Testimonials</h2>
        <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 mb-4"></div>
        <p className="text-slate-500 italic">What our community is saying about Tenachin</p>
      </div>

      <div className="container mx-auto px-4">
        {reviews.length > 0 && (
          <Swiper
            modules={[Autoplay, Pagination]}
            loop={reviews.length > 3} // Only loop if there are enough slides
            speed={600}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            slidesPerView={"auto"}
            pagination={{ clickable: true, el: ".custom-pagination" }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 30 },
              1200: { slidesPerView: 3, spaceBetween: 30 },
            }}
            className="pb-16"
          >
            {reviews.map((item, index) => (
              <SwiperSlide key={item.id || index}>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col justify-between transition-transform hover:-translate-y-1">
                  <div>
                    <div className="flex text-yellow-400 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="bi bi-star-fill text-sm"></i>
                      ))}
                    </div>
                    <p className="text-slate-600 leading-relaxed italic mb-6 relative">
                      <i className="bi bi-quote text-blue-200 text-4xl absolute -top-4 -left-4 -z-0"></i>
                      <span className="relative z-10">"{item.text}"</span>
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-slate-50">
                    <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
                    <p className="text-blue-600 text-sm font-medium">{item.role}</p>
                    <p className="text-slate-400 text-xs mt-1 uppercase tracking-wider">{item.location}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        
        {/* Custom Pagination Container */}
        <div className="custom-pagination flex justify-center mt-4"></div>
      </div>
    </section>
  );
};

export default Testimonials;