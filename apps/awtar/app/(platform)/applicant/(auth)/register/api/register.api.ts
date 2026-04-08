import http from "@/lib/http";
import type {
    RegisterApplicantParams,
    RegisterApplicantPayload,
    RegisterApplicantResponse,
} from "../schemas/register.schema";

function toFormData(payload: RegisterApplicantPayload): FormData {
    const fd = new FormData();
    for (const [key, value] of Object.entries(payload)) {
        if (value == null || value === "") continue;
        if (value instanceof File) {
            fd.append(key, value);
        } else if (Array.isArray(value)) {
            for (const item of value) fd.append(key, String(item));
        } else {
            fd.append(key, String(value));
        }
    }
    return fd;
}

export const registerApi = {
    async register(payload: RegisterApplicantPayload, params?: RegisterApplicantParams) {
        const { data } = await http.post<RegisterApplicantResponse>(
            "/api/v1/users/create",
            toFormData(payload),
            { params: params?.token ? { token: params.token } : undefined },
        );
        return data;
    },
};
