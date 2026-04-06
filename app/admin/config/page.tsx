"use client";

import React, { useState, useEffect } from "react";

export default function ConfigPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Get the API URL from environment variables
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // 1. Fetch current config on load
  useEffect(() => {
    fetch(`${API_URL}/api/config`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setConfig(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading config:", err);
        setMessage("❌ Could not connect to the server.");
        setLoading(false);
      });
  }, [API_URL]);

  // 2. Handle input changes
  const handleChange = (section: string, key: string, value: string | boolean) => {
    setConfig({
      ...config,
      [section]: {
        ...config[section],
        [key]: value,
      },
    });
  };

  // 3. Save to Backend
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setMessage("✅ Configuration updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        throw new Error("Save failed");
      }
    } catch (error) {
      setMessage("❌ Failed to save configuration.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse font-black text-slate-400 tracking-widest uppercase">
          Loading Settings...
        </div>
      </div>
    );
  }

  // Fallback if config failed to load
  if (!config) {
    return <div className="p-10 text-center text-red-500">{message}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">SITE CONFIGURATION</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
              Connected to: <span className="text-slate-600">{API_URL}</span>
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-[#04ceba] text-white rounded-xl font-bold uppercase tracking-widest hover:brightness-110 shadow-lg shadow-[#04ceba]/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 bg-white border-l-4 ${message.includes('✅') ? 'border-[#04ceba]' : 'border-red-500'} shadow-sm font-bold text-slate-700`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* THEME SECTION */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Visual Theme</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-2">Primary Brand Color</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={config.theme?.primaryColor || "#000000"}
                    onChange={(e) => handleChange("theme", "primaryColor", e.target.value)}
                    className="h-10 w-20 rounded cursor-pointer border-none bg-transparent"
                  />
                  <input
                    type="text"
                    value={config.theme?.primaryColor || ""}
                    onChange={(e) => handleChange("theme", "primaryColor", e.target.value)}
                    className="flex-1 border border-slate-200 p-2 rounded-lg bg-slate-50 font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-2">Base Font Size</label>
                <select 
                  value={config.theme?.fontSizeBase || "16px"}
                  onChange={(e) => handleChange("theme", "fontSizeBase", e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded-lg bg-slate-50 font-bold"
                >
                  <option value="14px">Small (14px)</option>
                  <option value="16px">Default (16px)</option>
                  <option value="18px">Large (18px)</option>
                </select>
              </div>
            </div>
          </div>

          {/* GENERAL SETTINGS SECTION */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-2">App Name</label>
                <input
                  type="text"
                  value={config.siteSettings?.title || ""}
                  onChange={(e) => handleChange("siteSettings", "title", e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded-lg bg-slate-50 font-bold text-slate-700"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="block text-xs font-bold uppercase">Maintenance Mode</span>
                  <span className="text-[10px] text-slate-400 font-bold">Locks front-end access</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.siteSettings?.maintenanceMode || false}
                  onChange={(e) => handleChange("siteSettings", "maintenanceMode", e.target.checked)}
                  className="w-6 h-6 accent-[#04ceba] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}