import { z } from "zod";

const verificationSummarySchema = z
    .object({
        taken: z.boolean().default(false),
        verification_recommended: z.boolean().default(false),
        skills_to_verify: z.array(z.string()).default([]),
        reason: z.string().default(""),
    })
    .partial()
    .extend({
        taken: z.boolean().default(false),
        verification_recommended: z.boolean().default(false),
        skills_to_verify: z.array(z.string()).default([]),
        reason: z.string().default(""),
    });

export const shortlistCardSchema = z
    .object({
        candidate_id: z.string(),
        application_id: z.string(),
        final_score: z.number(),
        ranking_reason: z.string().default(""),
        mcp_recommendation: z.string().default("hold"),
        policy_bucket: z.string().default("hold"),
        match_overall_score: z.number().nullable().optional(),
        trust_score: z.number().nullable().optional(),
        trust_red_flags: z.array(z.string()).default([]),
        verification: verificationSummarySchema.default({
            taken: false,
            verification_recommended: false,
            skills_to_verify: [],
            reason: "",
        }),
        application_status: z.string().nullable().optional(),
        ai_scoring_status: z.string().nullable().optional(),
        used_cached_scores: z.boolean().default(false),
        status_locked: z.boolean().default(false),
    })
    .passthrough();

export type ShortlistCard = z.infer<typeof shortlistCardSchema>;

export const llmUsageSchema = z
    .object({
        used: z.boolean(),
        skipped_reason: z.string().nullable().optional(),
    })
    .passthrough();

export const scoresPersistenceMetaSchema = z
    .object({
        attempted: z.boolean().default(false),
        succeeded: z.boolean().nullable().optional(),
        correlation_id: z.string().nullable().optional(),
        idempotency_key: z.string().nullable().optional(),
        http_status: z.number().nullable().optional(),
        backend_message: z.string().nullable().optional(),
        updated: z.number().nullable().optional(),
    })
    .passthrough();

export const shortlistResponseSchema = z
    .object({
        job_id: z.string(),
        summary: z.string().default(""),
        shortlist: z.array(shortlistCardSchema).default([]),
        hold: z.array(shortlistCardSchema).default([]),
        reject: z.array(shortlistCardSchema).default([]),
        pending_ai_scoring: z.array(shortlistCardSchema).default([]),
        failed_ai_scoring: z.array(shortlistCardSchema).default([]),
        verification_needed: z.array(shortlistCardSchema).default([]),
        next_actions: z.array(z.string()).default([]),
        llm: llmUsageSchema.default({ used: false }),
        requires_human_approval: z.boolean().default(true),
        scores_persistence: scoresPersistenceMetaSchema.nullable().optional(),
        warnings: z.array(z.string()).default([]),
    })
    .passthrough();

export type ShortlistResponse = z.infer<typeof shortlistResponseSchema>;

export function parseShortlistResponse(data: unknown): ShortlistResponse {
    return shortlistResponseSchema.parse(data);
}

export const approveStatusResponseSchema = z
    .object({
        success: z.boolean(),
        data: z.unknown().nullable().optional(),
    })
    .passthrough();

export type ApproveStatusResponse = z.infer<typeof approveStatusResponseSchema>;
