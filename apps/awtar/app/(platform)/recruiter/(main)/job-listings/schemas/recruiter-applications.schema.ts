import { z } from "zod";

export const recruiterApplicationSchema = z
    .object({
        id: z.string(),
        job_id: z.string(),
        user_id: z.string(),
        status: z.enum(["Pending", "Accepted", "Rejected"]),
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
        updated_at: z.string(),
    })
    .passthrough();

export type RecruiterApplication = z.infer<typeof recruiterApplicationSchema>;

export function parseRecruiterApplication(data: unknown): RecruiterApplication {
    return recruiterApplicationSchema.parse(data);
}

export function parseRecruiterApplications(data: unknown): RecruiterApplication[] {
    return z.array(recruiterApplicationSchema).parse(data);
}
