"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export default function EditFAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${apiUrl}/api/faq`)
      .then((res) => res.json())
      .then((data) => {
        setFaqs(data.faqs || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [apiUrl]);

  /* --- CRUD OPERATIONS --- */

  // CREATE: Add a new blank FAQ card
  const handleAddFaq = () => {
    const newFaq: FAQItem = {
      id: Date.now(), // Unique ID for React keys and backend tracking
      question: "",
      answer: "",
    };
    setFaqs([newFaq, ...faqs]); // Add to the top of the list
  };

  // UPDATE: Existing handleUpdate logic
  const handleUpdate = (index: number, field: keyof FAQItem, value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setFaqs(newFaqs);
  };

  // DELETE: Remove an FAQ card
  const handleDelete = (index: number) => {
    if (window.confirm("Are you sure you want to delete this FAQ? This cannot be undone.")) {
      const filteredFaqs = faqs.filter((_, i) => i !== index);
      setFaqs(filteredFaqs);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/api/faq`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faqs }),
      });
      if (res.ok) setMessage("✅ FAQs updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Connection error.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse">Loading FAQ Knowledge Base...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 bg-white min-h-screen pb-32">
      <header className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 italic">Frequently Asked Questions</h1>
          <p className="text-slate-500 font-medium mt-1">Manage the core information shared with the Tenachin community.</p>
        </div>
        <div className="flex gap-3">
          {/* CREATE BUTTON */}
          <button 
            type="button"
            onClick={handleAddFaq}
            className="px-6 py-2 bg-emerald-500 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all hover:-translate-y-1"
          >
            + Add New FAQ
          </button>
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <i className="bi bi-x-lg text-slate-600"></i>
          </button>
        </div>
      </header>

      <form onSubmit={handleSave} className="space-y-6">
        {faqs.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[3rem]">
            <p className="text-slate-400 font-bold">No FAQs found. Click "Add New FAQ" to get started.</p>
          </div>
        )}

        {faqs.map((faq, idx) => (
          <div 
            key={faq.id} 
            className="group relative p-6 bg-slate-50 rounded-[2rem] border border-slate-100 transition-all hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5"
          >
            {/* DELETE BUTTON */}
            <button 
              type="button"
              onClick={() => handleDelete(idx)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
              title="Delete FAQ"
            >
              <i className="bi bi-trash-fill text-sm"></i>
            </button>

            <div className="flex items-center gap-4 mb-4 pr-10">
              <span className="text-xs font-black bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-xl shadow-lg shadow-blue-600/20 shrink-0">
                {idx + 1}
              </span>
              <input
                type="text"
                value={faq.question}
                onChange={(e) => handleUpdate(idx, "question", e.target.value)}
                placeholder="Enter the question here..."
                className="flex-1 bg-transparent border-none text-lg font-black text-slate-800 focus:ring-0 placeholder:text-slate-300"
              />
            </div>

            <textarea
              value={faq.answer}
              onChange={(e) => handleUpdate(idx, "answer", e.target.value)}
              placeholder="Provide a helpful answer..."
              rows={4}
              className="w-full p-5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent leading-relaxed text-slate-600 shadow-inner font-medium"
            />
            
            <div className="flex justify-between items-center mt-3 px-2">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                Tip: Press Enter for bullet points (e.g., • Point 1)
              </p>
              <span className="text-[9px] font-mono text-slate-300 uppercase">ID: {faq.id}</span>
            </div>
          </div>
        ))}

        {/* Floating Save Bar */}
        <div className="fixed bottom-8 left-0 right-0 px-6 z-50">
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
             {message && (
              <div className="bg-slate-900 text-white px-6 py-3 rounded-full text-center font-black text-xs uppercase tracking-widest shadow-2xl border border-white/10">
                {message}
              </div>
            )}
            
            <button
              type="submit"
              disabled={saving}
              className="group relative w-full py-5 bg-blue-600 text-white rounded-[2.5rem] font-black text-xl overflow-hidden transition-all hover:bg-blue-700 shadow-2xl shadow-blue-600/40 disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {saving ? "SAVING TO CLOUD..." : "SYNC KNOWLEDGE BASE"}
                {!saving && <i className="bi bi-cloud-check-fill group-hover:scale-110 transition-transform"></i>}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}