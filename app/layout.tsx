import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tenachin - Telehealth",
  description: "Africa’s first multilingual, full-spectrum telehealth platform.",
  // --- ADDED THIS SECTION ---
  icons: {
    icon: "/favicon.ico",         // Standard favicon c:\Users\hp\Downloads\favicon.ico.ico
    shortcut: "/favicon.ico",     // For bookmarks
    apple: "/favicon.ico",        // For iOS home screen icons
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Manual link tag fallback for older browsers */}
        <link rel="icon" href="/favicon.ico" />
        
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"></link>
        
        {/* Vendor CSS Files */}
        <link rel="stylesheet" href="/assets/vendor/bootstrap/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/vendor/bootstrap-icons/bootstrap-icons.css" />
        <link rel="stylesheet" href="/assets/vendor/aos/aos.css" />
        <link rel="stylesheet" href="/assets/vendor/animate.css/animate.min.css" />
        <link rel="stylesheet" href="/assets/vendor/glightbox/css/glightbox.min.css" />
        <link rel="stylesheet" href="/assets/vendor/swiper/swiper-bundle.min.css" />
        <link rel="stylesheet" href="/assets/css/main.css" />
      </head>
      <body className="index-page min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
