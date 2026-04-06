import { useAuthStore } from "@/lib/store/auth";
import { loginApi } from "../api/login.api";
import { type LoginPayload, parseLoginResponse, validateLoginForm } from "../schemas/login.schema";

export class LoginValidationError extends Error {
    constructor(public fieldErrors: Record<string, string>) {
        super("Login form is invalid");
        this.name = "LoginValidationError";
    }
}

export const loginService = {
    async login(payload: LoginPayload) {
        const validated = validateLoginForm(payload);
        if (!validated.success) {
            throw new LoginValidationError(validated.errors);
        }

        const response = await loginApi.login(validated.data);
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
