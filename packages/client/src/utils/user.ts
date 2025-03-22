import { User } from "#";
import { useAuth } from "@/components/user";

export function isAuthenticated() {
    const auth = useAuth();
    return !!auth.user;
}

export const getUser = async (): Promise<User> => {
    const res = await fetch("/api/auth");
    if (!res.ok) {
        throw new Error("Failed to fetch user");
    }
    return await res.json();
};
