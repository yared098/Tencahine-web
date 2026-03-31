import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./page/**/*.{js,ts,jsx,tsx,mdx}", // Add your custom component folder here!
  ],
  theme: {
    extend: {
      colors: {
        // You can add Tenachin-specific colors here
        tenachinBlue: "#007bff", 
      },
    },
  },
  plugins: [],
};
export default config;