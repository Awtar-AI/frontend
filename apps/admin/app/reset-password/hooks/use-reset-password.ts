"use client";

import { useMutation } from "@tanstack/react-query";
import { normalizeError } from "@/lib/errors";
import { resetPasswordApi } from "../api/reset-password.api";
import type { ResetPasswordPayload } from "../schemas/reset-password.schema";

export function useResetPassword() {
    return useMutation({
        mutationFn: (payload: ResetPasswordPayload) => resetPasswordApi.resetPassword(payload),
    });
}

export function getResetPasswordErrorMessage(error: unknown): string {
    return normalizeError(error).message;
}
