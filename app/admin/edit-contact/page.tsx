"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditContact() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${apiUrl}/api/contact`)
      .then((res) => res.json())
      .then((result) => {
        setData(result.contactData || result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [apiUrl]);

  const handleChange = (path: string, value: any) => {
    const newData = { ...data };
    const keys = path.split('.');
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setData(newData);
  };

  const updateArrayItem = (key: string, index: number, field: string, value: any) => {
    const newData = { ...data };
    newData[key][index] = { ...newData[key][index], [field]: value };
    setData(newData);
  };

  const addItem = (key: string, template: any) => {
    setData({
      ...data,
      [key]: [...data[key], { ...template }]
    });
  };

  const removeItem = (key: string, index: number) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      const newData = { ...data };
      newData[key] = newData[key].filter((_: any, i: number) => i !== index);
      setData(newData);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/api/contact`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactData: data }),
      });
      if (res.ok) {
        setMessage("✅ Changes Published Successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setMessage("❌ Error saving data.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) return (
    <div className="p-20 text-center animate-pulse font-black text-slate-300 uppercase tracking-widest">
      Loading Contact Config...
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 bg-white pb-32">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Contact & Legal</h1>
          <p className="text-slate-500 font-medium">Manage how patients reach Tenachin and view terms.</p>
        </div>
      </header>

      <form onSubmit={handleSave} className="space-y-12">
        
        {/* 1. Header & Media Section */}
        <section className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6">Visuals & Branding</h2>
          
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:w-1/3">
              <div className="relative group aspect-square overflow-hidden rounded-[2rem] border-4 border-white shadow-xl bg-slate-200">
                {data.image ? (
                   <img 
                    src={data.image} 
                    alt="Contact Preview" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 font-bold">No Image</div>
                )}
              </div>
            </div>

            <div className="w-full lg:w-2/3 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Cover Image Link</label>
                <input
                  type="text"
                  placeholder="Paste image URL here..."
                  value={data.image}
                  onChange={(e) => handleChange("image", e.target.value)}
                  className="w-full p-5 rounded-2xl ring-1 ring-slate-200 font-mono text-xs text-blue-600 bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  value={data.title}
                  placeholder="Page Title"
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full p-6 rounded-3xl ring-1 ring-slate-200 font-black text-2xl text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <textarea
                  value={data.subtitle}
                  placeholder="Page Subtitle"
                  onChange={(e) => handleChange("subtitle", e.target.value)}
                  rows={2}
                  className="w-full p-6 rounded-3xl ring-1 ring-slate-200 text-slate-600 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Contact Channels */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Channels</h2>
            <button type="button" onClick={() => addItem("info", { icon: "bi-chat", title: "New", content: "", delay: "100" })} className="text-[10px] font-black bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg shadow-blue-200 hover:scale-105 transition-transform">+ ADD CHANNEL</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.info.map((item: any, idx: number) => (
              <div key={idx} className="group p-6 bg-white border border-slate-100 rounded-[2rem] relative hover:shadow-md transition-shadow">
                <button type="button" onClick={() => removeItem("info", idx)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"><i className="bi bi-trash-fill"></i></button>
                <input type="text" value={item.title} onChange={(e) => updateArrayItem("info", idx, "title", e.target.value)} className="text-[10px] font-black text-blue-500 uppercase tracking-widest w-full bg-transparent outline-none" />
                <input type="text" value={item.content} onChange={(e) => updateArrayItem("info", idx, "content", e.target.value)} className="w-full bg-slate-50 rounded-xl p-3 font-bold text-slate-700 text-sm mt-2 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-400 transition-all" />
                <div className="flex items-center gap-2 mt-2">
                  <i className={`bi ${item.icon} text-slate-300`}></i>
                  <input type="text" value={item.icon} onChange={(e) => updateArrayItem("info", idx, "icon", e.target.value)} className="text-[9px] font-mono text-slate-400 w-full outline-none" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Social Media Section */}
        <section className="bg-blue-50/30 p-8 rounded-[2.5rem] border border-blue-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2">
               <i className="bi bi-share-fill"></i> Social Media Links
            </h2>
            <button 
              type="button" 
              onClick={() => addItem("socials", { icon: "bi-link-45deg", url: "https://", color: "hover:bg-blue-600" })} 
              className="text-[10px] font-black bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg shadow-blue-200 hover:scale-105 transition-transform"
            >
              + ADD SOCIAL
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data.socials.map((social: any, idx: number) => (
              <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2 relative group hover:shadow-md transition-all">
                <button 
                  type="button" 
                  onClick={() => removeItem("socials", idx)} 
                  className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                      <i className={`bi ${social.icon}`}></i>
                   </div>
                   <input 
                      type="text" 
                      placeholder="bi-icon" 
                      value={social.icon} 
                      onChange={(e) => updateArrayItem("socials", idx, "icon", e.target.value)}
                      className="text-[10px] font-mono text-slate-400 bg-transparent outline-none w-full"
                   />
                </div>
                <input 
                  type="text" 
                  placeholder="URL (https://...)" 
                  value={social.url} 
                  onChange={(e) => updateArrayItem("socials", idx, "url", e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 rounded-lg border-none ring-1 ring-slate-100 focus:ring-blue-500 transition-all outline-none"
                />
              </div>
            ))}
          </div>
        </section>

        {/* NEW: 4. Map & Location Section */}
        <section className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6">Map & Physical Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Address Name (Display)</label>
                <input
                  type="text"
                  value={data.location.addressName}
                  onChange={(e) => handleChange("location.addressName", e.target.value)}
                  className="w-full p-4 rounded-2xl ring-1 ring-slate-200 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Google Maps Link</label>
                <input
                  type="text"
                  value={data.location.googleMapsUrl}
                  placeholder="https://goo.gl/maps/..."
                  onChange={(e) => handleChange("location.googleMapsUrl", e.target.value)}
                  className="w-full p-4 rounded-2xl ring-1 ring-slate-200 font-mono text-xs text-blue-600 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={data.location.lat}
                  onChange={(e) => handleChange("location.lat", parseFloat(e.target.value))}
                  className="w-full p-4 rounded-2xl ring-1 ring-slate-200 font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={data.location.lng}
                  onChange={(e) => handleChange("location.lng", parseFloat(e.target.value))}
                  className="w-full p-4 rounded-2xl ring-1 ring-slate-200 font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="col-span-2">
                <p className="text-[9px] text-slate-400 italic px-2">* Coordinates are used for the interactive map pointer.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CTA Card */}
        <section className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-8">Call-to-Action</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-4">
              <input type="text" value={data.cta.title} onChange={(e) => handleChange("cta.title", e.target.value)} className="w-full p-4 bg-white/5 rounded-2xl text-white font-bold border-none outline-none focus:bg-white/10 transition-colors" />
              <textarea value={data.cta.text} onChange={(e) => handleChange("cta.text", e.target.value)} rows={2} className="w-full p-4 bg-white/5 rounded-2xl text-slate-300 text-sm border-none outline-none focus:bg-white/10 transition-colors" />
            </div>
            <div className="space-y-2">
               <label className="text-[9px] font-black text-blue-400 opacity-50 uppercase tracking-widest ml-4">Hotline Number</label>
               <input type="text" value={data.cta.phone} onChange={(e) => handleChange("cta.phone", e.target.value)} className="w-full p-6 bg-blue-600 rounded-2xl text-white font-black text-2xl shadow-inner focus:scale-[1.02] transition-transform outline-none" />
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
        </section>

        {/* 6. Legal & Policy */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Legal Documents</h2>
            <button type="button" onClick={() => addItem("terms", { title: "New Policy", content: "", isEmergency: false })} className="text-[10px] font-black bg-slate-100 text-slate-600 px-4 py-2 rounded-full hover:bg-slate-200 transition-colors">+ ADD TERM</button>
          </div>
          <div className="space-y-4">
            {data.terms.map((term: any, idx: number) => (
              <div key={idx} className={`p-8 rounded-[2rem] border transition-all ${term.isEmergency ? 'bg-red-50/50 border-red-100 shadow-sm' : 'bg-white border-slate-100'}`}>
                <div className="flex justify-between items-center mb-4">
                  <input type="text" value={term.title} onChange={(e) => updateArrayItem("terms", idx, "title", e.target.value)} className="bg-transparent font-black text-xl text-slate-800 outline-none w-2/3" />
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={term.isEmergency} onChange={(e) => updateArrayItem("terms", idx, "isEmergency", e.target.checked)} className="accent-red-600" />
                      <span className="text-[10px] font-black text-red-600">EMERGENCY</span>
                    </label>
                    <button type="button" onClick={() => removeItem("terms", idx)} className="text-slate-300 hover:text-red-500 transition-colors"><i className="bi bi-trash3-fill"></i></button>
                  </div>
                </div>
                <textarea value={term.content} onChange={(e) => updateArrayItem("terms", idx, "content", e.target.value)} rows={4} className="w-full p-6 bg-white/50 rounded-3xl ring-1 ring-slate-200 text-sm leading-relaxed text-slate-600 focus:ring-2 focus:ring-blue-400 outline-none transition-all" />
              </div>
            ))}
          </div>
        </section>

        {/* Floating Save Bar */}
        <div className="fixed bottom-8 left-0 right-0 z-50 px-6">
          <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md border border-slate-200 p-4 rounded-[2.5rem] shadow-2xl flex items-center justify-between px-8">
            <p className="text-xs text-slate-900 font-bold tracking-tight">{message || "Configuration live on server"}</p>
            <button type="submit" disabled={saving} className="bg-slate-900 hover:bg-blue-600 text-white px-10 py-4 rounded-full font-black text-xs tracking-widest transition-all active:scale-95 shadow-xl shadow-slate-200">
              {saving ? "UPLOADING..." : "PUBLISH CHANGES"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}