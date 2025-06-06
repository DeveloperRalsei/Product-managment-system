import { tryCatch } from "#";
import { MiddlewareHandler } from "hono";
import { Context } from "hono";
import categoryService from "~/service/category.service";
import { CategoryInput } from "~/types";

export const getAllCategories: MiddlewareHandler = async (c) => {
    const query = c.req.query("q");
    const [categories, error] = await tryCatch(
        () => categoryService.get(query),
        true,
    );
    if (error) return c.json({ error });
    const [parentCategories, childCategories] = categories;
    return c.json(categories);
};

export const createNewCategory = async (c: Context, body: CategoryInput) => {};
