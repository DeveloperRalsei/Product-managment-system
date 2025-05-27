import { Prisma, Product } from "#/prisma";
import { Context } from "hono";
import prisma from "~/lib/prisma";
import { ProductInput } from "~/types";

const defaultSelectValues: Prisma.ProductSelect = {
    id: true,
    name: true,
    description: true,
    isActive: true,
    updatedAt: true,
    createdAt: true,
    tags: true,
    price: true,
    currency: true,
    inStock: true,
    quantity: true,
    categoryIDs: true,
    images: true,
    barcode: true,
    rating: true,
    videoUrl: true,
    brand: true,
};

const ITEM_COUNT_PER_PAGE = 20;

const getAll = async (q?: string, page = 1) => {
    const currentPage = Math.max(1, page);
    const where: Prisma.ProductWhereInput = q
        ? {
              OR: [
                  { name: { contains: q, mode: "insensitive" } },
                  { description: { contains: q, mode: "insensitive" } },
              ],
          }
        : {};

    return prisma.product.findMany({
        where,
        skip: (currentPage - 1) * ITEM_COUNT_PER_PAGE || 0,
        take: ITEM_COUNT_PER_PAGE,
        select: defaultSelectValues,
    });
};

const getOneById = async (id: string) =>
    await prisma.product.findUnique({
        where: { id },
        select: defaultSelectValues,
    });

const create = async ({ images, ...p }: ProductInput, c: Context) => {
    const imgList: string[] = c.get("uploadedFiles");

    imgList.forEach((img) => {
        if (img.startsWith(process.cwd())) img = img.replace(process.cwd(), "");
    });

    const data = {
        ...p,
        images: imgList,
    };

    return await prisma.product.create({
        data,
        select: defaultSelectValues,
    });
};

async function remove(type: "byId", id: string): Promise<Product>;
async function remove(type: "multi"): Promise<Product>;
async function remove(type: "byId" | "multi", id?: string) {
    if (type === "byId") {
        if (!id) throw new Error("ID is required for 'byId'");
        return prisma.product.delete({
            where: { id },
        });
    } else {
    }
}

async function update(id: string, { images, ...p }: ProductInput, c: Context) {
    const imgList: string[] = c.get("uploadedFiles");

    imgList.forEach((img) => {
        if (img.startsWith(process.cwd())) img = img.replace(process.cwd(), "");
    });

    const data = {
        ...p,
        images: imgList,
    };

    return await prisma.product.update({
        where: { id },
        data,
        select: defaultSelectValues,
    });
}

export default { getAll, getOneById, create, remove, update };
