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
        
        {/* 1. Page Header */}
        <section className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6">Header</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={data.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full p-6 rounded-3xl ring-1 ring-slate-200 font-black text-2xl text-slate-800"
            />
            <textarea
              value={data.subtitle}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              rows={2}
              className="w-full p-6 rounded-3xl ring-1 ring-slate-200 text-slate-600 font-medium"
            />
          </div>
        </section>

        {/* 2. Contact Channels */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Channels</h2>
            <button type="button" onClick={() => addItem("info", { icon: "bi-chat", title: "New", content: "", delay: "100" })} className="text-[10px] font-black bg-blue-600 text-white px-4 py-2 rounded-full">+ ADD</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.info.map((item: any, idx: number) => (
              <div key={idx} className="group p-6 bg-white border border-slate-100 rounded-[2rem] relative">
                <button type="button" onClick={() => removeItem("info", idx)} className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100"><i className="bi bi-trash-fill"></i></button>
                <input type="text" value={item.title} onChange={(e) => updateArrayItem("info", idx, "title", e.target.value)} className="text-[10px] font-black text-blue-500 uppercase tracking-widest w-full bg-transparent" />
                <input type="text" value={item.content} onChange={(e) => updateArrayItem("info", idx, "content", e.target.value)} className="w-full bg-slate-50 rounded-xl p-2 font-bold text-slate-700 text-sm mt-2" />
                <input type="text" value={item.icon} onChange={(e) => updateArrayItem("info", idx, "icon", e.target.value)} className="text-[9px] font-mono text-slate-300 w-full mt-1" />
              </div>
            ))}
          </div>
        </section>

        {/* 3. Social Media Section (NEWLY ADDED) */}
        <section className="bg-blue-50/30 p-8 rounded-[2.5rem] border border-blue-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2">
               <i className="bi bi-share-fill"></i> Social Media Links
            </h2>
            <button 
              type="button" 
              onClick={() => addItem("socials", { icon: "bi-link-45deg", url: "https://", color: "hover:bg-blue-600" })} 
              className="text-[10px] font-black bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg shadow-blue-200"
            >
              + ADD SOCIAL
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data.socials.map((social: any, idx: number) => (
              <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2 relative group">
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
                  className="w-full text-xs p-2 bg-slate-50 rounded-lg border-none ring-1 ring-slate-100 focus:ring-blue-500"
                />
                <input 
                  type="text" 
                  placeholder="Hover Color (hover:bg-[#HEX])" 
                  value={social.color} 
                  onChange={(e) => updateArrayItem("socials", idx, "color", e.target.value)}
                  className="w-full text-[9px] font-bold text-slate-400 p-2 bg-slate-50 rounded-lg border-none"
                />
              </div>
            ))}
          </div>
        </section>

        {/* 4. CTA Card */}
        <section className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-8">Call-to-Action</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <input type="text" value={data.cta.title} onChange={(e) => handleChange("cta.title", e.target.value)} className="w-full p-4 bg-white/5 rounded-2xl text-white font-bold" />
              <textarea value={data.cta.text} onChange={(e) => handleChange("cta.text", e.target.value)} rows={2} className="w-full p-4 bg-white/5 rounded-2xl text-slate-300 text-sm" />
            </div>
            <input type="text" value={data.cta.phone} onChange={(e) => handleChange("cta.phone", e.target.value)} className="w-full p-6 bg-blue-600 rounded-2xl text-white font-black text-2xl" />
          </div>
        </section>

        {/* 5. Legal & Policy */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Legal</h2>
            <button type="button" onClick={() => addItem("terms", { title: "New", content: "", isEmergency: false })} className="text-[10px] font-black bg-slate-100 text-slate-600 px-4 py-2 rounded-full">+ ADD TERM</button>
          </div>
          <div className="space-y-4">
            {data.terms.map((term: any, idx: number) => (
              <div key={idx} className={`p-8 rounded-[2rem] border ${term.isEmergency ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'}`}>
                <div className="flex justify-between items-center mb-4">
                  <input type="text" value={term.title} onChange={(e) => updateArrayItem("terms", idx, "title", e.target.value)} className="bg-transparent font-black text-xl text-slate-800 outline-none w-2/3" />
                  <label className="flex items-center gap-2"><input type="checkbox" checked={term.isEmergency} onChange={(e) => updateArrayItem("terms", idx, "isEmergency", e.target.checked)} /> <span className="text-[10px] font-black text-red-600">EMERGENCY</span></label>
                  <button type="button" onClick={() => removeItem("terms", idx)} className="text-slate-300 hover:text-red-500"><i className="bi bi-trash3-fill"></i></button>
                </div>
                <textarea value={term.content} onChange={(e) => updateArrayItem("terms", idx, "content", e.target.value)} rows={4} className="w-full p-6 bg-white/50 rounded-3xl ring-1 ring-slate-200 text-sm leading-relaxed text-slate-600" />
              </div>
            ))}
          </div>
        </section>

        {/* Floating Save Bar */}
        <div className="fixed bottom-8 left-0 right-0 z-50 px-6">
          <div className="max-w-5xl mx-auto bg-white border border-slate-200 p-4 rounded-[2.5rem] shadow-2xl flex items-center justify-between px-8">
            <p className="text-xs text-slate-900 font-bold">{message || "Ready to sync"}</p>
            <button type="submit" disabled={saving} className="bg-slate-900 hover:bg-blue-600 text-white px-10 py-4 rounded-full font-black text-xs tracking-widest transition-all">
              {saving ? "UPLOADING..." : "PUBLISH CHANGES"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}