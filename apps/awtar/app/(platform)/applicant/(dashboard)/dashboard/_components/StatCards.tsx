"use client";

import { Bookmark, CheckCircle2, FileText, TrendingDown, TrendingUp, XCircle } from "lucide-react";
import { useDashboardStats } from "../hooks/use-dashboard-stats";

function DiffBadge({ diff, label }: { diff: number; label: string }) {
    if (diff === 0) return <span className="text-[10px] font-bold text-gray-400">No change</span>;
    const up = diff > 0;
    const absoluteDiff = Math.abs(diff);
    const changeLabel = absoluteDiff === 1 ? label : `${label}s`;

    return (
        <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold ${up ? "text-green-600" : "text-red-500"}`}
        >
            {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {up ? "+" : ""}
            {diff} {changeLabel}
        </span>
    );
}

export function StatCards() {
    const { data, isLoading } = useDashboardStats();

    const cards = [
        {
            label: "Applications Sent",
            value: data?.total_sent ?? 0,
            diff: data?.total_sent_diff ?? 0,
            icon: FileText,
            color: "text-blue-500",
            bg: "bg-blue-50 border-blue-100",
            changeLabel: "application sent",
        },
        {
            label: "Accepted",
            value: data?.accepted ?? 0,
            diff: data?.accepted_diff ?? 0,
            icon: CheckCircle2,
            color: "text-green-500",
            bg: "bg-green-50 border-green-100",
            changeLabel: "accepted application",
        },
        {
            label: "Rejected",
            value: data?.rejected ?? 0,
            diff: data?.rejected_diff ?? 0,
            icon: XCircle,
            color: "text-red-400",
            bg: "bg-red-50 border-red-100",
            changeLabel: "rejected application",
        },
        {
            label: "Saved Jobs",
            value: data?.saved_jobs ?? 0,
            diff: data?.saved_jobs_diff ?? 0,
            icon: Bookmark,
            color: "text-orange-500",
            bg: "bg-orange-50 border-orange-100",
            changeLabel: "saved job",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {cards.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.label}
                        className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] flex flex-col justify-between transition-transform hover:-translate-y-1"
                    >
                        <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border ${stat.bg} ${stat.color}`}
                        >
                            <Icon className="w-5 h-5" />
                        </div>
                        <p className="text-gray-500 font-bold text-sm mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black text-gray-900 mb-2">
                            {isLoading ? (
                                <span className="inline-block w-10 h-8 bg-gray-100 rounded-lg animate-pulse" />
                            ) : (
                                stat.value
                            )}
                        </h3>
                        {isLoading ? (
                            <span className="inline-block w-16 h-3 bg-gray-100 rounded animate-pulse" />
                        ) : (
                            <DiffBadge diff={stat.diff} label={stat.changeLabel} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
