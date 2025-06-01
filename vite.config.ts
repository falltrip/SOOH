import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/SOOH/",
  build: {
    outDir: "dist", // 기본 출력 디렉토리
  },

  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
