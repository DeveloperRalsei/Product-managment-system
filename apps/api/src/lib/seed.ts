// @ts-ignore
import { PrismaClient } from "#/prisma";

const prisma = new PrismaClient();

async function main() {
    return await prisma.product.deleteMany();
}

main()
    .then((res) => {
        console.log("Deleted all products successfuly: COUNT: " + res.count);
    })
    .catch((e) => {
        console.error("Seed sırasında hata:", e);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });
