import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { v1Router } from "./routes";
import { serveStatic } from "@hono/node-server/serve-static";
import { createNodeWebSocket } from "@hono/node-ws";

const app = new Hono();

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });
export { injectWebSocket };

app.use(
    cors({
        origin:
            process.env.NODE_ENV === "production"
                ? process.env.ALLOWED_ORIGINS?.split(",") || []
                : ["http://localhost:5173"],
        allowHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    }),
    logger(),
);
app.route("/api/v1", v1Router);
app.get("/static/*", serveStatic({ root: "./" }));
app.get(
    "/ws",
    upgradeWebSocket((c) => ({})),
);

export default app;
