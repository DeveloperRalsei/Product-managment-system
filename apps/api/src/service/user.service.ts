import { User } from "#/prisma";
import prisma from "~/lib/prisma";
import { encryptPassword } from "~/utils";

const defaultSelectValues = {
    id: true,
    name: true,
    email: true,
    verified: true,
    role: true,
    deleted: true,
};

const findAllUsers = async (q?: string) => {
    return prisma.user.findMany({
        where: q
            ? {
                  OR: [
                      { name: { contains: q, mode: "insensitive" } },
                      { email: { contains: q, mode: "insensitive" } },
                  ],
              }
            : {},
        select: defaultSelectValues,
    });
};

const findUser = async (emailOrId: string) => {
    const isEmail = emailOrId.includes("@");
    const identifier = isEmail
        ? { email: emailOrId }
        : { id: Number(emailOrId) };

    return prisma.user.findUnique({
        where: identifier,
        select: defaultSelectValues,
    });
};

const createUser = async ({
    name,
    email,
    password,
    phoneNumber,
    role,
}: Omit<
    User,
    | "id"
    | "emailVerificationExpires"
    | "emailVerificationCode"
    | "deleted"
    | "verified"
    | "createdAt"
    | "updatedAt"
>) => {
    const userFound = await prisma.user.findFirst({ where: { email } });

    if (userFound && !userFound.deleted)
        throw new Error("Email already in use");

    const userData = {
        name,
        email,
        password: encryptPassword(password),
        role,
        phoneNumber,
    };

    return prisma.user.upsert({
        create: {
            ...userData,
        },
        update:
            userFound && userFound.deleted
                ? { ...userData, deleted: false }
                : {},
        where: { email },
        select: defaultSelectValues,
    });
};

const deleteUser = async (emailOrId: string, permanently: boolean = false) => {
    const isEmail = emailOrId.includes("@");
    const identifier = isEmail
        ? { email: emailOrId }
        : { id: Number(emailOrId) };

    return permanently
        ? prisma.user.delete({
              where: identifier,
              select: defaultSelectValues,
          })
        : prisma.user.update({
              where: identifier,
              data: { deleted: true },
              select: defaultSelectValues,
          });
};

const updateUser = async (emailOrId: string, data: Partial<User>) => {
    const identifier = emailOrId.includes("@")
        ? { email: emailOrId }
        : { id: Number(emailOrId) };

    return prisma.user.update({
        where: identifier,
        data: {
            ...data,
            password: data.password
                ? encryptPassword(data.password)
                : undefined,
            verified: data.email ? false : undefined,
        },
        select: defaultSelectValues,
    });
};

export default {
    findAllUsers,
    findUser,
    createUser,
    deleteUser,
    updateUser,
};
