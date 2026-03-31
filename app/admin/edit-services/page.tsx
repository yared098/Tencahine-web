"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ServiceItem {
  id: number;
  icon: string;
  color: string;
  title: string;
  desc: string;
}

export default function EditServices() {
  // Initialize as empty array to prevent .map errors
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${apiUrl}/api/services`)
      .then((res) => res.json())
      .then((data) => {
        // Look for the "services" key specifically
        if (data && Array.isArray(data.services)) {
          setServices(data.services);
        } else if (Array.isArray(data)) {
          setServices(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [apiUrl]);

  /* --- CRUD OPERATIONS --- */

  const addService = () => {
    const newService: ServiceItem = {
      id: Date.now(),
      icon: "bi-activity",
      color: "#3b82f6",
      title: "New Medical Service",
      desc: "Brief description of the clinical service offered..."
    };
    setServices([...services, newService]);
  };

  const deleteService = (id: number) => {
    if (confirm("Are you sure you want to remove this medical service?")) {
      setServices(services.filter(service => service.id !== id));
    }
  };

  const updateService = (index: number, field: keyof ServiceItem, value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value } as ServiceItem;
    setServices(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/api/services`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // Wrap back into the { services: [...] } structure for the backend
        body: JSON.stringify({ services }),
      });
      
      if (res.ok) {
        setMessage("✅ Services updated successfully!");
      } else {
        setMessage("❌ Failed to save changes.");
      }
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Error connecting to API.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center font-black text-slate-300 animate-pulse tracking-widest uppercase">
      Loading Medical Services...
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 bg-white min-h-screen pb-40">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
            CMS Module
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Medical Services</h1>
          <p className="text-slate-500 font-medium">Define clinical offerings for the Tenachin ecosystem.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            type="button"
            onClick={addService}
            className="flex-1 md:flex-none px-8 py-4 bg-blue-600 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all"
          >
            + Add Service
          </button>
          <button 
            type="button"
            onClick={() => router.back()} 
            className="p-4 bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-all"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      </header>

      <form onSubmit={handleSave} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div key={service.id} className="group relative bg-white border border-slate-100 rounded-[3rem] p-8 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all">
              
              <button 
                type="button"
                onClick={() => deleteService(service.id)}
                className="absolute top-6 right-6 w-10 h-10 bg-red-50 text-red-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all shadow-lg"
              >
                <i className="bi bi-trash3-fill text-sm"></i>
              </button>

              <div className="flex items-center gap-5 mb-8">
                <div 
                  className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white text-3xl shadow-xl shadow-blue-500/10 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: service.color }}
                >
                  <i className={`bi ${service.icon}`}></i>
                </div>
                <div className="flex flex-col gap-1">
                   <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Brand Color</label>
                   <input 
                    type="color" 
                    value={service.color}
                    onChange={(e) => updateService(idx, "color", e.target.value)}
                    className="w-10 h-6 rounded-md border-none bg-transparent cursor-pointer p-0"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="text-[10px] font-black uppercase text-blue-600 mb-2 block ml-1 tracking-widest">Service Title</label>
                <input 
                  type="text"
                  value={service.title}
                  onChange={(e) => updateService(idx, "title", e.target.value)}
                  className="w-full bg-slate-50 rounded-2xl p-4 font-black text-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                />
              </div>

              <div className="mb-6">
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1 tracking-widest">Description</label>
                <textarea 
                  value={service.desc}
                  onChange={(e) => updateService(idx, "desc", e.target.value)}
                  rows={4}
                  className="w-full bg-slate-50 rounded-[1.5rem] p-4 text-sm font-medium text-slate-500 border-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner resize-none leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-slate-50">
                <label className="text-[9px] font-black uppercase text-slate-300 mb-1 block tracking-widest">Bootstrap Icon Class</label>
                <input 
                  type="text"
                  value={service.icon}
                  onChange={(e) => updateService(idx, "icon", e.target.value)}
                  className="w-full text-[11px] font-mono text-blue-400 bg-transparent border-none p-0 focus:ring-0"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Floating Action Menu */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-6">
           <div className="flex flex-col items-center gap-4">
             {message && (
               <div className="bg-slate-900 text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                 {message}
               </div>
             )}
             <button
               type="submit"
               disabled={saving}
               className="w-full py-6 bg-blue-600 text-white rounded-[2.5rem] font-black text-xl hover:bg-blue-700 transition-all shadow-[0_20px_50px_rgba(59,130,246,0.3)] disabled:opacity-50 flex items-center justify-center gap-4"
             >
               {saving ? "SYNCING..." : "PUBLISH SERVICES"}
               <i className="bi bi-cloud-upload-fill"></i>
             </button>
           </div>
        </div>
      </form>
    </div>
  );
}