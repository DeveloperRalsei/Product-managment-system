import { MakeOptional, User } from "#";
import { Prisma } from "@prisma/client";
import { MiddlewareHandler } from "hono";
import prisma from "~/service/prisma";

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
                email: true,
                name: true,
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
    const {
        name,
        email,
        password,
    }: MakeOptional<Omit<User, "id" | "verified">, "name"> = body;

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
        const users = await prisma.user.findMany({ where: { email } });
        const isExist = users.length > 0;

        if (isExist) {
            return c.json(
                {
                    message: "Email already in use",
                },
                409,
            );
        }
    } catch (error) {}
};
