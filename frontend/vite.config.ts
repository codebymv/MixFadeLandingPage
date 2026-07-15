import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // CSS must stay render-blocking with prerendered HTML.
    // Async CSS caused a visible snap (hero UI shot showing then hiding on mobile,
    // grid stacking → 2-col, container padding jump) when Tailwind arrived late.
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Keep markdown inside lazy DocsPage (do not force a shared markdown-vendor —
        // that pulled shared deps into the landing graph via react-vendor).
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("react-dom") || id.includes("react-router")) return "react-vendor";
          if (id.includes("node_modules/react/") || id.includes("node_modules\\react\\"))
            return "react-vendor";
          if (id.includes("lucide-react")) return "icons";
        },
      },
    },
  },
}));
