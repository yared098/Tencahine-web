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

  /* --- TOP-LEVEL CRUD --- */

  const addFeature = () => {
    const newFeature = {
      id: `feat-${Date.now()}`,
      label: "New Tab",
      title: "New Strategy Heading",
      imgSrc: "https://via.placeholder.com/400",
      imgAlt: "Description",
      description: "Enter primary description here...",
      values: [] // Start with empty values array
    };
    setFeatures([...features, newFeature]);
  };

  const removeFeature = (index: number) => {
    if (confirm("Delete this entire strategy section?")) {
      setFeatures(features.filter((_, i) => i !== index));
    }
  };

  const updateFeature = (index: number, field: string, value: any) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    setFeatures(updated);
  };

  /* --- NESTED VALUES CRUD --- */

  const addValuePoint = (fIdx: number) => {
    const updated = [...features];
    if (!updated[fIdx].values) updated[fIdx].values = [];
    updated[fIdx].values.push({ title: "New Point", desc: "Detail description" });
    setFeatures(updated);
  };

  const removeValuePoint = (fIdx: number, vIdx: number) => {
    const updated = [...features];
    updated[fIdx].values = updated[fIdx].values.filter((_: any, i: number) => i !== vIdx);
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
      if (res.ok) setMessage("✅ Brand Strategy updated!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Error saving features.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-300 animate-pulse">Loading Strategy Data...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 pb-40">
      <header className="mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Brand Strategy</h1>
          <p className="text-slate-500 font-medium">Mission, Vision, and the Core of Tenachin.</p>
        </div>
        <div className="flex gap-4">
          <button 
            type="button"
            onClick={addFeature}
            className="px-6 py-2 bg-blue-600 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            + Add Section
          </button>
          <button onClick={() => router.back()} className="text-slate-400 hover:text-slate-900 font-bold transition-colors">
            Dismiss
          </button>
        </div>
      </header>

      <form onSubmit={handleSave} className="space-y-12">
        {features.map((feature, fIdx) => (
          <div key={feature.id} className="group bg-white border border-slate-100 rounded-[3rem] p-8 shadow-sm hover:shadow-xl transition-all relative">
            
            {/* Remove Top Section */}
            <button 
              type="button"
              onClick={() => removeFeature(fIdx)}
              className="absolute top-8 right-8 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <i className="bi bi-trash3-fill text-xl"></i>
            </button>

            <div className="flex flex-wrap gap-10 items-start">
              {/* Image Preview & URL */}
              <div className="w-full md:w-56 shrink-0">
                <label className="text-[10px] font-black uppercase text-blue-600 mb-2 block tracking-widest">Visual Asset</label>
                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-100 mb-4 border border-slate-200 shadow-inner">
                  <img src={feature.imgSrc} alt={feature.imgAlt} className="w-full h-full object-cover" />
                </div>
                <input 
                  type="text" 
                  value={feature.imgSrc} 
                  onChange={(e) => updateFeature(fIdx, "imgSrc", e.target.value)}
                  className="w-full text-[10px] p-3 bg-slate-50 rounded-xl border-none ring-1 ring-slate-100 focus:ring-blue-500 font-mono"
                  placeholder="Image URL"
                />
              </div>

              {/* Text Fields */}
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Tab Label (Navbar)</label>
                    <input 
                      type="text" 
                      value={feature.label} 
                      onChange={(e) => updateFeature(fIdx, "label", e.target.value)}
                      className="w-full p-4 bg-slate-50 rounded-2xl font-black text-slate-800 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Main Heading</label>
                    <input 
                      type="text" 
                      value={feature.title} 
                      onChange={(e) => updateFeature(fIdx, "title", e.target.value)}
                      className="w-full p-4 bg-slate-50 rounded-2xl font-black text-slate-800 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Contextual Description</label>
                  <textarea 
                    value={feature.description || ""} 
                    onChange={(e) => updateFeature(fIdx, "description", e.target.value)}
                    rows={3}
                    className="w-full p-5 bg-slate-50 rounded-[2rem] border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 text-slate-600 leading-relaxed font-medium"
                    placeholder="Describe the mission or vision..."
                  />
                </div>

                {/* Nested CRUD: Core Values */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Key Points / Core Values</label>
                    <button 
                      type="button" 
                      onClick={() => addValuePoint(fIdx)}
                      className="text-[10px] font-bold text-blue-600 hover:underline"
                    >
                      + ADD POINT
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {feature.values?.map((v: any, vIdx: number) => (
                      <div key={vIdx} className="group/item p-5 bg-slate-50 rounded-3xl border border-slate-100 relative">
                        <button 
                          type="button" 
                          onClick={() => removeValuePoint(fIdx, vIdx)}
                          className="absolute top-4 right-4 opacity-0 group-hover/item:opacity-100 text-red-300 hover:text-red-500 transition-all"
                        >
                          <i className="bi bi-x-circle-fill"></i>
                        </button>
                        <input 
                          type="text" 
                          value={v.title} 
                          onChange={(e) => updateValueItem(fIdx, vIdx, "title", e.target.value)}
                          className="w-full bg-transparent font-black text-slate-800 text-sm mb-1 border-none focus:ring-0 p-0"
                          placeholder="Value Title"
                        />
                        <textarea 
                          value={v.desc} 
                          onChange={(e) => updateValueItem(fIdx, vIdx, "desc", e.target.value)}
                          className="w-full bg-transparent text-xs text-slate-500 border-none focus:ring-0 p-0 leading-snug resize-none"
                          placeholder="Short detail description"
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Action Bar */}
        <div className="fixed bottom-10 left-0 right-0 z-50 px-6">
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            {message && (
              <div className="bg-slate-900 text-white p-4 rounded-2xl text-center font-black text-xs uppercase tracking-widest animate-bounce">
                {message}
              </div>
            )}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-6 bg-blue-600 text-white rounded-[2.5rem] font-black text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/40 disabled:opacity-50 flex items-center justify-center gap-4"
            >
              {saving ? "SYNCING BRAND..." : "PUBLISH BRAND STRATEGY"}
              <i className="bi bi-globe-central-south"></i>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}