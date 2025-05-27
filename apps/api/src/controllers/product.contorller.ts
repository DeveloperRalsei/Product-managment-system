import { tryCatch } from "#";
import { Prisma } from "#/prisma";
import { MiddlewareHandler } from "hono";
import { Context } from "hono";
import productService from "~/service/product.service";
import { ProductInput } from "~/types";

export const getAllProducts: MiddlewareHandler = async (c) => {
    const { q, page } = c.req.query();
    const [result, error] = await tryCatch(() =>
        productService.getAll(q, Number(page)),
    );
    if (error) return c.json({ error }, 400);
    return c.json(result);
};

export const getProductById: MiddlewareHandler = async (c) => {
    const id = c.req.param("id");
    if (!id) return c.json({ message: "Proivde an ID" }, 400);
    const [product, error] = await tryCatch(() =>
        productService.getOneById(id),
    );
    if (error) return c.json({ error }, 400);
    return c.json(product ?? null, product ? undefined : 404);
};

export const updateProductById = async (c: Context, body: ProductInput) => {
    const id = c.req.param("id");
    if (!id) return c.json({ message: "Proveide an ID" }, 400);
    const [product, error] = await tryCatch(() =>
        productService.update(id, body, c),
    );
    if (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError)
            return c.json({ error }, 403);
        return c.json({ error }, 400);
    }
    return c.json({ message: "Product Updated", product }, 202);
};

export const createProduct = async (c: Context, body: ProductInput) => {
    const [product, error] = await tryCatch(() =>
        productService.create(body, c),
    );
    if (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError)
            return c.json({ error }, 403);
        return c.json({ error }, 400);
    }
    return c.json({ message: "Product Created", product }, 201);
};

export const deleteProdutById: MiddlewareHandler = async (c) => {
    const id = c.req.param("id");
    if (!id) return c.json({ message: "No id provided" }, 400);
    const [product, error] = await tryCatch(() =>
        productService.remove("byId", id),
    );
    if (error) return c.json({ error }, 400);
    return c.json({ message: "Product deleted successfuly", product }, 202);
};
