import { z } from "zod";

export const employmentTypeOptions = [
    { value: "full_time", label: "Full-time" },
    { value: "part_time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
    { value: "temporary", label: "Temporary" },
] as const;

export const experienceLevelOptions = [
    { value: "entry", label: "Entry" },
    { value: "mid", label: "Mid" },
    { value: "senior", label: "Senior" },
    { value: "lead", label: "Lead" },
] as const;

export const salaryTypeOptions = [
    { value: "fixed", label: "Fixed salary" },
    { value: "range", label: "Salary range" },
    { value: "undisclosed", label: "Undisclosed" },
] as const;

export const createJobFormSchema = z
    .object({
        title: z.string().trim().min(2, "Job title must be at least 2 characters").max(255),
        description: z
            .string()
            .trim()
            .min(10, "Job description must be at least 10 characters"),
        location: z.string().trim().optional(),
        isRemote: z.boolean(),
        employmentType: z.enum(employmentTypeOptions.map((o) => o.value) as [string, ...string[]]),
        experienceLevel: z.enum(
            experienceLevelOptions.map((o) => o.value) as [string, ...string[]],
        ),
        salaryType: z.enum(salaryTypeOptions.map((o) => o.value) as [string, ...string[]]),
        minSalary: z.number().nullable(),
        maxSalary: z.number().nullable(),
        currency: z.string().trim().min(3, "Currency is required").max(10),
        deadline: z.string().min(1, "Application deadline is required"),
        isResumeRequired: z.boolean(),
        isCoverLetterRequired: z.boolean(),
        automaticResponse: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        if (!data.isRemote && !data.location?.trim()) {
            ctx.addIssue({
                code: "custom",
                path: ["location"],
                message: "Location is required for non-remote jobs",
            });
        }

        if (data.salaryType === "fixed" && (data.minSalary == null || Number.isNaN(data.minSalary))) {
            ctx.addIssue({
                code: "custom",
                path: ["minSalary"],
                message: "Salary is required for fixed salary jobs",
            });
        }

        if (data.salaryType === "range") {
            if (data.minSalary == null || Number.isNaN(data.minSalary)) {
                ctx.addIssue({
                    code: "custom",
                    path: ["minSalary"],
                    message: "Minimum salary is required for salary ranges",
                });
            }

            if (data.maxSalary == null || Number.isNaN(data.maxSalary)) {
                ctx.addIssue({
                    code: "custom",
                    path: ["maxSalary"],
                    message: "Maximum salary is required for salary ranges",
                });
            }

            if (
                typeof data.minSalary === "number" &&
                typeof data.maxSalary === "number" &&
                data.minSalary > data.maxSalary
            ) {
                ctx.addIssue({
                    code: "custom",
                    path: ["maxSalary"],
                    message: "Maximum salary must be greater than or equal to minimum salary",
                });
            }
        }

        const automaticResponse = data.automaticResponse?.trim();
        if (
            automaticResponse &&
            (automaticResponse.length < 50 || automaticResponse.length > 200)
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["automaticResponse"],
                message: "Auto-response must be between 50 and 200 characters",
            });
        }
    });

export type CreateJobFormData = z.infer<typeof createJobFormSchema>;

export interface CreateJobPayload {
    title: string;
    description: string;
    location?: string;
    is_remote: boolean;
    employment_type: (typeof employmentTypeOptions)[number]["value"];
    experience_level: (typeof experienceLevelOptions)[number]["value"];
    salary_type: (typeof salaryTypeOptions)[number]["value"];
    min_salary?: number;
    max_salary?: number;
    currency: string;
    deadline: string;
    is_resume_required: boolean;
    is_cover_letter_required: boolean;
    automatic_response?: string;
}

export const jobPostResponseSchema = z
    .object({
        id: z.string(),
        organization_id: z.string(),
        title: z.string(),
        description: z.string(),
        location: z.string().nullable().optional(),
        is_remote: z.boolean().optional(),
        employment_type: z.string(),
        expirence_level: z.string().optional(),
        experience_level: z.string().optional(),
        deadline: z.string(),
        automatic_response: z.string().nullable().optional(),
        salary_type: z.string(),
        min_salary: z.number().nullable().optional(),
        max_salary: z.number().nullable().optional(),
        currency: z.string(),
        is_resume_required: z.boolean(),
        is_cover_letter_required: z.boolean(),
        status: z.enum(["active", "closed"]),
        created_by: z.string(),
        created_at: z.string(),
        updated_at: z.string(),
    })
    .passthrough();

export type JobPostResponse = z.infer<typeof jobPostResponseSchema>;

/** API typo `expirence_level` vs `experience_level` — use either. */
export function getJobExperienceLevel(job: JobPostResponse): string {
    return job.expirence_level ?? job.experience_level ?? "";
}

export function toCreateJobPayload(data: CreateJobFormData): CreateJobPayload {
    const automaticResponse = data.automaticResponse?.trim();

    return {
        title: data.title.trim(),
        description: data.description.trim(),
        location: data.isRemote ? undefined : data.location?.trim() || undefined,
        is_remote: data.isRemote,
        employment_type: data.employmentType as CreateJobPayload["employment_type"],
        experience_level: data.experienceLevel as CreateJobPayload["experience_level"],
        salary_type: data.salaryType as CreateJobPayload["salary_type"],
        min_salary:
            data.salaryType === "undisclosed" || data.minSalary == null
                ? undefined
                : data.minSalary,
        max_salary:
            data.salaryType !== "range" || data.maxSalary == null ? undefined : data.maxSalary,
        currency: data.currency.trim().toUpperCase(),
        deadline: new Date(data.deadline).toISOString(),
        is_resume_required: data.isResumeRequired,
        is_cover_letter_required: data.isCoverLetterRequired,
        automatic_response: automaticResponse || undefined,
    };
}

export function parseJobPostResponse(data: unknown): JobPostResponse {
    return jobPostResponseSchema.parse(data);
}

export function parseJobPostList(data: unknown): JobPostResponse[] {
    return z.array(jobPostResponseSchema).parse(data);
}

/** Partial update — same fields as create, all optional (UpdateJobDto). */
export type UpdateJobPayload = Partial<CreateJobPayload>;
