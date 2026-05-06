import http from "@/lib/http";
import type { ResetPasswordPayload, ResetPasswordResponse } from "../schemas/reset-password.schema";

export const resetPasswordApi = {
    async resetPassword(payload: ResetPasswordPayload): Promise<ResetPasswordResponse> {
        const { data } = await http.post("/api/v1/auth/reset-password", payload);
        return data;
    },
};
