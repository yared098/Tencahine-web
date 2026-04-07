"use client";

import React, { useState, useEffect } from "react";

// Define strict types for your data structure
interface Slide {
  title: string;
  span: string;
  description: string;
  btnText: string;
  link: string;
}

interface HeroSettings {
  autoSlideInterval: number;
  showControls: boolean;
}

interface HeroData {
  slides: Slide[];
  settings: HeroSettings;
}

export default function EditHero() {
  const [data, setData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${API_URL}/api/hero`)
      .then((res) => res.json())
      .then((json: HeroData) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setMessage("❌ Failed to load hero data");
        setLoading(false);
      });
  }, [API_URL]);

  const updateSlide = (index: number, field: keyof Slide, value: string) => {
    if (!data) return;
    const newSlides = [...data.slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setData({ ...data, slides: newSlides });
  };

  const addSlide = () => {
    if (!data) return;
    const newSlide: Slide = {
      title: "New Title",
      span: "Highlighted Text",
      description: "Description here...",
      btnText: "Click Me",
      link: "#"
    };
    setData({ ...data, slides: [...data.slides, newSlide] });
  };

  const removeSlide = (index: number) => {
    if (!data) return;
    const newSlides = data.slides.filter((_, i) => i !== index);
    setData({ ...data, slides: newSlides });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/hero`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setMessage("✅ Hero Section Updated!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setMessage("❌ Save Failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 font-bold animate-pulse text-slate-500">Loading Hero Editor...</div>;
  if (!data) return <div className="p-10 text-red-500">Error: No data found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 pb-32 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Hero Content Manager</h1>
            <p className="text-slate-500 text-sm">Edit slides, buttons, and transition speeds</p>
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </header>

        {message && (
          <div className="mb-6 p-4 bg-white border-l-4 border-emerald-500 shadow-md font-bold animate-in fade-in slide-in-from-top-4 duration-300">
            {message}
          </div>
        )}

        {/* SETTINGS SECTION */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Carousel Settings</h2>
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase mb-1 text-slate-500">Slide Duration (ms)</label>
              <input 
                type="number" 
                value={data.settings.autoSlideInterval} 
                onChange={(e) => setData({...data, settings: {...data.settings, autoSlideInterval: parseInt(e.target.value) || 0}})}
                className="w-full bg-slate-50 p-3 rounded-lg border-none outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
              />
            </div>
            <div className="flex items-center gap-2 mt-4">
               <input 
                type="checkbox" 
                id="showControls"
                checked={data.settings.showControls} 
                onChange={(e) => setData({...data, settings: {...data.settings, showControls: e.target.checked}})}
                className="w-5 h-5 cursor-pointer accent-emerald-500"
               />
               <label htmlFor="showControls" className="text-xs font-bold uppercase text-slate-600 cursor-pointer">Show Arrows</label>
            </div>
          </div>
        </section>

        {/* SLIDES SECTION */}
        <div className="space-y-6">
          {data.slides.map((slide, index) => (
            <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative group">
              <div className="flex justify-between items-center mb-4">
                <span className="bg-slate-900 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase">Slide {index + 1}</span>
                <button 
                  onClick={() => removeSlide(index)}
                  className="text-red-500 hover:text-red-700 text-xs font-bold uppercase transition-colors"
                >
                  Delete Slide
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup label="Main Title" value={slide.title} onChange={(v) => updateSlide(index, "title", v)} />
                <InputGroup label="Highlighted Text (Span)" value={slide.span} onChange={(v) => updateSlide(index, "span", v)} />
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase mb-1 text-slate-400">Description</label>
                  <textarea 
                    value={slide.description} 
                    onChange={(e) => updateSlide(index, "description", e.target.value)}
                    className="w-full bg-slate-50 p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-emerald-500 h-24 text-sm font-medium"
                  />
                </div>
                <InputGroup label="Button Text" value={slide.btnText} onChange={(v) => updateSlide(index, "btnText", v)} />
                <InputGroup label="Button Link" value={slide.link} onChange={(v) => updateSlide(index, "link", v)} />
              </div>
            </div>
          ))}

          <button 
            onClick={addSlide}
            className="w-full py-4 border-2 border-dashed border-slate-300 rounded-3xl text-slate-400 font-bold uppercase hover:bg-slate-100 hover:border-slate-400 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-xl">+</span> Add New Slide
          </button>
        </div>

      </div>
    </div>
  );
}

// Sub-component Props Interface
interface InputGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function InputGroup({ label, value, onChange }: InputGroupProps) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase mb-1 text-slate-400">{label}</label>
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-700 transition-all"
      />
    </div>
  );
}