import { z } from "zod";

export const userRoleOptions = ["candidate", "hr", "admin"] as const;
export const userStatusOptions = ["active", "inactive"] as const;

export type UserRole = (typeof userRoleOptions)[number];
export type UserStatus = (typeof userStatusOptions)[number];

// Base user schema
const baseUserSchema = z.object({
    id: z.string(),
    email: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    role: z.enum(userRoleOptions),
    is_active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
    deleted_at: z.string().nullable().optional(),
    deleted_by: z.string().nullable().optional(),
    last_logged_in_at: z.string().nullable().optional(),
});

// User list response
export const userSummarySchema = baseUserSchema.extend({
    // Add any additional fields for summary if needed
});

export const userListResponseSchema = z.object({
    users: z.array(userSummarySchema),
    total: z.number(),
    page: z.number(),
    page_size: z.number(),
});

// User detail response
export const userDetailResponseSchema = baseUserSchema.extend({
    // Add candidate profile if role is candidate
    candidate_profile: z
        .object({
            current_job_title: z.string().optional(),
            years_of_experience: z.number().optional(),
            primary_skills: z.array(z.string()).optional(),
            education_level: z.string().optional(),
            preferred_job_types: z.array(z.string()).optional(),
            desired_annual_salary_min: z.number().optional(),
            desired_annual_salary_max: z.number().optional(),
            industry_interest: z.string().optional(),
            match_smart_notification: z.boolean().optional(),
            linkedin_url: z.string().optional(),
            location: z.string().optional(),
            professional_summary: z.string().optional(),
            profile_pic_url: z.string().optional(),
            resume_url: z.string().optional(),
        })
        .optional(),
    // Add organization info if role is hr/admin
    organization: z
        .object({
            id: z.string(),
            organization_name: z.string(),
            industry: z.string(),
            status: z.string(),
        })
        .optional(),
});

// Filters
export const adminUsersFiltersSchema = z.object({
    page: z.number().int().min(1).default(1),
    page_size: z.number().int().min(1).max(100).default(20),
    status: z.string().optional(),
    role: z.enum(userRoleOptions).optional(),
    search: z.string().trim().optional(),
});

// Create user schemas
// Admin user creation
export const createAdminUserSchema = z.object({
    role: z.literal("admin"),
    email: z.string().email("Enter a valid email"),
    first_name: z.string().trim().min(1, "First name is required"),
    last_name: z.string().trim().min(1, "Last name is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

// HR/Recruiter user creation (based on recruiter register)
export const createHrUserSchema = z.object({
    role: z.literal("hr"),
    email: z.string().email("Enter a valid email"),
    first_name: z.string().trim().min(1, "First name is required"),
    last_name: z.string().trim().min(1, "Last name is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    phone: z.string().trim().min(1, "Phone number is required"),
    organization_name: z.string().trim().min(2, "Organization name is required"),
    website_url: z.string().url("Enter a valid URL"),
    industry: z.string().min(1, "Select an industry"),
    organization_size: z.number().int().min(1, "Must be at least 1"),
    linkedin_url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
    business_documents: z
        .array(z.instanceof(File))
        .min(1, "Upload at least one document")
        .max(3, "Maximum 3 documents"),
});

// Applicant user creation (based on applicant register)
export const createApplicantUserSchema = z.object({
    role: z.literal("candidate"),
    email: z.string().email("Enter a valid email"),
    first_name: z.string().trim().min(1, "First name is required"),
    last_name: z.string().trim().min(1, "Last name is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    current_job_title: z.string().trim().optional(),
    desired_annual_salary_min: z.number().int().nonnegative().optional(),
    desired_annual_salary_max: z.number().int().nonnegative().optional(),
    education_level: z
        .enum(["high_school", "associate", "bachelor", "master", "phd", "self_taught", "other"])
        .optional(),
    industry_interest: z.enum(["Tech", "Finance", "Healthcare", "Education", "Other"]).optional(),
    match_smart_notification: z.boolean().optional(),
    preferred_job_types: z
        .array(z.enum(["full_time", "part_time", "contract", "internship", "temporary"]))
        .optional(),
    primary_skills: z.string().trim().optional(),
    years_of_experience: z.number().int().nonnegative().optional(),
    linkedin_url: z.string().url().optional().or(z.literal("")),
    location: z.string().trim().optional(),
    professional_summary: z.string().trim().optional(),
    resume: z.instanceof(File).optional(),
});

// Union of create user schemas
export const createUserSchema = z.discriminatedUnion("role", [
    createAdminUserSchema,
    createHrUserSchema,
    createApplicantUserSchema,
]);

// Update status
export const changeUserStatusSchema = z.object({
    is_active: z.boolean(),
});

// Types
export type UserSummary = z.infer<typeof userSummarySchema>;
export type UserListResponse = z.infer<typeof userListResponseSchema>;
export type UserDetailResponse = z.infer<typeof userDetailResponseSchema>;
export type AdminUsersFilters = z.infer<typeof adminUsersFiltersSchema>;
export type CreateUserPayload = z.infer<typeof createUserSchema>;
export type ChangeUserStatusInput = z.infer<typeof changeUserStatusSchema>;

export type SimpleMessageResponse = {
    message: string;
};

// Parsers
export function parseUserListResponse(data: unknown): UserListResponse {
    return userListResponseSchema.parse(data);
}

export function parseUserDetailResponse(data: unknown): UserDetailResponse {
    return userDetailResponseSchema.parse(data);
}
