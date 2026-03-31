"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Review {
  id: number;
  name: string;
  location: string;
  role: string;
  text: string;
}

export default function EditReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${apiUrl}/api/reviews`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [apiUrl]);

  /* --- CRUD OPERATIONS --- */

  const addReview = () => {
    const newReview: Review = {
      id: Date.now(),
      name: "New Patient/Professional",
      location: "Addis Ababa, Ethiopia",
      role: "Patient / Health Professional",
      text: "Share the impact Tenachin has made here..."
    };
    setReviews([newReview, ...reviews]);
  };

  const deleteReview = (index: number) => {
    if (confirm("Permanently delete this impact story?")) {
      setReviews(reviews.filter((_, i) => i !== index));
    }
  };

  const updateReview = (index: number, field: keyof Review, value: string) => {
    const updated = [...reviews];
    updated[index] = { ...updated[index], [field]: value } as Review;
    setReviews(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/api/reviews`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviews }),
      });
      if (res.ok) setMessage("✅ Patient & Professional reviews updated!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Error saving reviews.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-300 animate-pulse uppercase tracking-widest">Loading Testimonials...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 bg-white min-h-screen pb-40">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Impact Stories</h1>
          <p className="text-slate-500 font-medium mt-2">Manage patient testimonials and professional feedback.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            type="button"
            onClick={addReview}
            className="flex-1 md:flex-none px-8 py-4 bg-emerald-500 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 transition-all"
          >
            + Add Story
          </button>
          <button 
            onClick={() => router.back()}
            className="p-4 bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      </header>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review, idx) => (
            <div key={review.id} className="group relative p-8 bg-slate-50 rounded-[3rem] border border-slate-100 flex flex-col gap-6 hover:shadow-2xl hover:shadow-blue-500/5 transition-all hover:bg-white hover:border-blue-100">
              
              {/* DELETE ACTION */}
              <button 
                type="button"
                onClick={() => deleteReview(idx)}
                className="absolute top-8 right-8 w-10 h-10 bg-red-50 text-red-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all shadow-lg"
              >
                <i className="bi bi-trash3-fill"></i>
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <i className="bi bi-quote text-white text-2xl"></i>
                </div>
                <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">Legacy ID</span>
                    <span className="text-[10px] font-mono text-blue-600 font-bold uppercase">{review.id}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-blue-600 uppercase ml-2 tracking-widest">Full Name / Age</label>
                  <input 
                    type="text"
                    value={review.name}
                    onChange={(e) => updateReview(idx, "name", e.target.value)}
                    className="w-full p-4 bg-white border-none rounded-2xl font-black text-slate-800 focus:ring-2 focus:ring-blue-500 shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-blue-600 uppercase ml-2 tracking-widest">Location</label>
                  <input 
                    type="text"
                    value={review.location}
                    onChange={(e) => updateReview(idx, "location", e.target.value)}
                    className="w-full p-4 bg-white border-none rounded-2xl font-black text-slate-800 focus:ring-2 focus:ring-blue-500 shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Professional Designation</label>
                <input 
                  type="text"
                  value={review.role}
                  onChange={(e) => updateReview(idx, "role", e.target.value)}
                  className="w-full p-4 bg-white border-none rounded-2xl font-bold text-blue-600 focus:ring-2 focus:ring-blue-500 shadow-sm"
                  placeholder="e.g. Cardiologist / Grateful Mother"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">The Narrative</label>
                <textarea 
                  value={review.text}
                  onChange={(e) => updateReview(idx, "text", e.target.value)}
                  rows={5}
                  className="w-full p-6 bg-white border-none rounded-[2rem] text-slate-600 font-medium leading-relaxed italic focus:ring-2 focus:ring-blue-500 shadow-inner"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-10 left-0 right-0 z-50 px-6">
          <div className="max-w-xl mx-auto flex flex-col gap-4">
            {message && (
              <div className="bg-slate-900 text-white p-4 rounded-2xl text-center font-black text-xs uppercase tracking-widest shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-4">
                {message}
              </div>
            )}
            
            <button
              type="submit"
              disabled={saving}
              className="w-full py-6 bg-blue-600 text-white rounded-[2.5rem] font-black text-xl hover:bg-blue-700 transition-all shadow-[0_20px_50px_rgba(59,130,246,0.3)] disabled:opacity-50 flex items-center justify-center gap-4"
            >
              {saving ? "SYNCING DATA..." : "PUBLISH STORIES"}
              <i className="bi bi-stars"></i>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}