import { MiddlewareHandler } from "hono";
import { Context } from "hono";
import productService from "~/service/product.service";
import { ProductInput } from "~/types";

export const getAllProducts: MiddlewareHandler = async (c) => {
    const q = c.req.query("q");
    try {
        const products = await productService.getAll(q);
        return c.json(products);
    } catch (error) {
        return c.json(
            {
                error,
            },
            400,
        );
    }
};

export const createProduct = async (c: Context, body: ProductInput) => {
    try {
        const product = await productService.create(body);
        return c.json({ message: "Product Created", product }, 201);
    } catch (error) {
        return c.json({ error }, 400);
    }
};
