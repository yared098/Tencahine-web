"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AboutData {
  title: string;
  subtitle: string;
  mainDescription: string;
  bullets: string[];
  highlightText: string;
  ctaText: string;
  ctaLink: string;
}

export default function EditAbout() {
  const [formData, setFormData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/about`);
        const result = await res.json();
        setFormData(result.aboutData || result);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  /* --- BULLET POINT OPERATIONS --- */

  const handleBulletChange = (index: number, value: string) => {
    const newBullets = [...(formData?.bullets || [])];
    newBullets[index] = value;
    setFormData((prev) => (prev ? { ...prev, bullets: newBullets } : null));
  };

  const addBullet = () => {
    setFormData((prev) => 
      prev ? { ...prev, bullets: [...prev.bullets, "New clinical highlight..."] } : null
    );
  };

  const removeBullet = (index: number) => {
    setFormData((prev) => 
      prev ? { ...prev, bullets: prev.bullets.filter((_, i) => i !== index) } : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`${apiUrl}/api/about`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage("✅ About section updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to save changes.");
      }
    } catch (err) {
      setMessage("❌ Error connecting to server.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center font-black text-slate-300 animate-pulse tracking-widest uppercase">
      Loading Mission Data...
    </div>
  );

  if (!formData) return <div className="p-10 text-center">No data found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 bg-white min-h-screen pb-24">
      <header className="flex items-center justify-between mb-12 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 italic tracking-tight">Our Mission</h1>
          <p className="text-slate-500 font-medium mt-1">Refine the core narrative of the Tenachin platform.</p>
        </div>
        <button 
          onClick={() => router.back()}
          className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </header>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Core Identity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 ml-2">Section Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] font-black text-slate-800 focus:ring-2 focus:ring-blue-500 shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 ml-2">Subtitle</label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] font-bold text-slate-600 focus:ring-2 focus:ring-blue-500 shadow-inner"
            />
          </div>
        </div>

        {/* Narrative Content */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Main Description</label>
          <textarea
            name="mainDescription"
            rows={6}
            value={formData.mainDescription}
            onChange={handleChange}
            className="w-full p-6 bg-slate-50 border-none rounded-[2rem] text-slate-700 font-medium leading-relaxed focus:ring-2 focus:ring-blue-500 shadow-inner resize-none"
          />
        </div>

        {/* Highlights (Array Management) */}
        <div className="space-y-6 bg-slate-50 p-8 rounded-[3rem] border border-slate-100">
          <div className="flex justify-between items-center px-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Key Platform Highlights</label>
            <button 
              type="button" 
              onClick={addBullet}
              className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-tighter"
            >
              + Add Highlight
            </button>
          </div>
          <div className="space-y-3">
            {formData.bullets.map((bullet, idx) => (
              <div key={idx} className="group flex gap-3 items-center">
                <span className="flex-shrink-0 w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-black text-xs shadow-sm border border-blue-50">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => handleBulletChange(idx, e.target.value)}
                  className="flex-1 p-4 bg-white border-none rounded-2xl text-sm font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="button"
                  onClick={() => removeBullet(idx)}
                  className="w-10 h-10 bg-red-50 text-red-400 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <i className="bi bi-trash3-fill"></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Highlight */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 ml-2">Blue Highlight Box</label>
          <textarea
            name="highlightText"
            rows={3}
            value={formData.highlightText}
            onChange={handleChange}
            className="w-full p-6 bg-blue-600 text-white rounded-[2rem] font-bold shadow-xl shadow-blue-500/20 border-none outline-none focus:ring-4 focus:ring-blue-200"
          />
        </div>

        {/* Action Call */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Button Label</label>
            <input
              type="text"
              name="ctaText"
              value={formData.ctaText}
              onChange={handleChange}
              className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] font-black text-slate-800"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Target Link</label>
            <input
              type="text"
              name="ctaLink"
              value={formData.ctaLink}
              onChange={handleChange}
              className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] font-mono text-xs text-blue-500"
            />
          </div>
        </div>

        {/* Status Toast */}
        {message && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-10 py-4 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-2xl animate-bounce z-50">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-xl hover:bg-blue-600 transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-4 group"
        >
          {saving ? "SYNCING..." : "UPDATE ABOUT SECTION"}
          <i className="bi bi-check2-all text-2xl group-hover:scale-125 transition-transform"></i>
        </button>
      </form>
    </div>
  );
}