import { forgotPasswordApi } from "../api/forgot-password.api";
import type { ForgotPasswordFormData } from "../schemas/forgot-password.schema";

export const forgotPasswordService = {
    async sendResetLink(payload: ForgotPasswordFormData) {
        return forgotPasswordApi.sendResetLink(payload);
    },
};
