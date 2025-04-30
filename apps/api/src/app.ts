import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { v1Router } from "./routes";
import { AuthUser } from "./types";
import { serveStatic } from "@hono/node-server/serve-static";

type Variables = { user: AuthUser };
const app = new Hono<{ Variables: Variables }>();

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

export default app;
