import { z } from "zod";

const creatorSchema = z.object({
    user_id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
});

export const organizationDetailSchema = z.object({
    id: z.string(),
    phone: z.string().optional().nullable(),
    organization_name: z.string(),
    website_url: z.string(),
    industry: z.string(),
    organization_size: z.coerce.number(),
    linkedin_url: z.string().optional().nullable(),
    status: z.enum(["pending", "active", "suspended"]),
    document_url: z.array(z.string()).optional(),
    created_at: z.string(),
    updated_at: z.string(),
    creator: creatorSchema.optional(),
});

export type OrganizationDetail = z.infer<typeof organizationDetailSchema>;

export type SwitchOrganizationPayload = {
    organizationId: string;
};

export function parseOrganizationDetail(data: unknown): OrganizationDetail {
    return organizationDetailSchema.parse(data);
}

export function toKnownOrganization(detail: OrganizationDetail) {
    return {
        id: detail.id,
        organization_name: detail.organization_name,
        status: detail.status,
        industry: detail.industry,
        website_url: detail.website_url,
        linkedin_url: detail.linkedin_url ?? undefined,
    };
}
