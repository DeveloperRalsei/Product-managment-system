import prisma from "~/lib/prisma";

const get = async (query?: string) => {
    return await prisma.category.findMany({
        where: query ? { name: { contains: query, mode: "insensitive" } } : {},
    });
};

export default { get };
