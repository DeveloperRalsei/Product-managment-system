import { z } from "zod";
import { productSchema } from "./zodSchemas";
import prisma from "~/lib/prisma";
import { Prisma } from "#/prisma";

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
export type ProductReturnType = (typeof prisma.product.fields)[];

export type ParentCategoryReturnType = Prisma.ParentCategoryGetPayload<{
    include: { childCategories: true };
}>;
export type ChildCategoryReturnType = Prisma.ChildCategoryGetPayload<{
    include: { products: true };
}>;

export type CategoriesReturnType = [
    ParentCategoryReturnType[],
    ChildCategoryReturnType[],
];

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
