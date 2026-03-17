function getEnvVar(key: string, required = true): string {
    const value = process.env[key];
    if (required && (value === undefined || value === "")) {
        throw new Error(
            `Missing required environment variable: ${key}. ` +
                `Copy .env.example to .env.local and set it.`,
        );
    }
    return value ?? "";
}

export const API_URL = getEnvVar("NEXT_PUBLIC_API_URL");
