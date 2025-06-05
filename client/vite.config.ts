import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@assets": path.resolve(__dirname, "attached_assets"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: "src",
  build: {
    outDir: "../dist/public",
    emptyOutDir: true,
    assetsInlineLimit: 4096,
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  envDir: "..",
  define: {
    "globalThis.__APP_VERSION__": JSON.stringify(process.env.npm_package_version),
  },
});
