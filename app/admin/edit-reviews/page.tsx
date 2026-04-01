"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Review {
  id: string | number;
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
  const endpoint = `${apiUrl}/api/testimonials`;

  useEffect(() => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        const key = Object.keys(data).find(k => Array.isArray(data[k]));
        setReviews(key ? data[key] : Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [endpoint]);

  const addReview = () => {
    const newReview: Review = {
      id: Date.now().toString(),
      name: "New Contributor",
      location: "Addis Ababa, Ethiopia",
      role: "Patient / Health Professional",
      text: "Share the impact here..."
    };
    setReviews(prev => [newReview, ...prev]);
  };

  // --- THE FIX IS HERE ---
  const deleteReview = (id: string | number) => {
    if (window.confirm("Permanently delete this impact story?")) {
      setReviews((prevReviews) => {
        // Convert both to string to avoid number vs string mismatch
        return prevReviews.filter((review) => review.id.toString() !== id.toString());
      });
      setMessage("📍 Removed locally. Click SYNC to save to database.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const updateReview = (id: string | number, field: keyof Review, value: string) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id.toString() === id.toString() ? { ...review, [field]: value } : review
      )
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testimonials: reviews }),
      });
      if (res.ok) setMessage("✅ Published Successfully");
      else setMessage("❌ Server Error");
    } catch (err) {
      setMessage("❌ Connection Error");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) return <div className="p-20 text-center font-black">LOADING...</div>;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-40">
      <div className="bg-white border-b p-6 sticky top-0 z-30 flex justify-between items-center">
        <h1 className="text-2xl font-black">Impact <span className="text-blue-600">Stories.</span></h1>
        <div className="flex gap-2">
          <button onClick={addReview} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase">+ Create</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 mt-8">
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="group relative p-8 bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
              
              {/* DELETE BUTTON: Added z-20 and made it always visible on small screens */}
              <button 
                type="button"
                onClick={() => deleteReview(review.id)}
                className="absolute top-6 right-6 w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center z-20 sm:opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all"
              >
                <i className="bi bi-trash3-fill"></i>
              </button>

              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase">Name</label>
                    <input 
                      value={review.name} 
                      onChange={(e) => updateReview(review.id, "name", e.target.value)}
                      className="w-full p-3 bg-slate-50 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase">Location</label>
                    <input 
                      value={review.location} 
                      onChange={(e) => updateReview(review.id, "location", e.target.value)}
                      className="w-full p-3 bg-slate-50 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Designation</label>
                  <input 
                    value={review.role} 
                    onChange={(e) => updateReview(review.id, "role", e.target.value)}
                    className="w-full p-3 bg-slate-50 rounded-xl mt-1 outline-none font-bold text-blue-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Message</label>
                  <textarea 
                    value={review.text} 
                    onChange={(e) => updateReview(review.id, "text", e.target.value)}
                    rows={3}
                    className="w-full p-4 bg-slate-50 rounded-2xl mt-1 outline-none italic text-slate-600 resize-none"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Floating Action Bar */}
          <div className="fixed bottom-8 left-0 right-0 z-50 flex flex-col items-center gap-4">
            {message && <div className="bg-slate-900 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">{message}</div>}
            <button type="submit" disabled={saving} className="w-64 py-4 bg-blue-600 text-white rounded-full font-black shadow-2xl hover:scale-105 transition-transform active:scale-95 disabled:opacity-50">
              {saving ? "SYNCING..." : "SYNC TO LIVE SITE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}