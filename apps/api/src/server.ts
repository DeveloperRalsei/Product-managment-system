import server from "./app";
import { serve } from "@hono/node-server";

const { NODE_ENV, JWT_SECRET, DATABASE_URL, PORT } = process.env;
if (!NODE_ENV || !JWT_SECRET || !DATABASE_URL || !PORT) {
    console.log("please use valid environment variables");
    process.exit(1);
}

const port = Number(process.env.API_PORT) || 3000;
serve(
    {
        fetch: server.fetch,
        port,
    },
    (info) =>
        console.log(
            `Server running on port ${info.port} | http://localhost:${info.port}`,
        ),
);
