"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditPartners() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const endpoint = `${apiUrl}/api/partners`;

  useEffect(() => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((result) => {
        setData(result.partnerData || result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [endpoint]);

  const handleChange = (field: string, value: string) => {
    setData((prev: any) => ({ ...prev, [field]: value }));
  };

  /* --- CRUD Handlers --- */
  const addCategory = () => {
    const newCat = { title: "New Category", description: "Description...", icon: "bi-shield-plus", color: "#3b82f6" };
    setData((prev: any) => ({ ...prev, items: prev.items ? [...prev.items, newCat] : [newCat] }));
  };

  const deleteCategory = (index: number) => {
    const filtered = data.items.filter((_: any, i: number) => i !== index);
    setData((prev: any) => ({ ...prev, items: filtered }));
  };

  const updateItem = (index: number, field: string, value: string) => {
    const updatedItems = [...data.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setData((prev: any) => ({ ...prev, items: updatedItems }));
  };

  const addHospital = () => {
    const newHosp = { name: "Partner Name", image: "" }; // Start with empty string
    setData((prev: any) => ({ ...prev, hospitals: prev.hospitals ? [...prev.hospitals, newHosp] : [newHosp] }));
  };

  const deleteHospital = (index: number) => {
    const filtered = data.hospitals.filter((_: any, i: number) => i !== index);
    setData((prev: any) => ({ ...prev, hospitals: filtered }));
  };

  const updateHospital = (index: number, field: string, value: string) => {
    const updatedHospitals = [...data.hospitals];
    updatedHospitals[index] = { ...updatedHospitals[index], [field]: value };
    setData((prev: any) => ({ ...prev, hospitals: updatedHospitals }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerData: data }),
      });
      if (res.ok) setMessage("✅ PUBLISHED SUCCESSFULLY");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ SYNC ERROR");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="text-center font-black text-slate-300 animate-pulse uppercase tracking-[0.4em] text-xs">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-44 text-slate-900">
      <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl px-6 py-6 border-b border-slate-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-black tracking-tighter italic">Ecosystem <span className="text-blue-600">Editor</span></h1>
          <button type="button" onClick={() => router.back()} className="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">
            Discard Changes
          </button>
        </div>
      </nav>

      <form onSubmit={handleSave} className="max-w-7xl mx-auto p-6 space-y-20">
        
        {/* MESSAGING SECTION */}
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-50">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-black italic mb-2 tracking-tight">Main Header</h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">Adjust header text and call-to-action buttons.</p>
            </div>
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-blue-500 tracking-widest ml-1">Small Badge Text</label>
                  <input type="text" value={data.badge} onChange={(e) => handleChange("badge", e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-blue-100" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-blue-500 tracking-widest ml-1">Section Title</label>
                  <input type="text" value={data.title} onChange={(e) => handleChange("title", e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-300 tracking-widest ml-1">Description / Subtitle</label>
                <textarea rows={2} value={data.subtitle} onChange={(e) => handleChange("subtitle", e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-medium text-slate-500 outline-none resize-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-emerald-500 tracking-widest ml-1">Button Text</label>
                  <input type="text" value={data.ctaText} onChange={(e) => handleChange("ctaText", e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-emerald-500 tracking-widest ml-1">Button Link</label>
                  <input type="text" value={data.ctaLink} onChange={(e) => handleChange("ctaLink", e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-blue-500 tracking-widest ml-1">Slider Section Title</label>
                <input type="text" value={data.hospitalSectionTitle} onChange={(e) => handleChange("hospitalSectionTitle", e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* PILLARS SECTION */}
        <section>
          <div className="flex items-center justify-between mb-10 px-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300">Collaboration Pillars</h3>
            <button type="button" onClick={addCategory} className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">+ New Pillar</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.items?.map((item: any, idx: number) => (
              <div key={idx} className="group bg-white p-8 rounded-[2.5rem] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col relative border border-slate-50">
                <button type="button" onClick={() => deleteCategory(idx)} className="absolute top-6 right-6 text-slate-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                  <i className="bi bi-trash-fill"></i>
                </button>
                <div className="w-12 h-12 rounded-2xl mb-6 flex items-center justify-center text-white" style={{ backgroundColor: item.color || "#3b82f6" }}>
                  <i className={`bi ${item.icon || "bi-star-fill"} text-xl`}></i>
                </div>
                <input type="text" value={item.title} onChange={(e) => updateItem(idx, "title", e.target.value)} className="font-black text-slate-900 mb-2 border-none p-0 focus:ring-0 text-sm bg-transparent" />
                <textarea rows={3} value={item.description} onChange={(e) => updateItem(idx, "description", e.target.value)} className="text-xs text-slate-400 font-medium leading-relaxed bg-transparent border-none p-0 focus:ring-0 resize-none" />
              </div>
            ))}
          </div>
        </section>

        {/* NETWORK LOGOS SECTION */}
        <section className="bg-slate-50/50 rounded-[4rem] p-10 md:p-16">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <h3 className="text-2xl font-black italic tracking-tighter">Partner Network</h3>
            <button type="button" onClick={addHospital} className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
              Add Institution Logo
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {data.hospitals?.map((hosp: any, idx: number) => (
              <div key={idx} className="group relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
                <button type="button" onClick={() => deleteHospital(idx)} className="absolute -top-2 -right-2 w-7 h-7 bg-white text-red-500 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10 border border-slate-50">
                  <i className="bi bi-x-lg text-xs"></i>
                </button>
                <div className="aspect-square bg-slate-50/50 rounded-2xl mb-4 p-4 flex items-center justify-center overflow-hidden">
                  {/* FIX: Only render img if URL is not empty */}
                  {hosp.image ? (
                    <img 
                      src={hosp.image} 
                      alt="Logo" 
                      className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform group-hover:scale-110 duration-500" 
                    />
                  ) : (
                    <i className="bi bi-image text-slate-200 text-3xl"></i>
                  )}
                </div>
                <input type="text" value={hosp.name} placeholder="Name" onChange={(e) => updateHospital(idx, "name", e.target.value)} className="w-full text-[10px] font-black text-center text-slate-900 bg-transparent border-none p-0 focus:ring-0 uppercase tracking-tighter" />
                <input type="text" value={hosp.image} placeholder="URL" onChange={(e) => updateHospital(idx, "image", e.target.value)} className="w-full text-[8px] font-mono text-center text-slate-300 bg-transparent border-none p-0 mt-2 focus:ring-0 truncate" />
              </div>
            ))}
          </div>
        </section>

        {/* ACTION BAR */}
        <div className="fixed bottom-12 left-0 right-0 z-50 px-6">
          <div className="max-w-md mx-auto">
            {message && (
              <div className="text-center mb-4 py-2 px-6 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest animate-fade-in-up">
                {message}
              </div>
            )}
            <button type="submit" disabled={saving} className="w-full py-6 bg-blue-600 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-xl flex items-center justify-center gap-3">
              {saving ? "SAVING..." : "Confirm & Publish"}
              {!saving && <i className="bi bi-lightning-fill"></i>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
