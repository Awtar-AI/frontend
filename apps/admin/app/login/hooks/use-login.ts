"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AppError, normalizeError } from "@/lib/errors";
import { useAuthStore } from "@/lib/store/auth";
import { loginApi } from "../api/login.api";
import type { LoginFormData } from "../schemas/login.schema";

export function useLogin() {
    const router = useRouter();

    return useMutation({
        mutationFn: async (payload: LoginFormData) => {
            const data = await loginApi.login(payload);
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
            router.push("/dashboard");
        },
        onError: () => {
            useAuthStore.getState().clearAuth();
        },
    });
}

export function getLoginErrorMessage(error: unknown): string {
    return normalizeError(error).message;
}
