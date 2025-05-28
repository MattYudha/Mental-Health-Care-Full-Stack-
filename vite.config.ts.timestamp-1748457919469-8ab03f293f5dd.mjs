// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { VitePWA } from "file:///home/project/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Opsi registerType: 'autoUpdate' akan otomatis memperbarui service worker
      // saat ada versi baru.
      registerType: "autoUpdate",
      // Opsi devOptions berguna untuk testing PWA di mode development.
      devOptions: {
        enabled: true,
        // Aktifkan untuk testing di dev
        type: "module"
        // Sesuaikan dengan tipe service worker Anda
      },
      // Konfigurasi manifest PWA Anda
      manifest: {
        name: "Smart Health Monitoring App",
        short_name: "HealthApp",
        description: "Aplikasi untuk monitoring kesehatan mental.",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            // Ganti dengan path ikon Anda
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            // Ganti dengan path ikon Anda
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
      // Opsi workbox bisa dikustomisasi lebih lanjut jika perlu
      // workbox: {
      //   globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      // },
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjsvLyB2aXRlLmNvbmZpZy50cyAoYXRhdSAuanMgamlrYSBBbmRhIG1lbmdndW5ha2FuIEphdmFTY3JpcHQpXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1wd2FcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgVml0ZVBXQSh7XG4gICAgICAvLyBPcHNpIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnIGFrYW4gb3RvbWF0aXMgbWVtcGVyYmFydWkgc2VydmljZSB3b3JrZXJcbiAgICAgIC8vIHNhYXQgYWRhIHZlcnNpIGJhcnUuXG4gICAgICByZWdpc3RlclR5cGU6IFwiYXV0b1VwZGF0ZVwiLFxuICAgICAgLy8gT3BzaSBkZXZPcHRpb25zIGJlcmd1bmEgdW50dWsgdGVzdGluZyBQV0EgZGkgbW9kZSBkZXZlbG9wbWVudC5cbiAgICAgIGRldk9wdGlvbnM6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSwgLy8gQWt0aWZrYW4gdW50dWsgdGVzdGluZyBkaSBkZXZcbiAgICAgICAgdHlwZTogXCJtb2R1bGVcIiwgLy8gU2VzdWFpa2FuIGRlbmdhbiB0aXBlIHNlcnZpY2Ugd29ya2VyIEFuZGFcbiAgICAgIH0sXG4gICAgICAvLyBLb25maWd1cmFzaSBtYW5pZmVzdCBQV0EgQW5kYVxuICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgbmFtZTogXCJTbWFydCBIZWFsdGggTW9uaXRvcmluZyBBcHBcIixcbiAgICAgICAgc2hvcnRfbmFtZTogXCJIZWFsdGhBcHBcIixcbiAgICAgICAgZGVzY3JpcHRpb246IFwiQXBsaWthc2kgdW50dWsgbW9uaXRvcmluZyBrZXNlaGF0YW4gbWVudGFsLlwiLFxuICAgICAgICB0aGVtZV9jb2xvcjogXCIjZmZmZmZmXCIsXG4gICAgICAgIGljb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcInB3YS0xOTJ4MTkyLnBuZ1wiLCAvLyBHYW50aSBkZW5nYW4gcGF0aCBpa29uIEFuZGFcbiAgICAgICAgICAgIHNpemVzOiBcIjE5MngxOTJcIixcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwicHdhLTUxMng1MTIucG5nXCIsIC8vIEdhbnRpIGRlbmdhbiBwYXRoIGlrb24gQW5kYVxuICAgICAgICAgICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIC8vIE9wc2kgd29ya2JveCBiaXNhIGRpa3VzdG9taXNhc2kgbGViaWggbGFuanV0IGppa2EgcGVybHVcbiAgICAgIC8vIHdvcmtib3g6IHtcbiAgICAgIC8vICAgZ2xvYlBhdHRlcm5zOiBbJyoqLyoue2pzLGNzcyxodG1sLGljbyxwbmcsc3ZnfSddLFxuICAgICAgLy8gfSxcbiAgICB9KSxcbiAgXSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFFeEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sUUFBUTtBQUFBO0FBQUE7QUFBQSxNQUdOLGNBQWM7QUFBQTtBQUFBLE1BRWQsWUFBWTtBQUFBLFFBQ1YsU0FBUztBQUFBO0FBQUEsUUFDVCxNQUFNO0FBQUE7QUFBQSxNQUNSO0FBQUE7QUFBQSxNQUVBLFVBQVU7QUFBQSxRQUNSLE1BQU07QUFBQSxRQUNOLFlBQVk7QUFBQSxRQUNaLGFBQWE7QUFBQSxRQUNiLGFBQWE7QUFBQSxRQUNiLE9BQU87QUFBQSxVQUNMO0FBQUEsWUFDRSxLQUFLO0FBQUE7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtGLENBQUM7QUFBQSxFQUNIO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
