"use client";

import React, { useState, useEffect } from "react";

interface FAQItem {
  id: number | string;
  question: string;
  answer: string;
}

const Faq: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [activeId, setActiveId] = useState<number | string | null>(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchFaqs = async () => {
    // 1. Reference the base URL from your .env.local
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      // 2. Fetch using the dynamic API URL
      const response = await fetch(`${apiUrl}/api/faq`);
      const data = await response.json();
      
      // 3. Extract the array from the response object
      const key = Object.keys(data).find(k => Array.isArray(data[k]));
      
      if (key) {
        setFaqs(data[key]);
        
        // Optionally set the first one active by default for better UX
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
    <section id="faq" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 text-center mb-16" data-aos="fade-up">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Frequently Asked Questions</h2>
        <div className="w-16 h-1 bg-blue-600 mx-auto mt-6 mb-4"></div>
        <p className="text-slate-500 italic">Your Health, Our Priority</p>
      </div>

      <div className="container mx-auto px-4 max-w-4xl" data-aos="fade-up" data-aos-delay="100">
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div 
              key={faq.id} 
              className={`border rounded-2xl transition-all duration-300 ${
                activeId === faq.id 
                ? "border-blue-200 bg-blue-50/30 shadow-md" 
                : "border-slate-100 bg-white hover:border-blue-100"
              }`}
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className={`font-semibold text-lg ${activeId === faq.id ? "text-blue-700" : "text-slate-800"}`}>
                  {faq.question}
                </span>
                <span className={`ml-4 flex-shrink-0 transition-transform duration-300 ${activeId === faq.id ? "rotate-180 text-blue-600" : "text-slate-400"}`}>
                  <i className="bi bi-chevron-down"></i>
                </span>
              </button>

              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeId === faq.id ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div 
                  className="p-6 pt-0 text-slate-600 leading-relaxed whitespace-pre-line border-t border-blue-100/50 mt-2"
                >
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center" data-aos="fade-up">
        <p className="text-slate-500 text-sm">Still have questions?</p>
        <a 
          href="tel:+251978224422" 
          className="inline-flex items-center gap-2 mt-2 text-blue-600 font-bold hover:text-blue-800 transition-colors"
        >
          <i className="bi bi-headset"></i>
          Chat with our support team
        </a>
      </div>
    </section>
  );
};

export default Faq;