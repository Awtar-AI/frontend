import { z } from "zod";

export const recruiterCandidateProfileSchema = z
    .object({
        id: z.string(),
        email: z.string(),
        first_name: z.string(),
        last_name: z.string(),
        role: z.enum(["candidate", "hr", "admin"]),
        candidate_profile: z
            .object({
                current_job_title: z.string().optional(),
                years_of_experience: z.number().optional(),
                education_level: z.string().optional(),
                industry_interest: z.string().optional(),
                primary_skills: z.array(z.string()).optional(),
                preferred_job_types: z.array(z.string()).optional(),
                resume_url: z.string().optional(),
            })
            .nullable()
            .optional(),
    })
    .passthrough();

export type RecruiterCandidateProfile = z.infer<typeof recruiterCandidateProfileSchema>;

export function parseRecruiterCandidateProfile(data: unknown): RecruiterCandidateProfile {
    return recruiterCandidateProfileSchema.parse(data);
}
