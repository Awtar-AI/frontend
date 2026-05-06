"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { logoutApi } from "../api/logout.api";

export function useLogout() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useCallback(async () => {
        const { refreshToken } = useAuthStore.getState();

        try {
            if (refreshToken) {
                await logoutApi.logout({ refresh_token: refreshToken });
            }
        } finally {
            useAuthStore.getState().clearAuth();
            queryClient.clear();
            router.push("/login");
        }
    }, [queryClient, router]);
}
