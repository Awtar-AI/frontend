import { z } from "zod";

export const educationLevelSchema = z.enum([
    "high_school",
    "associate",
    "bachelor",
    "master",
    "phd",
    "self_taught",
    "other",
]);

export const industryInterestSchema = z.enum([
    "Tech",
    "Finance",
    "Healthcare",
    "Education",
    "Other",
]);

export const preferredJobTypeSchema = z.enum([
    "full_time",
    "part_time",
    "contract",
    "internship",
    "temporary",
]);

export const userRoleSchema = z.enum(["candidate", "hr", "admin"]);

export const registerApplicantPayloadSchema = z
    .object({
        email: z.string().email("Enter a valid email"),
        first_name: z.string().trim().min(1, "First name is required"),
        last_name: z.string().trim().min(1, "Last name is required"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        role: userRoleSchema,
        current_job_title: z.string().trim().optional(),
        desired_annual_salary_min: z.number().int().nonnegative().optional(),
        desired_annual_salary_max: z.number().int().nonnegative().optional(),
        education_level: educationLevelSchema.optional(),
        industry_interest: industryInterestSchema.optional(),
        match_smart_notification: z.boolean().optional(),
        preferred_job_types: z.array(preferredJobTypeSchema).optional(),
        primary_skills: z.string().trim().optional(),
        years_of_experience: z.number().int().nonnegative().optional(),
        resume: z.instanceof(File).optional(),
    })
    .superRefine((data, ctx) => {
        const { min, max } = {
            min: data.desired_annual_salary_min,
            max: data.desired_annual_salary_max,
        };
        if (min != null && max != null && min > max) {
            ctx.addIssue({
                code: "custom",
                path: ["desired_annual_salary_max"],
                message: "Maximum salary must be greater than or equal to minimum",
            });
        }
    });

export type RegisterApplicantPayloadInput = z.infer<typeof registerApplicantPayloadSchema>;
export type RegisterApplicantPayload = RegisterApplicantPayloadInput;
export type UserRole = z.infer<typeof userRoleSchema>;

export const registerApplicantParamsSchema = z.object({
    token: z.string().trim().min(1).optional(),
});
export type RegisterApplicantParams = z.infer<typeof registerApplicantParamsSchema>;

/** Optional: parse JSON from API at runtime */
export const registerApplicantResponseSchema = z.object({
    id: z.string(),
    email: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    is_active: z.boolean(),
    role: userRoleSchema,
    created_at: z.string(),
    updated_at: z.string(),
    candidate_profile: z.object({
        current_job_title: z.string(),
        years_of_experience: z.number(),
        primary_skills: z.array(z.string()),
        education_level: z.string(),
        preferred_job_types: z.array(z.string()),
        desired_annual_salary_min: z.number(),
        desired_annual_salary_max: z.number(),
        industry_interest: z.string(),
        match_smart_notification: z.boolean(),
        resume_url: z.string(),
    }),
});
export type RegisterApplicantResponse = z.infer<typeof registerApplicantResponseSchema>;

/* -------------------------------------------------------------------------- */
/* Zod — wizard form (UI). Use per-step or full form for inline errors.       */
/* -------------------------------------------------------------------------- */

/** Strip commas / spaces from salary inputs like "60,000" */
export function parseSalaryInput(value: string): number {
    const n = Number.parseInt(value.replace(/[,\s]/g, ""), 10);
    return Number.isFinite(n) ? n : Number.NaN;
}

export const registerStep1Schema = z
    .object({
        fullName: z.string().trim().min(2, "Full name is required"),
        email: z.string().email("Enter a valid email"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
                "Password must contain uppercase, lowercase, number, and special character",
            ),
        confirmPassword: z.string(),
    })
    .superRefine((data, ctx) => {
        if (data.fullName.trim().split(/\s+/).length < 2) {
            ctx.addIssue({
                code: "custom",
                path: ["fullName"],
                message: "Please enter first and last name",
            });
        }
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: "Passwords do not match",
            });
        }
    });

export const registerStep2Schema = z.object({
    jobTitle: z.string().trim().min(1, "Current job title is required"),
    experience: z.number().int().min(0, "Experience cannot be negative"),
    skills: z.array(z.string().trim().min(1)).min(1, "Add at least one skill"),
    education: z.string().trim().min(1, "Select education level"),
    resume: z.instanceof(File).nullable().optional(),
});

export const registerStep3Schema = z
    .object({
        jobTypes: z.array(z.string()).min(1, "Select at least one job type"),
        minSalary: z.string().trim().min(1, "Enter minimum salary"),
        maxSalary: z.string().trim().min(1, "Enter maximum salary"),
        industries: z.array(z.string()).min(1, "Select at least one industry"),
        smartMatch: z.boolean(),
    })
    .superRefine((data, ctx) => {
        const min = parseSalaryInput(data.minSalary);
        const max = parseSalaryInput(data.maxSalary);
        if (Number.isNaN(min)) {
            ctx.addIssue({
                code: "custom",
                path: ["minSalary"],
                message: "Enter a valid minimum salary",
            });
        }
        if (Number.isNaN(max)) {
            ctx.addIssue({
                code: "custom",
                path: ["maxSalary"],
                message: "Enter a valid maximum salary",
            });
        }
        if (!Number.isNaN(min) && !Number.isNaN(max) && min > max) {
            ctx.addIssue({
                code: "custom",
                path: ["maxSalary"],
                message: "Maximum must be greater than or equal to minimum",
            });
        }
    });

/** Full wizard state (single source of truth with page `useState`) */
export const registerFormDataSchema = registerStep1Schema
    .and(registerStep2Schema)
    .and(registerStep3Schema);

export type RegisterFormData = z.infer<typeof registerFormDataSchema>;

/** First field error per path (good for simple field-level UI) */
export function zodFieldErrors(error: z.ZodError): Record<string, string> {
    const map: Record<string, string> = {};
    for (const issue of error.issues) {
        const key = issue.path.length ? issue.path.join(".") : "_form";
        if (!map[key]) map[key] = issue.message;
    }
    return map;
}

export function validateRegisterStep(
    step: 1 | 2 | 3,
    data: unknown,
): { success: true; data: unknown } | { success: false; errors: Record<string, string> } {
    const schema =
        step === 1 ? registerStep1Schema : step === 2 ? registerStep2Schema : registerStep3Schema;
    const result = schema.safeParse(data);
    if (result.success) return { success: true, data: result.data };
    return { success: false, errors: zodFieldErrors(result.error) };
}

export function validateFullRegisterForm(
    data: unknown,
): { success: true; data: RegisterFormData } | { success: false; errors: Record<string, string> } {
    const result = registerFormDataSchema.safeParse(data);
    if (result.success) return { success: true, data: result.data };
    return { success: false, errors: zodFieldErrors(result.error) };
}

export function validateRegisterApplicantPayload(
    data: unknown,
):
    | { success: true; data: RegisterApplicantPayloadInput }
    | { success: false; errors: Record<string, string> } {
    const result = registerApplicantPayloadSchema.safeParse(data);
    if (result.success) return { success: true, data: result.data };
    return { success: false, errors: zodFieldErrors(result.error) };
}

export function parseRegisterApplicantResponse(data: unknown): RegisterApplicantResponse {
    return registerApplicantResponseSchema.parse(data);
}
