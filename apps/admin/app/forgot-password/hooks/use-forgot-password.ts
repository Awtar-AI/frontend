"use client";

import { useMutation } from "@tanstack/react-query";
import { normalizeError } from "@/lib/errors";
import { forgotPasswordApi } from "../api/forgot-password.api";
import type { ForgotPasswordFormData } from "../schemas/forgot-password.schema";

export function useForgotPassword() {
    return useMutation({
        mutationFn: (payload: ForgotPasswordFormData) => forgotPasswordApi.sendResetLink(payload),
    });
}

export function getForgotPasswordErrorMessage(error: unknown): string {
    return normalizeError(error).message;
}
