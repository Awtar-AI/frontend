import { z } from "zod";

export const organizationStatusOptions = ["pending", "active", "suspended"] as const;

const creatorInfoSchema = z.object({
    user_id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
});

export const organizationSummarySchema = z.object({
    id: z.string(),
    organization_name: z.string(),
    industry: z.string(),
    organization_size: z.number(),
    status: z.enum(organizationStatusOptions),
    website_url: z.string(),
    created_at: z.string(),
    creator: creatorInfoSchema.optional(),
    document_url: z.array(z.string()).optional(),
});

export const organizationListResponseSchema = z.object({
    organizations: z.array(organizationSummarySchema),
    total: z.number(),
    page: z.number(),
    page_size: z.number(),
});

export const organizationDetailResponseSchema = z.object({
    id: z.string(),
    phone: z.string().optional(),
    organization_name: z.string(),
    website_url: z.string(),
    industry: z.string(),
    organization_size: z.number(),
    linkedin_url: z.string().optional(),
    status: z.enum(organizationStatusOptions),
    document_url: z.array(z.string()).optional(),
    created_at: z.string(),
    updated_at: z.string(),
    creator: creatorInfoSchema.optional(),
});

export const adminOrganizationsFiltersSchema = z.object({
    page: z.number().int().min(1).default(1),
    page_size: z.number().int().min(1).max(100).default(20),
    status: z.enum(organizationStatusOptions).optional(),
    industry: z.string().trim().optional(),
    name: z.string().trim().optional(),
});

export const changeOrganizationStatusSchema = z.object({
    status: z.enum(organizationStatusOptions),
});

export type OrganizationStatus = (typeof organizationStatusOptions)[number];
export type OrganizationSummary = z.infer<typeof organizationSummarySchema>;
export type OrganizationListResponse = z.infer<typeof organizationListResponseSchema>;
export type OrganizationDetailResponse = z.infer<typeof organizationDetailResponseSchema>;
export type AdminOrganizationsFilters = z.infer<typeof adminOrganizationsFiltersSchema>;
export type ChangeOrganizationStatusInput = z.infer<typeof changeOrganizationStatusSchema>;

export type SimpleMessageResponse = {
    message: string;
};

export function parseOrganizationListResponse(data: unknown): OrganizationListResponse {
    return organizationListResponseSchema.parse(data);
}

export function parseOrganizationDetailResponse(data: unknown): OrganizationDetailResponse {
    return organizationDetailResponseSchema.parse(data);
}

export function getAllowedStatusTransitions(
    currentStatus: OrganizationStatus,
): OrganizationStatus[] {
    switch (currentStatus) {
        case "pending":
            return ["active", "suspended"];
        case "active":
            return ["suspended"];
        case "suspended":
            return ["active"];
        default:
            return [];
    }
}
