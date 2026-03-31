"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditCTA() {
  const [presets, setPresets] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${apiUrl}/api/cta`)
      .then((res) => res.json())
      .then((result) => {
        // Expecting an array of CTA presets from your backend
        const data = Array.isArray(result) ? result : [result.ctaData || result];
        setPresets(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [apiUrl]);

  // UPDATE: Handle input changes for the current active preset
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    
    const updatedPresets = [...presets];
    updatedPresets[activeIndex] = { ...updatedPresets[activeIndex], [name]: val };
    setPresets(updatedPresets);
  };

  // CREATE: Add a new blank CTA preset
  const addNewPreset = () => {
    const newCTA = {
      title: "New Campaign Title",
      description: "Enter a compelling description here...",
      buttonText: "Download Now",
      downloadUrl: "https://play.google.com/store/...",
      showAnimation: true,
      id: Date.now()
    };
    setPresets([...presets, newCTA]);
    setActiveIndex(presets.length); // Switch to the new one
  };

  // DELETE: Remove a preset
  const deletePreset = (index: number) => {
    if (presets.length === 1) {
      alert("You must have at least one CTA configuration.");
      return;
    }
    if (confirm("Are you sure you want to delete this CTA preset?")) {
      const filtered = presets.filter((_, i) => i !== index);
      setPresets(filtered);
      setActiveIndex(0);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // We save the entire array of presets and the active index
      const res = await fetch(`${apiUrl}/api/cta`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presets, activeIndex }),
      });
      if (res.ok) setMessage("✅ All CTA variations updated!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Error saving CTA data.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">Loading CTA Config...</div>;

  const current = presets[activeIndex];

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 pb-32">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Hero & CTA Manager</h1>
          <p className="text-slate-500 text-sm">Manage different versions of your app download section.</p>
        </div>
        <button onClick={() => router.back()} className="px-6 py-2 bg-slate-100 hover:bg-slate-200 rounded-full font-bold transition-all">
          Exit
        </button>
      </header>

      {/* READ: Preset Switcher */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
              activeIndex === idx 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
              : "bg-white border border-slate-200 text-slate-500 hover:border-blue-400"
            }`}
          >
            {p.title.substring(0, 15)}... {activeIndex === idx && " (Active)"}
          </button>
        ))}
        <button 
          onClick={addNewPreset}
          className="px-6 py-3 rounded-2xl font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100"
        >
          + New Version
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          {/* DELETE Button */}
          <button 
            type="button"
            onClick={() => deletePreset(activeIndex)}
            className="absolute top-8 right-8 text-red-400 hover:text-red-600 flex items-center gap-2 font-bold text-xs uppercase"
          >
            <i className="bi bi-trash3"></i> Delete This Version
          </button>

          {/* UPDATE: Inputs */}
          <div className="max-w-2xl">
            <label className="block text-xs font-black uppercase tracking-widest text-blue-600 mb-2">Main Heading</label>
            <input
              type="text"
              name="title"
              value={current.title}
              onChange={handleChange}
              className="w-full p-4 bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 font-black text-2xl"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-blue-600 mb-2">Description</label>
            <textarea
              name="description"
              rows={4}
              value={current.description}
              onChange={handleChange}
              className="w-full p-4 bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 leading-relaxed text-slate-600 font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100">
            <label className="block text-xs font-black uppercase tracking-widest text-blue-600 mb-2">Button Text</label>
            <input
              type="text"
              name="buttonText"
              value={current.buttonText}
              onChange={handleChange}
              className="w-full p-4 bg-white border-none ring-1 ring-blue-200 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold"
            />
          </div>

          <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
            <label className="block text-xs font-black uppercase tracking-widest text-blue-400 mb-2">Store Link</label>
            <input
              type="text"
              name="downloadUrl"
              value={current.downloadUrl}
              onChange={handleChange}
              className="w-full p-4 bg-white/10 border-none ring-1 ring-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400 text-sm font-mono text-blue-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              name="showAnimation"
              checked={current.showAnimation}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
          <div>
            <span className="text-sm font-black text-slate-800 uppercase tracking-tight">Enable Motion Effects</span>
            <p className="text-xs text-slate-500">Adds an attention-grabbing animation to the CTA section.</p>
          </div>
        </div>

        {/* Floating Save Bar */}
        <div className="fixed bottom-8 left-0 right-0 px-6 z-50">
          <div className="max-w-4xl mx-auto bg-slate-900/90 backdrop-blur-xl p-4 rounded-full flex items-center justify-between px-10 shadow-2xl border border-white/10">
            <span className="text-white text-xs font-bold opacity-80">
              {message || `Editing: Version ${activeIndex + 1}`}
            </span>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-10 py-3 rounded-full font-black tracking-widest text-sm hover:bg-blue-500 transition-all disabled:opacity-50"
            >
              {saving ? "SAVING..." : "PUBLISH ALL VERSIONS"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}