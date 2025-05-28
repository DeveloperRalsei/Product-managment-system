// @ts-ignore
import { PrismaClient } from "#/prisma";
import { encryptPassword } from "~/utils";

const prisma = new PrismaClient();

async function main() {
    return prisma.user.create({
        data: {
            email: "rizayildirim126@gmail.com",
            password: encryptPassword("123123"),
            role: "ADMIN",
            name: "",
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
