import { MiddlewareHandler } from "hono";
import { sign, verify } from "hono/jwt";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { User, userAuthentication } from "#";
import { JWT_SECRET } from "~/constants";
import { ZodError } from "zod";

export const authUser: MiddlewareHandler = async (c) => {
    const sessionToken = c.req.header("Authorization")?.split(" ")[1];

    if (!sessionToken) {
        c.status(401);
        return c.json({
            message: "No user logged",
        });
    }

    const user = await verify(sessionToken, JWT_SECRET!);
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
        userAuthentication.parse(tempUser);
    } catch (error) {
        c.status(400);
        const zodError = error as ZodError;
        return c.json(zodError.errors);
    }

    // TODO: create a user in the database
    if (email === "1234@1234.com" && password === "123456") {
        const token = await sign(tempUser, JWT_SECRET!);

        c.status(200);

        return c.json({
            message: "User logged in",
            token,
        });
    }

    c.status(401);
    return c.json({
        message: "Unauthorized",
    });
};
