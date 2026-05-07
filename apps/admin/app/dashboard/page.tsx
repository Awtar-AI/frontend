"use client";

import { Building2, Clock3, ShieldCheck, TrendingDown, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/lib/hooks/use-theme";
import { AdminShell } from "../_components/admin-shell";
import { useOrganizations } from "../organizations/hooks/use-organizations";
import { useDashboardStats } from "./hooks/use-dashboard-stats";

function statusTextClass(status: "pending" | "active" | "suspended") {
    switch (status) {
        case "active":
            return "text-emerald-300";
        case "suspended":
            return "text-red-300";
        default:
            return "text-amber-300";
    }
}

function formatDelta(diff: number) {
    if (diff === 0) return "No change";

    return `${diff > 0 ? "+" : ""}${diff.toLocaleString()} vs last month`;
}

function getDeltaIcon(diff: number) {
    if (diff < 0) return TrendingDown;
    return TrendingUp;
}

export default function DashboardPage() {
    const organizationsQuery = useOrganizations({ page: 1, page_size: 6 });
    const organizations = organizationsQuery.data?.organizations ?? [];
    const { theme } = useTheme();

    const isDark = theme === "dark";
    const statsQuery = useDashboardStats();
    const stats = statsQuery.data ?? {
        active_organizations: 0,
        active_organizations_diff: 0,
        active_users: 0,
        active_users_diff: 0,
        pending_organizations: 0,
        pending_organizations_diff: 0,
        total_staff: 0,
        total_staff_diff: 0,
    };

    const overviewCards = [
        {
            label: "Active organizations",
            value: stats.active_organizations,
            diff: stats.active_organizations_diff,
            icon: Building2,
        },
        {
            label: "Pending review",
            value: stats.pending_organizations,
            diff: stats.pending_organizations_diff,
            icon: Clock3,
        },
        {
            label: "Active users",
            value: stats.active_users,
            diff: stats.active_users_diff,
            icon: Users,
        },
        {
            label: "Total staff",
            value: stats.total_staff,
            diff: stats.total_staff_diff,
            icon: ShieldCheck,
        },
    ] as const;

    return (
        <AdminShell title="Admin Panel">
            <div className="space-y-8">
                <div>
                    <h1
                        className={`text-3xl font-bold tracking-tight ${isDark ? "text-awtar-white" : "text-gray-900"}`}
                    >
                        Dashboard
                    </h1>
                    <p className={`mt-2 ${isDark ? "text-awtar-slate" : "text-gray-600"}`}>
                        Platform moderation overview with a focus on organization approvals and
                        status changes.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    {overviewCards.map((card) => (
                        <div
                            key={card.label}
                            className={`rounded-2xl border p-5 shadow-xl transition-colors ${
                                isDark
                                    ? "border-white/10 bg-white/3 shadow-black/10"
                                    : "border-gray-200 bg-white shadow-gray-200/50"
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <p
                                    className={`text-sm ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                >
                                    {card.label}
                                </p>
                                <card.icon className="h-5 w-5 text-red-300" />
                            </div>
                            <p
                                className={`mt-4 text-3xl font-bold ${isDark ? "text-awtar-white" : "text-gray-900"}`}
                            >
                                {statsQuery.isLoading ? "—" : card.value.toLocaleString()}
                            </p>
                            <div
                                className={`mt-2 flex items-center gap-1.5 text-xs font-semibold ${
                                    isDark ? "text-awtar-slate" : "text-gray-500"
                                }`}
                            >
                                {statsQuery.isLoading ? (
                                    "Loading stats..."
                                ) : card.diff === 0 ? (
                                    <span>No change</span>
                                ) : (
                                    <>
                                        {(() => {
                                            const DeltaIcon = getDeltaIcon(card.diff);
                                            return (
                                                <DeltaIcon
                                                    className={`h-3.5 w-3.5 ${
                                                        card.diff > 0
                                                            ? "text-emerald-400"
                                                            : "text-red-300"
                                                    }`}
                                                />
                                            );
                                        })()}
                                        <span
                                            className={
                                                card.diff > 0 ? "text-emerald-300" : "text-red-300"
                                            }
                                        >
                                            {formatDelta(card.diff)}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    className={`rounded-2xl border shadow-2xl transition-colors ${
                        isDark
                            ? "border-white/10 bg-white/3 shadow-black/10"
                            : "border-gray-200 bg-white shadow-gray-200/50"
                    }`}
                >
                    <div
                        className={`flex items-center justify-between border-b px-6 py-4 ${isDark ? "border-white/10" : "border-gray-200"}`}
                    >
                        <div>
                            <h2
                                className={`text-lg font-semibold ${isDark ? "text-awtar-white" : "text-gray-900"}`}
                            >
                                Recent organizations
                            </h2>
                            <p
                                className={`text-sm ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                            >
                                Quick access to the latest moderation queue.
                            </p>
                        </div>
                        <Link
                            href="/organizations"
                            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                                isDark
                                    ? "border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/20 hover:text-white"
                                    : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-900"
                            }`}
                        >
                            Open full management
                        </Link>
                    </div>

                    <div className="p-6">
                        {organizationsQuery.isLoading ? (
                            <p className={isDark ? "text-awtar-slate" : "text-gray-600"}>
                                Loading organization activity...
                            </p>
                        ) : organizations.length > 0 ? (
                            <div className="space-y-3">
                                {organizations.map((organization) => (
                                    <Link
                                        key={organization.id}
                                        href={`/organizations/${organization.id}`}
                                        className={`flex items-center justify-between rounded-xl border px-4 py-4 transition-colors ${
                                            isDark
                                                ? "border-white/10 bg-awtar-navy-light/60 hover:border-red-500/20 hover:bg-awtar-navy-light"
                                                : "border-gray-200 bg-gray-50 hover:border-red-200 hover:bg-red-50"
                                        }`}
                                    >
                                        <div>
                                            <p
                                                className={`font-semibold ${isDark ? "text-awtar-white" : "text-gray-900"}`}
                                            >
                                                {organization.organization_name}
                                            </p>
                                            <p
                                                className={`mt-1 text-sm ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                            >
                                                {organization.industry} ·{" "}
                                                {organization.organization_size} employees
                                            </p>
                                        </div>
                                        <span
                                            className={`text-sm font-semibold capitalize ${statusTextClass(organization.status)}`}
                                        >
                                            {organization.status}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className={isDark ? "text-awtar-slate" : "text-gray-600"}>
                                No organizations available yet.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
