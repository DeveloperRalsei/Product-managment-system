import crypto from "crypto";

export const createSecret = () => {
    return crypto.randomBytes(64).toString("hex");
};
