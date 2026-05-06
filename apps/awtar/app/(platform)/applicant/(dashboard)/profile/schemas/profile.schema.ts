import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  PATCH /users/:userId/update  — basic user fields                  */
/* ------------------------------------------------------------------ */

export const updateUserSchema = z.object({
    first_name: z.string().trim().min(2, "Min 2 characters").max(50),
    last_name: z.string().trim().min(2, "Min 2 characters").max(50),
    email: z.string().email("Enter a valid email"),
});

export type UpdateUserPayload = z.infer<typeof updateUserSchema>;

/* ------------------------------------------------------------------ */
/*  PATCH /users/:userId/update-candidate-profile                     */
/* ------------------------------------------------------------------ */

export const educationOptions = [
    { value: "high_school", label: "High School" },
    { value: "associate", label: "Associate" },
    { value: "bachelor", label: "Bachelor" },
    { value: "master", label: "Master" },
    { value: "phd", label: "PhD" },
    { value: "self_taught", label: "Self Taught" },
    { value: "other", label: "Other" },
] as const;

export const industryOptions = [
    { value: "tech", label: "Tech" },
    { value: "finance", label: "Finance" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "other", label: "Other" },
] as const;

export const jobTypeOptions = [
    { value: "full_time", label: "Full Time" },
    { value: "part_time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
    { value: "temporary", label: "Temporary" },
] as const;

export const updateCandidateProfileFormSchema = z
    .object({
        current_job_title: z.string().trim().max(120).optional().or(z.literal("")),
        years_of_experience: z.number().int().min(0).max(60).optional(),
        education_level: z.string().optional().or(z.literal("")),
        desired_annual_salary_min: z.number().int().min(0).optional(),
        desired_annual_salary_max: z.number().int().min(0).optional(),
        industry_interest: z.string().optional().or(z.literal("")),
        match_smart_notification: z.boolean(),
        skills: z.array(z.string().trim().min(1)),
        preferred_job_types: z.array(z.string()),
    })
    .superRefine((data, ctx) => {
        const min = data.desired_annual_salary_min;
        const max = data.desired_annual_salary_max;
        if (min != null && max != null && min > max) {
            ctx.addIssue({
                code: "custom",
                path: ["desired_annual_salary_max"],
                message: "Max salary must be ≥ min salary",
            });
        }
    });

export type UpdateCandidateProfileFormData = z.infer<typeof updateCandidateProfileFormSchema>;

export type UpdateCandidateProfilePayload = {
    current_job_title?: string;
    years_of_experience?: number;
    education_level?: string;
    desired_annual_salary_min?: number;
    desired_annual_salary_max?: number;
    industry_interest?: string;
    match_smart_notification: boolean;
    primary_skills?: string;
    preferred_job_types?: string[];
};

export function toCandidatePayload(
    data: UpdateCandidateProfileFormData,
): UpdateCandidateProfilePayload {
    return {
        current_job_title: data.current_job_title || undefined,
        years_of_experience: data.years_of_experience,
        education_level: data.education_level || undefined,
        desired_annual_salary_min: data.desired_annual_salary_min,
        desired_annual_salary_max: data.desired_annual_salary_max,
        industry_interest: data.industry_interest || undefined,
        match_smart_notification: data.match_smart_notification,
        primary_skills: data.skills.length ? data.skills.join(",") : undefined,
        preferred_job_types: data.preferred_job_types.length ? data.preferred_job_types : undefined,
    };
}

export function labelForEducation(value?: string): string {
    return educationOptions.find((o) => o.value === value)?.label ?? value ?? "—";
}

export function labelForIndustry(value?: string): string {
    const lower = value?.toLowerCase();
    return industryOptions.find((o) => o.value === lower)?.label ?? value ?? "—";
}

export function labelForJobType(value: string): string {
    return jobTypeOptions.find((o) => o.value === value)?.label ?? value.replace(/_/g, " ");
}
