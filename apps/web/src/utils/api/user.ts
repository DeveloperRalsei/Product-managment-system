import { MakeOptional, User } from "#";
import { UserFormValues } from "@/components/ui/form/user";

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

export const getUsers = async (searchString?: string) =>
    await fetch(`/api/v1/user${searchString ? `?q=${searchString}` : ""}`);

export const getUserById = async (id: string): Promise<User> =>
    (await fetch(`/api/v1/user/${id}`)).json();

export const deleteUserById = async (
    type: "permanent" | "delete",
    id: string,
): Promise<Response> => {
    if (type === "delete")
        return (await fetch(`/api/v1/user/${id}`, { method: "DELETE" })).json();
    else
        return await fetch(`/api/v1/user/${id}?permanently=1`, {
            method: "DELETE",
        });
};

export const updateUser = async (userId: string, values: UserFormValues) =>
    await fetch(`/api/v1/user/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
    });

export const activateUser = async (userId: string) =>
    await fetch(`/api/v1/user/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            deleted: false,
        }),
    });
