"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Initialize context with the default structure to prevent 'undefined' crashes
const ThemeContext = createContext({
  theme: {
    primaryColor: "#1FB5A8",
    secondaryColor: "#0984e3",
    backgroundColor: "#0B1C2C",
    cardColor: "#152a3d",
    accentColor: "#2ED1B2",
    headerFontWeight: "900",
    fontSizeBase: "16px"
  },
  siteSettings: {
    title: "Tenachin Telehealth",
    maintenanceMode: false
  },
  loading: true
});

const DEFAULT_CONFIG = {
  theme: {
    primaryColor: "#1FB5A8",
    secondaryColor: "#0984e3",
    backgroundColor: "#0B1C2C",
    cardColor: "#152a3d",
    accentColor: "#2ED1B2",
    headerFontWeight: "900",
    fontSizeBase: "16px"
  },
  siteSettings: {
    title: "Tenachin Telehealth",
    maintenanceMode: false
  }
};

export const ThemeProvider = ({ children }) => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheme = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      try {
        const response = await fetch(`${apiUrl}/api/config`);
        if (!response.ok) throw new Error("Backend unreachable");
        
        const data = await response.json();
        // Ensure data has the expected nested structure
        if (data && data.theme) {
          setConfig(data);
        }
      } catch (error) {
        console.warn("Using default theme fallback:", error.message);
        setConfig(DEFAULT_CONFIG);
      } finally {
        // Smooth transition out of loading state
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ ...config, loading }}>
      
      
      {loading && (
        <div 
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500"
          style={{ backgroundColor: DEFAULT_CONFIG.theme.backgroundColor }}
        >
          <div 
            className="animate-pulse font-[900] tracking-[0.5em] text-3xl uppercase"
            style={{ color: DEFAULT_CONFIG.theme.primaryColor }}
          >
            Tenachin
          </div>
          
          <div className="mt-6 h-1.5 w-64 bg-white/10 overflow-hidden rounded-full">
            <div 
              className="h-full animate-loading-bar" 
              style={{ 
                backgroundColor: DEFAULT_CONFIG.theme.primaryColor,
                boxShadow: `0 0 15px ${DEFAULT_CONFIG.theme.primaryColor}`
              }}
            ></div>
          </div>
          
          <p className="mt-4 text-white/40 text-xs tracking-widest uppercase animate-pulse">
            Connecting to Health Services...
          </p>
        </div>
      )}

      {/* Main App Content */}
      <div className={loading ? "invisible" : "visible"}>
        {children}
      </div>

      <style jsx global>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          width: 100%;
          animation: loading-bar 1.5s infinite linear;
        }
        /* Custom scrollbar matching the theme */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: ${config.theme.backgroundColor};
        }
        ::-webkit-scrollbar-thumb {
          background: ${config.theme.primaryColor};
          border-radius: 10px;
        }
      `}</style>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
