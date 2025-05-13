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

export type Product = {
    id: string;
    name: string;
    description?: string;
    price: number;
    currency: keyof typeof Currency;
    inStock: boolean;
    isActive: boolean;
    quantity: number;
    images: string[];
    tags: string[];
    categoryIDs: string[];
};

export type Category = {
    id: string;
    name: string;
    bannerUrl?: string;
    logoUrl?: string;
    parentCategoryIds: string[];
};

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 50, // 50m MB
    ACCEPTED_FILE_TYPES = [
        "application/json",
        "audio/mpeg",
        "application/pdf",
        "image/svg+xml",
        "text/plain",
        "video/mp4",
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/webp",
    ];
