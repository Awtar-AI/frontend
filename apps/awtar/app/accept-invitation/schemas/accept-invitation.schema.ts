import { z } from "zod";

const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;

export const acceptInvitationFormSchema = z
    .object({
        firstName: z.string().trim().min(2, "First name is required"),
        lastName: z.string().trim().min(2, "Last name is required"),
        email: z.string().email("Enter a valid email"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(72, "Password must be at most 72 characters")
            .regex(strongPassword, "Must include uppercase, lowercase, number, and symbol"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

export type AcceptInvitationFormData = z.infer<typeof acceptInvitationFormSchema>;

export interface AcceptInvitationPayload {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: "hr";
}

export interface AcceptInvitationParams {
    token: string;
}

export function toAcceptInvitationPayload(data: AcceptInvitationFormData): AcceptInvitationPayload {
    return {
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        email: data.email.trim(),
        password: data.password,
        role: "hr",
    };
}
