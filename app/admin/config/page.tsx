"use client";

import React, { useState, useEffect } from "react";

export default function ConfigPage() {
  const [config, setConfig] = useState<any>(null);
  const [adminData, setAdminData] = useState<any>(null);
  const [confirmPasswords, setConfirmPasswords] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [configRes, adminRes] = await Promise.all([
          fetch(`${API_URL}/api/config`),
          fetch(`${API_URL}/api/admin`)
        ]);
        if (!configRes.ok || !adminRes.ok) throw new Error("Failed to fetch data");
        const configJson = await configRes.json();
        const adminJson = await adminRes.json();

        setConfig(configJson.configData || configJson);
        setAdminData(adminJson);
        setLoading(false);
      } catch (err) {
        setMessage("❌ Could not connect to the server.");
        setLoading(false);
      }
    };
    loadAllData();
  }, [API_URL]);

  const handleChange = (section: string, key: string, value: string | boolean, subKey?: string) => {
    if (subKey) {
      setConfig((prev: any) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: {
            ...prev[section][key],
            [subKey]: value
          }
        }
      }));
    } else {
      setConfig((prev: any) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value
        }
      }));
    }
  };

  const handleAdminChange = (index: number, key: string, value: string) => {
    const updatedUsers = [...adminData.users];
    updatedUsers[index] = { ...updatedUsers[index], [key]: value };
    setAdminData({ ...adminData, users: updatedUsers });
  };

  const addNewAdmin = () => {
    const newUser = { username: "", password: "", role: "admin" };
    setAdminData({ ...adminData, users: [...adminData.users, newUser] });
  };

  const deleteAdmin = (index: number) => {
    if (index === 0) return; 
    const updatedUsers = adminData.users.filter((_: any, i: number) => i !== index);
    setAdminData({ ...adminData, users: updatedUsers });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const [configSave, adminSave] = await Promise.all([
        fetch(`${API_URL}/api/config`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(config),
        }),
        fetch(`${API_URL}/api/admin`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(adminData),
        })
      ]);

      if (configSave.ok && adminSave.ok) {
        setMessage("✅ Changes Published Successfully!");
        setConfirmPasswords({});
        setTimeout(() => setMessage(""), 3000);
      } else {
        throw new Error("Save failed");
      }
    } catch (error) {
      setMessage("❌ Failed to publish changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-black text-slate-400">
      <div className="animate-bounce uppercase tracking-tighter">Syncing Master Data...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-12 pb-40 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter italic uppercase">Master Control</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Global Configuration</p>
          </div>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="hidden md:block px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? "PUBLISHING..." : "Publish Changes"}
          </button>
        </header>

        {message && (
          <div className="mb-8 p-6 rounded-3xl border-2 bg-emerald-50 border-emerald-200 text-emerald-700 font-black text-sm text-center animate-in fade-in zoom-in duration-300">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. BRAND COLORS (PRIMARY & ACCENT ONLY) */}
            <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-8 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span> Brand Identity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ColorInput label="Primary Color" value={config.theme.primaryColor} onChange={(v) => handleChange("theme", "primaryColor", v)} />
                {/* Secondary Color removed here to prevent sync mismatch */}
                <ColorInput label="Accent Color" value={config.theme.accentColor} onChange={(v) => handleChange("theme", "accentColor", v)} />
              </div>
            </section>

            {/* 2. BADGE STYLING */}
            <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-8 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Badge Typography
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ColorInput label="Text Color" value={config.theme.badge.textColor} onChange={(v) => handleChange("theme", "badge", v, "textColor")} />
                <TextInput label="Font Size" value={config.theme.badge.fontSize} onChange={(v) => handleChange("theme", "badge", v, "fontSize")} />
                <TextInput label="Font Weight" value={config.theme.badge.fontWeight} onChange={(v) => handleChange("theme", "badge", v, "fontWeight")} />
                <TextInput label="Letter Spacing" value={config.theme.badge.letterSpacing} onChange={(v) => handleChange("theme", "badge", v, "letterSpacing")} />
              </div>
            </section>

            {/* 3. TITLE STYLING */}
            <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-8 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Title Typography
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ColorInput label="Main Color" value={config.theme.title.mainColor} onChange={(v) => handleChange("theme", "title", v, "mainColor")} />
                <ColorInput label="Highlight Color" value={config.theme.title.highlightColor} onChange={(v) => handleChange("theme", "title", v, "highlightColor")} />
                <TextInput label="Font Size" value={config.theme.title.fontSize} onChange={(v) => handleChange("theme", "title", v, "fontSize")} />
                <TextInput label="Font Weight" value={config.theme.title.fontWeight} onChange={(v) => handleChange("theme", "title", v, "fontWeight")} />
              </div>
            </section>

            {/* 4. CORE LAYOUT */}
            <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Layout & Base Fonts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ColorInput label="Background" value={config.theme.backgroundColor} onChange={(v) => handleChange("theme", "backgroundColor", v)} />
                <ColorInput label="Card Color" value={config.theme.cardColor} onChange={(v) => handleChange("theme", "cardColor", v)} />
                <TextInput label="Base Font Size" value={config.theme.fontSizeBase} onChange={(v) => handleChange("theme", "fontSizeBase", v)} />
                <TextInput label="Header Weight" value={config.theme.headerFontWeight} onChange={(v) => handleChange("theme", "headerFontWeight", v)} />
              </div>
            </section>

            <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-8">Metadata</h2>
              <div>
                <label className="block text-[10px] font-black uppercase mb-3 text-slate-400">App Name</label>
                <input type="text" value={config.siteSettings.title} onChange={(e) => handleChange("siteSettings", "title", e.target.value)} className="w-full bg-slate-50 border-none ring-1 ring-slate-100 p-5 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <section className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl text-white">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Credentials</h2>
                <button onClick={addNewAdmin} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-all text-[9px] font-black uppercase text-slate-900">New Account</button>
              </div>
              <div className="space-y-10">
                {adminData.users.map((user: any, index: number) => (
                  <div key={index} className="relative p-6 bg-white/5 rounded-[2rem] border border-white/10 group">
                    {index !== 0 && (
                      <button onClick={() => deleteAdmin(index)} className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-xl"><i className="bi bi-x-lg text-[10px] font-bold"></i></button>
                    )}
                    <div className="space-y-4">
                      <input placeholder="Email" type="email" value={user.username} onChange={(e) => handleAdminChange(index, "username", e.target.value)} className="w-full bg-slate-800 border-none ring-1 ring-white/10 p-3 rounded-xl font-bold text-sm text-white focus:ring-emerald-500 transition-all" />
                      <input placeholder="New Password" type="password" value={user.password} onChange={(e) => handleAdminChange(index, "password", e.target.value)} className="w-full bg-slate-800 border-none ring-1 ring-white/10 p-3 rounded-xl font-bold text-sm text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className={`p-8 rounded-[3rem] border-2 transition-all ${config.siteSettings.maintenanceMode ? 'bg-red-500 border-red-400 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-sm'}`}>
              <div className="flex items-center justify-between">
                <span className="block text-[10px] font-black uppercase tracking-widest">Maintenance Mode</span>
                <input type="checkbox" checked={config.siteSettings.maintenanceMode} onChange={(e) => handleChange("siteSettings", "maintenanceMode", e.target.checked)} className="w-14 h-7 appearance-none bg-slate-200 checked:bg-slate-900 rounded-full relative transition-all cursor-pointer before:content-[''] before:absolute before:w-5 before:h-5 before:bg-white before:rounded-full before:top-1 before:left-1 checked:before:left-8 before:transition-all shadow-inner" />
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-white/80 backdrop-blur-xl border border-slate-200 p-4 rounded-3xl shadow-2xl flex items-center justify-between z-50">
        <div className="px-4"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">Config<br/>Modified</p></div>
        <button onClick={handleSave} disabled={saving} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all">
          {saving ? "SAVING..." : "Publish the Update"}
        </button>
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
  return (
    <div className="space-y-3">
      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{label}</label>
      <input 
        type="text" 
        value={value || ""} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full bg-slate-50 border-none ring-1 ring-slate-100 p-4 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 transition-all text-xs outline-none" 
      />
    </div>
  );
}

function ColorInput({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
  return (
    <div className="space-y-3">
      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{label}</label>
      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-[1.5rem] ring-1 ring-slate-100 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
        <input type="color" value={value || "#000000"} onChange={(e) => onChange(e.target.value)} className="h-10 w-14 rounded-xl cursor-pointer bg-transparent border-none" />
        <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} className="flex-1 bg-transparent border-none p-2 font-mono text-xs font-bold uppercase outline-none" />
      </div>
    </div>
  );
}