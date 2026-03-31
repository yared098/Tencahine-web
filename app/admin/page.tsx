"use client";

import React from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const managementSections = [
    {
      title: "Hero & Brand",
      desc: "Manage the main headline and download links.",
      icon: "bi-stars",
      href: "/admin/edit-cta",
      color: "bg-blue-600",
    },
    {
      title: "Our Mission",
      desc: "Edit the About section, vision, and core narrative.",
      icon: "bi-info-circle-fill",
      href: "/admin/edit-about",
      color: "bg-indigo-600",
    },
    {
      title: "Medical Services",
      desc: "Update clinical offerings and service icons.",
      icon: "bi-heart-pulse-fill",
      href: "/admin/edit-services",
      color: "bg-red-500",
    },
    {
      title: "Clinical Workforce",
      desc: "Manage professional roles and specialist types.",
      icon: "bi-people-fill",
      href: "/admin/edit-team-roles",
      color: "bg-slate-900",
    },
    {
      title: "Impact Stories",
      desc: "Edit patient testimonials and pro feedback.",
      icon: "bi-chat-quote-fill",
      href: "/admin/edit-reviews",
      color: "bg-emerald-500",
    },
    {
      title: "Ecosystem",
      desc: "Manage partner institutions and hospital logos.",
      icon: "bi-building-fill-check",
      href: "/admin/edit-partners",
      color: "bg-cyan-500",
    },
    {
      title: "Video & Media",
      desc: "Manage telehealth demo videos and promo clips.",
      icon: "bi-play-circle-fill",
      href: "/admin/edit-video",
      color: "bg-orange-500",
    },
    {
      title: "Knowledge Base",
      desc: "Manage the FAQ and support information.",
      icon: "bi-question-diamond-fill",
      href: "/admin/edit-faq",
      color: "bg-amber-500",
    },
    {
      title: "Contact Info",
      desc: "Update office address, phone, and emails.",
      icon: "bi-geo-alt-fill",
      href: "/admin/edit-contacts",
      color: "bg-rose-500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 py-6 sticky top-0 z-50">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-blue-600/30">
              T
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 leading-none tracking-tighter italic">Tenachin Admin</h1>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Control Center</span>
            </div>
          </div>
          <Link 
            href="/" 
            target="_blank"
            className="px-6 py-2 bg-slate-100 rounded-full text-xs font-black text-slate-600 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 uppercase tracking-widest"
          >
            <i className="bi bi-eye-fill"></i> View Live Site
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16">
        <header className="mb-16">
          <div className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            System Operational
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
            Welcome back, <span className="text-blue-600 italic">Admin.</span>
          </h2>
          <p className="text-slate-500 font-medium max-w-xl text-lg">
            Manage your telehealth ecosystem. Select a module below to push live updates to the Tenachin platform.
          </p>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {managementSections.map((section) => (
            <Link 
              key={section.title} 
              href={section.href}
              className="group relative bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            >
              {/* Decorative Background Blob */}
              <div className={`absolute -right-4 -top-4 w-24 h-24 ${section.color} opacity-[0.03] rounded-full group-hover:scale-[3] transition-transform duration-700`}></div>

              <div className={`w-16 h-16 ${section.color} rounded-3xl flex items-center justify-center text-white text-3xl mb-8 shadow-2xl shadow-${section.color}/20 group-hover:rotate-6 transition-transform`}>
                <i className={`bi ${section.icon}`}></i>
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors tracking-tight">
                {section.title}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                {section.desc}
              </p>

              <div className="flex items-center gap-3 text-xs font-black text-blue-600 uppercase tracking-[0.2em]">
                <span>Manage Module</span>
                <i className="bi bi-arrow-right text-lg group-hover:translate-x-2 transition-transform"></i>
              </div>
            </Link>
          ))}
        </div>

        {/* System Status Footer */}
        <footer className="mt-24 pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-8">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></span>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Global API: Online</span>
            </div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-l border-slate-200 pl-8">
              Local Context: <span className="text-slate-900 italic">Addis Ababa, ET</span>
            </div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-l border-slate-200 pl-8">
              Build v1.0.4
            </div>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            © {new Date().getFullYear()} Tenachin Telehealth
          </p>
        </footer>
      </main>
    </div>
  );
}