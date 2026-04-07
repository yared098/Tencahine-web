"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditFeatures() {
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${apiUrl}/api/features`)
      .then((res) => res.json())
      .then((data) => {
        setFeatures(data.features || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [apiUrl]);

  /* --- CRUD OPERATIONS --- */

  const addFeature = () => {
    const newFeature = {
      id: `feat-${Date.now()}`,
      label: "New Tab",
      icon: "bi-rocket-takeoff", // Default icon
      title: "New Strategy Heading",
      imgSrc: "https://via.placeholder.com/600x400",
      imgAlt: "Strategy Image",
      description: "Enter primary description here...",
      values: [] 
    };
    setFeatures([...features, newFeature]);
  };

  const updateFeature = (index: number, field: string, value: any) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    setFeatures(updated);
  };

  const addValuePoint = (fIdx: number) => {
    const updated = [...features];
    const newPoint = { title: "New Point", desc: "Detail description" };
    updated[fIdx].values = updated[fIdx].values ? [...updated[fIdx].values, newPoint] : [newPoint];
    setFeatures(updated);
  };

  const updateValueItem = (fIdx: number, vIdx: number, field: string, value: string) => {
    const updated = [...features];
    updated[fIdx].values[vIdx][field] = value;
    setFeatures(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/api/features`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features }),
      });
      if (res.ok) setMessage("✅ Brand Strategy Published!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Connection Error.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-300 animate-pulse">SYNCING STRATEGY...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 pb-40">
      <header className="mb-12 flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Brand Strategy</h1>
          <p className="text-slate-500 font-medium">Mission, Vision, and Core Values.</p>
        </div>
        <div className="flex gap-4">
          <button type="button" onClick={addFeature} className="px-6 py-3 bg-blue-600 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
            + Add Section
          </button>
         
        </div>
      </header>

      <form onSubmit={handleSave} className="space-y-12">
        {features.map((feature, fIdx) => (
          <div key={feature.id} className="group bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm hover:shadow-xl transition-all relative">
            <button 
              type="button"
              onClick={() => setFeatures(features.filter((_, i) => i !== fIdx))}
              className="absolute top-10 right-10 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <i className="bi bi-trash3-fill text-xl"></i>
            </button>

            <div className="flex flex-col lg:flex-row gap-12">
              {/* Sidebar: Image & Tab Settings */}
              <div className="w-full lg:w-64 space-y-6">
                <div className="aspect-video lg:aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                  <img src={feature.imgSrc} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-blue-600 px-2 tracking-widest">Tab Icon (Bootstrap Class)</label>
                    <input 
                      type="text" 
                      value={feature.icon} 
                      onChange={(e) => updateFeature(fIdx, "icon", e.target.value)}
                      className="w-full p-3 bg-slate-50 rounded-xl border-none ring-1 ring-slate-100 focus:ring-blue-500 font-mono text-xs"
                      placeholder="bi-heart-pulse"
                    />
                    <input 
                      type="text" 
                      value={feature.imgSrc} 
                      onChange={(e) => updateFeature(fIdx, "imgSrc", e.target.value)}
                      className="w-full p-3 bg-slate-50 rounded-xl border-none ring-1 ring-slate-100 focus:ring-blue-500 font-mono text-[10px]"
                      placeholder="Image URL"
                    />
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Tab Name</label>
                    <input type="text" value={feature.label} onChange={(e) => updateFeature(fIdx, "label", e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl font-black text-slate-800 border-none ring-1 ring-slate-100" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Section Heading</label>
                    <input type="text" value={feature.title} onChange={(e) => updateFeature(fIdx, "title", e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl font-black text-slate-800 border-none ring-1 ring-slate-100" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Primary Narrative</label>
                  <textarea value={feature.description} onChange={(e) => updateFeature(fIdx, "description", e.target.value)} rows={3} className="w-full p-5 bg-slate-50 rounded-[2rem] border-none ring-1 ring-slate-100 text-slate-600 font-medium" />
                </div>

                {/* Nested Key Points */}
                <div className="bg-slate-50/50 p-6 rounded-[2.5rem] border border-dashed border-slate-200">
                  <div className="flex justify-between items-center mb-4 px-2">
                    <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Bullet Points / Core Values</label>
                    <button type="button" onClick={() => addValuePoint(fIdx)} className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100">+ ADD POINT</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {feature.values?.map((v: any, vIdx: number) => (
                      <div key={vIdx} className="group/item p-5 bg-white rounded-3xl border border-slate-100 relative">
                        <button type="button" onClick={() => {
                          const updated = [...features];
                          updated[fIdx].values = updated[fIdx].values.filter((_: any, i: number) => i !== vIdx);
                          setFeatures(updated);
                        }} className="absolute top-4 right-4 text-red-200 hover:text-red-500"><i className="bi bi-x-circle-fill"></i></button>
                        <input type="text" value={v.title} onChange={(e) => updateValueItem(fIdx, vIdx, "title", e.target.value)} className="w-full font-black text-slate-800 text-sm mb-1 border-none p-0 focus:ring-0" placeholder="Point Title" />
                        <textarea value={v.desc} onChange={(e) => updateValueItem(fIdx, vIdx, "desc", e.target.value)} className="w-full text-xs text-slate-500 border-none p-0 focus:ring-0 resize-none" placeholder="Point Detail" rows={2} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Global Save */}
        <div className="fixed bottom-10 left-0 right-0 z-50 px-6">
          <div className="max-w-lg mx-auto">
            {message && <div className="mb-4 bg-slate-900 text-white p-4 rounded-2xl text-center font-black text-xs uppercase tracking-widest shadow-2xl">{message}</div>}
            <button type="submit" disabled={saving} className="w-full py-6 bg-blue-600 text-white rounded-[2.5rem] font-black text-xl hover:bg-blue-700 transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-4">
              {saving ? "PUBLISHING..." : "Publish the Update"}
              <i className="bi bi-send-fill"></i>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
