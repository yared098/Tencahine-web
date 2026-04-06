"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

interface ClinicalRole {
  id: string | number;
  icon: string;
  color: string;
  title: string;
  delay: string;
}

interface TeamHeader {
  badge?: string;
  title?: string;
  highlightText?: string;
  description?: string;
}

const ClinicalTeam: React.FC = () => {
  const { theme } = useTheme();
  const [roles, setRoles] = useState<ClinicalRole[]>([]);
  const [header, setHeader] = useState<TeamHeader | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      try {
        const response = await fetch(`${apiUrl}/api/team_roles`);
        const data = await response.json();
        
        // Handle dynamic header from backend
        if (data.header) {
          setHeader(data.header);
        }

        // Handle roles array
        const rolesKey = Object.keys(data).find(k => Array.isArray(data[k]));
        if (rolesKey) {
          setRoles(data[rolesKey]);
        }
      } catch (error) {
        console.error("Error fetching clinical team data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  const visibleRoles = showAll ? roles : roles.slice(0, 8);

  // HIDE LOGIC: If loading, or if no roles exist AND no header was provided
  if (loading) return null;
  if (roles.length === 0 && !header?.title) return null;

  return (
    <section 
      id="clinical-team" 
      className="py-24 relative overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div 
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 pointer-events-none"
        style={{ backgroundColor: theme.primaryColor }}
      ></div>

      <div className="container mx-auto px-4 relative">
        
        {/* Dynamic Section Header */}
        {(header?.title || header?.badge) && (
          <div className="max-w-3xl mx-auto text-center mb-20">
            {header.badge && (
              <span 
                className="font-black uppercase tracking-[0.4em] text-[10px] mb-4 block"
                style={{ color: theme.accentColor }}
              >
                {header.badge}
              </span>
            )}
            
            <h2 
              className="text-4xl md:text-5xl mb-6 tracking-tighter italic uppercase"
              style={{ color: "white", fontWeight: theme.headerFontWeight }}
            >
              {header.title} <span style={{ color: theme.primaryColor }}>{header.highlightText}</span>
            </h2>

            <div 
              className="w-24 h-1.5 mx-auto rounded-full mb-8"
              style={{ backgroundColor: theme.primaryColor }}
            ></div>

            {header.description && (
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                {header.description}
              </p>
            )}
          </div>
        )}

        {/* Roles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {visibleRoles.map((role, index) => (
            <div key={role.id || index} className="group cursor-default">
              <div 
                className="h-full border-2 p-8 rounded-2xl flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 relative overflow-hidden group-hover:border-white/20"
                style={{ 
                  backgroundColor: theme.cardColor,
                  borderColor: 'rgba(255, 255, 255, 0.05)'
                }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500"
                  style={{ backgroundColor: role.color }}
                ></div>

                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110 shadow-lg"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                >
                  <i 
                    className={`bi ${role.icon} text-3xl`} 
                    style={{ color: role.color || theme.primaryColor }}
                  ></i>
                </div>
                
                <h3 
                  className="text-sm md:text-base font-black uppercase tracking-tight transition-colors"
                  style={{ color: "white" }}
                >
                  {role.title}
                </h3>

                <div 
                  className="w-1.5 h-1.5 rounded-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: role.color || theme.primaryColor }}
                ></div>
              </div>
            </div>
          ))}
          
          {/* Join Our Team Card */}
          <div className="group cursor-pointer">
            <div 
              className="h-full min-h-[180px] border-2 border-dashed p-8 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-opacity-100 group-hover:border-solid group-hover:scale-[1.02]"
              style={{ 
                borderColor: `${theme.primaryColor}40`,
                backgroundColor: 'transparent'
              }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-xl transition-all group-hover:rotate-90"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <i className="bi bi-plus-lg text-xl" style={{ color: theme.backgroundColor }}></i>
              </div>
              <span 
                className="text-xs font-black uppercase tracking-widest"
                style={{ color: theme.primaryColor }}
              >
                Join Our Team
              </span>
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        {roles.length > 8 && (
          <div className="mt-20 text-center">
            <button 
              onClick={() => setShowAll(!showAll)}
              className="group inline-flex items-center gap-4 px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 border border-white/10 hover:border-white/20"
              style={{ backgroundColor: theme.cardColor, color: "white" }}
            >
              <span className="group-hover:text-[#1FB5A8] transition-colors">
                {showAll ? "Show Fewer Specialists" : "Explore All Specialties"}
              </span>
              <i 
                className={`bi bi-chevron-down text-base transition-transform duration-500 ${showAll ? 'rotate-180' : ''}`}
                style={{ color: theme.primaryColor }}
              ></i>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ClinicalTeam;