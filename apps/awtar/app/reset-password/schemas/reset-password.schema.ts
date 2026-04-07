import { z } from "zod";

export const resetPasswordFormSchema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
                "Password must contain uppercase, lowercase, number, and special character",
            ),
        confirmPassword: z.string(),
    })
    .superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: "Passwords do not match",
            });
        }
    });

export type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;

export type ResetPasswordPayload = {
    token: string;
    password: string;
};
