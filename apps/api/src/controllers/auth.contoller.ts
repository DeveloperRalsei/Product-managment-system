import { MiddlewareHandler } from "hono";
import { verify, sign } from "hono/jwt";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { ZodError } from "zod";
import { loginSchema } from "#";
import prisma from "~/lib/prisma";
import { generateVerificationCode } from "~/utils/auth";
import resend from "~/lib/resend";
import authService from "~/service/auth.service";

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
    let { email, password }: loginSchema = await c.req.json();

    if (!email || !password)
        return c.json(
            {
                message:
                    "You did not provide the required parameters: `email`,`password`",
            },
            400,
        );

    try {
        const [sessionCookie, user] = await authService.loginUser({
            email,
            password,
        });
        setCookie(
            c,
            "session-cookie",
            typeof sessionCookie === "string"
                ? sessionCookie
                : JSON.stringify(sessionCookie),
            {
                httpOnly: true,
                maxAge: 60 * 60 * 6,
                path: "/",
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            },
        );

        return c.json(user);
    } catch (error) {
        if (error instanceof Error) {
            switch (error.message) {
                case "404":
                    return c.json({ message: "User not found" }, 404);
                case "403":
                    return c.json({ message: "Forbidden" }, 403);
                case "401":
                    return c.json({ message: "Unauthorized" }, 401);
                default:
                    return c.json({ error }, 400);
            }
        }
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

export const verifyUser: MiddlewareHandler = async (c) => {
    let body: { email: string; code: string } = await c.req.json();
    const { email, code } = body;

    if (!email || !code) {
        return c.json(
            {
                message: "Missing parameters: `email` or `code`",
            },
            400,
        );
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) return c.json({ message: "User not found" }, 404);

        if (!user.verified) {
            if (user.emailVerificationCode !== code) {
                return c.json({ message: "Invalid verification code" }, 401);
            }

            if (user.emailVerificationExpires! < new Date()) {
                return c.json({ message: "Verification code expired" }, 400);
            }

            await prisma.user.update({
                where: { email },
                data: {
                    verified: true,
                    emailVerificationCode: null,
                    emailVerificationExpires: null,
                },
            });
        }

        const {
            password,
            emailVerificationCode,
            emailVerificationExpires,
            ...rest
        } = user;
        const sessionCookie = await sign(rest, process.env.JWT_TOKEN!);

        setCookie(c, "session-cookie", sessionCookie, {
            httpOnly: true,
            maxAge: 60 * 60 * 6,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return c.json({ message: "User verified and logged in", user: rest });
    } catch (error) {
        c.status(400);
        return c.json({ error });
    }
};

export const sendEmailVerification: MiddlewareHandler = async (c) => {
    const email = await c.req.text();
    const code = generateVerificationCode();

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return c.json({ message: "User not found" }, 404);

        await prisma.user.update({
            where: { email: user.email },
            data: {
                emailVerificationCode: code,
                emailVerificationExpires: new Date(Date.now() + 1000 * 60 * 5),
            },
        });

        if (!process.env.RESEND_DOMAIN)
            return c.json({ message: "RESEND_DOMAIN not defined" }, 400);

        const resendResponse = await resend.emails.send({
            from: `noreply@${process.env.RESEND_DOMAIN}`,
            to: user.email,
            subject: "Hesap doğrulama",
            text: `Doğrulama kodun: ${code}`,
        });

        if (resendResponse.error) {
            return c.json(
                {
                    message: "Email verification failed",
                    error: resendResponse.error,
                },
                400,
            );
        }

        return c.json({
            message: "Verification code sended",
        });
    } catch (error) {
        return c.json(
            {
                error,
            },
            400,
        );
    }
};
