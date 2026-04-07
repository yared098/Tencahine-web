"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ShieldCheck, Cpu, ArrowLeft, Lock, User } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [terminalId, setTerminalId] = useState("INITIALIZING...");
  const router = useRouter();

  // Uses the environment variable from your .env file
  // Fallback to localhost if the env variable is missing
  const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    setTerminalId(window.location.hostname.toUpperCase());
    
    /**
     * FIX: Rebuild Loop
     * Service workers are only cleared in production to avoid disrupting 
     * the Next.js development HMR (Hot Module Replacement).
     */
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
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
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server response protocol mismatch (Non-JSON).");
      }

      const result = await res.json();

      if (res.ok && result.success) {
        // Store token for the AdminDashboard to verify
        localStorage.setItem("tenachin_admin_token", result.token);
        router.push("/admin");
      } else {
        setError(result.message || "Access Denied: Invalid Credentials");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message === "Failed to fetch" 
        ? "Network Error: API Link Offline" 
        : err.message || "Protocol Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 selection:bg-blue-500/30 overflow-hidden relative font-sans">
      
      {/* --- ANIMATED BACKGROUND ELEMENTS --- */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full animate-pulse delay-1000"></div>
      
      {/* Subtle Grid */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>

      <div className="w-full max-w-[420px] relative z-10">
        
        {/* HEADER NAVIGATION */}
        <div className="flex justify-between items-center mb-10 px-2">
            <Link href="/" className="group flex items-center text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all">
               <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Terminal
            </Link>
            <div className="flex items-center gap-2 bg-slate-900/80 border border-white/5 py-1.5 px-3 rounded-full">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">System: Encrypted</span>
            </div>
        </div>

        {/* --- BRANDING --- */}
        <div className="text-center mb-10">
          <div className="relative inline-flex mb-4 group">
            <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl border border-white/10 -rotate-3 group-hover:rotate-0 transition-all duration-500">
              <ShieldCheck size={40} strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-1">TENACHIN</h1>
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.5em] opacity-80">Central Administration</p>
        </div>

        {/* --- LOGIN CARD --- */}
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group/card">
          {/* Animated Scan Line */}
          {loading && <div className="absolute inset-x-0 h-[2px] bg-blue-500/50 shadow-[0_0_15px_blue] z-20 animate-scan"></div>}
          
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">ID Identifier</label>
              <div className="relative group/input">
                <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white font-medium focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none placeholder:text-slate-700"
                  placeholder="Username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Access Cipher</label>
              <div className="relative group/input">
                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-14 pr-14 text-white font-medium focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none placeholder:text-slate-700"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/5 border border-red-500/20 text-red-400 text-[11px] font-bold px-4 py-3 rounded-xl flex items-center gap-3 animate-shake">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                <span className="uppercase tracking-tight">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98]"
            >
              <span className="relative flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                {loading ? "Authenticating..." : "login "} 
                {!loading && <Cpu size={16} />}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
            </button>
          </form>
        </div>

        {/* FOOTER */}
        <div className="mt-8 text-center space-y-4">
           <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">
             Protocol 4.4.0 <br />
             <span className="opacity-40 font-mono">NODE: {terminalId}</span>
           </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-scan { animation: scan 2s linear infinite; }
        .animate-shimmer { animation: shimmer 1.5s infinite; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}
