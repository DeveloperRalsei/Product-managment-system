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
    category: InnerCategory;
    innerCategoryId: string;
    tags: string[];
};

export type Category = {
    id: string;
    name: string;
    innerCategories: InnerCategory[];
};

export type InnerCategory = {
    id: string;
    name: string;
    products: Product[];
    category: Category;
    categoryId: String;
};
