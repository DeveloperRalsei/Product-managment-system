import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { v1Router } from "./routes";

const app = new Hono();

app.use(cors(), logger());
app.route("/api/v1", v1Router);

export default app;
