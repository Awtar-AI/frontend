"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { normalizeError } from "@/lib/errors";
import { USER_QUERY_KEY } from "@/lib/hooks/use-current-user";
import { toastService } from "@/lib/services/toast.service";
import { useAuthStore } from "@/lib/store/auth";
import { loginApi } from "../api/login.api";
import type { LoginFormData } from "../schemas/login.schema";

export function useLogin() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: LoginFormData) => loginApi.login(payload),
        onSuccess: (data) => {
            useAuthStore.getState().setSession({
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                userId: data.id,
                role: data.role,
                organizationId: data.last_login_organization,
            });
            queryClient.invalidateQueries({ queryKey: [...USER_QUERY_KEY] });
            toastService.success("Logged in successfully.");
            router.push("/applicant/dashboard");
        },
        onError: (error) => {
            toastService.error(normalizeError(error).message);
        },
    });
}
