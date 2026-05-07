"use client";

import { Building2, Clock3, ShieldCheck, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/lib/hooks/use-theme";
import { AdminShell } from "../_components/admin-shell";
import { useOrganizations } from "../organizations/hooks/use-organizations";

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

export default function DashboardPage() {
    const organizationsQuery = useOrganizations({ page: 1, page_size: 6 });
    const organizations = organizationsQuery.data?.organizations ?? [];
    const { theme } = useTheme();

    const isDark = theme === "dark";

    const total = organizationsQuery.data?.total ?? 0;
    const pending = organizations.filter((item) => item.status === "pending").length;
    const active = organizations.filter((item) => item.status === "active").length;
    const suspended = organizations.filter((item) => item.status === "suspended").length;

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
                    {[
                        {
                            label: "Organizations",
                            value: total.toString(),
                            icon: Building2,
                        },
                        {
                            label: "Pending review",
                            value: pending.toString(),
                            icon: Clock3,
                        },
                        {
                            label: "Active",
                            value: active.toString(),
                            icon: ShieldCheck,
                        },
                        {
                            label: "Suspended",
                            value: suspended.toString(),
                            icon: TriangleAlert,
                        },
                    ].map((card) => (
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
                                {card.value}
                            </p>
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
