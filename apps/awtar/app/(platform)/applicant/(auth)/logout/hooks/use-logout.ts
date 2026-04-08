"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toastService } from "@/lib/services/toast.service";
import { useAuthStore } from "@/lib/store/auth";
import { logoutApi } from "../api/logout.api";

export function useLogout() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useCallback(async () => {
        const { refreshToken } = useAuthStore.getState();

        try {
            if (refreshToken) {
                await logoutApi.logout(refreshToken);
            }
        } finally {
            useAuthStore.getState().clearAuth();
            queryClient.clear();
            toastService.success("Logged out successfully.");
            router.push("/applicant/login");
        }
    }, [queryClient, router]);
}
