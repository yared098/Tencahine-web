import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 1. Set output to export for static HTML generation */
  output: 'export',

  /* 2. Enable trailingSlash to create /admin/index.html instead of admin.html */
  /* This fixes the "404 on refresh" issue for your sub-routes */
  trailingSlash: true,

  /* 3. Disable image optimization since cPanel (static) doesn't have a Node.js 
     image server running to process them on the fly */
  images: {
    unoptimized: true,
  },

  /* Optional: If your site is in a subfolder like tenachin.org/app, 
     uncomment the line below: */
  // basePath: '/app',
};

export default nextConfig;