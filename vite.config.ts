// vite.config.ts (atau .js jika Anda menggunakan JavaScript)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Opsi registerType: 'autoUpdate' akan otomatis memperbarui service worker
      // saat ada versi baru.
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      // Opsi devOptions berguna untuk testing PWA di mode development.
      devOptions: {
        enabled: true, // Aktifkan untuk testing di dev
        type: "module", // Sesuaikan dengan tipe service worker Anda
      },
      // Konfigurasi manifest PWA Anda
      manifest: {
        name: "Smart Health Monitoring App",
        short_name: "Health App",
        description: "A comprehensive mental health monitoring application",
        theme_color: "#0d9488",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/socket.io": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
