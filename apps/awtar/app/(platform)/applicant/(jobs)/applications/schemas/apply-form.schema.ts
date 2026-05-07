import { z } from "zod";

function coverLetterText(value?: string): string {
    return (value ?? "")
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export function buildApplyFormSchema(options: { coverLetterRequired: boolean }) {
    return z
        .object({
            cover_letter: z.string().optional(),
        })
        .superRefine((data, ctx) => {
            if (options.coverLetterRequired && !coverLetterText(data.cover_letter)) {
                ctx.addIssue({
                    code: "custom",
                    path: ["cover_letter"],
                    message: "This employer requires a cover letter.",
                });
            }
        });
}

export type ApplyFormInput = z.infer<ReturnType<typeof buildApplyFormSchema>>;
