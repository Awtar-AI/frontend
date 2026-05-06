import { parseLoginResponse } from "@/app/login/schemas/login.schema";
import http from "@/lib/http";
import type { RefreshSessionPayload, RefreshSessionResponse } from "../schemas/refresh.schema";

export const refreshSessionApi = {
    async refresh(payload: RefreshSessionPayload): Promise<RefreshSessionResponse> {
        const { data } = await http.post("/api/v1/auth/refresh", payload);
        return parseLoginResponse(data);
    },
};
