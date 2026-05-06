import axios from "axios";
import { z } from "zod";
import { AppError, normalizeError } from "@/lib/errors";
import { useAuthStore } from "@/lib/store/auth";

const refreshSessionResponseSchema = z.object({
    id: z.string(),
    access_token: z.string(),
    refresh_token: z.string(),
    role: z.enum(["candidate", "hr", "admin"]),
    last_login_organization: z.string().nullable().optional(),
});

export type RefreshSessionResponse = z.infer<typeof refreshSessionResponseSchema>;

const TERMINAL_REFRESH_FAILURE_STATUSES = new Set([401, 422]);

const refreshClient = axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_API_URL ||
        (process.env.NODE_ENV === "development" ? "http://localhost:5432" : ""),
});

let inFlightRefresh: Promise<RefreshSessionResponse> | null = null;

export async function refreshAuthSessionSingleFlight(): Promise<RefreshSessionResponse> {
    const runRefresh = async (): Promise<RefreshSessionResponse> => {
        const { refreshToken } = useAuthStore.getState();
        if (!refreshToken) {
            throw new AppError(401, "Missing refresh token.", "UNAUTHORIZED");
        }

        const { data } = await refreshClient.post("/api/v1/auth/refresh", {
            refresh_token: refreshToken,
        });
        const parsed = refreshSessionResponseSchema.parse(data);

        useAuthStore.getState().setSession({
            accessToken: parsed.access_token,
            refreshToken: parsed.refresh_token,
            userId: parsed.id,
            role: parsed.role,
            organizationId: parsed.last_login_organization ?? null,
        });

        return parsed;
    };

    if (!inFlightRefresh) {
        inFlightRefresh = runRefresh().finally(() => {
            inFlightRefresh = null;
        });
    }

    return inFlightRefresh;
}

export function isTerminalRefreshError(error: unknown): boolean {
    const appError = normalizeError(error);
    return TERMINAL_REFRESH_FAILURE_STATUSES.has(appError.status);
}
