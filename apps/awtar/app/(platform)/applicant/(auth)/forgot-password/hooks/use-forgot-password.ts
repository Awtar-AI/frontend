"use client";

import { useMutation } from "@tanstack/react-query";
import { normalizeError } from "@/lib/errors";
import { toastService } from "@/lib/services/toast.service";
import { forgotPasswordApi } from "../api/forgot-password.api";
import type { ForgotPasswordFormData } from "../schemas/forgot-password.schema";

export function useForgotPassword() {
    return useMutation({
        mutationFn: (payload: ForgotPasswordFormData) => forgotPasswordApi.sendResetLink(payload),
        onSuccess: (data) => {
            toastService.success(data.message || "Reset link sent. Check your inbox.");
        },
        onError: (error) => {
            toastService.error(normalizeError(error).message);
        },
    });
}
