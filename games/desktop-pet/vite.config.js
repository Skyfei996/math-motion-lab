import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        simulator: resolve(import.meta.dirname, "index.html"),
        pet: resolve(import.meta.dirname, "pet.html")
      }
    }
  },
  server: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: true
  }
});
