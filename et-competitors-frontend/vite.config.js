import { defineConfig } from "vite";
import path from "path"
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000/",
        secure: "false",
        changeOrigin: true,
      },
    },
    host: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  plugins: [react()],
});


/* import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    proxy:
      mode === "development"
        ? {
            "/api": {
              target: "http://192.168.234.1:3000",
              secure: false,
              changeOrigin: true,
            },
          }
        : {},
    host: true,
  },
  plugins: [react()],
})); */
/* import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {},
  plugins: [react()],
});
 */
