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
                deleted: true,
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

        if (userFound && !userFound.deleted)
            return c.json({ message: "Email already in use" }, 409);

        const userData = {
            name,
            email,
            password: encryptPassword(password),
            role,
        };
        const newUser = await prisma.user.upsert({
            create: userData,
            update:
                userFound && userFound.deleted
                    ? { ...userData, deleted: false }
                    : {},
            where: { email },
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

export const deleteUser: MiddlewareHandler = async (c) => {
    const param = c.req.param("email_or_id");
    const permanently = c.req.query("permanently");

    if (!param) {
        return c.json({ message: "Email or ID required" }, 400);
    }

    const isEmail = param.includes("@");
    const identifier = isEmail ? { email: param } : { id: param };
    const isPermanent = permanently === "1";
    const selector = {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        verified: true,
    };

    try {
        const user = isPermanent
            ? await prisma.user.delete({ where: identifier, select: selector })
            : await prisma.user.update({
                  where: identifier,
                  data: { deleted: true },
                  select: selector,
              });
        return c.json({ message: "User deleted", user }, 202);
    } catch (error) {
        return c.json({ error }, 400);
    }
};

export const editUser: MiddlewareHandler = async (c) => {
    const param = c.req.param("email_or_id");
    if (!param) {
        return c.json({ message: "Email or ID required" }, 400);
    }

    const { name, email, password, phoneNumber, role, deleted } =
        await c.req.json();
    const identifier = param.includes("@") ? { email: param } : { id: param };

    try {
        const updatedUser = await prisma.user.update({
            where: identifier,
            data: {
                name,
                email,
                password: password ? encryptPassword(password) : undefined,
                phoneNumber,
                role,
                deleted,
                verified: email ? false : undefined,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                role: true,
                verified: true,
                deleted: true,
            },
        });

        return c.json({ message: "User updated", user: updatedUser });
    } catch (error) {
        return c.json({ error: "User not found or update failed" }, 400);
    }
};
