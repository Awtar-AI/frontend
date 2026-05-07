import { z } from "zod";

/** `GET /jobs/public` list item — see APPLICANT-FRONTEND-API.md §3. */
export const publicJobSchema = z
    .object({
        id: z.string(),
        organization_id: z.string(),
        title: z.string(),
        description: z.string(),
        location: z.string(),
        is_remote: z.boolean(),
        employment_type: z.string(),
        expirence_level: z.string().optional(),
        experience_level: z.string().optional(),
        deadline: z.string(),
        salary_type: z.string(),
        min_salary: z.number().nullable().optional(),
        max_salary: z.number().nullable().optional(),
        currency: z.string(),
        is_resume_required: z.boolean(),
        is_cover_letter_required: z.boolean(),
        status: z.string(),
        created_at: z.string().optional(),
    })
    .passthrough();

export type PublicJob = z.infer<typeof publicJobSchema>;

export const publicJobListResponseSchema = z.object({
    jobs: z.array(publicJobSchema),
    total: z.number(),
});

export type PublicJobListResponse = z.infer<typeof publicJobListResponseSchema>;

export function parsePublicJobListResponse(data: unknown): PublicJobListResponse {
    return publicJobListResponseSchema.parse(data);
}

export function parsePublicJob(data: unknown): PublicJob {
    return publicJobSchema.parse(data);
}

export function getPublicJobExperienceLevel(job: PublicJob): string {
    return job.expirence_level ?? job.experience_level ?? "";
}

/** Query params for `GET /jobs/public`. */
export type PublicJobsQuery = {
    organization_id?: string;
    title?: string;
    deadline_from?: string;
    deadline_to?: string;
    min_salary?: number;
    max_salary?: number;
    currency?: string;
    experience_level?: string;
    employment_type?: string;
    status?: "active" | "closed";
    is_remote?: boolean;
    is_resume_required?: boolean;
    is_cover_letter_required?: boolean;
    page?: number;
    limit?: number;
};
