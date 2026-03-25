import { request } from "@/lib/http";
import type { LoginPayload, LoginResponse } from "../schemas/login.schema";

export const loginApi = {
    login(payload: LoginPayload) {
        return request<LoginResponse>("/api/v1/auth/login", {
            method: "POST",
            body: payload,
        });
    },
};
