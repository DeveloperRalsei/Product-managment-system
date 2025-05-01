import { loginSchema, zodLoginSchema } from "#";
import { sign } from "hono/jwt";
import prisma from "~/lib/prisma";
import { validatePass } from "~/utils";

const loginUser = async ({ email, password }: loginSchema) => {
    zodLoginSchema.safeParse({ email, password });
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            name: true,
            email: true,
            password: true,
            verified: true,
            role: true,
        },
    });
    if (!user) throw new Error("404");
    if (!validatePass(password, user.password)) throw new Error("401");
    if (!user.verified) throw new Error("403");

    return [await sign(user, process.env.JWT_TOKEN!), user];
};

export default { loginUser };
