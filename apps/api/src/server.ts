import { serve } from "@hono/node-server";
import { validateEnv } from "./utils";
import { config } from "dotenv";

config({ path: "../.env" });
const missingEnvVariables = validateEnv();

if (missingEnvVariables)
    throw new Error(
        "You didn't provide all the environment variables: " +
            missingEnvVariables,
    );

import server from "./app";
const port = Number(process.env.PORT);
serve({ fetch: server.fetch, port }, (info) =>
    console.log(
        `Server running on port ${info.port} | http://localhost:${info.port}`,
    ),
);
