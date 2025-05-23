import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = {
        ...loadEnv(mode, process.cwd()),
        ...process.env,
    };

    return {
        plugins: [TanStackRouterVite(), react(), tsconfigPaths()],
        server: {
            allowedHosts: ["localhost.devrals.xyz"],
            hmr: true,
            proxy: {
                "/api": {
                    target: env.VITE_API_URL,
                    changeOrigin: true,
                },
                "/static": {
                    target:
                        mode === "development"
                            ? "http://localhost:3000/"
                            : env.VITE_API_URL,
                },
            },
        },
        build: {
            chunkSizeWarningLimit: 1000,
            rollupOptions: {
                output: {
                    manualChunks(config) {
                        if (config.includes("node_modules")) {
                            return "vendor";
                        }
                    },
                },
            },
        },
    };
});
