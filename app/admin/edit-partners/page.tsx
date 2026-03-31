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

  useEffect(() => {
    fetch(`${apiUrl}/api/partners`)
      .then((res) => res.json())
      .then((result) => {
        setData(result.partnerData || result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [apiUrl]);

  /* --- GLOBAL STATE HANDLERS --- */
  const handleChange = (field: string, value: string) => {
    setData((prev: any) => ({ ...prev, [field]: value }));
  };

  /* --- CATEGORY CRUD (Collaboration Categories) --- */
  const addCategory = () => {
    const newCat = {
      title: "New Category",
      description: "Description of the partnership type...",
      icon: "bi-shield-plus",
      color: "#3b82f6"
    };
    setData((prev: any) => ({ ...prev, items: [...prev.items, newCat] }));
  };

  const deleteCategory = (index: number) => {
    if (confirm("Delete this partnership category?")) {
      const filtered = data.items.filter((_: any, i: number) => i !== index);
      setData((prev: any) => ({ ...prev, items: filtered }));
    }
  };

  const updateItem = (index: number, field: string, value: string) => {
    const updatedItems = [...data.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setData((prev: any) => ({ ...prev, items: updatedItems }));
  };

  /* --- INSTITUTION CRUD (Logos/Slider) --- */
  const addHospital = () => {
    const newHosp = {
      name: "New Partner Hospital",
      image: "https://via.placeholder.com/200x200?text=Logo"
    };
    setData((prev: any) => ({ ...prev, hospitals: [...prev.hospitals, newHosp] }));
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
      const res = await fetch(`${apiUrl}/api/partners`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerData: data }),
      });
      if (res.ok) setMessage("✅ Partnership Ecosystem updated!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Error saving partner data.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-300 animate-pulse">Loading Ecosystem...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 bg-white min-h-screen pb-40">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Partnership Ecosystem</h1>
          <p className="text-slate-500 font-medium">Manage collaborations and institutional logos.</p>
        </div>
        <button onClick={() => router.back()} className="px-6 py-2 rounded-full border border-slate-200 font-bold hover:bg-slate-50 transition-colors">
          Back
        </button>
      </header>

      <form onSubmit={handleSave} className="space-y-16">
        {/* 1. Hero Content */}
        <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-blue-600 ml-2 tracking-widest">Main Page Title</label>
              <input 
                type="text" 
                value={data.title} 
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full p-5 rounded-[2rem] border-none ring-1 ring-slate-200 font-black text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-blue-600 ml-2 tracking-widest">Slider Section Heading</label>
              <input 
                type="text" 
                value={data.hospitalSectionTitle} 
                onChange={(e) => handleChange("hospitalSectionTitle", e.target.value)}
                className="w-full p-5 rounded-[2rem] border-none ring-1 ring-slate-200 font-black text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-blue-600 ml-2 tracking-widest">Description / Subtitle</label>
            <textarea 
              value={data.subtitle} 
              onChange={(e) => handleChange("subtitle", e.target.value)}
              rows={2}
              className="w-full p-6 rounded-[2rem] border-none ring-1 ring-slate-200 font-medium text-slate-600 leading-relaxed focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 2. Partnership Items (Grid) */}
        <section>
          <div className="flex justify-between items-end mb-8 px-4">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Collaboration Categories</h2>
              <p className="text-xs text-slate-400">Cards describing the types of partnerships.</p>
            </div>
            <button 
              type="button" 
              onClick={addCategory}
              className="px-5 py-2 bg-blue-600 text-white rounded-full font-black text-[10px] uppercase tracking-tighter hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
            >
              + Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.items.map((item: any, idx: number) => (
              <div key={idx} className="group p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all relative">
                <button 
                  type="button"
                  onClick={() => deleteCategory(idx)}
                  className="absolute top-4 right-4 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <i className="bi bi-trash3-fill"></i>
                </button>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/10" style={{ backgroundColor: item.color }}>
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <input 
                    type="text" 
                    value={item.title} 
                    onChange={(e) => updateItem(idx, "title", e.target.value)}
                    className="flex-1 font-black text-sm text-slate-800 border-none p-0 focus:ring-0 bg-transparent"
                  />
                </div>
                <textarea 
                  value={item.description} 
                  onChange={(e) => updateItem(idx, "description", e.target.value)}
                  className="w-full text-xs text-slate-500 bg-transparent border-none p-0 focus:ring-0 leading-relaxed font-medium resize-none"
                  rows={4}
                />
              </div>
            ))}
          </div>
        </section>

        {/* 3. Hospital Institutions (Logo CRUD) */}
        <section className="bg-slate-900 p-8 md:p-12 rounded-[4rem] text-white">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-blue-400">Institutional Network</h2>
              <p className="text-xs text-slate-400">Partner logos displayed in the scrolling slider.</p>
            </div>
            <button 
              type="button" 
              onClick={addHospital}
              className="px-6 py-2 bg-white text-slate-900 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-blue-400 transition-all"
            >
              + Add Partner Logo
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {data.hospitals.map((hosp: any, idx: number) => (
              <div key={idx} className="group/hosp bg-white/5 p-4 rounded-[2rem] border border-white/10 hover:border-blue-500/50 transition-all relative">
                <button 
                  type="button"
                  onClick={() => deleteHospital(idx)}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover/hosp:opacity-100 transition-all shadow-lg"
                >
                  <i className="bi bi-x-lg"></i>
                </button>

                <div className="aspect-square bg-white rounded-2xl overflow-hidden flex items-center justify-center mb-4 p-2 shadow-inner">
                   <img src={hosp.image} alt={hosp.name} className="max-h-full max-w-full object-contain" />
                </div>
                
                <div className="space-y-2">
                  <input 
                    type="text" 
                    value={hosp.name} 
                    placeholder="Partner Name"
                    onChange={(e) => updateHospital(idx, "name", e.target.value)}
                    className="w-full text-[10px] font-black uppercase text-center bg-transparent border-none p-0 focus:ring-0 text-blue-200"
                  />
                  <input 
                    type="text" 
                    value={hosp.image} 
                    placeholder="Logo URL"
                    onChange={(e) => updateHospital(idx, "image", e.target.value)}
                    className="w-full text-[8px] font-mono opacity-30 text-center bg-transparent border-none p-0 focus:ring-0 truncate"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final Save Action */}
        <div className="fixed bottom-10 left-0 right-0 z-50 px-6">
           <div className="max-w-xl mx-auto flex flex-col gap-4">
            {message && (
                <div className="bg-slate-900 text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest text-center shadow-2xl">
                  {message}
                </div>
              )}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-6 bg-blue-600 text-white rounded-[3rem] font-black text-xl hover:bg-blue-700 transition-all shadow-[0_20px_50px_rgba(59,130,246,0.3)] disabled:opacity-50 flex items-center justify-center gap-4"
            >
              {saving ? "SYNCING ECOSYSTEM..." : "PUBLISH NETWORK"}
              <i className="bi bi-diagram-3-fill"></i>
            </button>
           </div>
        </div>
      </form>
    </div>
  );
}