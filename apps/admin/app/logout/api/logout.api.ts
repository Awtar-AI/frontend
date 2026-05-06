import http from "@/lib/http";
import type { LogoutPayload, LogoutResponse } from "../schemas/logout.schema";

export const logoutApi = {
    async logout(payload: LogoutPayload): Promise<LogoutResponse> {
        const { data } = await http.post<LogoutResponse>("/api/v1/auth/logout", payload);
        return data;
    },
};
