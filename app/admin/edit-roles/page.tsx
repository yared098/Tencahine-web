"use client";

import React, { useState, useEffect } from "react";

interface TeamRole {
  id: number;
  icon: string;
  color: string;
  title: string;
  delay: string;
}

interface TeamHeader {
  badge: string;
  title: string;
  highlightText: string;
  description: string;
}

export default function EditTeamRoles() {
  const [roles, setRoles] = useState<TeamRole[]>([]);
  const [header, setHeader] = useState<TeamHeader>({
    badge: "",
    title: "",
    highlightText: "",
    description: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // 1. LOAD DATA
  useEffect(() => {
    fetch(`${apiUrl}/api/team_roles`)
      .then(async (res) => {
        if (!res.ok) {
          const errorBody = await res.text();
          throw new Error(`Error ${res.status}: ${errorBody}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.header) setHeader(data.header);
        
        if (data.roles) {
          setRoles(data.roles);
        } else if (Array.isArray(data)) {
          setRoles(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  /* --- OPERATIONS --- */

  const updateHeader = (field: keyof TeamHeader, value: string) => {
    setHeader(prev => ({ ...prev, [field]: value }));
  };

  const addRole = () => {
    const newRole: TeamRole = {
      id: Date.now(),
      icon: "bi-person-badge",
      color: "#3b82f6",
      title: "New Specialist",
      delay: "100"
    };
    setRoles([...roles, newRole]);
  };

  const deleteRole = (id: number) => {
    if (confirm("Remove this specialist role?")) {
      setRoles(roles.filter(role => role.id !== id));
    }
  };

  const updateRole = (index: number, field: keyof TeamRole, value: string) => {
    const updated = [...roles];
    updated[index] = { ...updated[index], [field]: value };
    setRoles(updated);
  };

  // 2. SAVE DATA
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("⏳ Syncing...");

    try {
      const res = await fetch(`${apiUrl}/api/team_roles`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ header, roles }), 
      });

      if (res.ok) {
        setMessage("✅ Changes synchronized!");
      } else {
        const errData = await res.json();
        setMessage(`❌ Save failed: ${errData.message || res.status}`);
      }
    } catch (err) {
      setMessage("❌ Network Error");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) return (
    <div className="p-20 text-center font-black text-slate-300 animate-pulse uppercase tracking-widest">
      Loading Clinical Workforce...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Clinical Workforce</h1>
          <p className="text-slate-500 text-sm font-medium">Update specialized medical roles and section headers.</p>
        </div>
        <button 
          type="button"
          onClick={addRole}
          className="px-8 py-4 bg-blue-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-xl transition-all"
        >
          + Add Specialist
        </button>
      </header>

      {message && (
        <div className="fixed top-24 right-10 z-[100] px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-2xl">
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-12 pb-40">
        
        {/* SECTION: HEADER EDITING */}
        <section className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200/60">
          <h2 className="text-xs font-black uppercase text-blue-600 tracking-[0.3em] mb-8 flex items-center gap-2">
            <i className="bi bi-layout-text-window-reverse"></i> Section Header
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1">Badge Text</label>
                <input 
                  type="text"
                  value={header.badge}
                  onChange={(e) => updateHeader("badge", e.target.value)}
                  className="w-full text-sm font-bold bg-white border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Expertise You Can Trust"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1">Main Title</label>
                <input 
                  type="text"
                  value={header.title}
                  onChange={(e) => updateHeader("title", e.target.value)}
                  className="w-full text-sm font-bold bg-white border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Our Renowned"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1">Highlight Text (Primary Color)</label>
                <input 
                  type="text"
                  value={header.highlightText}
                  onChange={(e) => updateHeader("highlightText", e.target.value)}
                  className="w-full text-sm font-bold bg-white border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Clinical Team"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1">Description Paragraph</label>
              <textarea 
                value={header.description}
                onChange={(e) => updateHeader("description", e.target.value)}
                className="w-full h-[195px] text-sm font-medium bg-white border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 leading-relaxed"
                placeholder="Enter section description..."
              />
            </div>
          </div>
        </section>

        {/* SECTION: ROLES GRID */}
        <div>
          <h2 className="text-xs font-black uppercase text-blue-600 tracking-[0.3em] mb-8 flex items-center gap-2">
            <i className="bi bi-people-fill"></i> Specialist Roles ({roles.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role, idx) => (
              <div key={role.id} className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative">
                <button 
                  type="button"
                  onClick={() => deleteRole(role.id)}
                  className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <i className="bi bi-trash3-fill text-sm"></i>
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shrink-0"
                    style={{ backgroundColor: role.color }}
                  >
                    <i className={`bi ${role.icon}`}></i>
                  </div>
                  
                  <div className="flex-1">
                    <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest block mb-1">Icon & Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={role.icon}
                        onChange={(e) => updateRole(idx, "icon", e.target.value)}
                        className="flex-1 text-[10px] font-mono font-bold text-blue-600 bg-slate-50 border-none rounded-lg p-2"
                      />
                      <input 
                        type="color" 
                        value={role.color}
                        onChange={(e) => updateRole(idx, "color", e.target.value)}
                        className="w-8 h-8 rounded-lg border-none bg-transparent cursor-pointer p-0"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black uppercase text-blue-600 tracking-widest block mb-2 ml-1">Professional Title</label>
                    <input 
                      type="text"
                      value={role.title}
                      onChange={(e) => updateRole(idx, "title", e.target.value)}
                      className="w-full text-sm font-black text-slate-800 bg-slate-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-between items-center bg-slate-50/50 p-3 rounded-xl">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Delay (ms)</label>
                    <input 
                      type="text"
                      value={role.delay}
                      onChange={(e) => updateRole(idx, "delay", e.target.value)}
                      className="w-12 text-[10px] font-black text-slate-500 border-none bg-transparent text-right p-0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>

      {/* FLOATING SAVE BAR */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3 border border-white/10"
        >
          {saving ? "SAVING CHANGES..." : "PUBLISH WORKFORCE"}
          <i className="bi bi-cloud-arrow-up-fill text-lg"></i>
        </button>
      </div>
    </div>
  );
}