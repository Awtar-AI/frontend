"use client";

import { useMutation } from "@tanstack/react-query";
import { AppError, normalizeError } from "@/lib/errors";
import { useAuthStore } from "@/lib/store/auth";
import { refreshSessionApi } from "../api/refresh.api";

export function useRefreshSession() {
    return useMutation({
        mutationFn: async () => {
            const { refreshToken } = useAuthStore.getState();
            if (!refreshToken) {
                throw new AppError(401, "Missing refresh token.", "UNAUTHORIZED");
            }

            const data = await refreshSessionApi.refresh({ refresh_token: refreshToken });
            if (data.role !== "admin") {
                throw new AppError(403, "This portal is only for admin accounts.", "FORBIDDEN");
            }

            return data;
        },
        onSuccess: (data) => {
            useAuthStore.getState().setSession({
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                userId: data.id,
                role: data.role,
                organizationId: data.last_login_organization,
            });
        },
        onError: () => {
            useAuthStore.getState().clearAuth();
        },
    });
}

export function getRefreshSessionErrorMessage(error: unknown): string {
    return normalizeError(error).message;
}
