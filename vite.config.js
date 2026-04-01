import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

function normalizeProxyTarget(value, fallbackValue) {
  const normalized = String(value || "")
    .trim()
    .replace(/\/+$/, "");

  return normalized || fallbackValue;
}

function createProxyConfig(target, options = {}) {
  const { ws = false, rewrite } = options;
  const proxyConfig = {
    target,
    changeOrigin: true,
    ws,
    secure: false,
    configure: (proxy, proxyOptions) => {
      proxy.on("error", (error, request) => {
        const requestMethod = request?.method || "GET";
        const requestUrl = request?.url || "/";
        const reason = error?.code || error?.message || "UNKNOWN_PROXY_ERROR";

        console.error(
          `[vite-proxy] ${requestMethod} ${requestUrl} -> ${proxyOptions.target} failed: ${reason}`
        );
      });
    }
  };

  if (typeof rewrite === "function") {
    proxyConfig.rewrite = rewrite;
  }

  return proxyConfig;
}

function normalizePort(value, fallbackValue) {
  const parsed = Number.parseInt(String(value || "").trim(), 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallbackValue;
}

function normalizeBoolean(value, fallbackValue = false) {
  if (typeof value === "boolean") {
    return value;
  }

  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) {
    return fallbackValue;
  }

  return ["1", "true", "yes", "on"].includes(normalized);
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const API_PROXY_TARGET = normalizeProxyTarget(
    env.VITE_API_PROXY_TARGET,
    "http://127.0.0.1:5000"
  );
  const WHOLESALE_PROXY_TARGET = normalizeProxyTarget(
    env.VITE_WHOLESALE_PROXY_TARGET,
    "http://127.0.0.1:5001"
  );
  const DEV_SERVER_PORT = normalizePort(env.VITE_DEV_PORT, 5177);
  const DEV_SERVER_STRICT_PORT = false;

  return {
    base: "./",
    envDir: ".",
    envPrefix: "VITE_",
    plugins: [react()],
    build: {
      target: "es2019",
      minify: "esbuild",
      cssMinify: true,
      sourcemap: false,
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            "icon-vendor": ["lucide-react"]
          }
        }
      }
    },
    server: {
      host: true,
      port: DEV_SERVER_PORT,
      strictPort: DEV_SERVER_STRICT_PORT,
      proxy: {
        "/socket.io": createProxyConfig(API_PROXY_TARGET, { ws: true }),
        "/api": createProxyConfig(API_PROXY_TARGET),
        "/wholesale-api": createProxyConfig(WHOLESALE_PROXY_TARGET, {
          rewrite: (proxyPath) => proxyPath.replace(/^\/wholesale-api/, "/api")
        })
      }
    }
  };
});
