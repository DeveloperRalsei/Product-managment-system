import { tryCatch } from "#";
import { MiddlewareHandler } from "hono";
import categoryService from "~/service/category.service";

export const getAllCategories: MiddlewareHandler = async (c) => {
    const query = c.req.query("q");
    const [categories, error] = await tryCatch(
        () => categoryService.get(query),
        true,
    );
    if (error) return c.json({ error });
    return c.json(categories);
};
