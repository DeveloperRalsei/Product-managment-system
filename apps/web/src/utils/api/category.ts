import { Category } from "#";

export const getAllCategories = async (q?: string): Promise<Category[]> =>
    (await fetch(`/api/v1/category${q ? `?q=${q}` : ""}`)).json();
