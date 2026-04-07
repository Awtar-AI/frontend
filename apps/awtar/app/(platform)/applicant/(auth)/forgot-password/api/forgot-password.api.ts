import { request } from "@/lib/http";
import type { ForgotPasswordFormData } from "../schemas/forgot-password.schema";

export const forgotPasswordApi = {
    sendResetLink(payload: ForgotPasswordFormData) {
        return request<{ message: string }>("/api/v1/auth/forgot-password", {
            method: "POST",
            body: payload,
        });
    },
};
