"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface TeamRole {
  id: number;
  icon: string;
  color: string;
  title: string;
  delay: string;
}

export default function EditTeamRoles() {
  const [roles, setRoles] = useState<TeamRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${apiUrl}/api/roles`)
      .then((res) => res.json())
      .then((data) => {
        setRoles(data.roles || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [apiUrl]);

  /* --- CRUD OPERATIONS --- */

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
    if (confirm("Remove this specialist role from the platform?")) {
      setRoles(roles.filter(role => role.id !== id));
    }
  };

  const updateRole = (index: number, field: keyof TeamRole, value: string) => {
    const updated = [...roles];
    updated[index] = { ...updated[index], [field]: value } as TeamRole;
    setRoles(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/api/roles`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roles }),
      });
      if (res.ok) setMessage("✅ Team roles synchronized!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Sync failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-300 animate-pulse uppercase tracking-widest">Loading Clinical Workforce...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 bg-slate-50 min-h-screen pb-40">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Clinical Workforce</h1>
          <p className="text-slate-500 font-medium">Manage the specialist roles displayed on the Tenachin platform.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            type="button"
            onClick={addRole}
            className="flex-1 md:flex-none px-8 py-4 bg-blue-600 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all"
          >
            + Add Specialist
          </button>
          <button 
            onClick={() => router.back()} 
            className="p-4 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-slate-900 transition-all"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      </header>

      {message && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl animate-in fade-in slide-in-from-top-8">
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {roles.map((role, idx) => (
          <div key={role.id} className="group bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col relative">
            
            {/* DELETE ACTION */}
            <button 
              type="button"
              onClick={() => deleteRole(role.id)}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
            >
              <i className="bi bi-trash3-fill text-xs"></i>
            </button>

            <div className="flex items-center gap-4 mb-6">
              {/* Icon Preview & Style Picker */}
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shrink-0 transition-transform group-hover:scale-110"
                style={{ backgroundColor: role.color }}
              >
                <i className={`bi ${role.icon}`}></i>
              </div>
              
              <div className="flex-1 space-y-2">
                 <div className="flex flex-col">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Icon Name</label>
                    <input 
                      type="text"
                      value={role.icon}
                      onChange={(e) => updateRole(idx, "icon", e.target.value)}
                      className="text-[10px] font-mono font-bold text-blue-600 bg-slate-50 border-none rounded-lg p-2 focus:ring-1 focus:ring-blue-400"
                    />
                 </div>
                 <div className="flex items-center gap-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Color</label>
                    <input 
                      type="color" 
                      value={role.color}
                      onChange={(e) => updateRole(idx, "color", e.target.value)}
                      className="w-full h-6 rounded-lg border-none bg-transparent cursor-pointer p-0"
                    />
                 </div>
              </div>
            </div>

            {/* Role Title */}
            <div className="mb-4">
              <label className="text-[9px] font-black uppercase text-blue-600 tracking-widest block mb-2 ml-1">Professional Title</label>
              <input 
                type="text"
                value={role.title}
                onChange={(e) => updateRole(idx, "title", e.target.value)}
                className="w-full text-sm font-black text-slate-800 bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Neurologist"
              />
            </div>

            {/* Delay (Animation Timing) */}
            <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
              <label className="text-[9px] font-black uppercase text-slate-300 tracking-widest">Entrance Delay</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  value={role.delay}
                  onChange={(e) => updateRole(idx, "delay", e.target.value)}
                  className="w-12 text-[10px] font-black text-slate-500 border-none p-0 bg-transparent text-right"
                />
                <span className="text-[9px] font-bold text-slate-300 uppercase">ms</span>
              </div>
            </div>
          </div>
        ))}
      </form>

      {/* Persistent Publish Button */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-xl hover:bg-blue-600 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.2)] disabled:opacity-50 flex items-center justify-center gap-4 border border-white/10"
        >
          {saving ? "SYNCING..." : "PUBLISH WORKFORCE"}
          <i className="bi bi-person-check-fill"></i>
        </button>
      </div>
    </div>
  );
}