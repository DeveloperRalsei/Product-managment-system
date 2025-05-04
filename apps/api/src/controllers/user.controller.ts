import { User } from "#/prisma";
import { MiddlewareHandler } from "hono";
import userService from "~/service/user.service";

export const getAllUsers: MiddlewareHandler = async (c) => {
    const { q } = c.req.query();
    try {
        const users = await userService.findAllUsers(q);
        return c.json(users);
    } catch (error) {
        return c.json(
            {
                message: "Failed to fetch users",
                error: error instanceof Error ? error.message : error,
            },
            500,
        );
    }
};

export const getUser: MiddlewareHandler = async (c) => {
    const emailOrId = c.req.param("email_or_id");
    if (!emailOrId) return c.json({ message: "Email or ID required" }, 400);

    try {
        const user = await userService.findUser(emailOrId);
        if (!user) return c.json({ message: "User not found" }, 404);
        return c.json(user);
    } catch (error) {
        return c.json({ error }, 400);
    }
};

export const createUser: MiddlewareHandler = async (c) => {
    const { name, email, password, role, phoneNumber } = await c.req.json();

    if (!email || !password) {
        return c.json({ message: "Email and password are required" }, 400);
    }

    try {
        const user = await userService.createUser({
            name,
            email,
            password,
            role,
            phoneNumber,
        });
        return c.json({ message: "User created", user }, 201);
    } catch (error) {
        const message = error instanceof Error ? error.message : error;
        const status = message === "Email already in use" ? 409 : 500;
        return c.json({ message }, status);
    }
};

export const deleteUser: MiddlewareHandler = async (c) => {
    const emailOrId = c.req.param("email_or_id");
    const permanently = c.req.query("permanently");

    if (!emailOrId) {
        return c.json({ message: "Email or ID required" }, 400);
    }

    const isPermanent = permanently === "1";

    try {
        const user = await userService.deleteUser(emailOrId, isPermanent);
        return c.json({ message: "User deleted", user }, 202);
    } catch (error) {
        return c.json({ error }, 400);
    }
};

export const editUser: MiddlewareHandler = async (c) => {
    const emailOrId = c.req.param("email_or_id");
    if (!emailOrId) {
        return c.json({ message: "Email or ID required" }, 400);
    }

    const userBody: User = await c.req.json();

    try {
        const user = userService.updateUser(emailOrId, { ...userBody });

        return c.json({ message: "User updated", user });
    } catch (error) {
        return c.json({ error: "User not found or update failed" }, 400);
    }
};
