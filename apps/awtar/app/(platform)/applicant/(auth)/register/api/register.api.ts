import { request } from "@/lib/http";
import type {
    RegisterApplicantParams,
    RegisterApplicantPayload,
    RegisterApplicantResponse,
} from "../schemas/register.schema";

/** Resume upload requires multipart/form-data; use FormData for all fields. */
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
    register(payload: RegisterApplicantPayload, params?: RegisterApplicantParams) {
        const queryParams = params?.token ? { token: params.token } : undefined;

        return request<RegisterApplicantResponse>("/api/v1/users/create", {
            method: "POST",
            body: toFormData(payload),
            params: queryParams,
        });
    },
};
