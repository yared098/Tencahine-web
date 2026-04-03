"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Added router for protection

// 1. IMPORT ALL SUB-PAGES AS COMPONENTS
import EditFAQ from "./edit-faq/page";
import EditCTA from "./edit-cta/page";
import EditAbout from "./editabout/page";
import EditServices from "./edit-services/page";
import EditRoles from "./edit-roles/page";
import EditReviews from "./edit-reviews/page";
import EditPartners from "./edit-partners/page";
import EditContact from "./edit-contact/page";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // --- AUTH PROTECTION STATE ---
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if the token we set in login/page.js exists
    const token = localStorage.getItem("tenachin_admin_token");
    
    if (!token) {
      // If no token, bounce them back to the login page
      router.push("/admin/login");
    } else {
      // If token exists, unlock the dashboard
      setIsAuthorized(true);
    }
  }, [router]);

  // Close mobile menu whenever the tab changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  const managementSections = [
    { title: "Dashboard", icon: "bi-grid-1x2-fill", color: "bg-slate-800" },
    { title: "Hero & Brand", icon: "bi-stars", color: "bg-blue-600" },
    { title: "Our Mission", icon: "bi-info-circle-fill", color: "bg-indigo-600" },
    { title: "Medical Services", icon: "bi-heart-pulse-fill", color: "bg-red-500" },
    { title: "Clinical Workforce", icon: "bi-people-fill", color: "bg-slate-700" },
    { title: "Testimonials", icon: "bi-chat-quote-fill", color: "bg-emerald-500" },
    { title: "Ecosystem", icon: "bi-building-fill-check", color: "bg-cyan-500" },
    { title: "Frequently asked", icon: "bi-question-diamond-fill", color: "bg-amber-500" },
    { title: "Contact Info", icon: "bi-geo-alt-fill", color: "bg-rose-500" },
  ];

  // LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.removeItem("tenachin_admin_token");
    router.push("/admin/login");
  };

  // --- GATEKEEPER: Prevent UI flicker if not logged in ---
  if (!isAuthorized) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white font-black italic tracking-widest text-[10px] uppercase">Verifying Operator Credentials...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard": 
        return <DashboardHome setActiveTab={setActiveTab} sections={managementSections} />;
      case "Hero & Brand": 
        return <EditCTA />;
      case "Our Mission": 
        return <EditAbout />;
      case "Medical Services": 
        return <EditServices />;
      case "Clinical Workforce": 
        return <EditRoles />;
      case "Testimonials": 
        return <EditReviews />;
      case "Ecosystem": 
        return <EditPartners />;
      case "Frequently asked": 
        return <EditFAQ />;
      case "Contact Info": 
        return <EditContact />;
      default: 
        return <DashboardHome setActiveTab={setActiveTab} sections={managementSections} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 selection:bg-blue-100 overflow-x-hidden">
      
      {/* --- MOBILE OVERLAY --- */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] lg:relative lg:flex
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${isSidebarOpen ? "w-72" : "w-20"} 
        bg-slate-900 transition-all duration-300 h-screen flex flex-col
      `}>
        <div className="p-6 flex items-center gap-4 border-b border-white/5 h-20 shrink-0">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shrink-0 shadow-lg shadow-blue-600/40">T</div>
          {(isSidebarOpen || isMobileMenuOpen) && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="text-white font-black italic leading-none tracking-tighter">TENACHIN</h1>
              <span className="text-[9px] text-blue-400 font-black uppercase tracking-widest">Admin Panel</span>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
          {managementSections.map((section) => (
            <button
              key={section.title}
              onClick={() => setActiveTab(section.title)}
              className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all ${
                activeTab === section.title 
                ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
                : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <i className={`bi ${section.icon} text-lg`}></i>
              {(isSidebarOpen || isMobileMenuOpen) && <span className="font-bold text-sm tracking-tight">{section.title}</span>}
            </button>
          ))}
        </nav>

        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="hidden lg:flex p-6 text-slate-500 hover:text-white transition-colors border-t border-white/5 items-center justify-center"
        >
          <i className={`bi ${isSidebarOpen ? "bi-arrow-left-circle" : "bi-arrow-right-circle"} text-2xl`}></i>
        </button>
      </aside>

      {/* --- MAIN VIEWPORT --- */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 px-4 md:px-8 py-4 flex justify-between items-center h-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <i className="bi bi-list text-2xl"></i>
            </button>
            
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-blue-600 font-black tracking-tighter italic">Admin</span>
              <i className="hidden sm:inline bi bi-chevron-right text-[10px] text-slate-300"></i>
              <h2 className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.2em]">{activeTab}</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
             {/* LOGOUT BUTTON */}
             <button 
               onClick={handleLogout}
               className="text-[8px] sm:text-[10px] font-black text-red-600 bg-red-50 hover:bg-red-600 hover:text-white px-3 py-2.5 rounded-full transition-all tracking-widest uppercase"
             >
               LOGOUT <i className="bi bi-power ml-1"></i>
             </button>

             <Link href="/" target="_blank" className="text-[8px] sm:text-[10px] font-black text-blue-600 bg-blue-50 px-3 sm:px-5 py-2.5 rounded-full hover:bg-blue-600 hover:text-white transition-all tracking-widest uppercase truncate max-w-[100px] sm:max-w-none">
                LIVE <span className="hidden xs:inline">SITE</span> <i className="bi bi-box-arrow-up-right ml-1"></i>
             </Link>
             <div className="w-8 h-8 sm:w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center">
                <i className="bi bi-person-fill text-slate-400"></i>
             </div>
          </div>
        </header>

        <main className="p-4 md:p-8 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            {renderContent()}
        </main>
      </div>
    </div>
  );
}

/* --- DASHBOARD HOME VIEW --- */
function DashboardHome({ setActiveTab, sections }: any) {
  return (
    <>
      <header className="mb-8 md:mb-12">
        <div className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-4">
          System Operational
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4 leading-[1.1] md:leading-[0.9]">
          Welcome back, <br className="md:hidden" /><span className="text-blue-600 italic underline decoration-blue-200">Admin.</span>
        </h2>
        <p className="text-slate-500 font-medium max-w-xl text-base md:text-lg mt-4 md:mt-6">
          Push live updates to the Tenachin platform. Select a module below to begin editing.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-20">
        {sections.filter((s:any) => s.title !== "Dashboard").map((section: any) => (
          <button 
            key={section.title}
            onClick={() => setActiveTab(section.title)}
            className="group text-left bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all duration-300"
          >
            <div className={`w-12 h-12 md:w-14 h-14 ${section.color} rounded-2xl flex items-center justify-center text-white text-xl md:text-2xl mb-6 shadow-xl shadow-black/5 group-hover:scale-110 transition-transform`}>
              <i className={`bi ${section.icon}`}></i>
            </div>
            <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{section.title}</h3>
            <p className="text-slate-400 text-xs md:text-sm font-medium mb-4 truncate">Update and manage this section live.</p>
            <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-all">
              Launch Module <i className="bi bi-arrow-right"></i>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}