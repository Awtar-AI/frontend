import { z } from "zod";

export const loginPayloadSchema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

export type LoginPayload = z.infer<typeof loginPayloadSchema>;

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

export type LoginFormData = z.infer<typeof loginPayloadSchema>;

export function zodFieldErrors(error: z.ZodError): Record<string, string> {
    const map: Record<string, string> = {};
    for (const issue of error.issues) {
        const key = issue.path.length ? issue.path.join(".") : "_form";
        if (!map[key]) map[key] = issue.message;
    }
    return map;
}

export function validateLoginForm(
    data: unknown,
): { success: true; data: LoginPayload } | { success: false; errors: Record<string, string> } {
    const result = loginPayloadSchema.safeParse(data);
    if (result.success) return { success: true, data: result.data };
    return { success: false, errors: zodFieldErrors(result.error) };
}

export function parseLoginResponse(data: unknown): LoginResponse {
    return loginResponseSchema.parse(data);
}
