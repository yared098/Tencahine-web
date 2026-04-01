"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditCTA() {
  const [presets, setPresets] = useState<any[]>([]);
  const [activeID, setActiveID] = useState<string | number>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${apiUrl}/api/cta`)
      .then((res) => res.json())
      .then((result) => {
        const rawData = Array.isArray(result.presets) 
          ? result.presets 
          : (Array.isArray(result) ? result : []);
        
        const normalizedData = rawData.map((item: any, index: number) => ({
          ...item,
          id: item.id || `preset-${index}-${Date.now()}`
        }));

        setPresets(normalizedData);
        setActiveID(result.activeID || (normalizedData.length > 0 ? normalizedData[0].id : ""));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setLoading(false);
      });
  }, [apiUrl]);

  const currentIdx = presets.findIndex(p => p.id === activeID);
  const current = presets[currentIdx] || null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    
    if (currentIdx === -1) return;

    const updatedPresets = [...presets];
    updatedPresets[currentIdx] = { ...updatedPresets[currentIdx], [name]: val };
    setPresets(updatedPresets);
  };

  const addNewPreset = () => {
    const newID = Date.now();
    const newCTA = {
      id: newID,
      title: "New Health Solution",
      description: "Explain how Tenachin is transforming care...",
      buttonText: "Download Now",
      downloadUrl: "https://play.google.com/store/...",
      showAnimation: true,
    };
    setPresets([...presets, newCTA]);
    setActiveID(newID); 
  };

  const deletePreset = (id: string | number) => {
    if (presets.length === 1) return alert("At least one CTA is required.");
    if (confirm("Delete this version?")) {
      const filtered = presets.filter(p => p.id !== id);
      setPresets(filtered);
      if (id === activeID) setActiveID(filtered[0].id);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/api/cta`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presets, activeID }), 
      });
      if (res.ok) setMessage("✅ LIVE VERSION UPDATED");
      else setMessage("❌ Server Error");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="text-center font-black text-blue-600 tracking-tighter animate-pulse text-xl">
        INITIALIZING ENGINE...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-40">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <i className="bi bi-arrow-left"></i>
            </button>
            <h1 className="text-xl font-bold tracking-tight">CTA <span className="text-blue-600">EDITOR</span></h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={addNewPreset}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all"
            >
              + New Version
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 mt-8">
        {/* Version Tabs */}
        <div className="flex gap-2 mb-10 overflow-x-auto no-scrollbar">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveID(p.id)}
              className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border shrink-0 ${
                activeID === p.id 
                ? "bg-blue-600 border-blue-600 text-white shadow-lg" 
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              {p.title?.substring(0, 15) || "Draft"} {activeID === p.id && "•"}
            </button>
          ))}
        </div>

        {current ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Form Section */}
            <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <h2 className="font-bold uppercase text-[10px] tracking-[0.2em] text-slate-400">Content Configuration</h2>
                  <button type="button" onClick={() => deletePreset(current.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all text-sm">
                    <i className="bi bi-trash3"></i>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Hero Heading</label>
                    <input 
                      name="title" 
                      value={current.title} 
                      onChange={handleChange}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Description</label>
                    <textarea 
                      name="description" 
                      rows={4} 
                      value={current.description} 
                      onChange={handleChange}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-600" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Button Label</label>
                      <input name="buttonText" value={current.buttonText} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Download URL</label>
                      <input name="downloadUrl" value={current.downloadUrl} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 p-8 rounded-2xl flex items-center justify-between text-white">
                <div>
                  <h3 className="font-bold">Engagement Pulse</h3>
                  <p className="text-blue-100 text-xs">Add a subtle bounce to the main action button.</p>
                </div>
                <input 
                  type="checkbox" 
                  name="showAnimation" 
                  checked={!!current.showAnimation} 
                  onChange={handleChange}
                  className="w-6 h-6 rounded-md accent-white" 
                />
              </div>
            </form>

            {/* Live Preview Section */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-slate-800 px-6 py-3 border-b border-slate-700 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Live Site Preview</span>
                </div>
                <div className="p-10 flex flex-col items-center text-center space-y-6">
                  <h2 className="text-3xl font-black text-white leading-tight">{current.title}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">{current.description}</p>
                  <button className={`bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest ${current.showAnimation ? 'animate-bounce' : ''}`}>
                    {current.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Floating Save Action */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-6">
        <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
          <div className="pl-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Status</span>
            <span className="text-xs font-bold text-blue-600">{message || "Ready to Sync"}</span>
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-50"
          >
            {saving ? "Publishing..." : "Sync to Live Site"}
          </button>
        </div>
      </div>
    </div>
  );
}