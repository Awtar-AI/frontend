"use client";

import { useMutation } from "@tanstack/react-query";
import { normalizeError } from "@/lib/errors";
import { toastService } from "@/lib/services/toast.service";
import { resetPasswordApi } from "../api/reset-password.api";
import type { ResetPasswordPayload } from "../schemas/reset-password.schema";

export function useResetPassword() {
    return useMutation({
        mutationFn: (payload: ResetPasswordPayload) => resetPasswordApi.resetPassword(payload),
        onSuccess: (data) => {
            toastService.success(data.message || "Password reset successfully.");
        },
        onError: (error) => {
            toastService.error(normalizeError(error).message);
        },
    });
}
