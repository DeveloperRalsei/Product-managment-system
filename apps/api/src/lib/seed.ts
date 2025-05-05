import { PrismaClient } from "#/prisma";

const prisma = new PrismaClient();

async function main() {
    const category = await prisma.category.create({
        data: {
            name: "Elektronik",
        },
    });

    const innerCategory = await prisma.innerCategory.create({
        data: {
            name: "Kulaklık",
            categoryId: category.id,
        },
    });

    console.log("Kategori oluşturuldu:", category);
    console.log("Alt Kategori oluşturuldu:", innerCategory);
}

main()
    .catch((e) => {
        console.error("Seed sırasında hata:", e);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });
