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
      // Opsi devOptions berguna untuk testing PWA di mode development.
      devOptions: {
        enabled: true, // Aktifkan untuk testing di dev
        type: "module", // Sesuaikan dengan tipe service worker Anda
      },
      // Konfigurasi manifest PWA Anda
      manifest: {
        name: "Smart Health Monitoring App",
        short_name: "HealthApp",
        description: "Aplikasi untuk monitoring kesehatan mental.",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png", // Ganti dengan path ikon Anda
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png", // Ganti dengan path ikon Anda
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      // Opsi workbox bisa dikustomisasi lebih lanjut jika perlu
      // workbox: {
      //   globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      // },
    }),
  ],
});
