import { encryptPassword } from "~/utils";
import prisma from "./prisma";

async function main() {
    const user = await prisma.user.upsert({
        where: {
            email: "admin@example.com",
        },
        update: {},
        create: {
            email: "admin@example.com",
            password: encryptPassword("12341234"),
            name: "Admin User Example",
        },
    });

    console.log("seed action successful ✅\n", user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
