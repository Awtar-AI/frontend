import http from "@/lib/http";
import type {
    AcceptInvitationParams,
    AcceptInvitationPayload,
} from "../schemas/accept-invitation.schema";

function toFormData(payload: AcceptInvitationPayload): FormData {
    const fd = new FormData();
    fd.append("first_name", payload.first_name);
    fd.append("last_name", payload.last_name);
    fd.append("email", payload.email);
    fd.append("password", payload.password);
    fd.append("role", payload.role);
    return fd;
}

export const acceptInvitationApi = {
    async accept(payload: AcceptInvitationPayload, params: AcceptInvitationParams) {
        const { data } = await http.post("/api/v1/users/create", toFormData(payload), {
            params: { token: params.token },
        });
        return data;
    },
};
