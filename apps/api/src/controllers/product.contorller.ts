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
        console.error(error);
        return c.json(
            {
                error,
            },
            400,
        );
    }
};

export const getProductById: MiddlewareHandler = async (c) => {
    const id = c.req.param("id");
    if (!id) return c.json({ message: "Proivde an ID" }, 400);
    try {
        const product = await productService.getOneById(id);
        return c.json(product ?? null, product ? undefined : 404);
    } catch (error) {
        console.error(404);
        return c.json({ error }, 400);
    }
};

export const updateProductById = async (c: Context, body: ProductInput) => {
    const id = c.req.param("id");
    if (!id) return c.json({ message: "Proveide an ID" }, 400);

    try {
        const product = await productService.update(id, body, c);
        return c.json(
            {
                message: "Product Updated",
                product,
            },
            202,
        );
    } catch (error) {
        console.error(error);
        return c.json({ error }, 400);
    }
};

export const createProduct = async (c: Context, body: ProductInput) => {
    try {
        const product = await productService.create(body, c);
        return c.json({ message: "Product Created", product }, 201);
    } catch (error) {
        console.error(error);
        return c.json({ error }, 400);
    }
};

export const deleteProdutById: MiddlewareHandler = async (c) => {
    const id = c.req.param("id");

    if (!id) {
        return c.json(
            {
                message: "No id provided",
            },
            400,
        );
    }

    try {
        const product = await productService.remove("byId", id);
        return c.json(
            {
                message: "Product deleted successfuly",
                product,
            },
            202,
        );
    } catch (error) {
        console.error(error);
        return c.json(
            {
                error,
            },
            400,
        );
    }
};
