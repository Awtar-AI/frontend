import { request } from "@/lib/http";
import type { ResetPasswordPayload } from "../schemas/reset-password.schema";

export const resetPasswordApi = {
    resetPassword(payload: ResetPasswordPayload) {
        return request<{ message: string }>("/api/v1/auth/reset-password", {
            method: "POST",
            body: payload,
        });
    },
};
