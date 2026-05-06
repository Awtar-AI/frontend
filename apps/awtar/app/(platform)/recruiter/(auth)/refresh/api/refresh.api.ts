import http from "@/lib/http";
import {
    parseLoginResponse,
    type LoginResponse,
} from "../../login/schemas/login.schema";
import type { RefreshSessionPayload } from "../schemas/refresh.schema";

export const refreshSessionApi = {
    async refresh(payload: RefreshSessionPayload): Promise<LoginResponse> {
        const { data } = await http.post("/api/v1/auth/refresh", payload);
        return parseLoginResponse(data);
    },
};
