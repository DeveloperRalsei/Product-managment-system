import { z } from "zod";
import { User } from "#/prisma";
import { productSchema } from "#";

export type AuthUser = {
    id: string;
    email: string;
    role: keyof User["role"];
    name?: string;
};

export type ProductInput = z.infer<typeof productSchema>;
