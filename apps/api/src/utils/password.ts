import { genSaltSync, hashSync, compareSync } from "bcryptjs";
const salt = genSaltSync(10);

export const encryptPassword = (password: string) => hashSync(password, salt);

export const validatePass = (password: string, excepted: string) =>
    compareSync(password, excepted);
