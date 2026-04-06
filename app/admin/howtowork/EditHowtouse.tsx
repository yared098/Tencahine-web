"use client";

import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function EditHowtouse() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Helper to ensure links are embed-ready
  const formatYoutubeLink = (url: string) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
    else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
    else if (url.includes("embed/")) return url;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  useEffect(() => {
    fetch(`${apiUrl}/api/howtouse`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => toast.error("Failed to load data"));
  }, [apiUrl]);

  const handleSave = async () => {
    setSaving(true);
    const loadingToast = toast.loading("Publishing to Tenachin Live...");
    
    try {
      const res = await fetch(`${apiUrl}/api/howtouse`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          videoUrl: formatYoutubeLink(data.videoUrl)
        }),
      });
      if (res.ok) {
        toast.success("Changes are now live!", { id: loadingToast });
      } else throw new Error();
    } catch (error) {
      toast.error("Network error. Try again.", { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  // --- Step Management Logic ---
  const updateStep = (index: number, field: string, value: any) => {
    const newSteps = [...data.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setData({ ...data, steps: newSteps });
  };

  const addNewStep = () => {
    const newStep = {
      step: String(data.steps.length + 1).padStart(2, '0'),
      title: "New Process Step",
      icon: "bi-gear",
      type: "text",
      content: "Describe the process here..."
    };
    setData({ ...data, steps: [...data.steps, newStep] });
    toast.success("New step added to end");
  };

  const deleteStep = (index: number) => {
    const newSteps = data.steps.filter((_: any, i: number) => i !== index);
    setData({ ...data, steps: newSteps });
    toast.error("Step deleted");
  };

  // --- List Item Logic ---
  const addListItem = (stepIdx: number) => {
    const newSteps = [...data.steps];
    newSteps[stepIdx].items = [...(newSteps[stepIdx].items || []), "New Entry"];
    setData({ ...data, steps: newSteps });
  };

  const removeListItem = (stepIdx: number, itemIdx: number) => {
    const newSteps = [...data.steps];
    newSteps[stepIdx].items = newSteps[stepIdx].items.filter((_: any, i: number) => i !== itemIdx);
    setData({ ...data, steps: newSteps });
  };

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-40 font-sans">
      <Toaster position="bottom-center" />
      
      {/* Dashboard Header */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-8 py-5">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">Admin Console</span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">Tenachin Process Editor</h1>
          </div>
          <button 
            onClick={addNewStep}
            className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
          >
            <i className="bi bi-plus-lg"></i> Add New Step
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 mt-12 space-y-12">
        
        {/* 1. Header & Video Section */}
        <section className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-4">General Info</h3>
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Badge</label>
                  <input className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold mt-1" value={data.header.badge} onChange={(e) => setData({...data, header: {...data.header, badge: e.target.value}})} />
               </div>
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Title</label>
                  <input className="w-full p-4 bg-slate-50 rounded-2xl border-none font-black text-lg mt-1" value={data.header.title} onChange={(e) => setData({...data, header: {...data.header, title: e.target.value}})} />
               </div>
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Description</label>
                  <textarea className="w-full p-4 bg-slate-50 rounded-2xl border-none text-sm leading-relaxed mt-1 h-24" value={data.header.description} onChange={(e) => setData({...data, header: {...data.header, description: e.target.value}})} />
               </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-4">Video Link</h3>
              <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-inner relative group">
                <iframe src={formatYoutubeLink(data.videoUrl)} className="w-full h-full" />
              </div>
              <input className="w-full p-4 bg-slate-50 rounded-2xl border-none font-mono text-[11px] text-blue-600" value={data.videoUrl} onChange={(e) => setData({...data, videoUrl: e.target.value})} placeholder="YouTube Embed URL" />
            </div>
          </div>
        </section>

        {/* 2. Dynamic Steps Section */}
        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">Interactive Step Modules</h3>
          
          {data.steps.map((step: any, idx: number) => (
            <div key={idx} className="group bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <input 
                    className="w-12 h-12 bg-slate-900 text-white rounded-2xl text-center font-black text-lg shadow-lg border-none focus:ring-2 focus:ring-blue-500" 
                    value={step.step} 
                    onChange={(e) => updateStep(idx, "step", e.target.value)}
                  />
                  <div>
                    <input 
                      className="text-lg font-black text-slate-900 border-none p-0 focus:ring-0 bg-transparent" 
                      value={step.title} 
                      onChange={(e) => updateStep(idx, "title", e.target.value)}
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <i className={`bi ${step.icon} text-blue-600 text-xs`}></i>
                      <input className="text-[10px] font-mono text-slate-400 border-none p-0 bg-transparent focus:ring-0" value={step.icon} onChange={(e) => updateStep(idx, "icon", e.target.value)} />
                    </div>
                  </div>
                </div>
                <button onClick={() => deleteStep(idx)} className="opacity-0 group-hover:opacity-100 p-3 text-slate-300 hover:text-red-500 transition-all">
                  <i className="bi bi-trash3-fill"></i>
                </button>
              </div>

              {/* Step Type Content Switcher */}
              <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                {step.type === "text" && (
                  <textarea 
                    className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-600 leading-relaxed" 
                    value={step.description || step.content} 
                    onChange={(e) => updateStep(idx, step.description ? "description" : "content", e.target.value)}
                    rows={3}
                  />
                )}

                {step.type === "list" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {step.items.map((item: string, i: number) => (
                      <div key={i} className="flex bg-white p-2 rounded-xl border border-slate-200">
                        <input 
                          className="flex-1 bg-transparent border-none text-xs font-bold px-2 focus:ring-0" 
                          value={item} 
                          onChange={(e) => {
                            const newItems = [...step.items];
                            newItems[i] = e.target.value;
                            updateStep(idx, "items", newItems);
                          }}
                        />
                        <button onClick={() => removeListItem(idx, i)} className="p-1 text-slate-300 hover:text-red-500"><i className="bi bi-x"></i></button>
                      </div>
                    ))}
                    <button onClick={() => addListItem(idx)} className="border-2 border-dashed border-slate-200 rounded-xl py-2 text-[10px] font-black text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all">
                      + ADD ITEM
                    </button>
                  </div>
                )}

                {step.type === "guarantee" && (
                  <div className="flex gap-10">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase">Emergency</label>
                      <input className="block bg-transparent border-none text-xl font-black text-red-600 focus:ring-0 p-0" value={step.emergency} onChange={(e) => updateStep(idx, "emergency", e.target.value)} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase">General</label>
                      <input className="block bg-transparent border-none text-xl font-black text-blue-600 focus:ring-0 p-0" value={step.general} onChange={(e) => updateStep(idx, "general", e.target.value)} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Global Add Button */}
        <button 
          onClick={addNewStep}
          className="w-full py-8 border-4 border-dashed border-slate-200 rounded-[3rem] text-slate-300 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center gap-2 group"
        >
          <i className="bi bi-plus-circle text-2xl group-hover:scale-110 transition-transform"></i>
          <span className="font-black text-xs uppercase tracking-[0.3em]">Insert New Process Step</span>
        </button>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-10 left-0 right-0 z-50 flex justify-center px-6">
        <div className="bg-slate-900/90 backdrop-blur-xl p-4 rounded-full border border-white/10 shadow-2xl flex items-center gap-6">
          <div className="px-6 border-r border-white/10 hidden sm:block">
            <p className="text-white font-black text-xs">Tenachin v1.2</p>
            <p className="text-slate-400 text-[10px]">Changes will be visible to all patients</p>
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-blue-600 text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-500 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <i className="bi bi-send-fill"></i>}
            {saving ? "Syncing..." : "Publish Content"}
          </button>
        </div>
      </div>
    </div>
  );
}