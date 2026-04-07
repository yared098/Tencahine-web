"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Define your hardcoded defaults
const DEFAULT_CONFIG = {
  theme: {
    primaryColor: "#1FB5A8",
    secondaryColor: "#2ED1B2", // <--- THE FORCED COLOR
    backgroundColor: "#0B1C2C",
    cardColor: "#152a3d",
    accentColor: "#2ED1B2",
    fontSizeBase: "16px",
    headerFontWeight: "900",
    badge: {
      textColor: "#2ED1B2",
      fontSize: "100px",
      fontWeight: "900",
      letterSpacing: "0.4em"
    },
    title: {
      mainColor: "#FFFFFF",
      highlightColor: "#1FB5A8",
      fontSize: "72px",
      fontWeight: "900"
    }
  },
  siteSettings: {
    title: "Tenachin Telehealth",
    maintenanceMode: true
  }
};

const ThemeContext = createContext({
  ...DEFAULT_CONFIG,
  loading: true
});

export const ThemeProvider = ({ children }) => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheme = async () => {
      // Use timestamp to prevent browser caching
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/config?t=${Date.now()}`;
      
      try {
        const response = await fetch(apiUrl, { cache: 'no-store' });
        if (!response.ok) throw new Error("Backend unreachable");
        
        const data = await response.json();
        const incoming = data.configData || data;

        if (incoming && incoming.theme) {
          /**
           * THE LOGIC: 
           * 1. Extract 'secondaryColor' from the incoming backend data.
           * 2. Store everything ELSE from the backend into 'restOfTheme'.
           */
          const { secondaryColor, ...restOfTheme } = incoming.theme;

          setConfig({
            siteSettings: { 
              ...DEFAULT_CONFIG.siteSettings, 
              ...incoming.siteSettings 
            },
            theme: {
              ...DEFAULT_CONFIG.theme,       // Start with hardcoded defaults
              ...restOfTheme,               // Overwrite with backend data
              secondaryColor: DEFAULT_CONFIG.theme.secondaryColor, // RE-FORCE our default Teal
              
              // Deep merge nested objects to ensure backend typography settings win
              badge: { 
                ...DEFAULT_CONFIG.theme.badge, 
                ...incoming.theme.badge 
              },
              title: { 
                ...DEFAULT_CONFIG.theme.title, 
                ...incoming.theme.title 
              }
            }
          });
        }
      } catch (error) {
        console.error("Critical: Backend fetch failed, using fallback.", error);
      } finally {
        // Smooth transition: small delay to ensure states are set
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ ...config, loading }}>
      
      {/* Branded Loading Screen */}
      {loading && (
        <div 
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ backgroundColor: config.theme.backgroundColor }}
        >
          <div 
            className="animate-pulse font-[900] tracking-[0.5em] text-3xl uppercase italic"
            style={{ color: config.theme.badge.textColor }}
          >
            {config.siteSettings.title.split(' ')[0]}
          </div>
          
          <div className="mt-6 h-1 w-48 bg-white/10 overflow-hidden rounded-full">
            <div 
              className="h-full animate-loading-bar" 
              style={{ backgroundColor: config.theme.accentColor }}
            ></div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!loading && (
        <div className="fade-in">
          {children}
        </div>
      )}

      <style jsx global>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          width: 100%;
          animation: loading-bar 1.5s infinite linear;
        }
        .fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        body {
            background-color: ${config.theme.backgroundColor} !important;
            transition: background-color 0.3s ease;
            font-size: ${config.theme.fontSizeBase};
        }
        h1, h2, h3 { 
          font-weight: ${config.theme.headerFontWeight}; 
        }
      `}</style>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);