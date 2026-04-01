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

  // Standard input handler for top-level and nested (path.sub) keys
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

  // Handler for updating items inside arrays (info, terms, socials)
  const updateArrayItem = (key: string, index: number, field: string, value: any) => {
    const newData = { ...data };
    newData[key][index] = { ...newData[key][index], [field]: value };
    setData(newData);
  };

  /* --- CRUD OPERATIONS --- */

  const addItem = (key: string, template: any) => {
    setData({
      ...data,
      [key]: [...data[key], { ...template, id: data[key].length + 1 }]
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
        body: JSON.stringify({ contactData: data }), // Wrap to match your display page's expectation
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
        
        {/* 1. Main Header Content */}
        <section className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6 flex items-center gap-2">
            <i className="bi bi-info-circle-fill"></i> Page Header
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              value={data.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Main Title"
              className="w-full p-6 rounded-3xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 font-black text-2xl text-slate-800 shadow-inner"
            />
            <textarea
              value={data.subtitle}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              placeholder="Subtitle description..."
              rows={2}
              className="w-full p-6 rounded-3xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 text-slate-600 font-medium shadow-inner"
            />
          </div>
        </section>

        {/* 2. Contact Channels (CRUD) */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Contact Channels</h2>
            <button 
              type="button"
              onClick={() => addItem("info", { icon: "bi-chat", title: "New Label", content: "Details here" })}
              className="text-[10px] font-black bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              + ADD CHANNEL
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.info.map((item: any, idx: number) => (
              <div key={idx} className="group p-6 bg-white border border-slate-100 shadow-sm rounded-[2rem] flex items-start gap-4 relative hover:shadow-xl transition-all">
                <button 
                  type="button"
                  onClick={() => removeItem("info", idx)}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-white text-red-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all shadow-md"
                >
                  <i className="bi bi-trash-fill text-xs"></i>
                </button>
                <div className="w-14 h-14 bg-slate-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                  <i className={`bi ${item.icon} text-2xl`}></i>
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateArrayItem("info", idx, "title", e.target.value)}
                    className="text-[10px] font-black text-blue-500 uppercase tracking-widest w-full bg-transparent border-none outline-none"
                    placeholder="LABEL (E.G. OFFICE)"
                  />
                  <input
                    type="text"
                    value={item.content}
                    onChange={(e) => updateArrayItem("info", idx, "content", e.target.value)}
                    className="w-full bg-slate-50 rounded-xl p-2 outline-none font-bold text-slate-700 text-sm"
                    placeholder="Content / Address"
                  />
                  <input
                    type="text"
                    value={item.icon}
                    onChange={(e) => updateArrayItem("info", idx, "icon", e.target.value)}
                    className="text-[9px] font-mono text-slate-300 w-full bg-transparent border-none outline-none"
                    placeholder="icon-class (bi-phone)"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Emergency & CTA Bar */}
        <section className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full"></div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-8 flex items-center gap-2">
            <i className="bi bi-lightning-charge-fill"></i> Call-to-Action Card
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Display Title</label>
              <input 
                type="text" 
                value={data.cta.title} 
                onChange={(e) => handleChange("cta.title", e.target.value)}
                className="w-full p-4 bg-white/5 rounded-2xl border-none ring-1 ring-white/10 text-white font-bold focus:ring-blue-500 transition-all"
              />
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Description Text</label>
              <textarea 
                value={data.cta.text} 
                onChange={(e) => handleChange("cta.text", e.target.value)}
                rows={2}
                className="w-full p-4 bg-white/5 rounded-2xl border-none ring-1 ring-white/10 text-slate-300 text-sm focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-4 flex flex-col justify-end">
              <label className="text-[9px] font-black text-blue-400 uppercase tracking-widest ml-2">Emergency Phone Number</label>
              <input 
                type="text" 
                value={data.cta.phone} 
                onChange={(e) => handleChange("cta.phone", e.target.value)}
                className="w-full p-6 bg-blue-600 rounded-2xl border-none text-white font-black text-2xl shadow-xl shadow-blue-900/40"
              />
            </div>
          </div>
        </section>

        {/* 4. Legal & Policy (CRUD) */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Legal & Policy</h2>
            <button 
              type="button"
              onClick={() => addItem("terms", { title: "New Section", content: "", isEmergency: false })}
              className="text-[10px] font-black bg-slate-100 text-slate-600 px-5 py-2 rounded-full hover:bg-slate-200 transition-all"
            >
              + ADD LEGAL TERM
            </button>
          </div>
          <div className="space-y-4">
            {data.terms.map((term: any, idx: number) => (
              <div key={idx} className={`group p-8 rounded-[2rem] border transition-all ${term.isEmergency ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'}`}>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-6 flex-1">
                    <input
                      type="text"
                      value={term.title}
                      onChange={(e) => updateArrayItem("terms", idx, "title", e.target.value)}
                      className="bg-transparent font-black text-xl text-slate-800 outline-none border-b-2 border-transparent focus:border-blue-500 w-2/3"
                      placeholder="Title (e.g. Data Privacy)"
                    />
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={term.isEmergency} 
                        onChange={(e) => updateArrayItem("terms", idx, "isEmergency", e.target.checked)}
                        className="w-5 h-5 rounded-lg text-red-600 focus:ring-red-500 border-slate-300"
                      />
                      <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter">Emergency Highlight</span>
                    </label>
                  </div>
                  <button 
                    type="button"
                    onClick={() => removeItem("terms", idx)}
                    className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </div>
                <textarea
                  value={term.content}
                  onChange={(e) => updateArrayItem("terms", idx, "content", e.target.value)}
                  rows={4}
                  className="w-full p-6 bg-white/50 rounded-3xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-400 text-sm leading-relaxed text-slate-600 shadow-inner"
                  placeholder="Policy content..."
                />
              </div>
            ))}
          </div>
        </section>

        {/* Floating Save Bar */}
        <div className="fixed bottom-8 left-0 right-0 z-50 px-6">
          <div className="max-w-5xl mx-auto bg-white border border-slate-200 p-4 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-between px-8">
            <div className="hidden md:block">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Configuration Status</p>
              <div className="flex items-center gap-2">
                 <span className={`w-2 h-2 rounded-full ${message ? 'bg-green-500 animate-ping' : 'bg-blue-500'}`}></span>
                 <p className="text-xs text-slate-900 font-bold">{message || "Ready to sync with live site"}</p>
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full md:w-auto bg-slate-900 hover:bg-blue-600 text-white px-12 py-5 rounded-full font-black text-xs tracking-[0.2em] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {saving ? "UPLOADING..." : "PUBLISH CHANGES"}
              <i className="bi bi-cloud-arrow-up-fill text-lg"></i>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}