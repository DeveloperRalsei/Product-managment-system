import { MakeOptional, User } from "#";

export const createUser = async (
    values: MakeOptional<Omit<User, "id" | "verified" | "deleted">, "name">,
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

export const deleteUserById = async (
    type: "permanent" | "delete",
    id: string,
): Promise<User> => {
    if (type === "delete")
        return (await fetch(`/api/v1/user/${id}`, { method: "DELETE" })).json();
    else
        return (
            await fetch(`/api/v1/user/${id}?permanently=1`, {
                method: "DELETE",
            })
        ).json();
};
