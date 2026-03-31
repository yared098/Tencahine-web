"use client";

import React, { useState, useEffect } from "react";

interface ClinicalRole {
  id: string | number;
  icon: string;
  color: string;
  title: string;
  delay: string;
}

const ClinicalTeam: React.FC = () => {
  const [roles, setRoles] = useState<ClinicalRole[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchRoles = async () => {
    // 1. Get the base URL from the .env file
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      // 2. Fetch using the dynamic path
      const response = await fetch(`${apiUrl}/api/team_roles`);
      const data = await response.json();
      
      // 3. Find the array inside the object (matching your generic controller logic)
      const key = Object.keys(data).find(k => Array.isArray(data[k]));
      if (key) {
        setRoles(data[key]);
      }
    } catch (error) {
      console.error("Error fetching clinical roles:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchRoles();
}, []);

  // Logic for "See More" toggle
  const visibleRoles = showAll ? roles : roles.slice(0, 8);

  if (loading) return null; // Or a simple skeleton/spinner

  return (
    <section id="clinical-team" className="py-24 bg-slate-50/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-4 relative">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-3 block">
            Expertise You Can Trust
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Our Renowned Clinical Team
          </h2>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-500 text-lg leading-relaxed font-medium">
            From critical chronic conditions to preventive wellness—our 
            diverse experts deliver holistic, patient-centered care for everyone.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6">
          {visibleRoles.map((role, index) => (
            <div 
              key={role.id || index}
              className="group cursor-default"
            >
              <div className="h-full bg-white border border-slate-100 p-6 rounded-[2rem] flex flex-col items-center text-center transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-2 hover:border-blue-200 relative overflow-hidden">
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500"
                  style={{ backgroundColor: role.color }}
                ></div>

                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110 shadow-sm"
                  style={{ backgroundColor: `${role.color}15` }}
                >
                  <i className={`bi ${role.icon} text-2xl`} style={{ color: role.color }}></i>
                </div>
                
                <h3 className="text-sm md:text-base font-extrabold text-slate-800 transition-colors group-hover:text-blue-600 leading-tight">
                  {role.title}
                </h3>

                <div 
                  className="w-1 h-1 rounded-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: role.color }}
                ></div>
              </div>
            </div>
          ))}
          
          {/* Static Join Us Card */}
          <div className="group">
            <div className="h-full min-h-[160px] border-2 border-dashed border-blue-200 bg-blue-50/30 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-blue-600 hover:bg-blue-600 cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 shadow-md transition-transform group-hover:scale-110">
                <i className="bi bi-plus-lg text-blue-600 text-xl group-hover:text-blue-600"></i>
              </div>
              <span className="text-sm font-black text-blue-600 group-hover:text-white uppercase tracking-tighter">
                Join Our Team
              </span>
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        {roles.length > 8 && (
          <div className="mt-16 text-center">
            <button 
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-full font-bold text-slate-700 shadow-sm hover:shadow-md hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95"
            >
              <span>{showAll ? "Show Less Experts" : "See All Clinical Roles"}</span>
              <i className={`bi bi-chevron-down transition-transform duration-500 ${showAll ? 'rotate-180' : ''}`}></i>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default ClinicalTeam;