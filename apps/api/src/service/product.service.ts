import prisma from "~/lib/prisma";
import { ProductInput } from "~/types";

const defaultSelectValues = {
    id: true,
    name: true,
    description: true,
    categories: true,
    tags: true,
    price: true,
    currency: true,
    inStock: true,
    quantity: true,
    images: true,
};

const getAll = async (q?: string) =>
    await prisma.product.findMany({
        where: q
            ? {
                  OR: [
                      { name: { contains: q, mode: "insensitive" } },
                      { description: { contains: q, mode: "insensitive" } },
                  ],
              }
            : {},
        select: defaultSelectValues,
    });

const create = async ({ images: _, ...p }: ProductInput) =>
    await prisma.product.create({
        data: p,
        select: defaultSelectValues,
    });

export default { getAll, create };
