import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Not VITE_-prefixed, so it stays in the dev/preview server and never reaches the bundle.
  const { WEATHER_API_PROXY_TARGET = "http://localhost:8000" } = loadEnv(mode, ".", "WEATHER_");

  // The page calls /api on its own address, so it works from any host without CORS.
  const proxy = { "/api": WEATHER_API_PROXY_TARGET };

  return {
    plugins: [react()],
    server: { proxy },
    preview: { proxy },
  };
});
