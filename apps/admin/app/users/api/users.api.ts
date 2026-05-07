import http from "@/lib/http";
import {
    type AdminUsersFilters,
    type ChangeUserStatusInput,
    type CreateUserPayload,
    parseUserDetailResponse,
    parseUserListResponse,
    type SimpleMessageResponse,
    type UserDetailResponse,
    type UserListResponse,
} from "../schemas/users.schema";

export const adminUsersApi = {
    async list(filters: AdminUsersFilters): Promise<UserListResponse> {
        const { data } = await http.get("/api/v1/users", { params: filters });
        return parseUserListResponse(data);
    },

    async getOne(userId: string): Promise<UserDetailResponse> {
        const { data } = await http.get(`/api/v1/users/${userId}/single`);
        return parseUserDetailResponse(data);
    },

    async createUser(payload: CreateUserPayload): Promise<SimpleMessageResponse> {
        const formData = new FormData();

        // Add common fields
        formData.append("role", payload.role);
        formData.append("email", payload.email);
        formData.append("first_name", payload.first_name);
        formData.append("last_name", payload.last_name);
        formData.append("password", payload.password);

        if (payload.role === "admin") {
            // Admin has no additional fields
        } else if (payload.role === "hr") {
            formData.append("phone", payload.phone);
            formData.append("organization_name", payload.organization_name);
            formData.append("website_url", payload.website_url);
            formData.append("industry", payload.industry);
            formData.append("organization_size", payload.organization_size.toString());
            if (payload.linkedin_url) {
                formData.append("linkedin_url", payload.linkedin_url);
            }
            payload.business_documents.forEach((file, _index) => {
                formData.append(`business_documents`, file);
            });
        } else if (payload.role === "candidate") {
            if (payload.current_job_title) {
                formData.append("current_job_title", payload.current_job_title);
            }
            if (payload.desired_annual_salary_min !== undefined) {
                formData.append(
                    "desired_annual_salary_min",
                    payload.desired_annual_salary_min.toString(),
                );
            }
            if (payload.desired_annual_salary_max !== undefined) {
                formData.append(
                    "desired_annual_salary_max",
                    payload.desired_annual_salary_max.toString(),
                );
            }
            if (payload.education_level) {
                formData.append("education_level", payload.education_level);
            }
            if (payload.industry_interest) {
                formData.append("industry_interest", payload.industry_interest);
            }
            if (payload.match_smart_notification !== undefined) {
                formData.append(
                    "match_smart_notification",
                    payload.match_smart_notification.toString(),
                );
            }
            if (payload.preferred_job_types) {
                payload.preferred_job_types.forEach((type) => {
                    formData.append("preferred_job_types", type);
                });
            }
            if (payload.primary_skills) {
                formData.append("primary_skills", payload.primary_skills);
            }
            if (payload.years_of_experience !== undefined) {
                formData.append("years_of_experience", payload.years_of_experience.toString());
            }
            if (payload.linkedin_url) {
                formData.append("linkedin_url", payload.linkedin_url);
            }
            if (payload.location) {
                formData.append("location", payload.location);
            }
            if (payload.professional_summary) {
                formData.append("professional_summary", payload.professional_summary);
            }
            if (payload.resume) {
                formData.append("resume", payload.resume);
            }
        }

        const { data } = await http.post("/api/v1/users/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    },

    async updateStatus(
        userId: string,
        payload: ChangeUserStatusInput,
    ): Promise<SimpleMessageResponse> {
        const { data } = await http.patch(`/api/v1/admin/${userId}/update-status`, payload);
        return data;
    },
};
