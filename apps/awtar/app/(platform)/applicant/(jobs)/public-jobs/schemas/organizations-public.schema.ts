import { z } from "zod";

export const organizationPublicSchema = z
    .object({
        id: z.string(),
        organization_name: z.string(),
        website_url: z.string(),
        industry: z.string(),
        organization_size: z.number(),
        owner_first_name: z.string().optional(),
        owner_last_name: z.string().optional(),
        member_since: z.string().optional(),
        total_jobs_posted: z.number().optional(),
        active_jobs_count: z.number().optional(),
        linkedin_url: z.string().optional(),
    })
    .passthrough();

export type OrganizationPublic = z.infer<typeof organizationPublicSchema>;

export function parseOrganizationPublic(data: unknown): OrganizationPublic {
    return organizationPublicSchema.parse(data);
}
