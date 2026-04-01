"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ServiceItem {
  id: string | number;
  icon: string;
  color: string;
  title: string;
  desc: string;
}

export default function EditServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Use the same endpoint as your show page
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const endpoint = `${apiUrl}/api/services_data`;

  useEffect(() => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        // Match the logic in your Services.tsx to find the array key
        const key = Object.keys(data).find(k => Array.isArray(data[k]));
        if (key) {
          setServices(data[key]);
        } else if (Array.isArray(data)) {
          setServices(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [endpoint]);

  /* --- CRUD OPERATIONS --- */

  const addService = () => {
    const newService: ServiceItem = {
      id: Date.now().toString(), // Use string ID to match interface
      icon: "bi-activity",
      color: "#3b82f6",
      title: "New Health Service",
      desc: "Describe the new digital health offering here..."
    };
    setServices([newService, ...services]); // Add to start of list
  };

  const deleteService = (id: string | number) => {
    if (confirm("Are you sure you want to remove this service?")) {
      setServices(services.filter(service => service.id !== id));
    }
  };

  const updateService = (index: number, field: keyof ServiceItem, value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // Wrap back into the object structure expected by the generic route
        body: JSON.stringify({ services_data: services }),
      });
      
      if (res.ok) {
        setMessage("✅ Services published successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to save changes.");
      }
    } catch (err) {
      setMessage("❌ Connection error.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center font-black text-slate-300 animate-pulse tracking-widest uppercase">
      Loading Ecosystem Data...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 bg-white min-h-screen pb-40">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b border-slate-50 pb-8">
        <div>
          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
            Services Manager
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Health Ecosystem</h1>
          <p className="text-slate-500 font-medium">Manage the cards displayed in the Tenachin services section.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            type="button"
            onClick={addService}
            className="flex-1 md:flex-none px-8 py-4 bg-blue-600 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all"
          >
            + Add New Service
          </button>
          
        </div>
      </header>

      <form onSubmit={handleSave} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div key={service.id} className="group relative bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-8 transition-all hover:bg-white hover:shadow-2xl hover:border-blue-100">
              
              {/* Delete Button */}
              <button 
                type="button"
                onClick={() => deleteService(service.id)}
                className="absolute top-6 right-6 w-10 h-10 bg-white text-red-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all shadow-md border border-red-50"
              >
                <i className="bi bi-trash3"></i>
              </button>

              <div className="flex items-center gap-5 mb-8">
                {/* Icon Preview */}
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg transition-transform group-hover:rotate-12"
                  style={{ backgroundColor: service.color }}
                >
                  <i className={`bi ${service.icon}`}></i>
                </div>
                <div className="flex flex-col">
                   <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Accent Color</label>
                   <input 
                    type="color" 
                    value={service.color}
                    onChange={(e) => updateService(idx, "color", e.target.value)}
                    className="w-12 h-6 rounded cursor-pointer bg-transparent border-none p-0"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-blue-600 mb-1 block ml-1 tracking-widest">Service Title</label>
                  <input 
                    type="text"
                    value={service.title}
                    onChange={(e) => updateService(idx, "title", e.target.value)}
                    className="w-full bg-white rounded-xl p-4 font-bold text-slate-800 border border-slate-100 focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block ml-1 tracking-widest">Short Description</label>
                  <textarea 
                    value={service.desc}
                    onChange={(e) => updateService(idx, "desc", e.target.value)}
                    rows={3}
                    className="w-full bg-white rounded-xl p-4 text-sm font-medium text-slate-600 border border-slate-100 focus:ring-2 focus:ring-blue-500 transition-all shadow-sm resize-none leading-relaxed"
                  />
                </div>

                <div className="pt-2">
                  <label className="text-[9px] font-black uppercase text-slate-300 mb-1 block tracking-widest">Icon (Bootstrap Class)</label>
                  <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-lg px-3 py-2 shadow-sm">
                    <span className="text-slate-300 text-xs font-mono">bi-</span>
                    <input 
                      type="text"
                      value={service.icon.replace('bi-', '')}
                      onChange={(e) => updateService(idx, "icon", `bi-${e.target.value}`)}
                      placeholder="activity"
                      className="w-full text-xs font-mono text-blue-500 border-none p-0 focus:ring-0 bg-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Save Control */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-6">
           <div className="flex flex-col items-center gap-3">
             {message && (
               <div className="bg-slate-900 text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl animate-bounce">
                 {message}
               </div>
             )}
             <button
               type="submit"
               disabled={saving}
               className="w-full py-5 bg-slate-900 text-white rounded-full font-black text-lg hover:bg-blue-600 transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-4 group"
             >
               {saving ? "SYNCING..." : "PUBLISH TO SITE"}
               <i className="bi bi-check-circle-fill group-hover:scale-125 transition-transform"></i>
             </button>
           </div>
        </div>
      </form>
    </div>
  );
}