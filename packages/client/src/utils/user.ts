import { User } from "#";

export async function isAuthenticated() {
    const res = await fetch("/api/auth", { credentials: "include" });
    const user = await res.json();
    console.log(user);
    return !!user;
}

export const getUser = async (): Promise<User | undefined> => {
    return await fetch("/api/auth").then((res) => {
        if (res.ok) {
            return res.json();
        }
    });
};
