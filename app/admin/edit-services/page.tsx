"use client";

import React, { useState, useEffect } from "react";

interface ServiceItem {
  id: string | number;
  icon: string;
  color: string;
  title: string;
  desc: string;
}

export default function EditServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [headerBadge, setHeaderBadge] = useState("");
  const [headerTitle, setHeaderTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const endpoint = `${apiUrl}/api/services_data`;

  useEffect(() => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        setHeaderBadge(data.badge || "");
        setHeaderTitle(data.title || "");
        const key = Object.keys(data).find(k => Array.isArray(data[k]));
        setServices(key ? data[key] : (Array.isArray(data) ? data : []));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [endpoint]);

  const addService = () => {
    const newService: ServiceItem = {
      id: Date.now().toString(),
      icon: "bi-activity",
      color: "#3b82f6",
      title: "New Service",
      desc: "" 
    };
    setServices([newService, ...services]);
  };

  const deleteService = (id: string | number) => {
    setServices(services.filter(s => s.id !== id));
  };

  const updateService = (index: number, field: keyof ServiceItem, value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          badge: headerBadge || null, // Null logic: hides on public site if empty
          title: headerTitle || null, 
          services_data: services 
        }),
      });
      if (res.ok) {
        setMessage("ECOSYSTEM SYNCHRONIZED");
        setTimeout(() => setMessage(""), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-40 font-sans">
      {/* TOP NAV */}
      <nav className="sticky top-0 z-[60] bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs font-black">T</div>
            <h2 className="font-black text-[11px] uppercase tracking-[0.3em] text-slate-900">Tenachin Admin</h2>
          </div>
          <button 
            type="button"
            onClick={addService} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-md flex items-center gap-2"
          >
            <i className="bi bi-plus-lg"></i> Add Service
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 md:p-12">
        {/* HEADER EDITOR */}
        <div className="mb-12 space-y-8 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm transition-all hover:border-blue-200">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Hero Badge</span>
                <input 
                  value={headerBadge} 
                  onChange={(e) => setHeaderBadge(e.target.value)}
                  placeholder="Leave empty to hide badge"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Section Title</span>
                <input 
                  value={headerTitle} 
                  onChange={(e) => setHeaderTitle(e.target.value)}
                  placeholder="Leave empty to hide title"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
              </div>
           </div>
        </div>

        {/* SERVICES GRID */}
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <div
                key={service.id}
                className="group bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 relative"
              >
                {/* Delete Button */}
                <button 
                  type="button" 
                  onClick={() => deleteService(service.id)} 
                  className="absolute top-6 right-6 w-9 h-9 bg-red-50 text-red-500 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white"
                >
                  <i className="bi bi-trash3"></i>
                </button>

                <div className="flex items-center gap-5 mb-8">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-inner transition-transform group-hover:scale-110" 
                    style={{ backgroundColor: service.color }}
                  >
                    <i className={`bi ${service.icon}`}></i>
                  </div>
                  <div className="flex-grow">
                    <input 
                      type="color" 
                      value={service.color} 
                      onChange={(e) => updateService(idx, "color", e.target.value)} 
                      className="w-full h-8 rounded-lg cursor-pointer bg-slate-100 border-none p-1" 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Title</label>
                    <input 
                      placeholder="Title" 
                      value={service.title} 
                      onChange={(e) => updateService(idx, "title", e.target.value)}
                      className="w-full bg-slate-50 border border-transparent rounded-xl p-3 text-sm font-black text-slate-800 focus:bg-white focus:border-blue-200 outline-none transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1">Description (Hide if null)</label>
                    <textarea 
                      placeholder="Description text..." 
                      value={service.desc} 
                      onChange={(e) => updateService(idx, "desc", e.target.value)}
                      rows={3}
                      className="w-full bg-slate-50 border border-transparent rounded-xl p-3 text-xs font-medium text-slate-500 resize-none leading-relaxed focus:bg-white focus:border-blue-200 outline-none transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 border border-transparent focus-within:border-blue-200 transition-all">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Icon:</span>
                    <input 
                      value={service.icon.replace('bi-', '')} 
                      onChange={(e) => updateService(idx, "icon", `bi-${e.target.value}`)}
                      className="bg-transparent border-none p-0 text-[10px] font-mono text-blue-600 focus:ring-0 w-full outline-none"
                      placeholder="activity"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FLOATING ACTION DOCK */}
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-6">
            <div className="bg-slate-900 rounded-3xl p-4 shadow-2xl border border-white/10 ring-1 ring-black">
               {message && (
                 <div className="text-center text-blue-400 text-[9px] font-black tracking-[0.3em] pb-3 animate-pulse">
                   {message}
                 </div>
               )}
               <button 
                type="submit"
                disabled={saving} 
                className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
               >
                 {saving ? "SYNCING..." : "Publish to Tenachin"}
                 <i className="bi bi-cloud-check-fill text-sm"></i>
               </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
