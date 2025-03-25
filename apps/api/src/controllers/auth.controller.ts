import { MiddlewareHandler } from "hono";
import { decode, sign } from "hono/jwt";
import { getCookie, setCookie } from "hono/cookie";
import { User, userAuthentication } from "#";
import { IS_PRODUCTION } from "~/constants";
import { ZodError } from "zod";

export const authUser: MiddlewareHandler = async (c) => {
    const sessionToken = getCookie(c, "session-token");

    if (!sessionToken) {
        c.status(401);
        return c.json({
            message: "No user logged",
        });
    }

    const { payload: user } = decode(sessionToken);
    return c.json(user);
};

export const loginUser: MiddlewareHandler = async (c) => {
    const { email, password } = await c.req.json();
    if (!email || !password) {
        c.status(401);
        return c.json({
            message: "email and password required",
        });
    }

    const tempUser: User = {
        id: 1,
        email: email,
        password: password,
        name: "selma",
        roleId: 1,
        role: {
            id: 1,
            key: "user",
            permissions: ["read"],
        },
        created_at: "2022-01-01T00:00:00.000Z",
        updated_at: "2022-01-01T00:00:00.000Z",
    };

    try {
        userAuthentication.parse({
            email: tempUser.email,
            password: tempUser.password,
        });
    } catch (error) {
        c.status(400);
        const zodError = error as ZodError;
        return c.json({
            message: zodError.message,
            errors: zodError.errors,
        });
    }

    // TODO: create a user in the database
    if (email === "1234@1234.com" && password === "123456") {
        const token = await sign(tempUser, process.env.JWT_SECRET!);

        c.status(200);

        setCookie(c, "session-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 60 * 60 * 24,
            path: "/",
            domain: IS_PRODUCTION ? "devrals.xyz" : "localhost",
        });

        return c.json({
            message: "Logged in",
        });
    }

    c.status(401);
    return c.json({
        message: "Unauthorized",
    });
};
