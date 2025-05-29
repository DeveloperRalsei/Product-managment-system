import prisma from "~/lib/prisma";

const get = async (query?: string) => {
    const idenifier: any = { name: { contains: query, mode: "insensitive" } };
    return Promise.all([
        prisma.parentCategory.findMany({
            where: idenifier,
            include: { childCategories: true },
        }),
        prisma.childCategory.findMany({
            where: idenifier,
            include: { products: true },
        }),
    ]);
};

export default { get };
