import { z } from "zod";

export const recruiterVerificationSessionSchema = z
    .object({
        id: z.string(),
        user_id: z.string(),
        job_id: z.string(),
        application_id: z.string(),
        status: z.string(),
        current_difficulty: z.string().nullable().optional(),
        verification_score: z.number().nullable().optional(),
        trust_score_delta: z.number().nullable().optional(),
        questions_answered: z.number(),
        correct_count: z.number(),
        partial_count: z.number(),
        incorrect_count: z.number(),
        verified_badge: z.boolean(),
        started_at: z.string().nullable().optional(),
        completed_at: z.string().nullable().optional(),
        technical_problem_flag: z.boolean(),
        target_skill: z.string().nullable().optional(),
        trigger_reason: z.string().optional(),
        provision_context: z.record(z.string(), z.unknown()).nullable().optional(),
        tab_violation_count: z.coerce.number().optional(),
        created_at: z.string(),
        updated_at: z.string(),
    })
    .passthrough();

export type RecruiterVerificationSession = z.infer<typeof recruiterVerificationSessionSchema>;

export function parseRecruiterVerificationSessions(data: unknown): RecruiterVerificationSession[] {
    return z.array(recruiterVerificationSessionSchema).parse(Array.isArray(data) ? data : []);
}
