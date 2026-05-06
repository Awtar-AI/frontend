import http from "@/lib/http";
import type {
    RecruiterRegisterPayload,
    RecruiterRegisterResponse,
} from "../schemas/recruiter-register.schema";

function toFormData(payload: RecruiterRegisterPayload): FormData {
    const fd = new FormData();
    fd.append("first_name", payload.first_name);
    fd.append("last_name", payload.last_name);
    fd.append("email", payload.email);
    fd.append("phone", payload.phone);
    fd.append("password", payload.password);
    fd.append("organization_name", payload.organization_name);
    fd.append("website_url", payload.website_url);
    fd.append("industry", payload.industry);
    fd.append("organization_size", String(payload.organization_size));
    if (payload.linkedin_url) {
        fd.append("linkedin_url", payload.linkedin_url);
    }
    for (const file of payload.business_documents) {
        fd.append("business_documents", file);
    }
    return fd;
}

export const recruiterRegisterApi = {
    async register(payload: RecruiterRegisterPayload) {
        const { data } = await http.post<RecruiterRegisterResponse>(
            "/api/v1/organizations/register",
            toFormData(payload),
        );
        return data;
    },
};
