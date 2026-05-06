import { z } from "zod";

export function buildApplyFormSchema(options: { coverLetterRequired: boolean }) {
    return z
        .object({
            cover_letter: z.string().optional(),
        })
        .superRefine((data, ctx) => {
            if (options.coverLetterRequired && !data.cover_letter?.trim()) {
                ctx.addIssue({
                    code: "custom",
                    path: ["cover_letter"],
                    message: "This employer requires a cover letter.",
                });
            }
        });
}

export type ApplyFormInput = z.infer<ReturnType<typeof buildApplyFormSchema>>;
