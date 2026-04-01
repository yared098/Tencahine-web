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
        const fetchedFaqs = Array.isArray(data) ? data : (data.faqs || []);
        setFaqs(fetchedFaqs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [apiUrl]);

  const handleAddFaq = () => {
    const newFaq: FAQItem = {
      id: Date.now(),
      question: "",
      answer: "",
    };
    setFaqs([newFaq, ...faqs]); 
  };

  const handleUpdate = (index: number, field: keyof FAQItem, value: string) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
    setFaqs(updatedFaqs);
  };

  const handleDelete = (index: number) => {
    if (window.confirm("Delete this FAQ?")) {
      setFaqs(faqs.filter((_, i) => i !== index));
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
      if (res.ok) setMessage("✅ Knowledge Base Synced!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Sync failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="text-center animate-pulse">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Loading Knowledge Base</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-12 pb-48">
      {/* HEADER SECTION */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <div>
          <div className="inline-block px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
            Support System
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 italic tracking-tighter leading-none">
            FAQ <span className="text-blue-600">Manager.</span>
          </h1>
        </div>
        <button 
          type="button" 
          onClick={handleAddFaq} 
          className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all active:scale-95"
        >
          + New Question
        </button>
      </header>

      {/* FAQ LIST */}
      <form onSubmit={handleSave} className="space-y-4 md:space-y-8">
        {faqs.map((faq, idx) => (
          <div key={faq.id} className="group relative p-6 md:p-10 bg-white border border-slate-100 rounded-[2rem] md:rounded-[3.5rem] shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500">
            
            {/* MOBILE-READY DELETE BUTTON */}
            <button 
              type="button" 
              onClick={() => handleDelete(idx)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-red-50 text-red-400 rounded-full sm:opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all z-10"
            >
              <i className="bi bi-trash3-fill"></i>
            </button>

            <div className="space-y-6 md:space-y-8">
              {/* QUESTION FIELD */}
              <div className="flex flex-col md:flex-row gap-2 md:gap-6">
                <span className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg font-black text-sm shrink-0">Q</span>
                <div className="flex-1">
                   <label className="md:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Question</label>
                   <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleUpdate(idx, "question", e.target.value)}
                    placeholder="What does the community ask?"
                    className="w-full border-none focus:ring-0 text-lg md:text-2xl font-black text-slate-800 placeholder:text-slate-200 p-0 bg-transparent leading-tight outline-none"
                  />
                </div>
              </div>
              
              {/* DIVIDER LINE */}
              <div className="h-px w-full bg-slate-50"></div>

              {/* ANSWER FIELD */}
              <div className="flex flex-col md:flex-row gap-2 md:gap-6">
                <span className="w-8 h-8 flex items-center justify-center bg-emerald-50 text-emerald-500 rounded-lg font-black text-sm shrink-0">A</span>
                <div className="flex-1">
                   <label className="md:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Answer</label>
                   <textarea
                    value={faq.answer}
                    onChange={(e) => handleUpdate(idx, "answer", e.target.value)}
                    placeholder="Provide a clear, helpful response..."
                    rows={Math.max(2, faq.answer.length / 50)} // Auto-expanding height based on content
                    className="w-full border-none focus:ring-0 text-slate-600 font-medium placeholder:text-slate-200 p-0 bg-transparent resize-none leading-relaxed text-sm md:text-base outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* PERSISTENT MOBILE-OPTIMIZED SAVING DOCK */}
        <div className="fixed bottom-6 left-0 right-0 px-4 z-50">
          <div className="max-w-md mx-auto flex flex-col gap-3">
            {message && (
              <div className="bg-slate-900 text-white p-4 rounded-2xl text-center font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                {message}
              </div>
            )}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-5 md:py-6 bg-blue-600 text-white rounded-full font-black text-lg md:text-xl shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-4 group"
            >
              {saving ? "SYNCING..." : "PUBLISH TO APP"}
              <i className="bi bi-cloud-check-fill group-hover:translate-y-[-2px] transition-transform"></i>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}