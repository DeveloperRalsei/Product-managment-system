import { User } from "#";
import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/utils/user";

type UserContextType = {
    user?: User;
    loading: boolean;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: React.PropsWithChildren) => {
    const { data: user, isPending } = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
    });

    return (
        <UserContext.Provider
            value={{
                user,
                loading: isPending,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("Wrap the app with UserProvider");
    return ctx;
};
