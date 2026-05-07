"use client";

import {
    ArrowLeft,
    Bell,
    Briefcase,
    Calendar,
    Clock,
    GraduationCap,
    Linkedin,
    MapPin,
    Shield,
    User,
    UserX,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTheme } from "@/lib/hooks/use-theme";
import { AdminShell } from "../../_components/admin-shell";
import { useUpdateUserStatus } from "../hooks/use-update-user-status";
import { useUserDetail } from "../hooks/use-user-detail";

export default function UserDetailPage() {
    const params = useParams();
    const userId = params.userId as string;
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const { data: user, isLoading, error } = useUserDetail(userId);
    const updateStatusMutation = useUpdateUserStatus(userId);

    const handleStatusChange = async (isActive: boolean) => {
        try {
            await updateStatusMutation.mutateAsync({ is_active: isActive });
        } catch (error) {
            console.error("Failed to update user status:", error);
        }
    };

    if (isLoading) {
        return (
            <AdminShell>
                <div className="flex items-center justify-center h-64">
                    <div
                        className={`animate-spin rounded-full h-8 w-8 border-b-2 border-awtar-blue`}
                    />
                </div>
            </AdminShell>
        );
    }

    if (error || !user) {
        return (
            <AdminShell>
                <div className={`text-center py-12 text-awtar-blue`}>
                    <p>Failed to load user details</p>
                    <Link
                        href="/users"
                        className={`mt-4 inline-flex items-center gap-2 transition-colors text-awtar-blue hover:text-awtar-blue-light`}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Users
                    </Link>
                </div>
            </AdminShell>
        );
    }

    return (
        <AdminShell>
            <div>
                <div className="max-w-6xl mx-auto p-6">
                    {/* Back Button */}
                    <div className="mb-8">
                        <Link
                            href="/users"
                            className={`inline-flex items-center gap-3 transition-all duration-200 group ${
                                isDark
                                    ? "text-awtar-slate hover:text-white"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            <div
                                className={`p-2 rounded-full transition-colors ${
                                    isDark
                                        ? "bg-white/5 group-hover:bg-white/10"
                                        : "bg-gray-200 group-hover:bg-gray-300"
                                }`}
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </div>
                            <span
                                className={`text-lg font-medium ${isDark ? "text-awtar-white" : "text-gray-900"}`}
                            >
                                Back to User
                            </span>
                        </Link>
                    </div>

                    {/* User Header Card */}
                    <div
                        className={`backdrop-blur-sm border rounded-2xl p-8 mb-8 shadow-2xl transition-colors ${
                            isDark ? "bg-slate-900 border-white/10" : "bg-white border-gray-200"
                        }`}
                    >
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            {/* Avatar */}
                            <div className="shrink-0">
                                <div
                                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg bg-linear-to-br from-awtar-blue to-awtar-blue-light`}
                                >
                                    <User className="h-10 w-10 text-white" />
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="flex-1">
                                <h1
                                    className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                                >
                                    {user.first_name} {user.last_name}
                                </h1>
                                <p
                                    className={`text-lg mb-4 ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                >
                                    {user.email}
                                </p>

                                {/* Status Badges */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <span
                                        className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                                            user.role === "admin"
                                                ? isDark
                                                    ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                                                    : "bg-purple-100 text-purple-700 border-purple-300"
                                                : user.role === "hr"
                                                  ? isDark
                                                      ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                                      : "bg-blue-100 text-blue-700 border-blue-300"
                                                  : isDark
                                                    ? "bg-green-500/20 text-green-300 border-green-500/30"
                                                    : "bg-green-100 text-green-700 border-green-300"
                                        }`}
                                    >
                                        <Shield className="h-4 w-4 inline mr-2" />
                                        {user.role.toUpperCase()}
                                    </span>
                                    <span
                                        className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                                            user.is_active
                                                ? isDark
                                                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                                    : "bg-emerald-100 text-emerald-700 border-emerald-300"
                                                : isDark
                                                  ? "bg-red-500/20 text-red-300 border-red-500/30"
                                                  : "bg-red-100 text-red-700 border-red-300"
                                        }`}
                                    >
                                        {user.is_active ? "✓ ACTIVE" : "✗ SUSPENDED"}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                {user.is_active ? (
                                    <button
                                        type="button"
                                        onClick={() => handleStatusChange(false)}
                                        disabled={updateStatusMutation.isPending}
                                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                                            isDark
                                                ? "bg-awtar-blue hover:bg-awtar-blue-light text-white"
                                                : "bg-awtar-blue hover:bg-awtar-blue text-white"
                                        }`}
                                    >
                                        <UserX className="h-5 w-5" />
                                        Suspend User
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleStatusChange(true)}
                                        disabled={updateStatusMutation.isPending}
                                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                                            isDark
                                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                                : "bg-emerald-500 hover:bg-emerald-600 text-white"
                                        }`}
                                    >
                                        <Shield className="h-5 w-5" />
                                        Activate User
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Basic Information Card */}
                        <div
                            className={`backdrop-blur-sm border rounded-2xl p-6 shadow-xl transition-colors ${
                                isDark ? "bg-slate-900 border-white/10" : "bg-white border-gray-200"
                            }`}
                        >
                            <div
                                className={`flex items-center gap-3 mb-6 ${isDark ? "text-blue-400" : "text-blue-600"}`}
                            >
                                <div
                                    className={`p-2 rounded-lg ${isDark ? "bg-blue-500/20" : "bg-blue-100"}`}
                                >
                                    <User className="h-5 w-5" />
                                </div>
                                <h2
                                    className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                                >
                                    Basic Information
                                </h2>
                            </div>
                            <dl className="space-y-4">
                                <div
                                    className={`flex justify-between items-center py-3 border-b transition-colors ${
                                        isDark ? "border-white/5" : "border-gray-200"
                                    }`}
                                >
                                    <dt
                                        className={`text-sm font-medium ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                    >
                                        Email
                                    </dt>
                                    <dd className={isDark ? "text-white" : "text-gray-900"}>
                                        {user.email}
                                    </dd>
                                </div>
                                <div
                                    className={`flex justify-between items-center py-3 border-b transition-colors ${
                                        isDark ? "border-white/5" : "border-gray-200"
                                    }`}
                                >
                                    <dt
                                        className={`text-sm font-medium ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                    >
                                        Full Name
                                    </dt>
                                    <dd
                                        className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                                    >
                                        {user.first_name} {user.last_name}
                                    </dd>
                                </div>
                                <div
                                    className={`flex justify-between items-center py-3 border-b transition-colors ${
                                        isDark ? "border-white/5" : "border-gray-200"
                                    }`}
                                >
                                    <dt
                                        className={`text-sm font-medium ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                    >
                                        Role
                                    </dt>
                                    <dd
                                        className={`capitalize ${isDark ? "text-white" : "text-gray-900"}`}
                                    >
                                        {user.role}
                                    </dd>
                                </div>
                                <div
                                    className={`flex justify-between items-center py-3 border-b transition-colors ${
                                        isDark ? "border-white/5" : "border-gray-200"
                                    }`}
                                >
                                    <dt
                                        className={`text-sm font-medium ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                    >
                                        Status
                                    </dt>
                                    <dd className={isDark ? "text-white" : "text-gray-900"}>
                                        {user.is_active ? "Active" : "Suspended"}
                                    </dd>
                                </div>
                                <div
                                    className={`flex justify-between items-center py-3 border-b transition-colors ${
                                        isDark ? "border-white/5" : "border-gray-200"
                                    }`}
                                >
                                    <dt
                                        className={`text-sm font-medium ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                    >
                                        Last Login
                                    </dt>
                                    <dd
                                        className={`text-sm ${isDark ? "text-white" : "text-gray-900"}`}
                                    >
                                        {user.last_logged_in_at
                                            ? new Date(user.last_logged_in_at).toLocaleString()
                                            : "Never"}
                                    </dd>
                                </div>
                                {user.deleted_at && (
                                    <div
                                        className={`flex justify-between items-center py-3 border-t transition-colors ${
                                            isDark ? "border-white/5" : "border-gray-200"
                                        }`}
                                    >
                                        <dt
                                            className={`text-sm font-medium ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                        >
                                            Deleted At
                                        </dt>
                                        <dd
                                            className={`text-sm ${isDark ? "text-white" : "text-gray-900"}`}
                                        >
                                            {new Date(user.deleted_at).toLocaleString()}
                                        </dd>
                                    </div>
                                )}
                                {user.deleted_by && (
                                    <div
                                        className={`flex justify-between items-center py-3 transition-colors`}
                                    >
                                        <dt
                                            className={`text-sm font-medium ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                        >
                                            Deleted By
                                        </dt>
                                        <dd className={isDark ? "text-white" : "text-gray-900"}>
                                            {user.deleted_by}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        {user.candidate_profile && (
                            <div
                                className={`backdrop-blur-sm border rounded-2xl p-6 shadow-xl transition-colors ${
                                    isDark
                                        ? "bg-slate-900 border-white/10"
                                        : "bg-white border-gray-200"
                                }`}
                            >
                                <div
                                    className={`flex items-center gap-3 mb-6 ${isDark ? "text-green-400" : "text-green-600"}`}
                                >
                                    <div
                                        className={`p-2 rounded-lg ${isDark ? "bg-green-500/20" : "bg-green-100"}`}
                                    >
                                        <Briefcase className="h-5 w-5" />
                                    </div>
                                    <h2
                                        className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                                    >
                                        Candidate Profile
                                    </h2>
                                </div>
                                <dl className="space-y-4">
                                    <div
                                        className={`flex justify-between items-center py-3 border-b transition-colors ${
                                            isDark ? "border-white/5" : "border-gray-200"
                                        }`}
                                    >
                                        <dt
                                            className={`text-sm font-medium flex items-center gap-2 ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                        >
                                            <Briefcase className="h-4 w-4" />
                                            Current Job Title
                                        </dt>
                                        <dd
                                            className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                                        >
                                            {user.candidate_profile.current_job_title ||
                                                "Not specified"}
                                        </dd>
                                    </div>
                                    <div
                                        className={`flex justify-between items-center py-3 border-b transition-colors ${
                                            isDark ? "border-white/5" : "border-gray-200"
                                        }`}
                                    >
                                        <dt
                                            className={`text-sm font-medium flex items-center gap-2 ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                        >
                                            <Clock className="h-4 w-4" />
                                            Years of Experience
                                        </dt>
                                        <dd className={isDark ? "text-white" : "text-gray-900"}>
                                            {user.candidate_profile?.years_of_experience ??
                                                "Not specified"}
                                        </dd>
                                    </div>
                                    <div
                                        className={`flex justify-between items-start py-3 border-b transition-colors ${
                                            isDark ? "border-white/5" : "border-gray-200"
                                        }`}
                                    >
                                        <dt
                                            className={`text-sm font-medium ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                        >
                                            Primary Skills
                                        </dt>
                                        <dd
                                            className={`text-right ${isDark ? "text-white" : "text-gray-900"}`}
                                        >
                                            {user.candidate_profile?.primary_skills?.join(", ") ||
                                                "Not specified"}
                                        </dd>
                                    </div>
                                    <div
                                        className={`flex justify-between items-center py-3 border-b transition-colors ${
                                            isDark ? "border-white/5" : "border-gray-200"
                                        }`}
                                    >
                                        <dt
                                            className={`text-sm font-medium flex items-center gap-2 ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                        >
                                            <GraduationCap className="h-4 w-4" />
                                            Education Level
                                        </dt>
                                        <dd
                                            className={`capitalize ${isDark ? "text-white" : "text-gray-900"}`}
                                        >
                                            {user.candidate_profile?.education_level?.replace(
                                                "_",
                                                " ",
                                            ) || "Not specified"}
                                        </dd>
                                    </div>
                                    <div
                                        className={`flex justify-between items-center py-3 border-b transition-colors ${
                                            isDark ? "border-white/5" : "border-gray-200"
                                        }`}
                                    >
                                        <dt
                                            className={`text-sm font-medium ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                        >
                                            Preferred Job Types
                                        </dt>
                                        <dd className={isDark ? "text-white" : "text-gray-900"}>
                                            {user.candidate_profile?.preferred_job_types?.join(
                                                ", ",
                                            ) || "Not specified"}
                                        </dd>
                                    </div>
                                    <div
                                        className={`flex justify-between items-center py-3 border-b transition-colors ${
                                            isDark ? "border-white/5" : "border-gray-200"
                                        }`}
                                    >
                                        <dt
                                            className={`text-sm font-medium ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                        >
                                            Salary Range
                                        </dt>
                                        <dd
                                            className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                                        >
                                            $
                                            {user.candidate_profile?.desired_annual_salary_min?.toLocaleString()}{" "}
                                            - $
                                            {user.candidate_profile?.desired_annual_salary_max?.toLocaleString()}
                                        </dd>
                                    </div>
                                    <div className={isDark ? "" : ""}>
                                        <dt
                                            className={`text-sm ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                        >
                                            Industry Interest
                                        </dt>
                                        <dd className={isDark ? "text-white" : "text-gray-900"}>
                                            {user.candidate_profile?.industry_interest ||
                                                "Not specified"}
                                        </dd>
                                    </div>
                                    <div
                                        className={`flex justify-between items-center py-3 border-b transition-colors ${
                                            isDark ? "border-white/5" : "border-gray-200"
                                        }`}
                                    >
                                        <dt
                                            className={`text-sm font-medium flex items-center gap-2 ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                        >
                                            <MapPin className="h-4 w-4" />
                                            Location
                                        </dt>
                                        <dd className={isDark ? "text-white" : "text-gray-900"}>
                                            {user.candidate_profile?.location || "Not specified"}
                                        </dd>
                                    </div>
                                    <div
                                        className={`flex justify-between items-center py-3 border-b transition-colors ${
                                            isDark ? "border-white/5" : "border-gray-200"
                                        }`}
                                    >
                                        <dt
                                            className={`text-sm font-medium flex items-center gap-2 ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                        >
                                            <Linkedin className="h-4 w-4" />
                                            LinkedIn
                                        </dt>
                                        <dd>
                                            {user.candidate_profile?.linkedin_url ? (
                                                <a
                                                    href={user.candidate_profile.linkedin_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={
                                                        isDark
                                                            ? "text-blue-400 hover:text-blue-300 underline"
                                                            : "text-blue-600 hover:text-blue-700 underline"
                                                    }
                                                >
                                                    View Profile
                                                </a>
                                            ) : (
                                                <span
                                                    className={
                                                        isDark ? "text-white" : "text-gray-900"
                                                    }
                                                >
                                                    Not provided
                                                </span>
                                            )}
                                        </dd>
                                    </div>
                                    <div
                                        className={`flex justify-between items-start py-3 border-b transition-colors ${
                                            isDark ? "border-white/5" : "border-gray-200"
                                        }`}
                                    >
                                        <dt
                                            className={`text-sm font-medium ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                        >
                                            Professional Summary
                                        </dt>
                                        <dd
                                            className={`text-sm max-w-xs text-right ${isDark ? "text-white" : "text-gray-900"}`}
                                        >
                                            {user.candidate_profile?.professional_summary ||
                                                "Not provided"}
                                        </dd>
                                    </div>
                                    <div className={isDark ? "" : ""}>
                                        <dt
                                            className={`text-sm font-medium flex items-center gap-2 ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                        >
                                            <Bell className="h-4 w-4" />
                                            Smart Match Notifications
                                        </dt>
                                        <dd className={isDark ? "text-white" : "text-gray-900"}>
                                            {user.candidate_profile?.match_smart_notification
                                                ? "Enabled"
                                                : "Disabled"}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        )}

                        {user.organization && (
                            <div
                                className={`backdrop-blur-sm border rounded-2xl p-6 shadow-xl transition-colors ${
                                    isDark
                                        ? "bg-slate-900 border-white/10"
                                        : "bg-white border-gray-200"
                                }`}
                            >
                                <div
                                    className={`flex items-center gap-3 mb-6 ${isDark ? "text-purple-400" : "text-purple-600"}`}
                                >
                                    <div
                                        className={`p-2 rounded-lg ${isDark ? "bg-purple-500/20" : "bg-purple-100"}`}
                                    >
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <h2
                                        className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                                    >
                                        Organization
                                    </h2>
                                </div>
                                <dl className="space-y-4">
                                    <div
                                        className={`flex justify-between items-center py-3 border-b transition-colors ${
                                            isDark ? "border-white/5" : "border-gray-200"
                                        }`}
                                    >
                                        <dt
                                            className={`text-sm font-medium ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                        >
                                            Organization Name
                                        </dt>
                                        <dd
                                            className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                                        >
                                            {user.organization.organization_name}
                                        </dd>
                                    </div>
                                    <div
                                        className={`flex justify-between items-center py-3 border-b transition-colors ${
                                            isDark ? "border-white/5" : "border-gray-200"
                                        }`}
                                    >
                                        <dt
                                            className={`text-sm font-medium ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                        >
                                            Industry
                                        </dt>
                                        <dd className={isDark ? "text-white" : "text-gray-900"}>
                                            {user.organization.industry}
                                        </dd>
                                    </div>
                                    <div
                                        className={`flex justify-between items-center py-3 transition-colors`}
                                    >
                                        <dt
                                            className={`text-sm font-medium ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                        >
                                            Status
                                        </dt>
                                        <dd
                                            className={`capitalize ${isDark ? "text-white" : "text-gray-900"}`}
                                        >
                                            {user.organization.status}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        )}
                    </div>

                    {/* Timestamps */}
                    <div
                        className={`mt-8 backdrop-blur-sm border rounded-2xl p-6 shadow-xl transition-colors ${
                            isDark ? "bg-slate-900 border-white/10" : "bg-white border-gray-200"
                        }`}
                    >
                        <div
                            className={`flex items-center gap-3 mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                        >
                            <div
                                className={`p-2 rounded-lg ${isDark ? "bg-gray-500/20" : "bg-gray-200"}`}
                            >
                                <Calendar className="h-5 w-5" />
                            </div>
                            <h2
                                className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                            >
                                Account Timeline
                            </h2>
                        </div>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div
                                className={`rounded-lg p-4 ${isDark ? "bg-slate-800" : "bg-gray-50"}`}
                            >
                                <dt
                                    className={`text-sm font-medium mb-2 ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                >
                                    Created At
                                </dt>
                                <dd
                                    className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                                >
                                    {new Date(user.created_at).toLocaleString()}
                                </dd>
                            </div>
                            <div
                                className={`rounded-lg p-4 ${isDark ? "bg-slate-800" : "bg-gray-50"}`}
                            >
                                <dt
                                    className={`text-sm font-medium mb-2 ${isDark ? "text-awtar-slate" : "text-gray-600"}`}
                                >
                                    Last Updated
                                </dt>
                                <dd
                                    className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                                >
                                    {new Date(user.updated_at).toLocaleString()}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
