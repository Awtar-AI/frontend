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

const applicationStatusSchema = z.preprocess(
    (value) => {
        if (typeof value !== "string") return value;
        const normalized = value.trim().toLowerCase();
        if (normalized === "applied") return "Applied";
        if (normalized === "pending") return "Pending";
        if (normalized === "accepted") return "Accepted";
        if (normalized === "rejected") return "Rejected";
        return value;
    },
    z.enum(["Applied", "Pending", "Accepted", "Rejected"]),
);

export const applicationResponseSchema = z
    .object({
        id: z.string(),
        job_id: z.string(),
        user_id: z.string().optional(),
        status: applicationStatusSchema,
        resume_url: z.string().optional(),
        cover_letter: z.string().optional(),
        applicant_first_name: z.string().optional(),
        applicant_last_name: z.string().optional(),
        applicant_email: z.string().optional(),
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
        created_by: z.string().optional(),
        updated_at: z.string().optional(),
        updated_by: z.string().optional(),
    })
    .passthrough();

export type ApplicationResponse = z.infer<typeof applicationResponseSchema>;

export function parseApplicationResponse(data: unknown): ApplicationResponse {
    return applicationResponseSchema.parse(data);
}

export function parseApplicationList(data: unknown): ApplicationResponse[] {
    const list = Array.isArray(data)
        ? data
        : typeof data === "object" && data !== null && "applications" in data
          ? (data as { applications: unknown }).applications
          : typeof data === "object" && data !== null && "data" in data
            ? (data as { data: unknown }).data
            : typeof data === "object" && data !== null && "items" in data
              ? (data as { items: unknown }).items
              : data;

    return z.array(applicationResponseSchema).parse(list);
}
