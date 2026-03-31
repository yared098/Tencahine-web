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

  const handleChange = (path: string, value: string) => {
    const newData = { ...data };
    const keys = path.split('.');
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]];
    current[keys[keys.length - 1]] = value;
    setData(newData);
  };

  const updateArrayItem = (key: string, index: number, field: string, value: string) => {
    const newData = { ...data };
    newData[key][index][field] = value;
    setData(newData);
  };

  /* --- CRUD OPERATIONS --- */

  // ADD NEW ITEM
  const addItem = (key: string, template: any) => {
    setData({
      ...data,
      [key]: [...data[key], { ...template, id: Date.now() }]
    });
  };

  // DELETE ITEM
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
        body: JSON.stringify(data),
      });
      if (res.ok) setMessage("✅ Contact & Legal updated!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Error saving data.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse font-bold text-slate-400">Loading Contact Config...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 bg-white pb-32">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Contact & Legal</h1>
          <p className="text-slate-500 font-medium">Manage how patients reach Tenachin and view terms.</p>
        </div>
        <button onClick={() => router.back()} className="px-6 py-2 border border-slate-200 rounded-full font-bold hover:bg-slate-50 transition-all">
          Exit
        </button>
      </header>

      <form onSubmit={handleSave} className="space-y-12">
        {/* 1. Header Info */}
        <section className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner">
          <h2 className="text-sm font-black uppercase tracking-widest text-blue-600 mb-6 flex items-center gap-2">
            <i className="bi bi-info-circle"></i> Main Content
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              value={data.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Title"
              className="w-full p-4 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 font-black text-2xl text-slate-800"
            />
            <textarea
              value={data.subtitle}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              placeholder="Subtitle"
              rows={2}
              className="w-full p-4 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 text-slate-600 font-medium"
            />
          </div>
        </section>

        {/* 2. Contact Methods Grid (CRUD) */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-blue-600">Channels</h2>
            <button 
              type="button"
              onClick={() => addItem("info", { icon: "bi-chat", title: "New Channel", content: "" })}
              className="text-xs font-black bg-blue-50 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors"
            >
              + ADD CHANNEL
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.info.map((item: any, idx: number) => (
              <div key={idx} className="group p-6 bg-white border border-slate-100 shadow-sm rounded-3xl flex items-start gap-4 relative">
                <button 
                  type="button"
                  onClick={() => removeItem("info", idx)}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all"
                >
                  <i className="bi bi-trash-fill"></i>
                </button>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                  <i className={`bi ${item.icon} text-xl`}></i>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateArrayItem("info", idx, "title", e.target.value)}
                    className="text-[10px] font-black text-slate-400 uppercase mb-1 w-full bg-transparent border-none outline-none focus:text-blue-500"
                  />
                  <input
                    type="text"
                    value={item.content}
                    onChange={(e) => updateArrayItem("info", idx, "content", e.target.value)}
                    className="w-full bg-transparent border-b border-slate-50 focus:border-blue-400 outline-none font-bold text-slate-700 pb-1"
                  />
                  <input
                    type="text"
                    value={item.icon}
                    onChange={(e) => updateArrayItem("info", idx, "icon", e.target.value)}
                    className="mt-2 text-[9px] font-mono text-slate-300 w-full bg-transparent outline-none"
                    placeholder="Icon class (bi-phone)"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Emergency & CTA Bar */}
        <section className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100">
          <h2 className="text-sm font-black uppercase tracking-widest text-red-600 mb-6 flex items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill"></i> Emergency CTA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black text-red-400 uppercase tracking-tighter">Banner Title</label>
              <input 
                type="text" 
                value={data.cta.title} 
                onChange={(e) => handleChange("cta.title", e.target.value)}
                className="w-full p-4 bg-white rounded-2xl border-none ring-1 ring-red-100 mt-1 font-bold text-red-900"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-red-400 uppercase tracking-tighter">Direct Phone</label>
              <input 
                type="text" 
                value={data.cta.phone} 
                onChange={(e) => handleChange("cta.phone", e.target.value)}
                className="w-full p-4 bg-white rounded-2xl border-none ring-1 ring-red-100 mt-1 font-mono font-black text-xl text-red-600"
              />
            </div>
          </div>
        </section>

        {/* 4. Terms & Disclaimers (CRUD) */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-blue-600">Legal & Policy</h2>
            <button 
              type="button"
              onClick={() => addItem("terms", { title: "New Term", content: "", isEmergency: false })}
              className="text-xs font-black bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-slate-800 transition-colors"
            >
              + ADD LEGAL TERM
            </button>
          </div>
          <div className="space-y-4">
            {data.terms.map((term: any, idx: number) => (
              <div key={idx} className={`group p-6 rounded-3xl border transition-all ${term.isEmergency ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3 flex-1">
                     <input
                      type="text"
                      value={term.title}
                      onChange={(e) => updateArrayItem("terms", idx, "title", e.target.value)}
                      className="bg-transparent font-black text-lg text-slate-800 outline-none border-b-2 border-transparent focus:border-blue-400 w-1/2"
                    />
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={term.isEmergency} 
                        // onChange={(e) => updateArrayItem("terms", idx, "isEmergency", e.target.checked)}
                        className="rounded text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-[10px] font-black text-orange-600 uppercase">Emergency Highlight</span>
                    </label>
                  </div>
                  <button 
                    type="button"
                    onClick={() => removeItem("terms", idx)}
                    className="text-slate-300 hover:text-red-500 transition-colors ml-4"
                  >
                    <i className="bi bi-trash-fill text-xl"></i>
                  </button>
                </div>
                <textarea
                  value={term.content}
                  onChange={(e) => updateArrayItem("terms", idx, "content", e.target.value)}
                  rows={4}
                  className="w-full p-4 bg-white/60 rounded-2xl border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-400 text-sm leading-relaxed text-slate-600"
                  placeholder="Enter policy or legal text..."
                />
              </div>
            ))}
          </div>
        </section>

        {/* Floating Save Bar */}
        <div className="fixed bottom-8 left-0 right-0 z-50 px-6">
          <div className="max-w-5xl mx-auto bg-slate-900/90 backdrop-blur-md p-4 rounded-[2rem] shadow-2xl flex items-center justify-between px-8 text-white border border-white/10">
            <div className="hidden md:block">
              <span className="text-xs font-black uppercase tracking-widest text-blue-400">Tenachin CMS</span>
              <p className="text-[10px] text-slate-400 font-medium">{message || "Active edits will update the live site."}</p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 px-12 py-4 rounded-full font-black text-sm tracking-widest transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
            >
              {saving ? "SYNCING DATA..." : "PUBLISH CHANGES"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}