"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { normalizeError } from "@/lib/errors";
import { toastService } from "@/lib/services/toast.service";
import { CoverLetterViewer } from "../../../../../../_components/CoverLetterViewer";
import { recruiterApplicationsApi } from "../../../api/recruiter-applications.api";
import { useRecruiterApplicationVerifications } from "../../../hooks/use-recruiter-application-verifications";
import { useRecruiterCandidateProfile } from "../../../hooks/use-recruiter-candidate-profile";
import { parseEvaluateBundle } from "../../../lib/parse-ai-evaluate-bundle";
import {
    RECRUITER_JOB_APPLICATION_DETAIL_QUERY_KEY,
    useRecruiterJobApplicationDetail,
} from "../../../hooks/use-recruiter-job-application-detail";
import { RECRUITER_JOB_APPLICATIONS_QUERY_KEY } from "../../../hooks/use-recruiter-job-applications";

function formatDateLabel(value: string): string {
    try {
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(value));
    } catch {
        return value;
    }
}

function normalizeLifecycleStatus(
    status:
        | "Applied"
        | "Shortlisted"
        | "Interviewed"
        | "Passed"
        | "Rejected"
        | "Pending"
        | "Accepted",
): "Applied" | "Shortlisted" | "Interviewed" | "Passed" | "Rejected" {
    if (status === "Pending") return "Applied";
    if (status === "Accepted") return "Passed";
    return status;
}

function statusBadgeClass(
    status: "Applied" | "Shortlisted" | "Interviewed" | "Passed" | "Rejected",
): string {
    if (status === "Applied") return "bg-blue-100 text-blue-700";
    if (status === "Shortlisted") return "bg-purple-100 text-purple-700";
    if (status === "Interviewed") return "bg-amber-100 text-amber-700";
    if (status === "Passed") return "bg-green-100 text-green-700";
    return "bg-red-100 text-red-700";
}

function fmt(v: unknown, d = 0): string {
    if (v === null || v === undefined || Number.isNaN(Number(v))) return "—";
    return Number(v).toFixed(d);
}

function fmtI(v: unknown): string {
    if (v === null || v === undefined || Number.isNaN(Number(v))) return "—";
    return String(Math.round(Number(v)));
}

function extractResumeFilename(resumeUrl: string): string {
    try {
        const raw = resumeUrl.split("?")[0]?.split("#")[0] ?? "";
        const lastSegment = raw.split("/").pop() ?? "";
        const decoded = decodeURIComponent(lastSegment);
        if (!decoded.trim()) return "resume.pdf";
        return decoded.toLowerCase().endsWith(".pdf") ? decoded : `${decoded}.pdf`;
    } catch {
        return "resume.pdf";
    }
}

function Sc({ label, v }: { label: string; v: string }) {
    return (
        <div className="rounded-md bg-white/70 border border-indigo-100 px-2 py-1">
            <p className="text-[9px] font-bold uppercase text-gray-400">{label}</p>
            <p className="font-black text-gray-900">{v}</p>
        </div>
    );
}

// Map raw scorer flag types to plain-language labels recruiters can act on.
const TRUST_FLAG_LABELS: Record<string, string> = {
    inflated_skills: "Skill claims look inflated",
    identity_name_mismatch: "Resume name doesn’t match the account name",
    date_overlap: "Overlapping employment dates",
    missing_dates: "Missing employment dates",
    domain_mismatch: "Experience is in a different domain",
    short_experience: "Limited work history",
    education_inconsistency: "Education info isn’t consistent",
};

function friendlyTrustFlag(type: string | null | undefined): string {
    if (!type) return "Trust signal";
    const norm = type.toLowerCase().replace(/[^a-z0-9_]/g, "_");
    return TRUST_FLAG_LABELS[norm] ?? type.replace(/_/g, " ");
}

function severityTone(sev: string | null | undefined): {
    pill: string;
    label: string;
} {
    const s = (sev ?? "").toLowerCase();
    if (s === "high") return { pill: "bg-rose-100 text-rose-800", label: "High" };
    if (s === "medium")
        return { pill: "bg-amber-100 text-amber-800", label: "Medium" };
    if (s === "low") return { pill: "bg-yellow-100 text-yellow-800", label: "Low" };
    return { pill: "bg-gray-100 text-gray-700", label: sev ?? "Info" };
}

function splitRationale(raw: string | null | undefined): string[] {
    if (!raw) return [];
    return raw
        .split(/[;]\s+/)
        .map((s) => s.trim().replace(/\.$/, ""))
        .filter((s) => s.length > 0)
        .slice(0, 8);
}

