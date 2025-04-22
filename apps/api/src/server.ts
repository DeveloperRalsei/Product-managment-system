import server from "./app";
import { serve } from "@hono/node-server";
import { validateEnv } from "./utils";
import { config } from "dotenv";

config({ path: "../.env" });

if (!validateEnv())
    throw new Error(
        "You didn't provide all the environment variables: PORT, JWT_TOKEN, DATABASE_URL",
    );

const port = Number(process.env.PORT);
serve({ fetch: server.fetch, port }, (info) =>
    console.log(
        `Server running on port ${info.port} | http://localhost:${info.port}`,
    ),
);
