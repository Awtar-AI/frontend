"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Clock, Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { normalizeError } from "@/lib/errors";
import { toastService } from "@/lib/services/toast.service";
import {
    applicantVerificationApi,
    type NextQuestionPayload,
} from "../../../../verification/api/applicant-verification.api";
import { APPLICANT_VERIFICATION_SESSIONS_KEY } from "../../../../verification/hooks/use-verification-sessions";
import { useTabFocusGuard } from "../../../../verification/hooks/use-tab-focus-guard";

export default function ApplicantVerificationSessionPage({
    params,
}: {
    params: Promise<{ id: string; sessionId: string }>;
}) {
    const { id: jobId, sessionId } = use(params);
    const router = useRouter();
    const queryClient = useQueryClient();
    const startedAtRef = useRef<number | null>(null);
    const [elapsed, setElapsed] = useState("00:00");
    const [phase, setPhase] = useState<"idle" | "running" | "done" | "cheat">("idle");
    const [currentQuestion, setCurrentQuestion] = useState<NextQuestionPayload["question"]>();
    const [lastPayload, setLastPayload] = useState<NextQuestionPayload | null>(null);
    const [isLoadingNext, setIsLoadingNext] = useState(false);

    useEffect(() => {
        if (phase !== "running" || !startedAtRef.current) {
            setElapsed("00:00");
            return;
        }
        const t = window.setInterval(() => {
            const sec = Math.max(0, Math.floor((Date.now() - startedAtRef.current!) / 1000));
            const m = Math.floor(sec / 60)
                .toString()
                .padStart(2, "0");
            const s = (sec % 60).toString().padStart(2, "0");
            setElapsed(`${m}:${s}`);
        }, 1000);
        return () => window.clearInterval(t);
    }, [phase]);

    const sessionQuery = useQuery({
        queryKey: ["applicant", "verification", "session", sessionId],
        queryFn: () => applicantVerificationApi.getSession(sessionId),
        enabled: Boolean(sessionId),
        staleTime: 5000,
    });

    const violatedRef = useRef(false);

    const beginMut = useMutation({
        mutationFn: () => applicantVerificationApi.begin(sessionId),
        onSuccess: async () => {
            violatedRef.current = false;
            startedAtRef.current = Date.now();
            setPhase("running");
            await loadNext();
        },
        onError: (e) => toastService.error(normalizeError(e).message),
    });

    const loadNext = useCallback(async () => {
        setIsLoadingNext(true);
        try {
            const n = await applicantVerificationApi.next(sessionId);
            setLastPayload(n);
            if (n.skipped || !n.question) {
                setCurrentQuestion(undefined);
                if (n.reason) toastService.error(n.reason);
                return;
            }
            setCurrentQuestion(n.question);
        } finally {
            setIsLoadingNext(false);
        }
    }, [sessionId]);

    const submitMut = useMutation({
        mutationFn: async (answer: string) => {
            if (!currentQuestion) throw new Error("No question loaded");
            return applicantVerificationApi.submit(sessionId, {
                question_id: currentQuestion.question_id,
                answer,
                question: currentQuestion,
            });
        },
        onSuccess: () => {
            completeMut.mutate();
        },
        onError: (e) => toastService.error(normalizeError(e).message),
    });

    const completeMut = useMutation({
        mutationFn: () => applicantVerificationApi.complete(sessionId),
        onSuccess: async () => {
            setPhase("done");
            toastService.success("Verification submitted.");
            await queryClient.invalidateQueries({ queryKey: [...APPLICANT_VERIFICATION_SESSIONS_KEY] });
            router.replace(`/applicant/applications/${jobId}`);
        },
        onError: (e) => toastService.error(normalizeError(e).message),
    });

    const tabViolationMut = useMutation({
        mutationFn: () => applicantVerificationApi.tabViolation(sessionId),
        onSuccess: async () => {
            setPhase("cheat");
            toastService.error(
                "You left the assessment view. Integrity violation recorded with zero verification impact.",
            );
            await queryClient.invalidateQueries({ queryKey: [...APPLICANT_VERIFICATION_SESSIONS_KEY] });
        },
    });

    const tabViolationRef = useRef(tabViolationMut);
    tabViolationRef.current = tabViolationMut;

    const onTabCheat = useCallback(() => {
        if (violatedRef.current || phase !== "running") return;
        violatedRef.current = true;
        tabViolationRef.current.mutate();
    }, [phase]);

    useTabFocusGuard(phase === "running", onTabCheat, 1500);

    const sess = sessionQuery.data;
    const targetSkill = sess?.target_skill ?? "";

    const canStart =
        phase === "idle" &&
        !sessionQuery.isLoading &&
        sess &&
        sess.status !== "completed" &&
        (sess.status === "recommended" || sess.status === "in_progress");

    return (
        <div className="max-w-2xl mx-auto p-6 lg:p-10 space-y-6 animate-in fade-in">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-gray-900">Skills verification</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Stay on this browser tab until you finish — switching away can trigger an integrity
                        flag and impose a harsh trust penalty via the scorer.
                    </p>
                </div>
                <Link href={`/applicant/applications/${jobId}`} className="text-xs font-bold text-blue-600 underline">
                    Exit to application
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Target skill</p>
                    <p className="text-sm font-black text-blue-900 mt-1">{targetSkill || "—"}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                            Elapsed
                        </p>
                        <p className="text-lg font-black text-gray-900 tabular-nums">{elapsed}</p>
                    </div>
                </div>
            </div>

            {phase === "cheat" && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex gap-3 text-red-900 text-sm font-semibold">
                    <ShieldAlert className="h-5 w-5 shrink-0" />
                    This attempt received an integrity flag. Progress on this verification was forced closed and
                    your overall AI scores were recomputed.
                </div>
            )}

            {phase === "idle" && sessionQuery.isLoading && (
                <div className="flex items-center gap-2 text-gray-500 text-sm font-semibold">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading verification session...
                </div>
            )}

            {sess && sess.status === "completed" && phase === "idle" && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-800">
                    This verification session is already completed.
                    <Link href={`/applicant/applications/${jobId}`} className="block mt-3 text-blue-600 underline font-bold">
                        View application
                    </Link>
                </div>
            )}

            {phase === "idle" && sess && sess.status !== "completed" && canStart && (
                <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50 p-5">
                    <div className="flex gap-2 text-amber-900 text-sm font-bold">
                        <AlertTriangle className="h-5 w-5 shrink-0" />
                        You&apos;ll answer adaptive checks focused on{" "}
                        <span className="underline">{targetSkill}</span>.
                    </div>
                    <button
                        type="button"
                        onClick={() => beginMut.mutate()}
                        disabled={beginMut.isPending}
                        className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-black hover:bg-black disabled:opacity-50"
                    >
                        {beginMut.isPending ? "Starting..." : "Start verification"}
                    </button>
                </div>
            )}

            {phase === "running" && (
                <div className="space-y-4">
                    {isLoadingNext && (
                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm font-semibold text-blue-800 inline-flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generating next question...
                        </div>
                    )}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => loadNext()}
                            disabled={isLoadingNext || submitMut.isPending || completeMut.isPending}
                            className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next question
                        </button>
                    </div>
                    {lastPayload?.skipped && !currentQuestion ? (
                        <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm space-y-3">
                            <p>No further questions ({lastPayload.reason ?? "done"}).</p>
                            <button
                                type="button"
                                className="inline-flex px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-sm"
                                onClick={() => completeMut.mutate()}
                                disabled={completeMut.isPending}
                            >
                                {completeMut.isPending ? "Saving..." : "Finalize & merge scores"}
                            </button>
                        </div>
                    ) : (
                        currentQuestion && (
                            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                                <div className="border-b border-gray-100 px-6 py-3 bg-slate-50">
                                    <p className="text-[10px] font-black uppercase text-slate-500">
                                        Question · {currentQuestion.difficulty}
                                    </p>
                                </div>
                                <div className="p-6 space-y-4">
                                    <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                                        {currentQuestion.question}
                                    </p>
                                    {currentQuestion.type === "mcq" && currentQuestion.options?.length ? (
                                        <McqForm
                                            options={currentQuestion.options}
                                            disabled={submitMut.isPending}
                                            onSubmit={(a) => submitMut.mutate(a)}
                                        />
                                    ) : (
                                        <ShortForm
                                            disabled={submitMut.isPending}
                                            onSubmit={(a) => submitMut.mutate(a)}
                                        />
                                    )}
                                    <button
                                        type="button"
                                        className="text-xs font-bold text-gray-500 hover:text-gray-800"
                                        disabled={submitMut.isPending || completeMut.isPending}
                                        onClick={() => completeMut.mutate()}
                                    >
                                        Submit session early (finalize with results so far)
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}

            {phase === "done" && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-900">
                    Verification complete — your application ranking was recomputed including this assessment.
                    <div className="mt-4">
                        <Link
                            href={`/applicant/applications/${jobId}`}
                            className="underline text-green-950 font-black"
                        >
                            Back to application
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

function McqForm({
    options,
    disabled,
    onSubmit,
}: {
    options: string[];
    disabled: boolean;
    onSubmit: (a: string) => void;
}) {
    const [sel, setSel] = useState<string | null>(null);
    return (
        <form
            className="space-y-2"
            onSubmit={(e) => {
                e.preventDefault();
                if (!sel) return;
                onSubmit(sel);
                setSel(null);
            }}
        >
            <div className="space-y-2">
                {options.map((o) => (
                    <label
                        key={o}
                        className="flex gap-3 items-center rounded-lg border border-gray-100 p-3 hover:bg-gray-50 cursor-pointer text-sm font-medium"
                    >
                        <input
                            type="radio"
                            name="mcq"
                            value={o}
                            checked={sel === o}
                            onChange={() => setSel(o)}
                        />
                        {o}
                    </label>
                ))}
            </div>
            <button
                type="submit"
                disabled={disabled || !sel}
                className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-black disabled:opacity-50"
            >
                Submit answer
            </button>
        </form>
    );
}

function ShortForm({
    disabled,
    onSubmit,
}: {
    disabled: boolean;
    onSubmit: (a: string) => void;
}) {
    const [val, setVal] = useState("");
    return (
        <form
            className="space-y-2"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(val);
                setVal("");
            }}
        >
            <textarea
                rows={5}
                value={val}
                disabled={disabled}
                onChange={(e) => setVal(e.target.value)}
                placeholder="Short answer..."
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
            <button
                type="submit"
                disabled={disabled || val.trim().length < 8}
                className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-black disabled:opacity-50"
            >
                Submit answer
            </button>
        </form>
    );
}

