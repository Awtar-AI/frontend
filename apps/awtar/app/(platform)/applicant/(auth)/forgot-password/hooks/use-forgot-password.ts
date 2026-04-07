"use client";

import { useMutation } from "@tanstack/react-query";
import type { ForgotPasswordFormData } from "../schemas/forgot-password.schema";
import { forgotPasswordService } from "../services/forgot-password.service";

export function useForgotPassword() {
    return useMutation({
        mutationFn: (payload: ForgotPasswordFormData) =>
            forgotPasswordService.sendResetLink(payload)
    });
}
