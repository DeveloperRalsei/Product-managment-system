import { Product } from "#";
import { ProductFormValues } from "@/components/ui/form/product";
import { objectToFormData } from "../createFormData";

export const getAllProducts = async (q?: string, page?: number) =>
    await fetch(
        `/api/v1/product${q ? `?q=${q}` : ""}${page ? `&page=${page}` : ""}`,
    );

export const createNewProduct = async (p: ProductFormValues) => {
    const formData = objectToFormData(p);

    return await fetch("/api/v1/product/new", {
        method: "POST",
        body: formData,
    });
};

export const getProductById = async (id: string): Promise<Product | null> =>
    (await fetch(`/api/v1/product/${id}`)).json();

export const updateProductById = async (id: string, p: ProductFormValues) => {
    const formData = objectToFormData(p);

    return await fetch(`/api/v1/product/${id}`, {
        method: "PATCH",
        body: formData,
    });
};

export const deleteProductById = async (id: string) =>
    fetch(`/api/v1/product/${id}`, { method: "DELETE" });
