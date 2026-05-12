import http from "@/lib/http";
import {
    parseShortlistResponse,
    approveStatusResponseSchema,
    type ApproveStatusResponse,
    type ShortlistResponse,
} from "../schemas/shortlist.schema";

export type RunShortlistInput = {
    jobId: string;
    instructions?: string;
    includeVerification?: boolean;
    maxShortlist?: number;
    persistScores?: boolean;
};

export type ApproveStatusInput = {
    applicationIds: string[];
    status: "Applied" | "Shortlisted" | "Interviewed" | "Passed" | "Rejected";
    approvalConfirmed: boolean;
};

export const recruiterShortlistApi = {
    /**
     * POST /api/v1/recruiter/jobs/:jobId/shortlist — backend proxy that
     * forwards to agent-service /agent/shortlist with the recruiter JWT.
     */
    async runShortlist({
        jobId,
        instructions,
        includeVerification = true,
        maxShortlist = 10,
        persistScores = true,
    }: RunShortlistInput): Promise<ShortlistResponse> {
        const body: Record<string, unknown> = {
            include_verification: includeVerification,
            max_shortlist: maxShortlist,
            persist_scores: persistScores,
        };
        if (instructions && instructions.trim()) {
            body.instructions = instructions.trim();
        }
        const { data } = await http.post(
            `/api/v1/recruiter/jobs/${jobId}/shortlist`,
            body,
        );
        return parseShortlistResponse(data);
    },

    /**
     * POST /api/v1/recruiter/applications/approve-status — backend proxy that
     * forwards to agent-service /agent/approve-status-update; recruiter-approved
     * status changes are enforced server-side.
     */
    async approveStatus(
        input: ApproveStatusInput,
    ): Promise<ApproveStatusResponse> {
        const { data } = await http.post(
            `/api/v1/recruiter/applications/approve-status`,
            {
                application_ids: input.applicationIds,
                status: input.status,
                approval_confirmed: input.approvalConfirmed,
            },
        );
        return approveStatusResponseSchema.parse(data);
    },
};
