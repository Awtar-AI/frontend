import http from "@/lib/http";
import type { ResetPasswordPayload } from "../schemas/reset-password.schema";

export const resetPasswordApi = {
    async resetPassword(payload: ResetPasswordPayload) {
        const { data } = await http.post<{ message: string }>(
            "/api/v1/auth/reset-password",
            payload,
        );
        return data;
    },
};
