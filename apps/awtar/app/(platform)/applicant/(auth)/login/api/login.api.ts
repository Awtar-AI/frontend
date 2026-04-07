import { request } from "@/lib/http";
import type { LoginFormData, LoginResponse } from "../schemas/login.schema";

export const loginApi = {
    login(payload: LoginFormData) {
        return request<LoginResponse>("/api/v1/auth/login", {
            method: "POST",
            body: payload,
        });
    },
};
