import { Prisma } from "#/prisma";
import { Context } from "hono";
import prisma from "~/lib/prisma";
import { ProductInput } from "~/types";

const defaultSelectValues: Prisma.ProductSelect = {
    id: true,
    name: true,
    description: true,
    innerCategoryId: true,
    isActive: true,
    updatedAt: true,
    createdAt: true,
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

const create = async ({ images, ...p }: ProductInput, c: Context) => {
    const imgList: string[] = c.get("uploadedFiles");

    imgList.forEach((img) => {
        if (img.startsWith(process.cwd())) img = img.replace(process.cwd(), "");
    });

    const { id } = (await prisma.innerCategory.findMany())[0];

    const data = {
        ...p,
        images: imgList,
        innerCategoryId: id,
    };

    console.log(data);

    return await prisma.product.create({
        data,
        select: defaultSelectValues,
    });
};
export default { getAll, create };
