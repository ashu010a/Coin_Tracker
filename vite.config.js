import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [react(), componentTagger()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 8080,

    // ✅ Allow access from Cloudflare tunnel or any domain
    allowedHosts: [
      'michigan-leader-graduated-employees.trycloudflare.com', // your tunnel domain
      '.trycloudflare.com', // allow all trycloudflare subdomains
      'localhost',
      '127.0.0.1'
    ],

    proxy: {
      "/api-evm": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-evm/, "/api"),
      },
      "/api-ai": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-ai/, "/api-ai"),
      },
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
}));