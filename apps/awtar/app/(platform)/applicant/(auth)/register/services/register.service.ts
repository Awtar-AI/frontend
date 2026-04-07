import { useAuthStore } from "@/lib/store/auth";
import { registerApi } from "../api/register.api";
import {
    parseRegisterApplicantResponse,
    type RegisterApplicantParams,
    type RegisterApplicantPayload,
} from "../schemas/register.schema";

export const registerService = {
    async register(payload: RegisterApplicantPayload, params?: RegisterApplicantParams) {
        const response = await registerApi.register(payload, params);
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
