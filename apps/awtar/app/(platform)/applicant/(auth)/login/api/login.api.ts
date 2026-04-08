import http from "@/lib/http";
import type { LoginFormData, LoginResponse } from "../schemas/login.schema";

export const loginApi = {
    async login(payload: LoginFormData) {
        const { data } = await http.post<LoginResponse>("/api/v1/auth/login", payload);
        return data;
    },
};
