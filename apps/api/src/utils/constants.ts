export function validateEnv() {
    const required = ["PORT", "JWT_TOKEN", "DATABASE_URL", "RESEND_KEY"];
    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        console.error("Missing env variables:", missing.join(", "));
        return false;
    }

    return true;
}
