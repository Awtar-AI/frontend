import axios from "axios";

export class AppError extends Error {
    status: number;
    code: string;
    fieldErrors?: Record<string, string>;

    constructor(
        status: number,
        message: string,
        code = "UNKNOWN",
        fieldErrors?: Record<string, string>,
    ) {
        super(message);
        this.name = "AppError";
        this.status = status;
        this.code = code;
        this.fieldErrors = fieldErrors;
    }
}

interface ApiErrorBody {
    message?: string;
    errors?: Array<{ field: string; message: string }>;
}

export function normalizeError(error: unknown): AppError {
    if (error instanceof AppError) return error;

    if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? 0;
        const body = error.response?.data as ApiErrorBody | undefined;
        const message = body?.message || error.message || "An unexpected error occurred";
        const code = status ? `HTTP_${status}` : "NETWORK";

        let fieldErrors: Record<string, string> | undefined;
        if (body?.errors?.length) {
            fieldErrors = {};
            for (const entry of body.errors) {
                fieldErrors[entry.field] = entry.message;
            }
        }

        return new AppError(
            status,
            status === 0 ? "Network error. Please check your connection." : message,
            code,
            fieldErrors,
        );
    }

    if (error instanceof Error) {
        return new AppError(0, error.message, "UNKNOWN");
    }

    return new AppError(0, "An unexpected error occurred", "UNKNOWN");
}
