"use client";

import React from "react";

const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: "01",
      title: "Get Started",
      icon: "bi-phone-vibrate",
      color: "bg-blue-600",
      content: (
        <ul className="space-y-2">
          <li className="flex items-center gap-2"><i className="bi bi-check-circle-fill text-blue-500 text-[10px]"></i> Mobile App (iOS/Android)</li>
          <li className="flex items-center gap-2"><i className="bi bi-check-circle-fill text-blue-500 text-[10px]"></i> Call Center for voice help</li>
          <li className="flex items-center gap-2"><i className="bi bi-check-circle-fill text-blue-500 text-[10px]"></i> SMS Gateway for low-tech</li>
        </ul>
      ),
    },
    {
      step: "02",
      title: "Share Your Concern",
      icon: "bi-chat-right-heart",
      color: "bg-indigo-600",
      content: "Briefly describe your symptoms or upload a referral. Request a specific specialist if you have a preference.",
    },
    {
      step: "03",
      title: "Get Connected",
      icon: "bi-person-video3",
      color: "bg-cyan-600",
      content: "Get matched with a certified GP or specialist within minutes via HD video, voice call, or secure text.",
    },
    {
      step: "04",
      title: "Receive Care",
      icon: "bi-capsule",
      color: "bg-teal-600",
      content: (
        <ul className="space-y-2">
          <li className="flex items-center gap-2"><i className="bi bi-dot text-teal-500 text-xl"></i> Digital prescription</li>
          <li className="flex items-center gap-2"><i className="bi bi-dot text-teal-500 text-xl"></i> Lab request (if needed)</li>
          <li className="flex items-center gap-2"><i className="bi bi-dot text-teal-500 text-xl"></i> Follow-up instructions</li>
        </ul>
      ),
    },
    {
      step: "05",
      title: "Make Payment",
      icon: "bi-shield-check",
      color: "bg-emerald-600",
      content: (
        <ul className="space-y-2">
          <li className="flex items-center gap-2"><i className="bi bi-wallet2 text-emerald-500"></i> Telebirr / M-Pesa</li>
          <li className="flex items-center gap-2"><i className="bi bi-umbrella text-emerald-500"></i> Health Insurance</li>
        </ul>
      ),
    },
    {
      step: "⏱",
      title: "Response Guarantee",
      icon: "bi-lightning-charge",
      color: "bg-orange-500",
      content: (
        <div className="mt-2 p-3 rounded-xl bg-orange-50 border border-orange-100">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-bold text-orange-700 uppercase">Emergencies</span>
            <span className="text-xs font-black text-orange-700">&lt; 10m</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase">General</span>
            <span className="text-xs font-black text-slate-600">&lt; 30m</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20" data-aos="fade-up">
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full">
            The Process
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Simple, Fast, Inclusive
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            Tenachin is built for everyone—urban or rural. Access world-class care through our app, direct call, or SMS gateway.
          </p>
        </div>

        {/* Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 relative">
          
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-[15%] left-0 w-full h-0.5 bg-slate-100 -z-10">
             <div className="w-1/2 h-full bg-gradient-to-r from-blue-600 to-transparent"></div>
          </div>

          {steps.map((item, index) => (
            <div 
              key={index} 
              className="relative group h-full"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Giant Background Step Number */}
              <div className="absolute -top-10 -left-4 text-[120px] font-black text-slate-100/50 group-hover:text-blue-50 group-hover:-translate-y-2 transition-all duration-500 select-none -z-10">
                {item.step === "⏱" ? "" : item.step}
              </div>

              <div className="flex flex-col h-full p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-500">
                
                {/* Icon Box */}
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg shadow-blue-200 mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500`}>
                  <i className={`bi ${item.icon}`}></i>
                </div>

                {/* Text Content */}
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${item.color} animate-pulse`}></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Step {item.step === "⏱" ? "Limit" : item.step}</span>
                  </div>
                  
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  
                  <div className="text-slate-500 text-sm leading-relaxed font-medium">
                    {item.content}
                  </div>
                </div>

                {/* Bottom Decorative Bar */}
                <div className={`mt-8 w-12 h-1 ${item.color} rounded-full opacity-30 group-hover:w-full group-hover:opacity-100 transition-all duration-700`}></div>
              </div>

              {/* Connecting Arrow for Desktop */}
              {index < steps.length - 1 && (index + 1) % 3 !== 0 && (
                <div className="hidden lg:flex absolute -right-8 top-1/4 items-center justify-center text-slate-200">
                   <i className="bi bi-arrow-right text-2xl animate-pulse"></i>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom Wave Texture */}
      <div className="absolute bottom-0 left-0 w-full opacity-5 pointer-events-none">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path fill="#000" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HowItWorks;