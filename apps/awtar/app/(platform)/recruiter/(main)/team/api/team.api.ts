import http from "@/lib/http";
import {
    type InviteHrPayload,
    type InviteHrResponse,
    parseInviteHrResponse,
    parseTeamMembers,
    type TeamMember,
} from "../schemas/team.schema";

export const recruiterTeamApi = {
    async listEmployees(_organizationId: string): Promise<TeamMember[]> {
        const { data } = await http.get("/api/v1/organizations/employees");
        return parseTeamMembers(data);
    },

    async inviteHr(_organizationId: string, payload: InviteHrPayload): Promise<InviteHrResponse> {
        const { data } = await http.post("/api/v1/organizations/invite", payload);
        return parseInviteHrResponse(data);
    },
};
