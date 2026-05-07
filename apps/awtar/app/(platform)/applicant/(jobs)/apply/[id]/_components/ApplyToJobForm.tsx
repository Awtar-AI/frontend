"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowLeft,
    Bold,
    Briefcase,
    CalendarDays,
    Eye,
    FileText,
    HelpCircle,
    Italic,
    Link2,
    List,
    ListOrdered,
    Loader2,
    Mail,
    MapPin,
    Paperclip,
    Pencil,
    Quote,
    Underline,
    UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { useAuthStore } from "@/lib/store/auth";
import { useApplyToJob } from "../../../applications/hooks/use-apply-to-job";
import {
    type ApplyFormInput,
    buildApplyFormSchema,
} from "../../../applications/schemas/apply-form.schema";
import { useOrganizationPublic } from "../../../public-jobs/hooks/use-organization-public";
import {
    formatEmploymentTypeLabel,
    formatExperienceLevelLabel,
    formatPublicJobLocation,
    formatPublicJobSalary,
} from "../../../public-jobs/lib/format-job";
import type { PublicJob } from "../../../public-jobs/schemas/public-jobs.schema";

type Props = {
    job: PublicJob;
};

type CoverLetterEditorProps = {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
};

const editorButtonClass =
    "grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-100";

function CoverLetterEditor({ value, onChange, error, required }: CoverLetterEditorProps) {
    const editorRef = useRef<HTMLTextAreaElement>(null);

    function replaceSelection(format: (selected: string) => string) {
        const editor = editorRef.current;
        if (!editor) return;

        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const selected = value.slice(start, end);
        const replacement = format(selected);
        const nextValue = `${value.slice(0, start)}${replacement}${value.slice(end)}`;
        onChange(nextValue);

        window.requestAnimationFrame(() => {
            editor.focus();
            editor.setSelectionRange(start, start + replacement.length);
        });
    }

    function addLink() {
        const url = window.prompt("Enter a link URL");
        if (!url?.trim()) return;
        replaceSelection((selected) => `[${selected || "link text"}](${url.trim()})`);
    }

    function formatLines(prefix: string) {
        replaceSelection((selected) => {
            const text = selected || "List item";
            return text
                .split("\n")
                .map((line) => `${prefix}${line}`)
                .join("\n");
        });
    }

    return (
        <div className="space-y-2">
            <label htmlFor="cover_letter_editor" className="text-sm font-black text-gray-900">
                Cover letter
                {required ? (
                    <span className="text-red-500"> *</span>
                ) : (
                    <span className="text-gray-400 font-medium"> (optional)</span>
                )}
            </label>

            <div
                className={`overflow-hidden rounded-2xl border-2 bg-white transition-all ${
                    error ? "border-red-200" : "border-gray-100 focus-within:border-blue-500"
                }`}
            >
                <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 bg-slate-50 px-3 py-2">
                    <button
                        type="button"
                        onClick={() =>
                            replaceSelection((selected) => `**${selected || "bold text"}**`)
                        }
                        className={editorButtonClass}
                        aria-label="Bold"
                        title="Bold"
                    >
                        <Bold className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            replaceSelection((selected) => `_${selected || "italic text"}_`)
                        }
                        className={editorButtonClass}
                        aria-label="Italic"
                        title="Italic"
                    >
                        <Italic className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            replaceSelection(
                                (selected) => `<u>${selected || "underlined text"}</u>`,
                            )
                        }
                        className={editorButtonClass}
                        aria-label="Underline"
                        title="Underline"
                    >
                        <Underline className="h-4 w-4" />
                    </button>
                    <span className="mx-1 h-5 w-px bg-gray-200" />
                    <button
                        type="button"
                        onClick={() => formatLines("- ")}
                        className={editorButtonClass}
                        aria-label="Bullet list"
                        title="Bullet list"
                    >
                        <List className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => formatLines("1. ")}
                        className={editorButtonClass}
                        aria-label="Numbered list"
                        title="Numbered list"
                    >
                        <ListOrdered className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => formatLines("> ")}
                        className={editorButtonClass}
                        aria-label="Quote"
                        title="Quote"
                    >
                        <Quote className="h-4 w-4" />
                    </button>
                    <span className="mx-1 h-5 w-px bg-gray-200" />
                    <button
                        type="button"
                        onClick={addLink}
                        className={editorButtonClass}
                        aria-label="Add link"
                        title="Add link"
                    >
                        <Link2 className="h-4 w-4" />
                    </button>
                </div>

                <textarea
                    id="cover_letter_editor"
                    ref={editorRef}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder="Introduce yourself and explain why you are a strong fit..."
                    className="min-h-[220px] w-full resize-y px-5 py-4 text-sm font-medium leading-7 text-gray-700 outline-none placeholder:text-gray-300"
                />
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}

