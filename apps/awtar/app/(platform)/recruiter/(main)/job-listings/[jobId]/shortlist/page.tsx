"use client";

import { useMutation } from "@tanstack/react-query";
import {
    AlertTriangle,
    Brain,
    CheckCircle2,
    ChevronLeft,
    Clock,
    Loader2,
    RefreshCw,
    Sparkles,
    XCircle,
} from "lucide-react";
import Link from "next/link";
import { use, useMemo, useState } from "react";
import type { RecruiterApplication } from "../../schemas/recruiter-applications.schema";
import { recruiterApplicationsApi } from "../../api/recruiter-applications.api";
import { useRecruiterJobApplications } from "../../hooks/use-recruiter-job-applications";
import {
    useApproveStatus,
    useRunShortlist,
} from "../../hooks/use-recruiter-shortlist";
import type { ShortlistCard, ShortlistResponse } from "../../schemas/shortlist.schema";

type BucketKey =
    | "shortlist"
    | "verification_needed"
    | "hold"
    | "reject"
    | "pending_ai_scoring"
    | "failed_ai_scoring";

type CandidateLookup = Record<
    string,
    { name: string; email: string; status: string }
>;

function bucketLabel(b: BucketKey): string {
    switch (b) {
        case "shortlist":
            return "Shortlist";
        case "verification_needed":
            return "Verification needed";
        case "hold":
            return "Hold";
        case "reject":
            return "Reject";
        case "pending_ai_scoring":
            return "Scoring pending";
        case "failed_ai_scoring":
            return "Scoring failed";
    }
}

// Plain-language description shown under each bucket header so recruiters know
// exactly what action — if any — the bucket implies. The agent never auto-changes
// application status; it only proposes buckets.
function bucketDescription(b: BucketKey): string {
    switch (b) {
        case "shortlist":
            return "Strong fit + acceptable trust. Approve to move them to Shortlisted (interview pipeline).";
        case "verification_needed":
            return "Promising candidate but trust/skills are uncertain. Review the trust signals on the detail page and decide manually.";
        case "hold":
            return "Borderline match or missing data. Review manually — no action taken automatically.";
        case "reject":
            return "Weak fit and/or strong trust flags. Reject is suggested; final call is yours.";
        case "pending_ai_scoring":
            return "Scoring has not completed for these candidates yet. Open the detail page and click ‘Compute AI score’ to backfill, then re-run ranking.";
        case "failed_ai_scoring":
            return "The scoring pipeline errored on these. Re-run scoring from the detail page or try the ranking button again.";
    }
}

function bucketTone(b: BucketKey): { dot: string; pill: string; ring: string } {
    switch (b) {
        case "shortlist":
            return {
                dot: "bg-emerald-500",
                pill: "bg-emerald-100 text-emerald-700",
                ring: "border-emerald-200",
            };
        case "verification_needed":
            return {
                dot: "bg-amber-500",
                pill: "bg-amber-100 text-amber-800",
                ring: "border-amber-200",
            };
        case "hold":
            return {
                dot: "bg-sky-500",
                pill: "bg-sky-100 text-sky-700",
                ring: "border-sky-200",
            };
        case "reject":
            return {
                dot: "bg-rose-500",
                pill: "bg-rose-100 text-rose-700",
                ring: "border-rose-200",
            };
        case "pending_ai_scoring":
            return {
                dot: "bg-gray-400",
                pill: "bg-gray-100 text-gray-700",
                ring: "border-gray-200",
            };
        case "failed_ai_scoring":
            return {
                dot: "bg-red-600",
                pill: "bg-red-100 text-red-800",
                ring: "border-red-200",
            };
    }
}

function fmtScore(n: number | null | undefined): string {
    return typeof n === "number" && Number.isFinite(n) ? n.toFixed(0) : "—";
}

// Convert raw recruiter applications into a "cached" ShortlistResponse so the
// page can render buckets WITHOUT calling the agent on every refresh. Only the
// explicit Run/Re-run button hits the live agent chain.
function buildCachedView(
    jobId: string,
    apps: RecruiterApplication[],
): ShortlistResponse {
    const make = (a: RecruiterApplication): ShortlistCard => {
        const respJson = a.response_json as
            | { trust?: { risk_flags?: Array<{ message?: string }> } }
            | undefined;
        const flags = Array.isArray(respJson?.trust?.risk_flags)
            ? respJson.trust.risk_flags
                  .map((f) => (typeof f?.message === "string" ? f.message : ""))
                  .filter(Boolean)
            : [];
        return {
            candidate_id: a.user_id,
            application_id: a.id,
            final_score: typeof a.ai_final_score === "number" ? a.ai_final_score : 0,
            ranking_reason: "",
            mcp_recommendation: a.ai_recommendation ?? "—",
            policy_bucket: "hold",
            match_overall_score:
                typeof a.ai_match_score === "number" ? a.ai_match_score : null,
            trust_score:
                typeof a.ai_trust_score === "number" ? a.ai_trust_score : null,
            trust_red_flags: flags.slice(0, 4),
            verification: {
                taken: false,
                verification_recommended: Boolean(a.ai_requires_verification),
                skills_to_verify: [],
                reason: "",
            },
            application_status: a.status,
            ai_scoring_status: a.ai_scoring_status ?? null,
            used_cached_scores: true,
            status_locked: false,
        };
    };

    const shortlist: ShortlistCard[] = [];
    const hold: ShortlistCard[] = [];
    const reject: ShortlistCard[] = [];
    const pending: ShortlistCard[] = [];
    const failed: ShortlistCard[] = [];
    const verification: ShortlistCard[] = [];

    for (const a of apps) {
        const card = make(a);
        const status = (a.ai_scoring_status ?? "").toLowerCase();
        const rec = (a.ai_recommendation ?? "").toLowerCase();
        const hasScore = typeof a.ai_final_score === "number";

        if (status === "failed") {
            failed.push(card);
            continue;
        }
        if (!hasScore || status === "pending" || status === "") {
            pending.push(card);
            continue;
        }
        if (a.ai_requires_verification) {
            verification.push(card);
            continue;
        }
        if (rec === "shortlist") shortlist.push(card);
        else if (rec === "reject") reject.push(card);
        else hold.push(card);
    }

    shortlist.sort((a, b) => b.final_score - a.final_score);
    hold.sort((a, b) => b.final_score - a.final_score);
    reject.sort((a, b) => b.final_score - a.final_score);
    verification.sort((a, b) => b.final_score - a.final_score);

    const total =
        shortlist.length +
        hold.length +
        reject.length +
        pending.length +
        failed.length +
        verification.length;

    return {
        job_id: jobId,
        summary:
            `Cached AI scores for ${total} applicant(s). ` +
            "Click ‘Run AI ranking’ to recompute with the latest models and " +
            "regenerate a narrative summary.",
        shortlist,
        hold,
        reject,
        pending_ai_scoring: pending,
        failed_ai_scoring: failed,
        verification_needed: verification,
        next_actions: [],
        llm: { used: false, skipped_reason: "cached view — no LLM call" },
        requires_human_approval: true,
        scores_persistence: null,
        warnings: [],
    };
}

// Newest `ai_last_scored_at` across all applications. Used to detect "the
// cached view is fresher than the last live ranking run".
function newestScoredAt(apps: RecruiterApplication[]): number {
    let max = 0;
    for (const a of apps) {
        const raw = a.ai_last_scored_at;
        if (!raw) continue;
        const t = Date.parse(raw);
        if (Number.isFinite(t) && t > max) max = t;
    }
    return max;
}

