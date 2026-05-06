"use client";

import { Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useMyApplications } from "../../(jobs)/applications/hooks/use-my-applications";
import type { ApplicationResponse } from "../../(jobs)/applications/schemas/candidate-applications.schema";

function formatAppliedAt(iso: string): string {
    try {
        return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(iso));
    } catch {
        return iso;
    }
}

function statusLabel(status: ApplicationResponse["status"]): string {
    if (status === "Pending") return "Pending";
    if (status === "Accepted") return "Accepted";
    return "Rejected";
}

function statusDotClass(status: ApplicationResponse["status"]): string {
    if (status === "Pending") return "bg-blue-600";
    if (status === "Accepted") return "bg-green-500";
    return "bg-red-500";
}

function statusTextClass(status: ApplicationResponse["status"]): string {
    if (status === "Pending") return "text-blue-600";
    if (status === "Accepted") return "text-green-600";
    return "text-red-600";
}

export default function ApplicationsPage() {
    const [activeTab, setActiveTab] = useState<"All" | "Pending" | "Accepted" | "Rejected">("All");
    const statusFilter = activeTab === "All" ? undefined : activeTab;
    const appsQuery = useMyApplications(statusFilter);

    const filtered = useMemo(() => appsQuery.data ?? [], [appsQuery.data]);

    return (
        <div className="p-8 lg:p-10 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
                        My Applications
                    </h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        Track your progress with employers
                    </p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                        type="text"
                        placeholder="Filter in page (coming soon)"
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-900 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                        disabled
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 border-b border-gray-100 pb-2 flex-wrap">
                {(["All", "Pending", "Accepted", "Rejected"] as const).map((tab) => (
                    <button
                        type="button"
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 text-xs font-black uppercase tracking-widest transition-all relative ${
                            activeTab === tab
                                ? "text-blue-600"
                                : "text-gray-400 hover:text-gray-900"
                        }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-[-9px] left-0 w-full h-1 bg-blue-600 rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            {appsQuery.isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-500">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="text-sm font-semibold">Loading applications…</span>
                </div>
            ) : appsQuery.isError ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    Could not load applications. Sign in as a candidate and try again.
                </div>
            ) : filtered.length === 0 ? (
                <div className="rounded-[32px] border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500 text-sm font-medium">
                    No applications yet.{" "}
                    <Link
                        href="/applicant/jobs"
                        className="text-blue-600 font-bold hover:underline"
                    >
                        Browse jobs
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {filtered.map((app) => (
                        <div
                            key={app.id}
                            className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all group overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-lg uppercase border border-blue-100">
                                        {(app.applicant_first_name?.[0] ?? "?") +
                                            (app.applicant_last_name?.[0] ?? "")}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
                                            Application
                                        </h3>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            Job {app.job_id.slice(0, 8)}… • Applied{" "}
                                            {formatAppliedAt(app.created_at)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 lg:gap-10">
                                    <div className="space-y-1 text-center md:text-left">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            Status
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-2 h-2 rounded-full ${statusDotClass(app.status)}`}
                                            />
                                            <span
                                                className={`text-[11px] font-black uppercase tracking-tight ${statusTextClass(app.status)}`}
                                            >
                                                {statusLabel(app.status)}
                                            </span>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/applicant/applications/${app.job_id}`}
                                        className="px-8 py-3 bg-gray-50 hover:bg-gray-900 hover:text-white text-gray-900 text-[10px] font-black rounded-[18px] uppercase tracking-widest transition-all shadow-sm border border-gray-100"
                                    >
                                        View application
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
