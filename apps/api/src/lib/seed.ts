// @ts-ignore
import { PrismaClient } from "#/prisma";
import { encryptPassword } from "~/utils";

const prisma = new PrismaClient();

async function main() {
    const pCat = await prisma.parentCategory.create({
        data: {
            name: "Kolonya",
        },
    });

    const cCat = await prisma.childCategory.create({
        data: {
            name: "Gül Kolonyası",
            ParentCategory: {
                connect: {
                    id: pCat.id,
                },
            },
        },
    });
}

main()
    .catch((e) => {
        console.error("Seed sırasında hata:", e);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });
