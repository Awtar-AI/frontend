"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useMemo, useRef } from "react";
import { useApplicationById } from "../../../applications/hooks/use-application-by-id";
import { useVerificationSessionsForApplication } from "../../../verification/hooks/use-verification-sessions";

/** Match must be weak AND scorer requested verification before sending candidate to assessments. */
const LOW_SCORE_NEED_VERIFY_MAX = 65;

function scoringSettled(status?: string | null): boolean {
    if (!status) return false;
    const s = status.toLowerCase();
    return s === "complete" || s === "completed" || s === "partial" || s === "failed";
}

export default function PostApplyScoringPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: jobUuid } = use(params);
    const router = useRouter();
    const search = useSearchParams();
    const applicationId = search.get("applicationId");
    const mountedAtRef = useRef(Date.now());

    const appQuery = useApplicationById(applicationId, { refetchInterval: 2500 });
    const app = appQuery.data;

    const settled = useMemo(() => scoringSettled(app?.ai_scoring_status ?? null), [app?.ai_scoring_status]);

    const sessionsQuery = useVerificationSessionsForApplication(applicationId, Boolean(settled));

    useEffect(() => {
        if (!applicationId || appQuery.isError) return;
        if (!app) return;

        const fallbackNoVerify =
            !settled &&
            !app.ai_scoring_status &&
            app.ai_requires_verification === false &&
            Date.now() - mountedAtRef.current > 6000;
        if (fallbackNoVerify) {
            router.replace(`/applicant/applications/${jobUuid}`);
            return;
        }
        if (!settled) return;

        const final = app.ai_final_score ?? 0;
        const needVerify =
            Boolean(app.ai_requires_verification) && final <= LOW_SCORE_NEED_VERIFY_MAX;

        if (!needVerify) {
            router.replace(`/applicant/applications/${jobUuid}`);
            return;
        }

        if (sessionsQuery.isLoading || sessionsQuery.isFetching) return;

        const sessions = sessionsQuery.data ?? [];
        const pending =
            sessions.find((s) => s.status === "recommended") ??
            sessions.find((s) => s.status === "in_progress");
        if (pending && pending.status !== "completed") {
            router.replace(`/applicant/jobs/${jobUuid}/verify/${pending.id}`);
            return;
        }

        router.replace(`/applicant/applications/${jobUuid}`);
    }, [
        applicationId,
        app,
        settled,
        jobUuid,
        router,
        appQuery.isError,
        sessionsQuery.data,
        sessionsQuery.isFetching,
        sessionsQuery.isLoading,
    ]);

    if (!applicationId) {
        return (
            <div className="p-8 max-w-lg mx-auto rounded-2xl border border-amber-100 bg-amber-50 text-sm text-amber-900">
                Missing application reference.{" "}
                <Link href="/applicant/applications" className="font-bold underline">
                    Back to applications
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 p-8 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <div>
                <h1 className="text-lg font-black text-gray-900">Finishing your screening</h1>
                <p className="mt-2 text-sm text-gray-600 max-w-md">
                    We&apos;re running AI match and trust checks on your application. This usually takes a few
                    seconds. If verification is required, you&apos;ll be routed automatically.
                </p>
                {app?.ai_scoring_status && (
                    <p className="mt-4 text-xs font-bold text-gray-500">
                        Scoring status: {app.ai_scoring_status}
                    </p>
                )}
            </div>
        </div>
    );
}

