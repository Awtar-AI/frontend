import { z } from "zod";

const candidateProfileSchema = z
    .object({
        current_job_title: z.string().optional(),
        years_of_experience: z.number().optional(),
        primary_skills: z.array(z.string()).optional(),
        education_level: z.string().optional(),
        preferred_job_types: z.array(z.string()).optional(),
        industry_interest: z.string().optional(),
        profile_pic_url: z.string().optional(),
        resume_url: z.string().optional(),
        professional_summary: z.string().optional(),
        desired_annual_salary_min: z.number().optional(),
        desired_annual_salary_max: z.number().optional(),
        location: z.string().optional(),
    })
    .optional();

const talentCandidateSchema = z.object({
    id: z.string(),
    email: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    role: z.string(),
    is_active: z.boolean().optional(),
    candidate_profile: candidateProfileSchema,
});

const talentPoolResponseSchema = z.object({
    users: z.array(talentCandidateSchema),
    total: z.number(),
    page: z.number(),
    page_size: z.number(),
});

export type TalentCandidate = z.infer<typeof talentCandidateSchema>;
export type TalentPoolResponse = z.infer<typeof talentPoolResponseSchema>;

export function parseTalentPoolResponse(data: unknown): TalentPoolResponse {
    const parsed = talentPoolResponseSchema.parse(data);
    return {
        ...parsed,
        users: parsed.users.filter((user) => user.role === "candidate"),
    };
}
