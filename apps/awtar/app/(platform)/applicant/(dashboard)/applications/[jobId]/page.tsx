"use client";

import {
    ArrowLeft,
    Briefcase,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    DollarSign,
    ExternalLink,
    Eye,
    FileText,
    GraduationCap,
    Loader2,
    Mail,
    MapPin,
    UserRound,
} from "lucide-react";
import Link from "next/link";
import { use, useMemo } from "react";
import { CoverLetterViewer } from "../../../../_components/CoverLetterViewer";
import { useMyApplications } from "../../../(jobs)/applications/hooks/use-my-applications";
import type { ApplicationResponse } from "../../../(jobs)/applications/schemas/candidate-applications.schema";
import { useOrganizationPublic } from "../../../(jobs)/public-jobs/hooks/use-organization-public";
import { usePublicJob } from "../../../(jobs)/public-jobs/hooks/use-public-job";
import {
    formatEmploymentTypeLabel,
    formatExperienceLevelLabel,
    formatPublicJobLocation,
    formatPublicJobSalary,
} from "../../../(jobs)/public-jobs/lib/format-job";

function formatDate(value?: string): string {
    if (!value) return "Not available";

    try {
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(value));
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

function statusStyles(status: ApplicationResponse["status"]) {
    if (status === "Accepted") {
        return {
            badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
            dot: "bg-emerald-500",
        };
    }

    if (status === "Rejected") {
        return {
            badge: "bg-red-50 text-red-700 border-red-100",
            dot: "bg-red-500",
        };
    }

    return {
        badge: "bg-blue-50 text-blue-700 border-blue-100",
        dot: "bg-blue-600",
    };
}

function expectationRange(application: ApplicationResponse): string {
    const currency = application.salary_currency ?? "ETB";

    if (application.min_salary != null && application.max_salary != null) {
        return `${application.min_salary.toLocaleString()} - ${application.max_salary.toLocaleString()} ${currency}`;
    }

    if (application.min_salary != null) {
        return `From ${application.min_salary.toLocaleString()} ${currency}`;
    }

    if (application.max_salary != null) {
        return `Up to ${application.max_salary.toLocaleString()} ${currency}`;
    }

    return "Not provided";
}

function InfoTile({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Icon className="h-3.5 w-3.5" />
                {label}
            </div>
            <p className="break-words text-sm font-black text-slate-950">{value}</p>
        </div>
    );
}

function SummaryRow({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-white p-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-500">
                <Icon className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {label}
                </p>
                <p className="mt-1 text-xs font-black text-slate-900">{value}</p>
            </div>
        </div>
    );
}

export default function ApplicantApplicationDetailPage({
    params,
}: {
    params: Promise<{ jobId: string }>;
}) {
    const { jobId } = use(params);
    const myApplicationsQuery = useMyApplications();
    const jobQuery = usePublicJob(jobId);
    const job = jobQuery.data;
    const orgQuery = useOrganizationPublic(job?.organization_id ?? null);
    const application = (myApplicationsQuery.data ?? []).find((item) => item.job_id === jobId);

    const skills = useMemo(
        () => Array.from(new Set(application?.primary_skills ?? [])).slice(0, 12),
        [application?.primary_skills],
    );

    if (myApplicationsQuery.isLoading || jobQuery.isLoading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center gap-2 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm font-semibold">Loading application...</span>
            </div>
        );
    }

    if (!application || jobQuery.isError || !job) {
        return (
            <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                <h1 className="text-base font-black text-red-900">
                    Could not load this application
                </h1>
                <Link
                    href="/applicant/applications"
                    className="mt-3 inline-flex text-sm font-black text-red-700 underline underline-offset-2"
                >
                    Back to applications
                </Link>
            </div>
        );
    }

    const fullName =
        [application.applicant_first_name, application.applicant_last_name]
            .filter(Boolean)
            .join(" ")
            .trim() || "Not provided";
    const companyName = orgQuery.data?.organization_name ?? "Company";
    const status = statusStyles(application.status);

    return (
        <div className="mx-auto max-w-[1500px] space-y-6 p-6 pb-20 lg:p-10">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                        <Link
                            href="/applicant/applications"
                            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                            aria-label="Back to applications"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white shadow-sm">
                            <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                                Submitted application
                            </p>
                            <h1 className="mt-2 min-w-0 text-xl font-black leading-tight tracking-tight text-slate-950 lg:text-2xl">
                                {job.title}
                            </h1>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500">
                                <span className="text-slate-800">{companyName}</span>
                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                <span className="inline-flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {formatPublicJobLocation(job)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span
                            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-black ${status.badge}`}
                        >
                            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                            {application.status}
                        </span>
                        <Link
                            href={`/applicant/jobs/${jobId}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                            View job <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        {application.resume_url && (
                            <a
                                href={application.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-black text-white transition-colors hover:bg-blue-700"
                            >
                                Resume <Eye className="h-3.5 w-3.5" />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="space-y-6 xl:col-span-8">
                    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-base font-black text-slate-950">
                                    Submitted Details
                                </h2>
                                <p className="mt-1 text-sm font-medium text-slate-500">
                                    Sent on {formatDate(application.created_at)}
                                </p>
                            </div>
                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <InfoTile icon={UserRound} label="Full name" value={fullName} />
                            <InfoTile
                                icon={Mail}
                                label="Email address"
                                value={application.applicant_email ?? "Not provided"}
                            />
                            <InfoTile
                                icon={Briefcase}
                                label="Current role"
                                value={application.current_job_title ?? "Not provided"}
                            />
                            <InfoTile
                                icon={Clock3}
                                label="Experience"
                                value={
                                    application.years_of_experience != null
                                        ? `${application.years_of_experience} years`
                                        : "Not provided"
                                }
                            />
                        </div>
                    </section>

                    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-base font-black text-slate-950">
                                    Submitted Cover Letter
                                </h2>
                                <p className="mt-1 text-sm font-medium text-slate-500">
                                    The message included with this application.
                                </p>
                            </div>
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                                <FileText className="h-4 w-4" />
                            </span>
                        </div>

                        {application.cover_letter ? (
                            <div className="min-h-[220px] rounded-lg border border-slate-200 bg-slate-50 px-5 py-4">
                                <CoverLetterViewer
                                    html={application.cover_letter}
                                    className="text-slate-700"
                                />
                            </div>
                        ) : (
                            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center text-sm font-semibold text-slate-400">
                                No cover letter was submitted.
                            </div>
                        )}
                    </section>
                </div>

                <aside className="space-y-6 xl:col-span-4">
                    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-base font-black text-slate-950">Application Summary</h2>
                        <div className="mt-5 space-y-3">
                            <SummaryRow
                                icon={CalendarDays}
                                label="Applied"
                                value={formatDate(application.created_at)}
                            />
                            <SummaryRow
                                icon={Briefcase}
                                label="Job type"
                                value={formatEmploymentTypeLabel(job.employment_type)}
                            />
                            <SummaryRow
                                icon={DollarSign}
                                label="Job salary"
                                value={formatPublicJobSalary(job)}
                            />
                            <SummaryRow
                                icon={GraduationCap}
                                label="Experience level"
                                value={formatExperienceLevelLabel(job)}
                            />
                        </div>
                    </section>

                    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-base font-black text-slate-950">Resume & Profile</h2>
                        <div className="mt-5 rounded-lg border border-dashed border-blue-100 bg-blue-50/50 p-4">
                            <div className="flex items-start gap-3">
                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-blue-600 shadow-sm">
                                    <FileText className="h-4 w-4" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-black text-slate-950">
                                        {resumeFileName(application.resume_url)}
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-slate-500">
                                        Submitted resume
                                    </p>
                                </div>
                            </div>
                            {application.resume_url && (
                                <a
                                    href={application.resume_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-blue-100 bg-white px-3 py-2 text-xs font-black text-blue-700 transition-colors hover:border-blue-200 hover:bg-blue-50"
                                >
                                    Open document <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            )}
                        </div>

                        <div className="mt-5 space-y-3">
                            <SummaryRow
                                icon={MapPin}
                                label="Preferred location"
                                value={
                                    application.location
                                        ? `${application.location}${application.is_remote ? " (Remote)" : ""}`
                                        : "Not provided"
                                }
                            />
                            <SummaryRow
                                icon={DollarSign}
                                label="Expected salary"
                                value={expectationRange(application)}
                            />
                        </div>
                    </section>

                    {skills.length > 0 && (
                        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-base font-black text-slate-950">Key Skills</h2>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black text-blue-700"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </aside>
            </div>
        </div>
    );
}
