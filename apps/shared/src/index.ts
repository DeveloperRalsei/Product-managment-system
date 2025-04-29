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
