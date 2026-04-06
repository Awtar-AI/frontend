import { z } from "zod";
import type { AppUser } from "../models/app-user";

/** `GET /api/v1/users/:userId/single` — see APPLICANT-FRONTEND-API.md */
export const candidateProfileResponseSchema = z.object({
    current_job_title: z.string().optional(),
    desired_annual_salary_max: z.number().optional(),
    desired_annual_salary_min: z.number().optional(),
    education_level: z.string().optional(),
    industry_interest: z.string().optional(),
    match_smart_notification: z.boolean().optional(),
    preferred_job_types: z.array(z.string()).optional(),
    primary_skills: z.array(z.string()).optional(),
    resume_url: z.string().optional(),
    years_of_experience: z.number().optional(),
});

export const userMeResponseSchema = z.object({
    id: z.string(),
    email: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    is_active: z.boolean(),
    role: z.enum(["candidate", "hr", "admin"]),
    candidate_profile: candidateProfileResponseSchema.nullable().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    deleted_at: z.string().nullable().optional(),
    deleted_by: z.string().nullable().optional(),
    last_logged_in_at: z.string().nullable().optional(),
    last_log_in_at: z.string().nullable().optional(),
});

export type UserMeResponse = z.infer<typeof userMeResponseSchema>;

export function parseUserMeResponse(data: unknown): UserMeResponse {
    return userMeResponseSchema.parse(data);
}

export function appUserFromMeResponse(me: UserMeResponse): AppUser {
    return {
        id: me.id,
        email: me.email,
        first_name: me.first_name,
        last_name: me.last_name,
        role: me.role,
        is_active: me.is_active,
        candidate_profile: me.candidate_profile ?? null,
        created_at: me.created_at,
        updated_at: me.updated_at,
        deleted_at: me.deleted_at ?? null,
        deleted_by: me.deleted_by ?? null,
        last_logged_in_at: me.last_logged_in_at ?? me.last_log_in_at ?? null,
    };
}

export function applicantDisplayName(user: Pick<AppUser, "first_name" | "last_name">): string {
    return `${user.first_name} ${user.last_name}`.trim();
}