function CandidateCard({
    bucket,
    card,
    lookup,
    jobId,
    onApprove,
    onReject,
    isApproving,
    isRejecting,
}: {
    bucket: BucketKey;
    card: ShortlistCard;
    lookup: CandidateLookup;
    jobId: string;
    onApprove: () => void;
    onReject: () => void;
    isApproving: boolean;
    isRejecting: boolean;
}) {
    const tone = bucketTone(bucket);
    const meta = lookup[card.application_id];
    const name = meta?.name ?? `Application ${card.application_id.slice(0, 8)}`;
    const email = meta?.email ?? "";
    const currentStatus = meta?.status ?? card.application_status ?? "";

    // Recruiter action policy:
    //  - Approve (Move to shortlisted): Shortlist, Hold, Verification needed
    //    buckets when the application is still in "Applied" state.
    //  - Reject: any non-terminal bucket except Pending/Failed scoring.
    //  - Hide everything for Pending/Failed scoring (no real signal yet).
    const isPendingOrFailed =
        bucket === "pending_ai_scoring" || bucket === "failed_ai_scoring";

    const canShortlist =
        !isPendingOrFailed &&
        (bucket === "shortlist" ||
            bucket === "hold" ||
            bucket === "verification_needed") &&
        currentStatus === "Applied" &&
        !card.status_locked;

    const canReject =
        !isPendingOrFailed &&
        currentStatus !== "Rejected" &&
        currentStatus !== "Passed" &&
        currentStatus !== "Interviewed" &&
        !card.status_locked;

    return (
        <div className={`rounded-xl border ${tone.ring} bg-white p-4 shadow-sm`}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`h-2 w-2 rounded-full ${tone.dot}`} />
                        <span className="text-sm font-bold text-gray-900 truncate">{name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${tone.pill}`}>
                            {bucketLabel(bucket)}
                        </span>
                        {card.used_cached_scores && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-600">
                                cached
                            </span>
                        )}
                        {card.status_locked && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-gray-200 text-gray-700">
                                locked
                            </span>
                        )}
                    </div>
                    {email && (
                        <p className="text-[11px] text-gray-500 mt-0.5 truncate">{email}</p>
                    )}
                </div>
                <div className="text-right">
                    <p className="text-2xl font-black text-gray-900 leading-none">
                        {fmtScore(card.final_score)}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide font-bold">
                        Final score
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 text-[11px]">
                <div className="rounded-lg bg-gray-50 px-2 py-1.5">
                    <p className="text-gray-500 font-semibold">Match</p>
                    <p className="font-bold text-gray-800">
                        {fmtScore(card.match_overall_score ?? undefined)}
                    </p>
                </div>
                <div className="rounded-lg bg-gray-50 px-2 py-1.5">
                    <p className="text-gray-500 font-semibold">Trust</p>
                    <p className="font-bold text-gray-800">
                        {fmtScore(card.trust_score ?? undefined)}
                    </p>
                </div>
                <div className="rounded-lg bg-gray-50 px-2 py-1.5">
                    <p className="text-gray-500 font-semibold">Recommend</p>
                    <p className="font-bold text-gray-800 truncate" title={card.mcp_recommendation}>
                        {card.mcp_recommendation}
                    </p>
                </div>
            </div>

            {card.ranking_reason && (
                <p className="text-[12px] text-gray-700 mt-3 leading-snug whitespace-pre-line">
                    <span className="inline-flex items-center gap-1 text-gray-500 mr-1">
                        <Brain className="h-3 w-3" /> Why this ranking:
                    </span>
                    {card.ranking_reason}
                </p>
            )}

            {card.trust_red_flags.length > 0 && (
                <div className="mt-3 rounded-lg border border-rose-100 bg-rose-50/50 p-2">
                    <p className="text-[10px] font-bold uppercase text-rose-700 inline-flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Trust red flags
                    </p>
                    <ul className="mt-1 list-disc pl-4 text-[11px] text-rose-800 space-y-0.5">
                        {card.trust_red_flags.slice(0, 4).map((f, i) => (
                            <li key={i}>{f}</li>
                        ))}
                    </ul>
                </div>
            )}

            {card.verification?.verification_recommended && (
                <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50/60 p-2">
                    <p className="text-[10px] font-bold uppercase text-amber-700 inline-flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Verification suggested
                    </p>
                    {card.verification.skills_to_verify.length > 0 && (
                        <p className="text-[11px] text-amber-900 mt-1">
                            Skills:{" "}
                            <span className="font-bold">
                                {card.verification.skills_to_verify.slice(0, 5).join(", ")}
                            </span>
                        </p>
                    )}
                    {card.verification.reason && (
                        <p className="text-[11px] text-amber-900 mt-1 whitespace-pre-line">
                            {card.verification.reason}
                        </p>
                    )}
                </div>
            )}

            <div className="mt-4 flex items-center justify-between gap-2 flex-wrap">
                <Link
                    href={`/recruiter/job-listings/${jobId}/applications/${card.application_id}`}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                >
                    Open detail
                </Link>
                <div className="flex items-center gap-2">
                    {canReject && (
                        <button
                            type="button"
                            onClick={onReject}
                            disabled={isRejecting}
                            className="text-[11px] font-bold text-rose-700 border border-rose-200 bg-white px-2.5 py-1.5 rounded-lg hover:bg-rose-50 disabled:opacity-60 inline-flex items-center gap-1"
                        >
                            {isRejecting ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
                            Reject
                        </button>
                    )}
                    {canShortlist && (
                        <button
                            type="button"
                            onClick={onApprove}
                            disabled={isApproving}
                            className="text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg disabled:opacity-60 inline-flex items-center gap-1"
                        >
                            {isApproving ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                            Move to shortlisted
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function BucketSection({
    bucket,
    cards,
    lookup,
    jobId,
    onApprove,
    onReject,
    approvingId,
    rejectingId,
}: {
    bucket: BucketKey;
    cards: ShortlistCard[];
    lookup: CandidateLookup;
    jobId: string;
    onApprove: (card: ShortlistCard) => void;
    onReject: (card: ShortlistCard) => void;
    approvingId: string | null;
    rejectingId: string | null;
}) {
    if (cards.length === 0) return null;
    const tone = bucketTone(bucket);
    return (
        <section className={`rounded-2xl border ${tone.ring} bg-white/40 p-4`}>
            <header className="mb-3 flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${tone.dot}`} />
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                            {bucketLabel(bucket)}
                        </h3>
                        <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${tone.pill}`}
                        >
                            {cards.length}
                        </span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-1 max-w-3xl leading-snug">
                        {bucketDescription(bucket)}
                    </p>
                </div>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {cards.map((card) => (
                    <CandidateCard
                        key={`${bucket}-${card.application_id}`}
                        bucket={bucket}
                        card={card}
                        lookup={lookup}
                        jobId={jobId}
                        onApprove={() => onApprove(card)}
                        onReject={() => onReject(card)}
                        isApproving={approvingId === card.application_id}
                        isRejecting={rejectingId === card.application_id}
                    />
                ))}
            </div>
        </section>
    );
}

export default function RecruiterShortlistPage({
    params,
}: {
    params: Promise<{ jobId: string }>;
}) {
    const { jobId } = use(params);

    const applicationsQuery = useRecruiterJobApplications(jobId, true);
    const runShortlist = useRunShortlist(jobId);
    const approveStatus = useApproveStatus(jobId);

    const [response, setResponse] = useState<ShortlistResponse | null>(null);
    const [approvingId, setApprovingId] = useState<string | null>(null);
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    // Timestamp of the last live agent run. Used to detect when individual
    // rescore writes have made the rendered live ranking stale.
    const [lastRunAt, setLastRunAt] = useState<number | null>(null);

    const lookup: CandidateLookup = useMemo(() => {
        const apps = applicationsQuery.data ?? [];
        const out: CandidateLookup = {};
        for (const a of apps) {
            const fullName = [a.applicant_first_name, a.applicant_last_name]
                .filter(Boolean)
                .join(" ")
                .trim();
            out[a.id] = {
                name: fullName || `Application ${a.id.slice(0, 8)}`,
                email: a.applicant_email ?? "",
                status: a.status,
            };
        }
        return out;
    }, [applicationsQuery.data]);

    const triggerRun = (instructions?: string) => {
        setErrorMsg(null);
        runShortlist.mutate(
            { instructions, includeVerification: true, persistScores: true, maxShortlist: 10 },
            {
                onSuccess: (data) => {
                    setResponse(data);
                    setLastRunAt(Date.now());
                    void applicationsQuery.refetch();
                },
                onError: (err) => {
                    const msg = err instanceof Error ? err.message : "Shortlist run failed.";
                    setErrorMsg(msg);
                },
            },
        );
    };

    // Cached view is the default page render — recruiters get an instant
    // overview from data we already have, NO agent call on mount/refresh.
    const cachedView = useMemo<ShortlistResponse | null>(() => {
        const apps = applicationsQuery.data;
        if (!apps || apps.length === 0) return null;
        return buildCachedView(jobId, apps);
    }, [applicationsQuery.data, jobId]);

    const activeView = response ?? cachedView;
    const isCachedView = activeView !== null && response === null;

    // "Stale" = a per-applicant rescore has happened after the last live
    // ranking run, so the order/summary in `response` might no longer be right.
    const newestAppScoredAt = useMemo(
        () => newestScoredAt(applicationsQuery.data ?? []),
        [applicationsQuery.data],
    );
    const isLiveResponseStale =
        response !== null && lastRunAt !== null && newestAppScoredAt > lastRunAt;

    const moveToShortlistedMut = useMutation({
        mutationFn: (applicationId: string) =>
            approveStatus.mutateAsync({
                applicationIds: [applicationId],
                status: "Shortlisted",
                approvalConfirmed: true,
            }),
    });

    const rejectMut = useMutation({
        mutationFn: (applicationId: string) =>
            recruiterApplicationsApi.reject(applicationId),
        onSuccess: () => {
            void applicationsQuery.refetch();
        },
    });

    const handleApprove = (card: ShortlistCard) => {
        setApprovingId(card.application_id);
        moveToShortlistedMut.mutate(card.application_id, {
            onSettled: () => {
                setApprovingId(null);
            },
            onSuccess: () => {
                void applicationsQuery.refetch();
            },
        });
    };

    const handleReject = (card: ShortlistCard) => {
        setRejectingId(card.application_id);
        rejectMut.mutate(card.application_id, {
            onSettled: () => setRejectingId(null),
        });
    };

    const buckets: { key: BucketKey; cards: ShortlistCard[] }[] = activeView
        ? [
              { key: "shortlist", cards: activeView.shortlist },
              { key: "verification_needed", cards: activeView.verification_needed },
              { key: "hold", cards: activeView.hold },
              { key: "pending_ai_scoring", cards: activeView.pending_ai_scoring },
              { key: "failed_ai_scoring", cards: activeView.failed_ai_scoring },
              { key: "reject", cards: activeView.reject },
          ]
        : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 inline-flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                        AI Ranking & Shortlist
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Recommended ranking from the AI agent. Status changes still need your approval.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href={`/recruiter/job-listings/${jobId}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-blue-600"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to job
                    </Link>
                    <button
                        type="button"
                        onClick={() => triggerRun()}
                        disabled={runShortlist.isPending}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-bold hover:bg-blue-700 disabled:opacity-60"
                        title={
                            response
                                ? "Re-fetch live ranking from the AI agent and re-persist scores."
                                : "Compute fresh AI ranking from the agent + scoring service."
                        }
                    >
                        {runShortlist.isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {response ? "Re-running…" : "Running…"}
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4" />
                                {response ? "Re-run AI ranking" : "Run AI ranking"}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {runShortlist.isPending && !response && (
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex items-center justify-center text-gray-700 gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    <p className="text-sm font-semibold">
                        AI agent is ranking applicants… this can take a moment for large pools.
                    </p>
                </div>
            )}

            {errorMsg && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    <span className="font-bold">Could not run AI ranking. </span>
                    {errorMsg}
                </div>
            )}

            {isLiveResponseStale && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 flex items-start gap-3">
                    <RefreshCw className="h-4 w-4 mt-0.5 text-amber-700 shrink-0" />
                    <div className="flex-1">
                        <p className="font-bold">Scores changed since the last ranking.</p>
                        <p className="text-[12px] mt-0.5">
                            One or more applicants were rescored individually after this
                            ranking was generated. Click <strong>Re-run AI ranking</strong>{" "}
                            to refresh the order and summary.
                        </p>
                    </div>
                </div>
            )}

            {!activeView && !runShortlist.isPending && (
                <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50/40 p-10 text-center">
                    <Sparkles className="mx-auto h-7 w-7 text-blue-600" />
                    <h2 className="mt-3 text-base font-bold text-gray-900">
                        No AI ranking yet
                    </h2>
                    <p className="text-sm text-gray-600 mt-1 max-w-md mx-auto">
                        Either no one has applied yet, or scoring hasn’t run on the
                        current applicants. Click <strong>Run AI ranking</strong> to
                        generate one.
                    </p>
                    <button
                        type="button"
                        onClick={() => triggerRun()}
                        disabled={runShortlist.isPending}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-bold hover:bg-blue-700 disabled:opacity-60"
                    >
                        <Sparkles className="h-4 w-4" />
                        Run AI ranking
                    </button>
                </div>
            )}

            {activeView && (
                <>
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start gap-3">
                            <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h2 className="text-sm font-bold text-gray-900">
                                        {isCachedView ? "Cached AI summary" : "Agent summary"}
                                    </h2>
                                    {isCachedView && (
                                        <span
                                            className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700"
                                            title="Buckets below come from stored AI scores. Click ‘Run AI ranking’ to recompute live."
                                        >
                                            cached view
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">
                                    {activeView.summary}
                                </p>

                                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                                    {(
                                        [
                                            { key: "shortlist", n: activeView.shortlist.length },
                                            {
                                                key: "verification_needed",
                                                n: activeView.verification_needed.length,
                                            },
                                            { key: "hold", n: activeView.hold.length },
                                            { key: "reject", n: activeView.reject.length },
                                            {
                                                key: "pending_ai_scoring",
                                                n: activeView.pending_ai_scoring.length,
                                            },
                                            {
                                                key: "failed_ai_scoring",
                                                n: activeView.failed_ai_scoring.length,
                                            },
                                        ] as { key: BucketKey; n: number }[]
                                    ).map(({ key, n }) => {
                                        const tone = bucketTone(key);
                                        return (
                                            <div
                                                key={key}
                                                className={`rounded-lg border ${tone.ring} bg-white px-2.5 py-2`}
                                            >
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`h-2 w-2 rounded-full ${tone.dot}`} />
                                                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-600">
                                                        {bucketLabel(key)}
                                                    </p>
                                                </div>
                                                <p className="text-lg font-black text-gray-900 mt-0.5">
                                                    {n}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>

                                {!isCachedView && (
                                    <div className="flex items-center gap-3 mt-3 flex-wrap text-[11px] text-gray-500">
                                        <span
                                            className={`px-2 py-0.5 rounded-full font-bold ${
                                                activeView.llm.used
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                            title={
                                                activeView.llm.used
                                                    ? "Gemini wrote the narrative summary above."
                                                    : "Gemini was not called — falling back to a deterministic summary."
                                            }
                                        >
                                            LLM polish: {activeView.llm.used ? "yes" : "skipped"}
                                        </span>
                                        {activeView.llm.skipped_reason && (
                                            <span className="italic">
                                                {activeView.llm.skipped_reason}
                                            </span>
                                        )}
                                        {activeView.scores_persistence?.attempted && (
                                            <span
                                                className={`px-2 py-0.5 rounded-full font-bold ${
                                                    activeView.scores_persistence.succeeded
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-amber-100 text-amber-800"
                                                }`}
                                                title="Whether the agent wrote AI score rows back to the backend."
                                            >
                                                scores persisted:{" "}
                                                {activeView.scores_persistence.succeeded
                                                    ? `${activeView.scores_persistence.updated ?? "ok"}`
                                                    : "failed"}
                                            </span>
                                        )}
                                    </div>
                                )}
                                {activeView.next_actions.length > 0 && (
                                    <ul className="mt-3 list-disc pl-5 text-[12px] text-gray-700 space-y-1">
                                        {activeView.next_actions.map((a, i) => (
                                            <li key={i}>{a}</li>
                                        ))}
                                    </ul>
                                )}
                                {activeView.warnings.length > 0 && (
                                    <details className="mt-3">
                                        <summary className="text-[11px] font-bold text-amber-700 cursor-pointer inline-flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {activeView.warnings.length} warning(s)
                                        </summary>
                                        <ul className="list-disc pl-5 text-[11px] text-amber-800 mt-1">
                                            {activeView.warnings.map((w, i) => (
                                                <li key={i}>{w}</li>
                                            ))}
                                        </ul>
                                    </details>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {buckets.every((b) => b.cards.length === 0) && (
                            <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500 text-center">
                                No candidates returned by the AI ranking yet.
                            </div>
                        )}
                        {buckets.map((b) => (
                            <BucketSection
                                key={b.key}
                                bucket={b.key}
                                cards={b.cards}
                                lookup={lookup}
                                jobId={jobId}
                                onApprove={handleApprove}
                                onReject={handleReject}
                                approvingId={approvingId}
                                rejectingId={rejectingId}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
