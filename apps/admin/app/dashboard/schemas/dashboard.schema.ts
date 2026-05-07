import { z } from "zod";

export const DashboardStatsResponseSchema = z.object({
    active_organizations: z.number(),
    active_organizations_diff: z.number(),
    active_users: z.number(),
    active_users_diff: z.number(),
    pending_organizations: z.number(),
    pending_organizations_diff: z.number(),
    total_staff: z.number(),
    total_staff_diff: z.number(),
});

export type DashboardStatsResponse = z.infer<typeof DashboardStatsResponseSchema>;

export function parseDashboardStatsResponse(data: unknown): DashboardStatsResponse {
    return DashboardStatsResponseSchema.parse(data);
}
