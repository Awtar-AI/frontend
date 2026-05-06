"use client";

import { Building2, Globe, LogOut, Mail, Shield, User2, Users } from "lucide-react";
import { applicantDisplayName } from "@/applicant/user-me/schemas/user-me.schema";
import { useAuthOrganizationId, useAuthUser } from "@/lib/hooks/use-auth";
import { useSignOut } from "@/lib/hooks/use-signout";
import { useRecruiterOrganization } from "../organization/hooks/use-recruiter-organization";

export default function RecruiterProfilePage() {
    const user = useAuthUser();
    const organizationId = useAuthOrganizationId();
    const organizationQuery = useRecruiterOrganization(organizationId);
    const signOut = useSignOut();

    const displayName = user ? applicantDisplayName(user) : "Recruiter";
    const roleLabel =
        user?.role === "hr" ? "Recruiter" : user?.role === "admin" ? "Admin Recruiter" : "Unknown";
    const initials = displayName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl border border-blue-100 bg-blue-50 text-blue-700 font-bold text-lg flex items-center justify-center">
                            {initials || "R"}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
                            <p className="mt-1 text-sm font-semibold text-blue-700">{roleLabel}</p>
                            <p className="mt-1 text-sm text-gray-600">
                                {user?.email ?? "No email available"}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => void signOut({ redirectTo: "/recruiter/login" })}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-100"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Full Name
                    </p>
                    <p className="mt-2 text-sm text-gray-800">{displayName}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Email
                    </p>
                    <p className="mt-2 text-sm text-gray-800">{user?.email ?? "—"}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Account Status
                    </p>
                    <p className="mt-2 text-sm text-gray-800">
                        {user?.is_active ? "Active" : "Inactive"}
                    </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Last Login
                    </p>
                    <p className="mt-2 text-sm text-gray-800">{user?.last_logged_in_at ?? "—"}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    Active Organization Details
                </h2>
                {!organizationId && (
                    <p className="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                        No active organization found in this session.
                    </p>
                )}
                {organizationId && organizationQuery.isLoading && (
                    <p className="mt-4 text-sm text-gray-500">Loading organization details…</p>
                )}
                {organizationId && organizationQuery.isError && (
                    <p className="mt-4 text-sm text-red-600">
                        Could not load organization details right now.
                    </p>
                )}
                {organizationId && organizationQuery.data && (
                    <div className="mt-5 grid md:grid-cols-2 gap-4">
                        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                                Organization Name
                            </p>
                            <p className="mt-1 text-sm text-gray-900 font-semibold">
                                {organizationQuery.data.organization_name}
                            </p>
                        </div>
                        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                                Industry
                            </p>
                            <p className="mt-1 text-sm text-gray-900 font-semibold">
                                {organizationQuery.data.industry}
                            </p>
                        </div>
                        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                                Team Size
                            </p>
                            <p className="mt-1 text-sm text-gray-900 font-semibold inline-flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-500" />
                                {organizationQuery.data.organization_size}
                            </p>
                        </div>
                        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                                Organization Status
                            </p>
                            <p className="mt-1 text-sm text-gray-900 font-semibold">
                                {organizationQuery.data.status}
                            </p>
                        </div>
                        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 md:col-span-2">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                                Website
                            </p>
                            <p className="mt-1 text-sm text-gray-900 font-semibold inline-flex items-center gap-2">
                                <Globe className="w-4 h-4 text-gray-500" />
                                {organizationQuery.data.website_url}
                            </p>
                        </div>
                        {organizationQuery.data.creator && (
                            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 md:col-span-2">
                                <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                                    Organization Creator
                                </p>
                                <p className="mt-1 text-sm text-gray-900 font-semibold">
                                    {organizationQuery.data.creator.first_name}{" "}
                                    {organizationQuery.data.creator.last_name}
                                </p>
                                <p className="mt-1 text-xs text-gray-600 inline-flex items-center gap-1">
                                    <Mail className="w-3.5 h-3.5" />
                                    {organizationQuery.data.creator.email}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    Account Actions
                </h2>
                <div className="mt-4 flex flex-wrap gap-3">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        <User2 className="w-4 h-4" />
                        Edit Profile (coming soon)
                    </button>
                    <button
                        type="button"
                        onClick={() => void signOut({ redirectTo: "/recruiter/login" })}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
                {!user && (
                    <p className="mt-3 text-sm text-gray-500">
                        We could not load your profile details yet. Refresh the page to retry.
                    </p>
                )}
            </div>
        </div>
    );
}
