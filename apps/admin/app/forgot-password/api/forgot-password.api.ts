import http from "@/lib/http";
import type {
    ForgotPasswordFormData,
    ForgotPasswordResponse,
} from "../schemas/forgot-password.schema";

export const forgotPasswordApi = {
    async sendResetLink(payload: ForgotPasswordFormData): Promise<ForgotPasswordResponse> {
        const { data } = await http.post("/api/v1/auth/forgot-password", payload);
        return data;
    },
};
