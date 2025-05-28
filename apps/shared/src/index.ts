import { z } from "zod";
import { categorySchema, productSchema } from "./zodSchemas";

export * from "./utils";
export * from "./zodSchemas";

export type Role = "ADMIN" | "USER";

export type User = {
    id: string;
    name?: string;
    email: string;
    password: string;
    role: Role;
    verified: boolean;
    emailVerificationCode?: string;
    emailVerificationExpires?: Date;
    deleted: boolean;
};

export type loginSchema = {
    email: string;
    password: string;
};

export enum Currency {
    TRY,
    EUR,
    USD,
}

export type Product = Omit<z.infer<typeof productSchema>, "images"> & {
    id: string;
    images: string[];
};
export type ProductReturnType = Omit<Product, "categoryIDs"> & {
    categories: (Category & { id: number })[];
};
export type Category = z.infer<typeof categorySchema> & { id: string };

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 50, // 50m MB
    ACCEPTED_FILE_TYPES = [
        "application/json",
        "audio/mpeg",
        "image/svg+xml",
        "text/plain",
        "video/mp4",
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/webp",
    ];
