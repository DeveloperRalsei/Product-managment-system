export const JWT_SECRET = process.env.JWT_SECRET,
    IS_PRODUCTION = process.env.NODE_ENV === "production",
    DOMAIN = IS_PRODUCTION ? process.env.DOMAIN : "localhost:3000";
