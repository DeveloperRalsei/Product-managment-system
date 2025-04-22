import { verify } from "hono/jwt";

export const validateToken = async (token: string) => {
    const publicKey = process.env.JWT_TOKEN;
    if (!publicKey) {
        throw new Error("JWT_TOKEN undefined");
    }

    return await verify(token, publicKey);
};
