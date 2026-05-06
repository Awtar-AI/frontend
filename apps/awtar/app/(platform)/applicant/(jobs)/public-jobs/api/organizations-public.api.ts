import http from "@/lib/http";
import {
    type OrganizationPublic,
    parseOrganizationPublic,
} from "../schemas/organizations-public.schema";

export const organizationsPublicApi = {
    async getPublic(organizationId: string): Promise<OrganizationPublic> {
        const { data } = await http.get(`/api/v1/organizations/${organizationId}/public`);
        return parseOrganizationPublic(data);
    },
};
