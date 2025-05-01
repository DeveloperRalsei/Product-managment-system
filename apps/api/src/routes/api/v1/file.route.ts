import { Hono } from "hono";
import {} from "hono/etag";

const router = new Hono();

router.post("/", async (c) => {
    const body = await c.req.parseBody();
    return c.json(body);
});

export default router;
