"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

interface FAQItem {
  id: number | string;
  question: string;
  answer: string;
}

const Faq: React.FC = () => {
  const { theme } = useTheme();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [activeId, setActiveId] = useState<number | string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      try {
        const response = await fetch(`${apiUrl}/api/faq`);
        const data = await response.json();
        const key = Object.keys(data).find(k => Array.isArray(data[k]));
        
        if (key) {
          setFaqs(data[key]);
          if (data[key].length > 0) {
            setActiveId(data[key][0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFaq = (id: number | string) => {
    setActiveId(activeId === id ? null : id);
  };

  if (loading) return null;

  return (
    <section 
      id="faq" 
      className="py-24 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Header Section */}
      <div className="container mx-auto px-4 text-center mb-20" data-aos="fade-up">
        <span 
          className="text-[11px] font-black uppercase tracking-[0.5em] mb-4 block"
          style={{ color: theme.accentColor }}
        >
          Intelligence Base
        </span>
        <h2 
          className="text-4xl md:text-5xl mb-6 tracking-tighter uppercase italic font-black"
          style={{ color: "white" }}
        >
          Frequently Asked <span style={{ color: theme.primaryColor }}>Questions</span>
        </h2>
        <div 
          className="w-20 h-1.5 mx-auto rounded-sm mt-6"
          style={{ backgroundColor: theme.primaryColor }}
        ></div>
      </div>

      {/* Accordion List */}
      <div className="container mx-auto px-4 max-w-4xl" data-aos="fade-up" data-aos-delay="100">
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isActive = activeId === faq.id;
            return (
              <div 
                key={faq.id} 
                className="transition-all duration-500 border-2 overflow-hidden rounded-sm"
                style={{ 
                  backgroundColor: theme.cardColor,
                  borderColor: isActive ? `${theme.primaryColor}80` : "rgba(255,255,255,0.05)",
                  boxShadow: isActive ? `0 15px 30px ${theme.primaryColor}10` : "none"
                }}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none group"
                >
                  <span 
                    className="font-black text-lg md:text-xl tracking-tight transition-colors duration-300 uppercase"
                    style={{ color: isActive ? theme.primaryColor : "white" }}
                  >
                    {faq.question}
                  </span>
                  <div 
                    className={`ml-4 flex-shrink-0 w-8 h-8 rounded-sm flex items-center justify-center transition-all duration-500 ${
                      isActive ? "rotate-180" : "rotate-0"
                    }`}
                    style={{ 
                      backgroundColor: isActive ? theme.primaryColor : "rgba(255,255,255,0.03)",
                      color: isActive ? theme.backgroundColor : "white"
                    }}
                  >
                    <i className={`bi ${isActive ? "bi-dash" : "bi-plus"} text-xl`}></i>
                  </div>
                </button>

                <div 
                  className={`transition-all duration-500 ease-in-out ${
                    isActive ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0 invisible"
                  }`}
                >
                  <div 
                    className="p-8 pt-0 text-slate-400 text-lg leading-relaxed whitespace-pre-line border-t border-white/5 mt-2 font-medium"
                  >
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Support Section */}
      <div className="mt-20 text-center" data-aos="fade-up">
        <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Further Assistance Required?</p>
        <a 
          href="tel:+251978224422" 
          className="inline-flex items-center gap-4 mt-6 px-10 py-5 rounded-sm transition-all duration-300 hover:brightness-110 active:scale-95 shadow-xl"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.03)',
            color: theme.primaryColor,
            border: `2px solid ${theme.primaryColor}40`,
          }}
        >
          <i className="bi bi-headset text-xl"></i>
          <span className="uppercase tracking-[0.2em] text-xs font-black">Contact Support Core</span>
        </a>
      </div>
    </section>
  );
};

export default Faq;
