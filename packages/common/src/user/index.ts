export type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    role: Role;
    roleId: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
};

export type Role = {
    id: number;
    key: RoleKey;
    permissions: Permission[];
};

export type RoleKey = "admin" | "mod" | "user";

export type Permission = "read" | "update" | "delete" | "create";

export type authSchema = {
    email: string;
    password: string;
};
