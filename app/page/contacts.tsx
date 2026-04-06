"use client";

import React, { useState, useEffect } from "react";

interface ContactData {
  title: string;
  image: string;
  subtitle: string;
  info: any[];
  socials: { icon: string; url: string; color: string }[];
  cta: any;
  terms: any[];
  location?: {
    lat: number;
    lng: number;
    addressName: string;
    googleMapsUrl: string;
    embedUrl?: string;
  };
}

const ContactSection: React.FC = () => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [data, setData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isSending, setIsSending] = useState(false);
  const [emailForm, setEmailForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const fetchContact = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      try {
        const response = await fetch(`${apiUrl}/api/contact`);
        const result = await response.json();
        setData(result.contactData || result);
      } catch (error) {
        console.error("Error fetching contact data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setShowEmailModal(false);
      setEmailForm({ name: "", email: "", subject: "", message: "" });
      alert("Message sent successfully!");
    }, 1500);
  };

  // Function to handle direct map opening
  const openGoogleMaps = () => {
    if (data?.location?.googleMapsUrl) {
      window.open(data.location.googleMapsUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (loading || !data) return null;

  return (
    <section id="contact" className="py-24 bg-[#020a13] text-white overflow-hidden font-sans">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
          
          {/* LEFT COLUMN: CONTACT DETAILS */}
          <div className="bg-[#0B1C2C] border-2 border-white/5 p-8 md:p-12 rounded-2xl backdrop-blur-xl flex flex-col justify-center">
            <h2 className="text-4xl font-[900] mb-4 tracking-tighter uppercase italic text-white">
                {data.title}
            </h2>
            <p className="text-slate-400 font-medium mb-12 max-w-xs leading-relaxed">
              {data.subtitle}
            </p>

            <div className="space-y-10">
              {data.info.map((info, idx) => {
                const isEmail = info.title.toLowerCase().includes("email");
                const isOffice = info.title.toLowerCase().includes("office");

                return (
                  <div key={idx} className="group">
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 shrink-0 rounded-2xl border border-[#1FB5A8]/20 flex items-center justify-center text-2xl transition-all bg-[#1FB5A8]/5 text-[#1FB5A8] group-hover:bg-[#1FB5A8] group-hover:text-[#0B1C2C] group-hover:shadow-[0_0_30px_rgba(31,181,168,0.3)]">
                        <i className={`bi ${info.icon}`}></i>
                      </div>
                      <div className="flex-1 pt-1">
                        <h3 className="text-[10px] font-[900] uppercase tracking-[0.25em] text-[#1FB5A8] mb-2">
                            {info.title}
                        </h3>
                        <p 
                          onClick={() => isEmail && setShowEmailModal(true)}
                          className={`text-base font-bold leading-snug transition-colors ${isEmail ? 'cursor-pointer hover:text-[#2ED1B2] text-slate-100' : 'text-slate-200'}`}
                        >
                          {info.content}
                        </p>
                        {isOffice && (
                          <button 
                            onClick={openGoogleMaps} 
                            className="inline-flex items-center gap-2 text-[11px] font-[900] text-[#1FB5A8] mt-4 hover:text-[#2ED1B2] transition-colors uppercase tracking-widest"
                          >
                            <i className="bi bi-geo-fill"></i> View on Map
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CENTER COLUMN: INTERACTIVE PHONE MOCKUP */}
          <div className="relative flex justify-center items-center py-10 lg:py-0">
             <div className="absolute w-80 h-80 bg-[#1FB5A8]/10 blur-[120px] rounded-full"></div>
             <div className="relative z-10 w-[290px] md:w-[320px] aspect-[9/18.5] bg-[#0B1C2C] border-[10px] border-[#1c2631] rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col group">
                <div className="absolute top-0 inset-x-0 h-8 bg-black/20 flex justify-center items-center z-30">
                    <div className="w-24 h-5 bg-black rounded-b-3xl"></div>
                </div>
                <img 
                  src={data.image} 
                  alt={data.title} 
                  className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                />
                <div className="absolute bottom-10 inset-x-5 z-20">
                   <div className="bg-black/40 backdrop-blur-2xl p-4 rounded-2xl border border-white/10 flex justify-between items-center">
                      <div className="flex gap-2">
                         <div className="w-10 h-10 rounded-full bg-[#1FB5A8] flex items-center justify-center text-sm text-[#0B1C2C] shadow-lg"><i className="bi bi-camera-video-fill"></i></div>
                         <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm"><i className="bi bi-mic-fill"></i></div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shadow-xl rotate-[135deg] animate-pulse">
                         <i className="bi bi-telephone-fill text-white"></i>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* RIGHT COLUMN: CTA & SOCIALS */}
          <div className="bg-[#0B1C2C] border-2 border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl flex flex-col justify-center relative overflow-hidden">
             <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#1FB5A8]/5 blur-3xl rounded-full"></div>
             <div className="flex items-center gap-3 mb-8">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2ED1B2] shadow-[0_0_10px_#2ED1B2] animate-pulse"></span>
                <span className="text-[11px] font-[900] uppercase tracking-[0.4em] text-[#2ED1B2]">Live Network</span>
             </div>
             <h4 className="text-[2.75rem] font-[900] mb-8 leading-[0.9] tracking-tighter italic uppercase">
                {data.cta.title.split(' ').slice(0,2).join(' ')} <br/>
                <span className="text-[#1FB5A8] not-italic">{data.cta.title.split(' ').slice(2).join(' ')}</span>
             </h4>
             <p className="text-slate-400 text-lg font-medium mb-12 leading-relaxed">
               {data.cta.text}
             </p>
             <div className="space-y-5 mb-12 relative z-10">
                <a href={`tel:${data.cta.phone}`} className="flex items-center justify-between bg-[#1FB5A8] hover:bg-[#2ED1B2] text-[#0B1C2C] p-3 pl-8 rounded-2xl transition-all hover:scale-[1.03] shadow-xl shadow-[#1FB5A8]/20 group">
                   <div className="text-left">
                      <span className="block text-[8px] font-[900] uppercase tracking-widest opacity-60">Emergency Line</span>
                      <span className="block font-[900] text-xl tracking-tight">{data.cta.phone}</span>
                   </div>
                   <div className="w-14 h-14 bg-black/10 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-95 transition-transform">
                      <i className="bi bi-telephone-plus-fill"></i>
                   </div>
                </a>
                
                <div className="pt-4">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-4">Connect with us</span>
                  <div className="flex flex-wrap gap-3">
                    {data.socials.map((social, index) => (
                      <a 
                        key={index} 
                        href={social.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl transition-all ${social.color} hover:text-white hover:scale-110`}
                      >
                        <i className={`bi ${social.icon}`}></i>
                      </a>
                    ))}
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* EMAIL MODAL */}
      {showEmailModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0B1C2C] w-full max-w-lg rounded-2xl border border-white/10 p-8 relative">
            <button onClick={() => setShowEmailModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white text-2xl"><i className="bi bi-x-lg"></i></button>
            <h3 className="text-2xl font-black uppercase italic text-[#1FB5A8] mb-2">Send Message</h3>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input 
                type="text" required placeholder="Full Name" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-[#1FB5A8] outline-none transition-all"
                value={emailForm.name} onChange={(e) => setEmailForm({...emailForm, name: e.target.value})}
              />
              <input 
                type="email" required placeholder="Email Address" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-[#1FB5A8] outline-none transition-all"
                value={emailForm.email} onChange={(e) => setEmailForm({...emailForm, email: e.target.value})}
              />
              <textarea 
                rows={4} required placeholder="How can we help?" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-[#1FB5A8] outline-none transition-all resize-none"
                value={emailForm.message} onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
              ></textarea>
              <button 
                disabled={isSending}
                className="w-full bg-[#1FB5A8] text-[#0B1C2C] font-black py-4 rounded-2xl uppercase tracking-widest hover:bg-[#2ED1B2] transition-all disabled:opacity-50"
              >
                {isSending ? "Processing..." : "Dispatch Message"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ContactSection;