// @ts-ignore
import { PrismaClient } from "#/prisma";
import { encryptPassword } from "~/utils";

const prisma = new PrismaClient();

async function main() {
    return prisma.category.create({
        data: {
            name: "Kolonyalar",
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
