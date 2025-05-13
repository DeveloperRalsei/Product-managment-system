import { MiddlewareHandler } from "hono";
import categoryService from "~/service/category.service";

export const getAllCategories: MiddlewareHandler = async (c) => {
    const query = c.req.query("q");
    try {
        const categories = await categoryService.get(query);
        return c.json(categories);
    } catch (error) {
        console.error(error);
        return c.json({
            error,
        });
    }
};
