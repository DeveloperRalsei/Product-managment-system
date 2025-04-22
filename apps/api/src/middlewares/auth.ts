import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { validateToken } from "~/utils/token";

export const withAuth: MiddlewareHandler = async (c, next) => {
    const sessionToken = getCookie(c, "session-cookie");

    if (!sessionToken) {
        return c.json({ message: "Unauthorized" }, 401);
    }

    try {
        const user = await validateToken(sessionToken);
        c.set("user", user);
        await next();
    } catch (error) {
        console.error(error);
        return c.json({ message: "Unauthorized" }, 401);
    }
};
