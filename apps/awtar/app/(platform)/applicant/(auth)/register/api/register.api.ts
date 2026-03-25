import { request } from "@/lib/http";
import type {
    RegisterApplicantParams,
    RegisterApplicantPayload,
    RegisterApplicantResponse,
} from "../schemas/register.schema";

function toFormData(payload: RegisterApplicantPayload): FormData {
    const fd = new FormData();

    fd.append("email", payload.email);
    fd.append("first_name", payload.first_name);
    fd.append("last_name", payload.last_name);
    fd.append("password", payload.password);
    fd.append("role", payload.role);

    if (payload.current_job_title) fd.append("current_job_title", payload.current_job_title);
    if (payload.desired_annual_salary_min != null)
        fd.append("desired_annual_salary_min", String(payload.desired_annual_salary_min));
    if (payload.desired_annual_salary_max != null)
        fd.append("desired_annual_salary_max", String(payload.desired_annual_salary_max));
    if (payload.education_level) fd.append("education_level", payload.education_level);
    if (payload.industry_interest) fd.append("industry_interest", payload.industry_interest);
    if (payload.match_smart_notification != null)
        fd.append("match_smart_notification", String(payload.match_smart_notification));
    if (payload.preferred_job_types?.length) {
        for (const jt of payload.preferred_job_types) {
            fd.append("preferred_job_types", jt);
        }
    }
    if (payload.primary_skills) fd.append("primary_skills", payload.primary_skills);
    if (payload.years_of_experience != null)
        fd.append("years_of_experience", String(payload.years_of_experience));
    if (payload.resume) fd.append("resume", payload.resume);

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
