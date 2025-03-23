import { User } from "#";
import { useAuth } from "@/components/user";

export function isAuthenticated() {
    const auth = useAuth();
    return !!auth.user;
}

export const getUser = async (): Promise<string | User | undefined> => {
    return await fetch("/api/auth").then((res) => {
        if (res.ok) {
            return res.text();
        }
    });
};
