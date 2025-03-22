import { MiddlewareHandler } from "hono";
import {} from "zod";
import { authSchema, userAuthentication } from "#";

export const authUser: MiddlewareHandler = async (c) => {
    const { email, password } = await c.req.json<authSchema>();

    if (!email || !password) {
        return c.json({
            mesage: "Email and password are required",
        });
    }

    const zodRes = userAuthentication.parse({
        email,
        password,
    });

    return c.json(zodRes);
};
