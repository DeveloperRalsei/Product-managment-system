import { User } from "../generated/prisma";

export type AuthUser = {
    id: string;
    email: string;
    role: keyof User["role"];
    name?: string;
};
