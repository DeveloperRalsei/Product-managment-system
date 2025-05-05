import { Product } from "#";
import { ProductFormValues } from "@/components/ui/form/product";

export const getAllProducts = async (q?: string): Promise<Product[]> =>
    (await fetch(`/api/v1/product${q ? `?q=${q}` : ""}`)).json();

export const createNewProduct = async (p: ProductFormValues) => {
    const formData = new FormData();
    formData.append("name", p.name);
    formData.append("description", p.description || "");
    formData.append("price", String(p.price));
    formData.append("currency", p.currency);
    formData.append("inStock", String(p.inStock));
    formData.append("isActive", String(p.isActive));
    formData.append("quantity", String(p.quantity));
    formData.append("innerCategoryId", p.innerCategoryId);

    for (const img of p.images) {
        formData.append("images", img);
    }

    for (const tag of p.tags) {
        formData.append("tags", tag);
    }
    return await fetch("/api/v1/product/new", {
        method: "POST",
        body: formData,
    });
};
