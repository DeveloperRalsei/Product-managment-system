export const REQUIRED_ENV_VARIABLES = [
    "PORT",
    "JWT_TOKEN",
    "DATABASE_URL",
    "RESEND_KEY",
    "ALLOWED_ORIGINS",
];

export function validateEnv() {
    const missing = REQUIRED_ENV_VARIABLES.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        const missingEnvVariables = missing.join(", ");
        console.error("Missing env variables:", missingEnvVariables);
        return missingEnvVariables;
    }

    return null;
}