function formatJobDate(value?: string): string {
    if (!value) return "Recently posted";

    try {
        return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
    } catch {
        return value;
    }
}

function resumeFileName(url?: string): string {
    if (!url) return "Resume file";
    try {
        const path = new URL(url).pathname;
        return decodeURIComponent(path.split("/").filter(Boolean).at(-1) ?? "Resume file");
    } catch {
        return url.split("/").filter(Boolean).at(-1) ?? "Resume file";
    }
}

export function ApplyToJobForm({ job }: Props) {
    const role = useAuthStore((s) => s.role);
    const { data: user, isLoading: userLoading } = useCurrentUser();
    const applyMutation = useApplyToJob(job.id);
    const orgQuery = useOrganizationPublic(job.organization_id);
    const org = orgQuery.data;

    const resumeUrl = user?.candidate_profile?.resume_url?.trim();
    const hasResume = Boolean(resumeUrl);
    const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : "";
    const skills = user?.candidate_profile?.primary_skills ?? [];
    const hiringManager =
        [org?.owner_first_name, org?.owner_last_name].filter(Boolean).join(" ").trim() ||
        "Recruitment Team";

    const schema = useMemo(
        () => buildApplyFormSchema({ coverLetterRequired: job.is_cover_letter_required }),
        [job.is_cover_letter_required],
    );

    const {
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ApplyFormInput>({
        resolver: zodResolver(schema),
        defaultValues: { cover_letter: "" },
    });

    const onSubmit = handleSubmit((data) => {
        if (job.is_resume_required && !hasResume) {
            return;
        }
        applyMutation.mutate({
            cover_letter: data.cover_letter?.trim() || undefined,
            resume_url: resumeUrl || undefined,
        });
    });

    if (role && role !== "candidate") {
        return (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 text-sm text-amber-900">
                Only accounts with the candidate role can apply to jobs. You are signed in as{" "}
                <span className="font-semibold">{role}</span>.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-8">
                <form
                    onSubmit={onSubmit}
                    className="bg-white rounded-xl p-6 lg:p-8 border border-gray-200 shadow-sm space-y-7"
                >
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-black text-slate-950 tracking-tight">
                                Contact Information
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 font-medium">
                                Review the information sent with this application.
                            </p>
                        </div>
                        <Link
                            href="/applicant/profile/edit"
                            className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 hover:text-blue-700"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                            <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <UserRound className="h-3.5 w-3.5" />
                                Full Name
                            </div>
                            <p className="text-sm font-black text-slate-950">
                                {userLoading ? "Loading..." : fullName || "Not provided"}
                            </p>
                        </div>
                        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                            <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <Mail className="h-3.5 w-3.5" />
                                Email Address
                            </div>
                            <p className="break-all text-sm font-black text-slate-950">
                                {userLoading ? "Loading..." : user?.email || "Not provided"}
                            </p>
                        </div>
                    </div>

                    {job.is_resume_required && !userLoading && !hasResume && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                            This job requires a resume.{" "}
                            <Link
                                href="/applicant/profile/edit"
                                className="font-bold underline hover:text-red-900"
                            >
                                Upload a resume on your profile
                            </Link>{" "}
                            before applying.
                        </div>
                    )}

                    <CoverLetterEditor
                        value={watch("cover_letter") ?? ""}
                        onChange={(nextValue) =>
                            setValue("cover_letter", nextValue, {
                                shouldDirty: true,
                                shouldValidate: true,
                            })
                        }
                        error={errors.cover_letter?.message}
                        required={job.is_cover_letter_required}
                    />

                    <div className="space-y-3">
                        <div className="flex items-center justify-between gap-4">
                            <h3 className="text-sm font-black text-slate-950">
                                Resume & Documents
                            </h3>
                            <Link
                                href="/applicant/profile/edit"
                                className="text-xs font-black text-blue-600 hover:text-blue-700"
                            >
                                {hasResume ? "Replace" : "Attach file"}
                            </Link>
                        </div>

                        {hasResume ? (
                            <div className="flex items-center gap-4 rounded-lg border border-dashed border-blue-200 bg-blue-50/40 p-4">
                                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-red-500 shadow-sm">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-black text-slate-950">
                                        {resumeFileName(resumeUrl)}
                                    </p>
                                    <p className="mt-1 text-[11px] font-medium text-slate-500">
                                        Resume on file
                                    </p>
                                </div>
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-white hover:text-blue-600"
                                    aria-label="View resume"
                                >
                                    <Eye className="h-4 w-4" />
                                </a>
                            </div>
                        ) : (
                            <Link
                                href="/applicant/profile/edit"
                                className="inline-flex h-10 items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 text-xs font-black text-blue-600 transition-colors hover:bg-blue-50"
                            >
                                <Paperclip className="h-4 w-4" />
                                Attach File
                            </Link>
                        )}
                    </div>

                    {skills.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-black text-slate-950">Key Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-50">
                        <button
                            type="submit"
                            disabled={
                                applyMutation.isPending ||
                                userLoading ||
                                (job.is_resume_required && !hasResume)
                            }
                            className="px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-60"
                        >
                            {applyMutation.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Submitting…
                                </>
                            ) : (
                                "Submit application"
                            )}
                        </button>
                        <Link
                            href={`/applicant/jobs/${job.id}`}
                            className="text-sm font-bold text-gray-500 hover:text-gray-800"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>

            <div className="xl:col-span-4">
                <div className="sticky top-8 space-y-4">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="relative h-28 overflow-hidden">
                            <Image
                                src="/images/slide-recruiter.jpg"
                                alt="Organization office"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                        <div className="relative bg-white px-6 pb-6 pt-9">
                            <div className="absolute -top-7 left-6 z-10 grid h-14 w-14 place-items-center rounded-xl border border-blue-100 bg-white text-blue-600 shadow-lg">
                                <Briefcase className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-black text-slate-950 leading-tight">
                                {job.title}
                            </h3>
                            <p className="mt-2 text-sm font-black text-blue-600">
                                {org?.organization_name ?? "Hiring organization"}
                            </p>

                            <div className="mt-5 space-y-3 border-t border-gray-100 pt-5 text-xs font-bold text-slate-500">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                    {formatPublicJobLocation(job)}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-slate-400" />
                                    {formatPublicJobSalary(job)} ·{" "}
                                    {formatEmploymentTypeLabel(job.employment_type)}
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-slate-400" />
                                    Posted {formatJobDate(job.created_at)}
                                </div>
                            </div>

                            <div className="mt-6 rounded-lg bg-slate-50 p-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Hiring Manager
                                </p>
                                <div className="mt-3 flex items-center gap-3">
                                    <div className="grid h-9 w-9 place-items-center rounded-full bg-white text-slate-400 shadow-sm">
                                        <UserRound className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-950">
                                            {hiringManager}
                                        </p>
                                        <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                                            Recruitment team
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                        <div className="flex gap-3">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-blue-600">
                                <HelpCircle className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-blue-700">Need assistance?</p>
                                <p className="mt-1 text-xs font-medium text-blue-900/70">
                                    Check our FAQ or contact recruitment support.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Legacy summary removed after replacing it with the sidebar card above. */}
                    <div className="hidden">
                        <Link
                            href={`/applicant/jobs/${job.id}`}
                            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to job
                        </Link>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 leading-tight">
                                {job.title}
                            </h3>
                            <p className="text-sm font-bold text-gray-500 mt-2 flex items-center gap-2">
                                <Briefcase className="w-4 h-4" />
                                {formatEmploymentTypeLabel(job.employment_type)} ·{" "}
                                {formatExperienceLevelLabel(job)}
                            </p>
                        </div>
                        <div className="space-y-2 text-sm font-bold text-gray-600">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                {formatPublicJobLocation(job)}
                            </div>
                            <div>{formatPublicJobSalary(job)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
