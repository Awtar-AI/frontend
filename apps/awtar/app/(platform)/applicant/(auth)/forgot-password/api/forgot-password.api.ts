import http from "@/lib/http";
import type { ForgotPasswordFormData } from "../schemas/forgot-password.schema";

export const forgotPasswordApi = {
    async sendResetLink(payload: ForgotPasswordFormData) {
        const { data } = await http.post<{ message: string }>(
            "/api/v1/auth/forgot-password",
            payload,
        );
        return data;
    },
};
