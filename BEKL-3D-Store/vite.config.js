import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  base: "/3d-demo/",
  publicDir: "public",
  server: {
    host: "127.0.0.1",
    port: 5201,
    strictPort: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 5202,
    strictPort: true,
  },
  build: {
    outDir: "../3d-demo",
    emptyOutDir: true,
    sourcemap: false,
  },
});
