import type { loginSchema, User } from "#";
import { useEffect, useState } from "react";

export async function isAuthenticated() {
    const res = await fetch("/api/v1/auth", {
        credentials: "include",
    });

    return res.ok;
}

export const useUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null | string | Error>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/v1/auth");
                if (!res.ok) {
                    setError(res.statusText || "Unauthorized");
                    return;
                }
                const data = await res.json();
                setUser(data);
            } catch (err) {
                setError(err instanceof Error ? err : String(err));
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return {
        error,
        loading,
        user,
    };
};

export const login = async (userCredentials: loginSchema) => {
    return await fetch("/api/v1/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userCredentials),
    });
};

export const logout = async () => {
    return await fetch("/api/v1/auth/logout", { method: "POST" });
};
