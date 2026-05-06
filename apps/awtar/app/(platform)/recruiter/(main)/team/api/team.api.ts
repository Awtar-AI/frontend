import http from "@/lib/http";
import {
    parseInviteHrResponse,
    parseTeamMembers,
    type InviteHrPayload,
    type InviteHrResponse,
    type TeamMember,
} from "../schemas/team.schema";

export const recruiterTeamApi = {
    async listEmployees(organizationId: string): Promise<TeamMember[]> {
        const { data } = await http.get(`/api/v1/organizations/${organizationId}/employees`);
        return parseTeamMembers(data);
    },

    async inviteHr(organizationId: string, payload: InviteHrPayload): Promise<InviteHrResponse> {
        const { data } = await http.post(`/api/v1/organizations/${organizationId}/invite`, payload);
        return parseInviteHrResponse(data);
    },
};
