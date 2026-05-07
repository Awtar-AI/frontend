import http from "@/lib/http";
import { type OrganizationDetail, parseOrganizationDetail } from "../schemas/organization.schema";

export const recruiterOrganizationApi = {
    async getOne(_organizationId: string): Promise<OrganizationDetail> {
        const { data } = await http.get("/api/v1/organizations/single");
        return parseOrganizationDetail(data);
    },

    async switchOrganization(organizationId: string): Promise<OrganizationDetail> {
        const { data } = await http.patch(`/api/v1/organizations/${organizationId}/switch`);
        return parseOrganizationDetail(data);
    },
};
