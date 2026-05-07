"use client";

import { ArrowRight, CalendarDays, FileText, Loader2, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useMyApplications } from "../../(jobs)/applications/hooks/use-my-applications";
import type { ApplicationResponse } from "../../(jobs)/applications/schemas/candidate-applications.schema";

const TABS = ["All", "Applied", "Pending", "Accepted", "Rejected"] as const;
type Tab = (typeof TABS)[number];

function stripHtml(html: string): string {
    return html
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function formatAppliedAt(iso: string): string {
    try {
        return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(iso));
    } catch {
        return iso;
    }
}

function statusLabel(status: ApplicationResponse["status"]): string {
    if (status === "Applied") return "Applied";
    if (status === "Pending") return "Pending";
    if (status === "Accepted") return "Accepted";
    return "Rejected";
}

function statusDotClass(status: ApplicationResponse["status"]): string {
    if (status === "Applied") return "bg-blue-600";
    if (status === "Pending") return "bg-blue-600";
    if (status === "Accepted") return "bg-green-500";
    return "bg-red-500";
}

function statusBadgeClass(status: ApplicationResponse["status"]): string {
    if (status === "Applied") return "bg-blue-50 text-blue-700";
    if (status === "Pending") return "bg-blue-50 text-blue-700";
    if (status === "Accepted") return "bg-green-50 text-green-700";
    return "bg-red-50 text-red-700";
}

function applicationTitle(app: ApplicationResponse): string {
    return app.current_job_title?.trim() || `Application ${app.job_id.slice(0, 8)}`;
}

export default function ApplicationsPage() {
    const [activeTab, setActiveTab] = useState<Tab>("All");
    const [search, setSearch] = useState("");
    const appsQuery = useMyApplications();

    const applications = useMemo(() => appsQuery.data ?? [], [appsQuery.data]);
    const filteredApplications = useMemo(() => {
        let list = applications;
        if (activeTab !== "All") {
            list = list.filter((app) => app.status === activeTab);
        }

        const q = search.trim().toLowerCase();
        if (q.length >= 2) {
            list = list.filter((app) => {
                return (
                    app.job_id.toLowerCase().includes(q) ||
                    applicationTitle(app).toLowerCase().includes(q) ||
                    (app.applicant_email ?? "").toLowerCase().includes(q)
                );
            });
        }

        return list;
    }, [applications, activeTab, search]);

    return (
        <div className="p-8 lg:p-10 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <div
                className="relative min-h-[220px] overflow-hidden rounded-3xl bg-[#475ca3] p-8 lg:p-10 text-white shadow-sm z-0"
                style={{ backgroundColor: "#8fa3c4" }}
            >
                <div className="absolute inset-0 z-[-1] mix-blend-overlay">
                    <Image
                        src="/images/slide-interview.jpg"
                        alt="Application tracking background"
                        fill
                        priority
                        className="object-cover opacity-30"
                    />
                </div>
                <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-blue-900/90 to-blue-800/40" />

                <div className="max-w-2xl">
                    <h1 className="text-3xl lg:text-[40px] font-black mb-3 tracking-tight text-white drop-shadow-md">
                        My Applications
                    </h1>
                    <p className="text-blue-50 font-bold mb-8 text-sm lg:text-base drop-shadow">
                        Track the jobs you have applied to and follow each application status.
                    </p>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-white font-bold drop-shadow">
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            {appsQuery.isLoading
                                ? "Loading..."
                                : `${filteredApplications.length} of ${applications.length} applications`}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                        Applications
                    </h2>
                    <p className="mt-1 text-sm font-medium text-gray-400">
                        Filter and review submissions.
                    </p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search applications..."
                        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs font-bold text-gray-900 outline-none transition-all placeholder:text-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-1">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`rounded-md px-4 py-2 text-xs font-black transition-all ${
                                activeTab === tab
                                    ? "bg-white text-slate-950 shadow-sm"
                                    : "text-slate-500 hover:text-slate-950"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="text-xs font-bold text-gray-400">
                    {appsQuery.isLoading
                        ? "Loading..."
                        : `${filteredApplications.length} of ${applications.length} applications`}
                </div>
            </div>

            {appsQuery.isLoading ? (
                <div className="flex flex-col items-center justify-center rounded-[18px] border border-gray-100 bg-white py-24 gap-3 text-gray-500">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="text-sm font-semibold">Loading applications...</span>
                </div>
            ) : appsQuery.isError ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    Could not load applications. Sign in as a candidate and try again.
                </div>
            ) : filteredApplications.length === 0 ? (
                <div className="bg-white rounded-[24px] p-16 flex flex-col items-center justify-center text-center border border-gray-100 border-dashed">
                    <FileText className="w-10 h-10 text-gray-300 mb-4" />
                    <h3 className="text-xl font-black text-gray-900">
                        {activeTab === "All"
                            ? "Nothing found"
                            : `No ${activeTab.toLowerCase()} applications`}
                    </h3>
                    <p className="text-sm text-gray-400 font-medium max-w-sm mt-2">
                        {activeTab === "All"
                            ? "Apply to jobs from the job listings page and they will appear here."
                            : "There are no applications with this status right now."}
                    </p>
                    <Link
                        href="/applicant/jobs"
                        className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-black text-white shadow-sm transition-all hover:bg-blue-700"
                    >
                        Browse jobs <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredApplications.map((app) => (
                        <article
                            key={app.id}
                            className="w-full rounded-[18px] border border-gray-100 bg-white px-6 py-5 shadow-sm transition-all hover:border-gray-200 hover:shadow-md"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${statusBadgeClass(app.status)}`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${statusDotClass(app.status)}`}
                                            />
                                            {statusLabel(app.status)}
                                        </span>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-600">
                                            <CalendarDays className="h-3 w-3" />
                                            Applied {formatAppliedAt(app.created_at)}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-black text-gray-900 leading-tight mb-1.5">
                                        {applicationTitle(app)}
                                    </h3>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-gray-500 mb-3">
                                        <span>Job {app.job_id.slice(0, 8)}...</span>
                                        {app.years_of_experience != null && (
                                            <>
                                                <span className="h-1 w-1 rounded-full bg-gray-300" />
                                                <span>
                                                    {app.years_of_experience}{" "}
                                                    {app.years_of_experience === 1
                                                        ? "year"
                                                        : "years"}{" "}
                                                    experience
                                                </span>
                                            </>
                                        )}
                                        {app.employment_type && (
                                            <>
                                                <span className="h-1 w-1 rounded-full bg-gray-300" />
                                                <span>
                                                    {app.employment_type.replace(/_/g, " ")}
                                                </span>
                                            </>
                                        )}
                                        {app.is_remote != null && (
                                            <>
                                                <span className="h-1 w-1 rounded-full bg-gray-300" />
                                                <span>{app.is_remote ? "Remote" : "On-site"}</span>
                                            </>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                        {app.cover_letter
                                            ? stripHtml(app.cover_letter)
                                            : "Your application is saved here with the details submitted to the employer."}
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center">
                                    <Link
                                        href={`/applicant/applications/${app.job_id}`}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2 text-xs font-black text-white shadow-sm transition-all hover:bg-black"
                                    >
                                        View <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
