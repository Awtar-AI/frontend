"use client";

import { useMutation } from "@tanstack/react-query";
import type { ResetPasswordPayload } from "../schemas/reset-password.schema";
import { resetPasswordService } from "../services/reset-password.service";

export function useResetPassword() {
    return useMutation({
        mutationFn: (payload: ResetPasswordPayload) => resetPasswordService.resetPassword(payload),
    });
}
