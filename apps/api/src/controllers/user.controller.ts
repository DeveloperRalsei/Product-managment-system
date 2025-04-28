import { User, Prisma } from "../../generated/prisma";
import { MiddlewareHandler } from "hono";
import prisma from "~/service/prisma";
import { encryptPassword } from "~/utils";

export const getAllUsers: MiddlewareHandler = async (c) => {
    const { q } = c.req.query();

    try {
        const users = await prisma.user.findMany({
            where: q
                ? {
                      OR: [
                          { name: { contains: q, mode: "insensitive" } },
                          { email: { contains: q, mode: "insensitive" } },
                      ],
                  }
                : {},
            select: {
                id: true,
                name: true,
                email: true,
                verified: true,
                role: true,
            },
        });

        return c.json(users);
    } catch (error) {
        const message =
            error instanceof Prisma.PrismaClientKnownRequestError
                ? "Something went wrong while trying to get users"
                : error;
        return c.json({ message, error }, 500);
    }
};

export const createUser: MiddlewareHandler = async (c) => {
    const body = await c.req.json();
    const { name, email, password, role }: Omit<User, "id" | "verified"> = body;

    if (!email || !password) {
        return c.json(
            {
                message:
                    "You did not provide all required parameters: name? email password",
            },
            400,
        );
    }

    try {
        const userFound = await prisma.user.findFirst({ where: { email } });

        if (userFound) return c.json({ message: "Email already in use" }, 409);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: encryptPassword(password),
                role,
            },
        });

        return c.json(
            {
                message: "User created",
                user: newUser,
            },
            201,
        );
    } catch (error) {
        const message =
            error instanceof Prisma.PrismaClientKnownRequestError
                ? error.message
                : JSON.stringify(error);
        return c.json({
            message,
            error,
        });
    }
};
