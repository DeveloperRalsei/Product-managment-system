export * from "./utils";
export * from "./zodSchemas";

export type User = {
    id: number | string;
    name: string;
    email: string;
    password: string;
    verified: boolean;
};

export type loginSchema = {
    email: string;
    password: string;
};
