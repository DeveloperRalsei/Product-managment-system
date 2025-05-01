import { serve } from "@hono/node-server";
import { validateEnv } from "./utils";
import { config } from "dotenv";
import app, { injectWebSocket } from "./app";

config({ path: "../.env" });
const missingEnvVariables = validateEnv();

if (missingEnvVariables)
    throw new Error(
        "You didn't provide all the environment variables: " +
            missingEnvVariables,
    );

const port = Number(process.env.PORT);
const server = serve({ fetch: app.fetch, port }, (info) =>
    console.log(
        `Server running on port ${info.port} | http://localhost:${info.port}`,
    ),
);
injectWebSocket(server);
