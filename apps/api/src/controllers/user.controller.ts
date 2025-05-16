import { tryCatch } from "#";
import { User } from "#/prisma";
import { MiddlewareHandler } from "hono";
import userService from "~/service/user.service";

export const getAllUsers: MiddlewareHandler = async (c) => {
    const { q } = c.req.query();
    const [users, error] = await tryCatch(() => userService.findAllUsers(q));
    if (error)
        return c.json(
            {
                message: "Failed to fetch users",
                error: error instanceof Error ? error.message : error,
            },
            400,
        );
    return c.json(users);
};

export const getUser: MiddlewareHandler = async (c) => {
    const emailOrId = c.req.param("email_or_id");
    if (!emailOrId) return c.json({ message: "Email or ID required" }, 400);
    const [user, error] = await tryCatch(() => userService.findUser(emailOrId));
    if (error) return c.json({ error }, 400);
    if (!user) return c.json({ message: "User not found" }, 404);
    return c.json(user);
};

export const createUser: MiddlewareHandler = async (c) => {
    const { name, email, password, role, phoneNumber } = await c.req.json();
    if (!email || !password)
        return c.json({ message: "Email and password are required" }, 400);
    const [user, error] = await tryCatch(() =>
        userService.createUser({
            name,
            email,
            password,
            role,
            phoneNumber,
        }),
    );
    if (error) {
        const message = error instanceof Error ? error.message : error;
        const status = message === "Email already in use" ? 409 : 500;
        return c.json({ message }, status);
    }
    return c.json({ message: "User created", user }, 201);
};

export const deleteUser: MiddlewareHandler = async (c) => {
    const emailOrId = c.req.param("email_or_id");
    const permanently = c.req.query("permanently");
    if (!emailOrId) return c.json({ message: "Email or ID required" }, 400);
    const isPermanent = permanently === "1";
    const [user, error] = await tryCatch(() =>
        userService.deleteUser(emailOrId, isPermanent),
    );
    if (error) return c.json({ error }, 400);
    return c.json({ message: "User deleted", user }, 202);
};

export const editUser: MiddlewareHandler = async (c) => {
    const emailOrId = c.req.param("email_or_id");
    if (!emailOrId) return c.json({ message: "Email or ID required" }, 400);
    const userBody: User = await c.req.json();
    const [user, error] = await tryCatch(() =>
        userService.updateUser(emailOrId, { ...userBody }),
    );
    if (error) return c.json({ error: "User not found or update failed" }, 400);
    return c.json({ message: "User updated", user });
};
