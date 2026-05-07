import { z } from "zod";

/** `POST /applications/job/:jobId` body — see APPLICANT-FRONTEND-API.md §6. */
export const applyRequestSchema = z.object({
    resume_url: z.string().optional(),
    cover_letter: z.string().optional(),
    current_job_title: z.string().optional(),
    years_of_experience: z.number().int().min(0).optional(),
    primary_skills: z.array(z.string()).optional(),
    education_level: z.string().optional(),
    employment_type: z.string().optional(),
    experience_level: z.string().optional(),
    is_remote: z.boolean().optional(),
    location: z.string().optional(),
    min_salary: z.number().optional(),
    max_salary: z.number().optional(),
    salary_type: z.string().optional(),
    salary_currency: z.string().optional(),
});

export type ApplyRequestPayload = z.infer<typeof applyRequestSchema>;

export const applicationStatusValues = [
    "Applied",
    "Shortlisted",
    "Interviewed",
    "Passed",
    "Rejected",
    // Legacy values for old rows.
    "Pending",
    "Accepted",
] as const;

export type ApplicationStatus = (typeof applicationStatusValues)[number];

export const applicationResponseSchema = z
    .object({
        id: z.string(),
        job_id: z.string(),
        user_id: z.string(),
        status: z.enum(applicationStatusValues),
        resume_url: z.string().optional(),
        cover_letter: z.string().optional(),
        applicant_first_name: z.string(),
        applicant_last_name: z.string(),
        applicant_email: z.string(),
        current_job_title: z.string().optional(),
        years_of_experience: z.number().optional(),
        primary_skills: z.array(z.string()).optional(),
        education_level: z.string().optional(),
        employment_type: z.string().optional(),
        experience_level: z.string().optional(),
        is_remote: z.boolean().nullable().optional(),
        location: z.string().optional(),
        min_salary: z.number().nullable().optional(),
        max_salary: z.number().nullable().optional(),
        salary_type: z.string().optional(),
        salary_currency: z.string().optional(),
        created_at: z.string(),
        created_by: z.string(),
        updated_at: z.string(),
        updated_by: z.string().optional(),
    })
    .passthrough();

export type ApplicationResponse = z.infer<typeof applicationResponseSchema>;

export function parseApplicationResponse(data: unknown): ApplicationResponse {
    return applicationResponseSchema.parse(data);
}

export function parseApplicationList(data: unknown): ApplicationResponse[] {
    return z.array(applicationResponseSchema).parse(data);
}
