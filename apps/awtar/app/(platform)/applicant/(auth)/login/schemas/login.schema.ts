import { z } from "zod";

export const loginFormSchema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

export const loginResponseSchema = z.object({
    id: z.string(),
    access_token: z.string(),
    refresh_token: z.string(),
    email: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    is_active: z.boolean(),
    role: z.enum(["candidate", "hr", "admin"]),
    last_login_organization: z.string().nullable(),
    last_log_in_at: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export function parseLoginResponse(data: unknown): LoginResponse {
    return loginResponseSchema.parse(data);
}
