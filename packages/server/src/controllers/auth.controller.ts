import { MiddlewareHandler } from "hono";
import { decode, verify } from "hono/jwt";
import { getCookie, getSignedCookie } from "hono/cookie";
import {} from "zod";
import { authSchema, userAuthentication } from "#";
import { JWT_SECRET } from "~/constants";

export const authUser: MiddlewareHandler = async (c) => {
    const sessionCookie = getCookie(c, "user-session");

    if (!sessionCookie) {
        return c.text("No user logged");
    }

    try {
        const user = await verify(sessionCookie, JWT_SECRET!);
        return c.json(user);
    } catch (error) {
        c.status(500);
        return c.text("Internal Server Error" + error);
    }
};
