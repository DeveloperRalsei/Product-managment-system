import { MiddlewareHandler } from "hono";
import { decode, sign, verify } from "hono/jwt";
import {
    deleteCookie,
    getCookie,
    getSignedCookie,
    setCookie,
} from "hono/cookie";
import { authSchema, User, userAuthentication } from "#";
import { JWT_SECRET } from "~/constants";
import { ZodError, ZodErrorMap } from "zod";

export const authUser: MiddlewareHandler = async (c) => {
    const sessionCookie = getCookie(c, "user-session");

    if (!sessionCookie) {
        c.status(400);
        return c.json({
            message: "No user logged",
        });
    }

    const user = await verify(sessionCookie, JWT_SECRET!);
    return c.json(user);
};

export const loginUser: MiddlewareHandler = async (c) => {
    const { email, password } = await c.req.json();
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
        userAuthentication.parse(tempUser);
    } catch (error) {
        c.status(400);
        const zodError = error as ZodError;
        return c.json(zodError.errors);
    }

    // TODO: create a user in the database
    if (email === "1234@1234.com" && password === "123456") {
        const token = await sign(tempUser, JWT_SECRET!);
        deleteCookie(c, "user-session");
        setCookie(c, "user-session", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        });

        c.status(200);

        return c.json({
            message: "User logged in",
        });
    }
    c.status(401);
    return c.json({
        message: "Unauthorized",
    });
};
