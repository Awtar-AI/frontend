"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { authLogoutApi } from "@/lib/auth/logout.api";
import { toastService } from "@/lib/services/toast.service";
import { useAuthStore } from "@/lib/store/auth";

type SignOutOptions = {
    redirectTo: string;
    successMessage?: string;
};

export function useSignOut() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useCallback(
        async ({ redirectTo, successMessage = "Signed out successfully." }: SignOutOptions) => {
            const { refreshToken } = useAuthStore.getState();

            try {
                if (refreshToken) {
                    await authLogoutApi.logout(refreshToken);
                }
            } finally {
                useAuthStore.getState().clearAuth();
                queryClient.clear();
                toastService.dismissAll();
                toastService.success(successMessage);
                router.push(redirectTo);
            }
        },
        [queryClient, router],
    );
}