function formatSkill(s: string | null | undefined): string {
    if (!s) return "this skill";
    return s
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function friendlySessionStatus(status: string): {
    label: string;
    tone: string;
} {
    const s = status.toLowerCase();
    if (s === "completed")
        return { label: "Completed", tone: "bg-emerald-100 text-emerald-800" };
    if (s === "in_progress" || s === "started")
        return { label: "In progress", tone: "bg-blue-100 text-blue-800" };
    if (s === "recommended")
        return { label: "Recommended, not yet taken", tone: "bg-amber-100 text-amber-800" };
    if (s === "expired" || s === "abandoned")
        return { label: "Expired", tone: "bg-gray-100 text-gray-700" };
    return { label: status, tone: "bg-gray-100 text-gray-700" };
}

function stepperStateClass(
    step: "Applied" | "Shortlisted" | "Interviewed" | "Passed",
    current: "Applied" | "Shortlisted" | "Interviewed" | "Passed" | "Rejected",
): string {
    if (current === "Rejected")
        return step === "Applied" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500";
    const order = ["Applied", "Shortlisted", "Interviewed", "Passed"] as const;
    const stepIndex = order.indexOf(step);
    const currentIndex = order.indexOf(current);
    if (stepIndex <= currentIndex) return "bg-blue-600 text-white";
    return "bg-gray-200 text-gray-500";
}

export default function RecruiterJobApplicationDetailPage({
    params,
}: {
    params: Promise<{ jobId: string; applicationId: string }>;
}) {
    const { jobId, applicationId } = use(params);
    const applicationQuery = useRecruiterJobApplicationDetail(jobId, applicationId, true);
    const verificationsQuery = useRecruiterApplicationVerifications(jobId, applicationId, true);
    const queryClient = useQueryClient();
    const candidateQuery = useRecruiterCandidateProfile(
        applicationQuery.data?.user_id ?? null,
        true,
    );
    const transitionMutation = useMutation({
        mutationFn: async (target: "shortlist" | "interview" | "pass" | "reject") => {
            if (target === "shortlist") return recruiterApplicationsApi.shortlist(applicationId);
            if (target === "interview") return recruiterApplicationsApi.interview(applicationId);
            if (target === "pass") return recruiterApplicationsApi.pass(applicationId);
            return recruiterApplicationsApi.reject(applicationId);
        },
        onSuccess: async () => {
            toastService.success("Application status updated.");
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: [...RECRUITER_JOB_APPLICATION_DETAIL_QUERY_KEY, jobId, applicationId],
                }),
                queryClient.invalidateQueries({
                    queryKey: [...RECRUITER_JOB_APPLICATIONS_QUERY_KEY, jobId],
                }),
            ]);
        },
        onError: (error) => {
            toastService.error(normalizeError(error).message);
        },
    });

    const rescoreMutation = useMutation({
        mutationFn: () => recruiterApplicationsApi.rescore(jobId, applicationId),
        onSuccess: async () => {
            toastService.success("AI scoring recomputed.");
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: [...RECRUITER_JOB_APPLICATION_DETAIL_QUERY_KEY, jobId, applicationId],
                }),
                queryClient.invalidateQueries({
                    queryKey: [...RECRUITER_JOB_APPLICATIONS_QUERY_KEY, jobId],
                }),
            ]);
        },
        onError: (error) => {
            toastService.error(normalizeError(error).message);
        },
    });

    if (applicationQuery.isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh] text-gray-500 gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading application detail...
            </div>
        );
    }

    if (applicationQuery.isError || !applicationQuery.data) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Could not load this application.
            </div>
        );
    }

    const application = applicationQuery.data;
    const candidate = candidateQuery.data;
    const profile = candidate?.candidate_profile;
    const lifecycleStatus = normalizeLifecycleStatus(application.status);

    const evaluateHints = parseEvaluateBundle(application.response_json);

    const showDynamicBlock =
        Boolean(application.ai_requires_verification) ||
        (verificationsQuery.data?.length ?? 0) > 0 ||
        (evaluateHints?.trustFlags?.length ?? 0) > 0;

    const workflowActions =
        lifecycleStatus === "Applied"
            ? [
                  {
                      id: "shortlist" as const,
                      label: "Shortlist",
                      className: "bg-purple-600 hover:bg-purple-700",
                  },
                  {
                      id: "reject" as const,
                      label: "Reject",
                      className: "bg-red-600 hover:bg-red-700",
                  },
              ]
            : lifecycleStatus === "Shortlisted"
              ? [
                    {
                        id: "interview" as const,
                        label: "Mark Interviewed",
                        className: "bg-amber-600 hover:bg-amber-700",
                    },
                    {
                        id: "reject" as const,
                        label: "Reject",
                        className: "bg-red-600 hover:bg-red-700",
                    },
                ]
              : lifecycleStatus === "Interviewed"
                ? [
                      {
                          id: "pass" as const,
                          label: "Mark Passed",
                          className: "bg-green-600 hover:bg-green-700",
                      },
                      {
                          id: "reject" as const,
                          label: "Reject",
                          className: "bg-red-600 hover:bg-red-700",
                      },
                  ]
                : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Application Detail</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Full submission, status workflow, and profile context.
                    </p>
                </div>
                <Link
                    href={`/recruiter/job-listings/${jobId}`}
                    className="text-sm font-semibold text-blue-600 hover:underline"
                >
                    Back to applicants list
                </Link>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Status
                        </span>
                        <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusBadgeClass(
                                lifecycleStatus,
                            )}`}
                        >
                            {lifecycleStatus}
                        </span>
                    </div>
                    {workflowActions.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-2">
                            {workflowActions.map((action) => (
                                <button
                                    key={action.id}
                                    type="button"
                                    disabled={transitionMutation.isPending}
                                    onClick={() => transitionMutation.mutate(action.id)}
                                    className={`inline-flex items-center rounded-lg px-3 py-2 text-xs font-bold text-white transition-colors disabled:opacity-60 ${action.className}`}
                                >
                                    {transitionMutation.isPending ? "Updating..." : action.label}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs font-semibold text-gray-500">
                            This application is in a terminal stage.
                        </p>
                    )}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                    {(["Applied", "Shortlisted", "Interviewed", "Passed"] as const).map((step) => (
                        <div key={step} className="flex items-center gap-2">
                            <span
                                className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-[11px] font-bold ${stepperStateClass(
                                    step,
                                    lifecycleStatus,
                                )}`}
                            >
                                {step.slice(0, 1)}
                            </span>
                            <span className="text-xs font-semibold text-gray-600">{step}</span>
                            {step !== "Passed" && <span className="h-px w-4 bg-gray-300" />}
                        </div>
                    ))}
                    {lifecycleStatus === "Rejected" && (
                        <span className="ml-1 inline-flex rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-700">
                            Rejected
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-5 shadow-sm space-y-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                            <h2 className="text-sm font-bold text-indigo-950">AI screening summary</h2>
                            <p className="text-[11px] text-indigo-900/70 mt-0.5">
                                Match measures resume↔JD fit. Trust flags inconsistencies.
                                Final blends both with optional verification.
                            </p>
                        </div>
                        <button
                            type="button"
                            disabled={rescoreMutation.isPending}
                            onClick={() => rescoreMutation.mutate()}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 text-[11px] font-bold disabled:opacity-60"
                        >
                            {rescoreMutation.isPending ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <RefreshCw className="h-3.5 w-3.5" />
                            )}
                            {rescoreMutation.isPending ? "Computing…" : "Compute AI score"}
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <Sc label="Match" v={fmt(application.ai_match_score, 1)} />
                        <Sc label="Trust" v={fmtI(application.ai_trust_score)} />
                        <Sc label="Trust (eff.)" v={fmtI(application.ai_trust_effective)} />
                        <Sc label="Final" v={fmt(application.ai_final_score, 1)} />
                        <Sc label="Verification" v={fmt(application.ai_verification_score, 1)} />
                        <Sc label="Recommendation" v={application.ai_recommendation ?? "—"} />
                    </div>
                    {application.ai_last_scored_at && (
                        <p className="text-[10px] text-indigo-800/80">
                            Last scored {formatDateLabel(application.ai_last_scored_at)}
                        </p>
                    )}
                    {application.ai_scoring_status && (
                        <div className="flex items-center gap-2 flex-wrap">
                            <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                    application.ai_scoring_status === "completed" ||
                                    application.ai_scoring_status === "complete"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : application.ai_scoring_status === "pending"
                                          ? "bg-amber-100 text-amber-800"
                                          : application.ai_scoring_status === "failed"
                                            ? "bg-rose-100 text-rose-800"
                                            : "bg-gray-100 text-gray-700"
                                }`}
                            >
                                {application.ai_scoring_status}
                            </span>
                            <span className="text-[10px] text-indigo-800/70">
                                {application.ai_scoring_status === "pending"
                                    ? "Scoring has not finished yet — try Compute AI score above."
                                    : application.ai_scoring_status === "failed"
                                      ? "Last attempt failed — re-running is safe."
                                      : ""}
                            </span>
                        </div>
                    )}
                    {application.ai_scoring_error && (
                        <p className="text-[11px] text-amber-900 font-semibold whitespace-pre-wrap">
                            {application.ai_scoring_error}
                        </p>
                    )}
                </div>

                {showDynamicBlock && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm space-y-4">
                        <div>
                            <h2 className="text-sm font-bold text-amber-950">
                                Verification &amp; trust signals
                            </h2>
                            <p className="text-[11px] text-amber-900/80 mt-0.5">
                                What the AI noticed about this application. None of these
                                affect the candidate’s status automatically — they are guidance
                                for your decision.
                            </p>
                        </div>

                        {application.ai_requires_verification && (
                            <div className="rounded-lg border border-amber-200 bg-white px-3 py-2">
                                <p className="text-xs font-bold text-amber-900">
                                    Skill verification recommended
                                </p>
                                <p className="text-[11px] text-amber-900/80 mt-0.5">
                                    The candidate hasn’t taken a verification quiz. Invite
                                    them only if you want to confirm the skills below.
                                </p>
                            </div>
                        )}

                        {(() => {
                            const reasons = splitRationale(
                                evaluateHints?.verificationReason ?? null,
                            );
                            if (reasons.length === 0) return null;
                            return (
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wide text-amber-900/80">
                                        Why the AI flagged this candidate
                                    </p>
                                    <ul className="list-disc pl-5 text-xs text-amber-950 mt-1 space-y-1">
                                        {reasons.map((r, i) => (
                                            <li key={i}>{r}</li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })()}

                        {evaluateHints?.verificationSkills &&
                            evaluateHints.verificationSkills.length > 0 && (
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wide text-amber-900/80">
                                        Skills suggested for verification
                                    </p>
                                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                                        {evaluateHints.verificationSkills.map((s) => (
                                            <span
                                                key={s}
                                                className="inline-flex items-center rounded-full bg-white border border-amber-200 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900"
                                            >
                                                {formatSkill(s)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                        {evaluateHints?.trustFlags &&
                            evaluateHints.trustFlags.length > 0 && (
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wide text-amber-900/80">
                                        Trust concerns
                                    </p>
                                    <div className="mt-1.5 space-y-1.5">
                                        {evaluateHints.trustFlags.map((f, i) => {
                                            if (!f.message && !f.type) return null;
                                            const sev = severityTone(f.severity);
                                            return (
                                                <div
                                                    key={`${f.type}-${i}`}
                                                    className="rounded-lg border border-amber-200 bg-white p-3"
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className="text-xs font-bold text-gray-900">
                                                            {friendlyTrustFlag(f.type)}
                                                        </p>
                                                        <span
                                                            className={`text-[10px] font-bold uppercase tracking-wide rounded-full px-2 py-0.5 ${sev.pill}`}
                                                        >
                                                            {sev.label}
                                                        </span>
                                                    </div>
                                                    {f.message && (
                                                        <p className="text-[12px] text-gray-700 mt-1">
                                                            {f.message}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                        {verificationsQuery.isLoading && (
                            <p className="text-xs text-amber-900">
                                Loading verification activity…
                            </p>
                        )}
                        {verificationsQuery.data &&
                            verificationsQuery.data.length > 0 && (
                                <details className="rounded-lg border border-amber-200 bg-white">
                                    <summary className="cursor-pointer px-3 py-2 text-xs font-bold text-amber-900 select-none">
                                        Verification activity ({verificationsQuery.data.length})
                                    </summary>
                                    <div className="space-y-2 p-3 pt-0">
                                        {verificationsQuery.data.map((vs) => {
                                            const status = friendlySessionStatus(vs.status);
                                            const skill = formatSkill(vs.target_skill ?? "skill");
                                            const isCompleted =
                                                vs.status.toLowerCase() === "completed";
                                            return (
                                                <div
                                                    key={vs.id}
                                                    className="rounded-md border border-amber-100 bg-amber-50/40 p-3 text-xs text-gray-800"
                                                >
                                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                                        <p className="font-bold text-gray-900">
                                                            {skill} skill check
                                                        </p>
                                                        <span
                                                            className={`text-[10px] font-bold uppercase tracking-wide rounded-full px-2 py-0.5 ${status.tone}`}
                                                        >
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                    {isCompleted ? (
                                                        <p className="text-[12px] text-gray-700 mt-1">
                                                            Answered{" "}
                                                            <strong>
                                                                {vs.correct_count}
                                                            </strong>{" "}
                                                            of{" "}
                                                            <strong>
                                                                {vs.questions_answered}
                                                            </strong>{" "}
                                                            questions correctly. Trust impact:{" "}
                                                            <strong>
                                                                {typeof vs.trust_score_delta === "number"
                                                                    ? (vs.trust_score_delta >= 0
                                                                          ? "+"
                                                                          : "") +
                                                                      vs.trust_score_delta.toFixed(0)
                                                                    : "—"}
                                                            </strong>
                                                            .
                                                        </p>
                                                    ) : (
                                                        <p className="text-[12px] text-gray-700 mt-1">
                                                            No quiz taken yet for this skill.
                                                        </p>
                                                    )}
                                                    {(vs.tab_violation_count ?? 0) > 0 && (
                                                        <p className="text-[11px] text-rose-700 font-semibold mt-1">
                                                            Switched away from the quiz{" "}
                                                            {vs.tab_violation_count} time
                                                            {vs.tab_violation_count === 1 ? "" : "s"}
                                                            .
                                                        </p>
                                                    )}
                                                    {vs.technical_problem_flag && (
                                                        <p className="text-[11px] text-rose-700 font-semibold mt-1">
                                                            Possible integrity issue detected during
                                                            the quiz.
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </details>
                            )}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-7 rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                    <h2 className="text-base font-bold text-gray-900">Submitted application</h2>
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 space-y-2">
                        <p className="text-sm text-gray-900 font-semibold">
                            {application.applicant_first_name} {application.applicant_last_name}
                        </p>
                        <p className="text-xs text-gray-600">{application.applicant_email}</p>
                        <p className="text-xs text-gray-600">
                            Status:{" "}
                            <span className="font-semibold text-blue-700">{lifecycleStatus}</span>
                        </p>
                        <p className="text-xs text-gray-600">
                            Submitted: {formatDateLabel(application.created_at)}
                        </p>
                    </div>

                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Cover Letter
                        </p>
                        {application.cover_letter ? (
                            <div className="mt-2 min-h-[120px] rounded-lg bg-white px-1 py-1">
                                <CoverLetterViewer
                                    html={application.cover_letter}
                                    className="text-gray-800"
                                />
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic mt-2">Not provided</p>
                        )}
                    </div>

                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Resume
                        </p>
                        <p className="text-sm text-gray-800 mt-2">
                            {application.resume_url ? (
                                <a
                                    href={application.resume_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
                                >
                                    <FileText className="h-5 w-5" />
                                    {extractResumeFilename(application.resume_url)}
                                </a>
                            ) : (
                                "Not provided"
                            )}
                        </p>
                    </div>
                </div>

                <div className="xl:col-span-5 self-start rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                    <h2 className="text-base font-bold text-gray-900">Candidate profile context</h2>
                    {candidateQuery.isLoading && (
                        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading profile...
                        </div>
                    )}
                    {candidateQuery.isError && (
                        <p className="text-sm text-red-600">
                            Could not load candidate profile details.
                        </p>
                    )}
                    {candidate && (
                        <div className="space-y-3">
                            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                                <p className="text-xs text-gray-500">Name</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {candidate.first_name} {candidate.last_name}
                                </p>
                            </div>
                            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                                <p className="text-xs text-gray-500">Current job title</p>
                                <p className="text-sm text-gray-800">
                                    {profile?.current_job_title || "—"}
                                </p>
                            </div>
                            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                                <p className="text-xs text-gray-500">Years of experience</p>
                                <p className="text-sm text-gray-800">
                                    {profile?.years_of_experience ??
                                        application.years_of_experience ??
                                        "—"}
                                </p>
                            </div>
                            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                                <p className="text-xs text-gray-500">Education level</p>
                                <p className="text-sm text-gray-800">
                                    {profile?.education_level || "—"}
                                </p>
                            </div>
                            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                                <p className="text-xs text-gray-500">Primary skills</p>
                                <p className="text-sm text-gray-800">
                                    {profile?.primary_skills?.join(", ") ||
                                        application.primary_skills?.join(", ") ||
                                        "—"}
                                </p>
                            </div>
                            <Link
                                href={`/recruiter/candidates/${application.user_id}`}
                                className="inline-flex text-xs font-semibold text-blue-600 hover:underline"
                            >
                                Open candidate profile page
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
