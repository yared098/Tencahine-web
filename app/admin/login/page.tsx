"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [terminalId, setTerminalId] = useState("INITIALIZING...");
  const router = useRouter();

  /**
   * API CONFIGURATION
   * Fetched from .env via NEXT_PUBLIC_LOGIN_API_URL
   */
  const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API_URL ;

  useEffect(() => {
    // Set Terminal ID based on current hostname
    if (typeof window !== "undefined") {
      setTerminalId(window.location.hostname.toUpperCase());
    }

    // Safety: Clear old service workers
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister());
      });
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Logic: calls https://dotenvx.com/docs/env-file/auth/login
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        localStorage.setItem("tenachin_admin_token", result.token);
        router.push("/admin");
      } else {
        setError(result.message || "Access Denied: Invalid Credentials");
      }
    } catch (err) {
      setError("Network Protocol Error: Check API Connection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 sm:p-6 selection:bg-blue-500/30 overflow-hidden relative">
      
      {/* --- PREMIUM BACKGROUND ARCHITECTURE --- */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-blue-600/20 blur-[100px] sm:blur-[150px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-indigo-600/15 blur-[100px] sm:blur-[150px] rounded-full animate-pulse delay-700"></div>
      
      {/* Floating Grid Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="w-full max-w-[440px] relative z-10">
        
        {/* TOP STATUS BAR */}
        <div className="flex justify-between items-center mb-8 px-2">
            <Link href="/" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-blue-400 transition-colors">
               <i className="bi bi-arrow-left mr-2"></i> Back to Site
            </Link>
            <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Server: Online</span>
            </div>
        </div>

        {/* --- BRANDING --- */}
        <div className="text-center mb-10 group">
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-[2rem] flex items-center justify-center text-white text-3xl sm:text-4xl font-black shadow-2xl border border-white/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
              T
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter italic leading-none mb-3">
            TENACHIN
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-8 bg-slate-700"></div>
            <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em]">
              Admin Core
            </p>
            <div className="h-[1px] w-8 bg-slate-700"></div>
          </div>
        </div>

        {/* --- LOGIN CARD --- */}
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-8 sm:p-12 rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">
                Access Identifier
              </label>
              <div className="relative group">
                <i className="bi bi-person-fill absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors"></i>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-5 pl-14 pr-6 text-white font-bold focus:bg-white/[0.07] focus:ring-2 focus:ring-blue-500/50 transition-all outline-none placeholder:text-slate-600"
                  placeholder="Username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">
                Security Cipher
              </label>
              <div className="relative group">
                <i className="bi bi-shield-lock-fill absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors"></i>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-5 pl-14 pr-6 text-white font-bold focus:bg-white/[0.07] focus:ring-2 focus:ring-blue-500/50 transition-all outline-none placeholder:text-slate-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-black px-6 py-4 rounded-2xl flex items-center gap-3 animate-[shake_0.5s_ease-in-out]">
                <i className="bi bi-exclamation-octagon-fill text-lg"></i>
                <span className="uppercase tracking-wide">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-3xl shadow-2xl shadow-blue-900/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-12"></div>
              <span className="relative flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs">
                {loading ? "Syncing..." : "Initialize Auth"} 
                {!loading && <i className="bi bi-cpu-fill text-lg"></i>}
              </span>
            </button>
          </form>
        </div>

        {/* FOOTER INFO */}
        <div className="mt-10 text-center space-y-4">
            <div className="flex justify-center gap-6">
                <i className="bi bi-fingerprint text-slate-800 text-2xl"></i>
                <i className="bi bi-safe2 text-slate-800 text-2xl"></i>
                <i className="bi bi-incognito text-slate-800 text-2xl"></i>
            </div>
            <p className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.3em]">
              Authorized Personnel Only <br />
              <span className="opacity-50">Terminal ID: {terminalId}</span>
            </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}