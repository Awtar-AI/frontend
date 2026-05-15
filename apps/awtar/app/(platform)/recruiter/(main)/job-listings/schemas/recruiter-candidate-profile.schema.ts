import { z } from "zod";

export const recruiterCandidateProfileSchema = z
    .object({
        id: z.string(),
        email: z.string(),
        first_name: z.string(),
        last_name: z.string(),
        profile_pic_url: z.string().nullable().optional(),
        role: z.enum(["candidate", "hr", "admin"]),
        candidate_profile: z
            .object({
                current_job_title: z.string().optional(),
                years_of_experience: z.number().optional(),
                education_level: z.string().optional(),
                industry_interest: z.string().optional(),
                primary_skills: z.array(z.string()).optional(),
                extracted_skills: z.array(z.string()).optional(),
                preferred_job_types: z.array(z.string()).optional(),
                resume_url: z.string().optional(),
                professional_summary: z.string().optional(),
                desired_annual_salary_min: z.number().optional(),
                desired_annual_salary_max: z.number().optional(),
                ai_trust_score: z.number().optional(),
                resume_candidate_data: z
                    .object({
                        skills: z
                            .array(
                                z.object({
                                    name: z.string(),
                                    source: z.string().optional(),
                                    category: z.string().optional(),
                                    confidence: z.number().optional(),
                                }),
                            )
                            .nullable()
                            .optional(),
                        projects: z
                            .array(
                                z.object({
                                    raw: z.string().optional(),
                                    name: z.string().nullable().optional(),
                                    description: z.string().nullable().optional(),
                                }),
                            )
                            .nullable()
                            .optional(),
                        education: z
                            .array(
                                z.object({
                                    raw: z.string().optional(),
                                    degree: z.string().nullable().optional(),
                                    institution: z.string().nullable().optional(),
                                    start_date: z.string().nullable().optional(),
                                    end_date: z.string().nullable().optional(),
                                }),
                            )
                            .nullable()
                            .optional(),
                        experience: z
                            .array(
                                z.object({
                                    raw: z.string().optional(),
                                    title: z.string().nullable().optional(),
                                    company: z.string().nullable().optional(),
                                    start_date: z.string().nullable().optional(),
                                    end_date: z.string().nullable().optional(),
                                }),
                            )
                            .nullable()
                            .optional(),
                    })
                    .nullable()
                    .optional(),
            })
            .nullable()
            .optional(),
    })
    .passthrough();

export type RecruiterCandidateProfile = z.infer<typeof recruiterCandidateProfileSchema>;

export function parseRecruiterCandidateProfile(data: unknown): RecruiterCandidateProfile {
    return recruiterCandidateProfileSchema.parse(data);
}
