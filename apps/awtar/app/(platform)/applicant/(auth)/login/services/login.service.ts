import { useAuthStore } from "@/lib/store/auth";
import { loginApi } from "../api/login.api";
import { type LoginFormData, parseLoginResponse } from "../schemas/login.schema";

export const loginService = {
    async login(payload: LoginFormData) {
        const response = await loginApi.login(payload);
        const parsed = parseLoginResponse(response);

        useAuthStore.getState().setAuth(
            {
                id: parsed.id,
                email: parsed.email,
                first_name: parsed.first_name,
                last_name: parsed.last_name,
                role: parsed.role,
                is_active: parsed.is_active,
            },
            parsed.access_token,
            parsed.refresh_token,
        );

        return parsed;
    },
};
