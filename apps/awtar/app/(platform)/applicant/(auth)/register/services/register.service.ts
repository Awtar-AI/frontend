import { useAuthStore } from "@/lib/store/auth";
import { registerApi } from "../api/register.api";
import {
    parseRegisterApplicantResponse,
    type RegisterApplicantParams,
    type RegisterApplicantPayload,
    validateRegisterApplicantPayload,
} from "../schemas/register.schema";

export class RegisterValidationError extends Error {
    constructor(public fieldErrors: Record<string, string>) {
        super("Register form is invalid");
        this.name = "RegisterValidationError";
    }
}

export const registerService = {
    async register(payload: RegisterApplicantPayload, params?: RegisterApplicantParams) {
        const validated = validateRegisterApplicantPayload(payload);
        if (!validated.success) {
            throw new RegisterValidationError(validated.errors);
        }

        const response = await registerApi.register(validated.data, params);
        const parsed = parseRegisterApplicantResponse(response);

        useAuthStore.getState().setUser({
            id: parsed.id,
            email: parsed.email,
            first_name: parsed.first_name,
            last_name: parsed.last_name,
            role: parsed.role,
            is_active: parsed.is_active,
        });

        return parsed;
    },
};
