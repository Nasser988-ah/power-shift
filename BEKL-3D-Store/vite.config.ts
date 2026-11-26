import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  base: "/3d-demo/",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "../3d-demo",
    emptyOutDir: true,
    target: "es2022",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom") || id.includes("node_modules/react-router")) {
            return "react"
          }
          if (id.includes("node_modules/motion")) return "motion"
        },
      },
    },
  },
})
