import { resetPasswordApi } from "../api/reset-password.api";
import type { ResetPasswordPayload } from "../schemas/reset-password.schema";

export const resetPasswordService = {
    async resetPassword(payload: ResetPasswordPayload) {
        return resetPasswordApi.resetPassword(payload);
    },
};
