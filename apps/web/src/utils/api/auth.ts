import type { loginSchema, User } from "#";
import { useEffect, useState } from "react";

export async function isAuthenticated() {
    const res = await fetch("/api/v1/auth", {
        credentials: "include",
    });

    const data = await res.json();
    if (!("email" in data)) return false;
    return res.ok && data.role === "ADMIN" && data.verified;
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
    const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userCredentials),
    });

    return res;
};

export const logout = async () => {
    return await fetch("/api/v1/auth/logout", { method: "POST" });
};

export const verifyEmailCode = async (email: string, code: string) =>
    await fetch("/api/v1/auth/verify", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
    });

export const sendEmailVerificationCode = async (email: string) =>
    await fetch("/api/v1/auth/send-code", {
        method: "POST",
        credentials: "include",
        body: email,
    });
