import { MakeOptional, User } from "#";

export const createUser = async (
    values: MakeOptional<Omit<User, "id" | "verified">, "name">,
) =>
    await fetch("/api/v1/user/new", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
    });

export const getUsers = async (): Promise<User[]> =>
    (await fetch("/api/v1/user")).json();
