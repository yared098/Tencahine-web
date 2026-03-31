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
      color: "bg-blue-500",
    },
    {
      title: "Ecosystem",
      desc: "Manage partner institutions and hospital logos.",
      icon: "bi-building-check",
      href: "/admin/edit-partners",
      color: "bg-cyan-500",
    },
    {
      title: "Strategy",
      desc: "Edit Mission, Vision, and Core Values.",
      icon: "bi-compass",
      href: "/admin/edit-features",
      color: "bg-indigo-500",
    },
    {
      title: "Medical Services",
      desc: "Update clinical offerings and service icons.",
      icon: "bi-heart-pulse",
      href: "/admin/edit-services",
      color: "bg-red-500",
    },
    {
      title: "Clinical Workforce",
      desc: "Manage professional roles and specialist types.",
      icon: "bi-people",
      href: "/admin/edit-roles",
      color: "bg-slate-800",
    },
    {
      title: "Impact Stories",
      desc: "Edit patient testimonials and pro feedback.",
      icon: "bi-chat-quote",
      href: "/admin/edit-reviews",
      color: "bg-emerald-500",
    },
    {
      title: "Knowledge Base",
      desc: "Manage the FAQ and support information.",
      icon: "bi-question-circle",
      href: "/admin/edit-faq",
      color: "bg-amber-500",
    },
    {
      title: "Contact Info",
      desc: "Update office address, phone, and emails.",
      icon: "bi-geo-alt",
      href: "/admin/edit-contacts",
      color: "bg-rose-500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100">
      {/* Sidebar / Top Nav Branding */}
      <nav className="bg-white border-b border-slate-200 py-6">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/20">
              T
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-none">Tenachin Admin</h1>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Content Management System</span>
            </div>
          </div>
          <Link 
            href="/" 
            className="text-sm font-bold text-slate-500 hover:text-blue-600 flex items-center gap-2"
          >
            <i className="bi bi-eye"></i> View Live Site
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <header className="mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back, Admin</h2>
          <p className="text-slate-500 font-medium">Select a section to update the landing page content.</p>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {managementSections.map((section) => (
            <Link 
              key={section.title} 
              href={section.href}
              className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-14 h-14 ${section.color} rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-inner`}>
                <i className={`bi ${section.icon}`}></i>
              </div>
              
              <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                {section.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {section.desc}
              </p>

              <div className="mt-6 flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Edit Section <i className="bi bi-arrow-right"></i>
              </div>
            </Link>
          ))}
        </div>

        {/* System Status Footer */}
        <footer className="mt-20 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">API Online</span>
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l border-slate-200 pl-4">
              Version 1.0.4 (Sub-Saharan Region)
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            © {new Date().getFullYear()} Tenachin Telehealth Center
          </p>
        </footer>
      </main>
    </div>
  );
}