export const getAllCategories = async (q?: string) =>
    await fetch(`/api/v1/category${q ? `?q=${q}` : ""}`);
