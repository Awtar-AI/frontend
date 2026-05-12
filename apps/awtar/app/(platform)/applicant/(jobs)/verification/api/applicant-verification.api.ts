import http from "@/lib/http";
import {
    parseVerificationSessions,
    verificationSessionSchema,
    type VerificationSessionDto,
} from "../schemas/verification-session.schema";

export type NextQuestionPayload = {
    question?: {
        question_id: string;
        skill: string;
        difficulty: string;
        type: string;
        question: string;
        options: string[];
        rubric_hints?: string[];
    };
    skipped?: boolean;
    reason?: string | null;
};

export type GradingPayload = {
    score: number;
    result: string;
    feedback?: string;
    next_difficulty?: string;
};

export const applicantVerificationApi = {
    async getSession(sessionId: string): Promise<VerificationSessionDto> {
        const { data } = await http.get(`/api/v1/verification/sessions/${sessionId}`);
        return verificationSessionSchema.parse(data);
    },

    async listForApplication(applicationId: string): Promise<VerificationSessionDto[]> {
        const { data } = await http.get("/api/v1/verification/sessions", {
            params: { application_id: applicationId },
        });
        return parseVerificationSessions(data);
    },

    async begin(sessionId: string): Promise<VerificationSessionDto> {
        const { data } = await http.post(`/api/v1/verification/sessions/${sessionId}/begin-assessment`);
        return verificationSessionSchema.parse(data);
    },

    async next(sessionId: string): Promise<NextQuestionPayload> {
        const { data } = await http.post(`/api/v1/verification/sessions/${sessionId}/next-question`);
        return data as NextQuestionPayload;
    },

    async submit(sessionId: string, body: { question_id: string; answer: string; question?: unknown }) {
        const { data } = await http.post(`/api/v1/verification/sessions/${sessionId}/submit-answer`, body);
        return data as GradingPayload;
    },

    async complete(sessionId: string): Promise<VerificationSessionDto> {
        const { data } = await http.post(`/api/v1/verification/sessions/${sessionId}/complete`);
        return verificationSessionSchema.parse(data);
    },

    async tabViolation(sessionId: string): Promise<VerificationSessionDto> {
        const { data } = await http.post(`/api/v1/verification/sessions/${sessionId}/tab-violation`);
        return verificationSessionSchema.parse(data);
    },
};
