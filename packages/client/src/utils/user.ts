import { User } from "#";

export async function isAuthenticated() {
    const token = localStorage.getItem("session-token");
    if (!token || (token && token === "") || (token && token === "undefined")) {
        return false;
    }

    const res = await fetch("/api/auth", {
        credentials: "include",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) return false;

    return true;
}

export const getUser = async (): Promise<User | undefined> => {
    return await fetch("/api/auth").then((res) => {
        if (res.ok) {
            return res.json();
        }
    });
};
