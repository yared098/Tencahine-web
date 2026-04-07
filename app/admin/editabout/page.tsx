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

  const handleBulletChange = (index: number, value: string) => {
    if (!formData) return;
    const newBullets = [...formData.bullets];
    newBullets[index] = value;
    setFormData({ ...formData, bullets: newBullets });
  };

  const addBullet = () => {
    if (!formData) return;
    setFormData({ 
      ...formData, 
      bullets: [...formData.bullets, "New platform feature..."] 
    });
  };

  const removeBullet = (index: number) => {
    if (!formData) return;
    const newBullets = formData.bullets.filter((_, i) => i !== index);
    setFormData({ ...formData, bullets: newBullets });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/api/about`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aboutData: formData }),
      });
      if (res.ok) setMessage("✅ MISSION UPDATED LIVE");
      else setMessage("❌ Save Failed");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Connection Error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="text-center font-black text-slate-300 animate-pulse uppercase tracking-[0.3em]">
        Syncing About Data...
      </div>
    </div>
  );

  if (!formData) return <div className="p-10 text-center font-bold">Data source unavailable.</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-40">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            
            <h1 className="text-xl font-bold tracking-tight text-slate-900">MISSION <span className="text-blue-600">EDITOR</span></h1>
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">
            Tenachin Healthcare Platform
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Editing Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
            
            {/* Branding & Titles */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-sm">
              <h2 className="font-bold uppercase text-[10px] tracking-[0.2em] text-blue-600 border-b border-slate-100 pb-4">Core Branding</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Primary Title</label>
                  <input name="title" value={formData.title} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Italic Subtitle</label>
                  <input name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none italic text-slate-600" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Full Mission Narrative</label>
                <textarea name="mainDescription" rows={4} value={formData.mainDescription} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-600 leading-relaxed" />
              </div>
            </div>

            {/* Highlights List */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold uppercase text-[10px] tracking-[0.2em] text-blue-600">Service Highlights</h2>
                <button type="button" onClick={addBullet} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all">+ Add Feature</button>
              </div>
              <div className="space-y-3">
                {formData.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex gap-3 items-center group">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">{idx + 1}</span>
                    <input value={bullet} onChange={(e) => handleBulletChange(idx, e.target.value)} className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white transition-all outline-none" />
                    <button type="button" onClick={() => removeBullet(idx)} className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 transition-all"><i className="bi bi-x-circle-fill"></i></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Box */}
            <div className="bg-blue-600 rounded-2xl p-8 shadow-xl shadow-blue-200">
              <label className="text-[10px] font-black uppercase text-blue-200 mb-3 block">High-Impact Highlight (Quote)</label>
              <textarea name="highlightText" rows={2} value={formData.highlightText} onChange={handleChange} className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white font-bold placeholder:text-blue-300 outline-none focus:bg-white/20" />
            </div>

            {/* CTA Config */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Action Button</label>
                <input name="ctaText" value={formData.ctaText} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm" />
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl shadow-sm">
                <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Action Link</label>
                <input name="ctaLink" value={formData.ctaLink} onChange={handleChange} className="w-full p-3 bg-white/5 border border-white/10 rounded-xl font-mono text-xs text-blue-400" />
              </div>
            </div>
          </form>

          {/* Preview Section (Simulating a Phone) */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-28 mx-auto w-full max-w-[320px] aspect-[9/19] bg-white border-[8px] border-slate-900 rounded-[3rem] shadow-2xl overflow-hidden overflow-y-auto no-scrollbar">
              <div className="bg-slate-900 h-6 w-1/3 mx-auto rounded-b-2xl mb-4"></div>
              <div className="p-6 space-y-6">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black leading-none">{formData.title}</h3>
                  <p className="text-blue-600 italic font-medium text-sm">{formData.subtitle}</p>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">{formData.mainDescription}</p>
                <div className="space-y-2">
                  {formData.bullets.map((b, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <i className="bi bi-check2-circle text-blue-600 text-xs"></i>
                      <p className="text-[9px] font-bold text-slate-700">{b}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-600 p-4 rounded-2xl text-[10px] text-white font-bold text-center">
                  "{formData.highlightText}"
                </div>
                <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                  {formData.ctaText}
                </button>
              </div>
            </div>
            <p className="text-center text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-[0.2em]">Live Mobile Preview</p>
          </div>
        </div>
      </div>

      {/* Save Bar */}
      <div className="fixed bottom-10 left-0 right-0 z-50 px-6">
        <div className="max-w-2xl mx-auto bg-white border border-slate-200 p-4 rounded-2xl shadow-2xl flex items-center justify-between">
          <div className="pl-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Sync Status</p>
            <p className="text-xs font-bold text-blue-600 mt-1">{message || "Awaiting Changes"}</p>
          </div>
          <button onClick={handleSubmit} disabled={saving} className="bg-slate-900 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.1em] hover:bg-blue-600 transition-all disabled:opacity-50 shadow-xl shadow-slate-200">
            {saving ? "Publishing..." : "Publish to Site"}
          </button>
        </div>
      </div>
    </div>
  );
}
