import { z } from "zod";

export const inviteHrFormSchema = z.object({
    firstName: z.string().trim().min(2, "First name is required"),
    lastName: z.string().trim().min(2, "Last name is required"),
    email: z.string().email("Enter a valid work email"),
});

export type InviteHrFormData = z.infer<typeof inviteHrFormSchema>;

export interface InviteHrPayload {
    first_name: string;
    last_name: string;
    email: string;
}

export interface InviteHrResponse {
    message: string;
}

export const teamMemberSchema = z.object({
    user_id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    role: z.string(),
});

export type TeamMember = z.infer<typeof teamMemberSchema>;

export function toInviteHrPayload(data: InviteHrFormData): InviteHrPayload {
    return {
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        email: data.email.trim(),
    };
}

export function parseTeamMembers(data: unknown): TeamMember[] {
    return z.array(teamMemberSchema).parse(data);
}

export function parseInviteHrResponse(data: unknown): InviteHrResponse {
    return z
        .object({
            message: z.string().default("Invitation sent successfully."),
        })
        .parse(data);
}
