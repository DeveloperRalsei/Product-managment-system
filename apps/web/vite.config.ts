import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const { API_URL } = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [react(), tsconfigPaths(), TanStackRouterVite()],
        server: {
            hmr: true,
            proxy: {
                "/api": {
                    target:
                        mode === "production"
                            ? API_URL!
                            : "http://localhost:3000",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                },
            },
        },
    };
});
