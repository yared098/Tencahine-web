"use client";

import React, { useState, useEffect } from "react";

interface ContactData {
  title: string;
  subtitle: string;
  info: any[];
  socials: any[];
  cta: any;
  terms: any[];
  location?: {
    lat: number;
    lng: number;
    addressName: string;
    googleMapsUrl: string;
    externalUrl: string;
  };
}

const ContactSection: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [data, setData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isSending, setIsSending] = useState(false);
  const [emailForm, setEmailForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
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
    
    // Simulate API Call
    setTimeout(() => {
      setIsSending(false);
      setShowEmailModal(false);
      setEmailForm({ name: "", email: "", subject: "", message: "" });
      alert("Message sent successfully to Tenachin Support!");
    }, 1500);
  };

  const getGoogleMapsLink = () => {
    if (!data?.location) return "#";
    const { lat, lng } = data.location;
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  };

  if (loading || !data) return null;

  return (
    <section id="contact" className="py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4 mb-16 text-center" data-aos="fade-up">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight relative inline-block pb-4">
          {data.title}
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-blue-600 rounded-full"></span>
        </h2>
        <p className="mt-6 text-slate-500 font-medium text-lg max-w-xl mx-auto">
          {data.subtitle}
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 p-8 md:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Details */}
            <div className="space-y-10">
              <div className="space-y-8">
                {data.info.map((info, idx) => {
                  const isEmail = info.title.toLowerCase().includes("email");
                  return (
                    <div 
                      key={idx} 
                      onClick={() => isEmail && setShowEmailModal(true)}
                      className={`group flex flex-col gap-4 ${isEmail ? 'cursor-pointer' : ''}`} 
                      data-aos="fade-up" 
                      data-aos-delay={info.delay}
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 shrink-0 bg-slate-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg">
                          <i className={`bi ${info.icon}`}></i>
                        </div>
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-1">
                            {info.title} {isEmail && <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Click to open form</span>}
                          </h3>
                          <p className="text-slate-800 font-bold leading-tight">{info.content}</p>
                        </div>
                      </div>

                      {info.title.toLowerCase().includes("office") && data.location && (
                        <a href={getGoogleMapsLink()} target="_blank" rel="noopener noreferrer" className="relative block w-full h-48 mt-2 rounded-2xl overflow-hidden group/map border border-slate-100 shadow-inner">
                          <div className="absolute inset-0 bg-blue-600/5 group-hover/map:bg-transparent z-10 transition-colors"></div>
                          <iframe title="Tenachin Location" src={data.location.googleMapsUrl} width="100%" height="100%" style={{ border: 0, pointerEvents: 'none' }} loading="lazy" className="grayscale group-hover/map:grayscale-0 transition-all duration-700"></iframe>
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Socials & Terms */}
              <div className="pt-8 border-t border-slate-100">
                <div className="flex flex-wrap gap-4">
                  {data.socials.map((social, idx) => (
                    <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" className={`w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 text-xl transition-all hover:text-white hover:-translate-y-1.5 ${social.color}`}>
                      <i className={`bi ${social.icon}`}></i>
                    </a>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button onClick={() => setShowModal(true)} className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-sm transition-colors">
                  <i className="bi bi-file-earmark-text"></i>
                  <span className="underline underline-offset-4 decoration-slate-200">Legal Terms & Conditions</span>
                </button>
              </div>
            </div>

            {/* CTA Card */}
            <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl p-12 flex flex-col justify-center" data-aos="zoom-in">
              <span className="text-blue-400 font-black uppercase tracking-widest text-xs mb-4">Available Now</span>
              <h4 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">{data.cta.title}</h4>
              <p className="text-slate-400 mb-10 text-lg">{data.cta.text}</p>
              <a href={`tel:${data.cta.phone.replace(/\s+/g, '')}`} className="group flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white p-2 pl-8 rounded-2xl transition-all hover:scale-[1.02]">
                <span className="font-black text-xl tracking-tight">{data.cta.phone}</span>
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-2xl group-hover:bg-white/20">
                  <i className="bi bi-telephone-outbound"></i>
                </div>
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* --- EMAIL FORM MODAL --- */}
      {showEmailModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-8 bg-blue-600 text-white flex justify-between items-center">
              <div>
                <h5 className="text-2xl font-black tracking-tight">Send a Message</h5>
                <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">Tenachin Support Team</p>
              </div>
              <button onClick={() => setShowEmailModal(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleEmailSubmit} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Your Name</label>
                  <input required type="text" value={emailForm.name} onChange={(e) => setEmailForm({...emailForm, name: e.target.value})} className="w-full bg-slate-50 border-none ring-1 ring-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Abebe B." />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email Address</label>
                  <input required type="email" value={emailForm.email} onChange={(e) => setEmailForm({...emailForm, email: e.target.value})} className="w-full bg-slate-50 border-none ring-1 ring-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="abebe@example.com" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Subject</label>
                <input required type="text" value={emailForm.subject} onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})} className="w-full bg-slate-50 border-none ring-1 ring-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Appointment Inquiry" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Message</label>
                <textarea required rows={4} value={emailForm.message} onChange={(e) => setEmailForm({...emailForm, message: e.target.value})} className="w-full bg-slate-50 border-none ring-1 ring-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Describe your request..." />
              </div>

              <button disabled={isSending} type="submit" className="w-full bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2">
                {isSending ? "Sending..." : <>Dispatch Email <i className="bi bi-send-fill text-xs"></i></>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- TERMS MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
              <div>
                <h5 className="text-2xl font-black text-slate-900 tracking-tight">Terms of Service</h5>
                <p className="text-blue-600 text-xs font-black uppercase tracking-widest mt-1">Tenachin Telehealth Center</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors">
                <i className="bi bi-x-lg text-lg"></i>
              </button>
            </div>
            
            <div className="p-10 max-h-[50vh] overflow-y-auto text-slate-600 leading-relaxed space-y-8">
              {data.terms.map((term, i) => (
                <div key={i} className={`space-y-3 ${term.isEmergency ? 'p-6 bg-rose-50 rounded-3xl border border-rose-100' : ''}`}>
                  <h6 className={`font-black uppercase text-xs tracking-widest ${term.isEmergency ? 'text-rose-600' : 'text-slate-900'}`}>
                    {term.id}. {term.title}
                  </h6>
                  <p className={term.isEmergency ? 'text-rose-900/80 font-medium' : ''}>{term.content}</p>
                </div>
              ))}
            </div>

            <div className="p-8 bg-slate-50">
              <button onClick={() => setShowModal(false)} className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-2xl font-black text-lg transition-all">
                Accept and Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ContactSection;