export const getAllProducts = async (q?: string) =>
    fetch(`/api/v1/product${q ? `?q=${q}` : ""}`);

export const createNewProduct = async (formData: FormData) =>
    await fetch("/api/v1/product/new", {
        method: "POST",
        body: formData,
    });
