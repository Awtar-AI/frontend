import { z } from "zod";

export const organizationPublicSchema = z
    .object({
        id: z.string(),
        organization_name: z.string(),
        website_url: z.string(),
        industry: z.string(),
        organization_size: z.number(),
        linkedin_url: z.string().optional(),
    })
    .passthrough();

export type OrganizationPublic = z.infer<typeof organizationPublicSchema>;

export function parseOrganizationPublic(data: unknown): OrganizationPublic {
    return organizationPublicSchema.parse(data);
}
