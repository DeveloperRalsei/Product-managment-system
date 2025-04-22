import { MiddlewareHandler } from "hono";
import { verify, sign } from "hono/jwt";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { ZodError } from "zod";
import { loginSchema, zodLoginSchema } from "#";
import { validatePass } from "~/utils";
import prisma from "~/service/prisma";

export const authUser: MiddlewareHandler = async (c) => {
    const sessionCookie = getCookie(c, "session-cookie");

    if (!sessionCookie) {
        c.status(401);
        return c.json({
            message: "Unauthorized",
        });
    }

    const user = await verify(sessionCookie, process.env.JWT_TOKEN!);
    return c.json(user);
};

export const loginUser: MiddlewareHandler = async (c) => {
    let body: loginSchema = await c.req.json();
    const { email, password } = body;

    if (!email || !password)
        return c.json(
            {
                message:
                    "You did not provide the required parameters: `email`,`password`",
            },
            400,
        );

    try {
        zodLoginSchema.parse({ email, password });

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) return c.json({ message: "Unauthorized" }, 401);
        if (!validatePass(password, user.password))
            return c.json({ message: "Unauthorized" }, 401);

        const { password: _, ...rest } = user;

        const sessionCookie = await sign(rest, process.env.JWT_TOKEN!);

        setCookie(c, "session-cookie", sessionCookie, {
            httpOnly: true,
            maxAge: 60 * 60 * 24,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return c.json(user);
    } catch (error) {
        if (error instanceof ZodError) {
            const { errors } = error;

            c.status(401);
            return c.json({ errors });
        }

        c.status(400);
        return c.json({ error });
    }
};

export const logoutUser: MiddlewareHandler = async (c) => {
    deleteCookie(c, "session-cookie");
    return c.json({
        message: "Logged Out",
    });
};
