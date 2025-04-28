import { encryptPassword } from "~/utils";
import prisma from "./prisma";

async function main() {
    const user = await prisma.user.upsert({
        where: {
            email: "rizayildirim126@gmail.com",
        },
        update: {},
        create: {
            email: "rizayildirim126@gmail.com",
            password: encryptPassword("123456"),
            name: "Rıza",
            role: "ADMIN",
            verified: true,
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
