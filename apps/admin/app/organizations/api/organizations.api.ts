import http from "@/lib/http";
import {
    type AdminOrganizationsFilters,
    type ChangeOrganizationStatusInput,
    type OrganizationDetailResponse,
    type OrganizationListResponse,
    parseOrganizationDetailResponse,
    parseOrganizationListResponse,
    type SimpleMessageResponse,
} from "../schemas/organizations.schema";

export const adminOrganizationsApi = {
    async list(filters: AdminOrganizationsFilters): Promise<OrganizationListResponse> {
        const { data } = await http.get("/api/v1/admin/organizations/list", { params: filters });
        return parseOrganizationListResponse(data);
    },

    async getOne(organizationId: string): Promise<OrganizationDetailResponse> {
        const { data } = await http.get(`/api/v1/admin/organizations/${organizationId}/single`);
        return parseOrganizationDetailResponse(data);
    },

    async updateStatus(
        organizationId: string,
        payload: ChangeOrganizationStatusInput,
    ): Promise<SimpleMessageResponse> {
        const { data } = await http.patch(
            `/api/v1/admin/organizations/${organizationId}/update-status`,
            payload,
        );
        return data;
    },

    async deleteOrganization(organizationId: string): Promise<SimpleMessageResponse> {
        const { data } = await http.delete(`/api/v1/admin/organizations/${organizationId}/delete`);
        return data;
    },
};
