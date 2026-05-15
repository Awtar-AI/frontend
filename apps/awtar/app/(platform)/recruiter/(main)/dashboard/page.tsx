"use client";

import { useQueries } from "@tanstack/react-query";
import {
    Activity,
    Briefcase,
    Calendar,
    ChevronDown,
    Clock,
    FileText,
    Loader2,
    MoreHorizontal,
    Plus,
    Sparkles,
    TrendingDown,
    TrendingUp,
    UserPlus,
    Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { applicantDisplayName } from "@/applicant/user-me/schemas/user-me.schema";
import { useAuthOrganizationId, useAuthUser } from "@/lib/hooks/use-auth";
import { recruiterApplicationsApi } from "../job-listings/api/recruiter-applications.api";
import { useRecruiterJobs } from "../post-job/hooks/use-recruiter-jobs";
import { getJobExperienceLevel } from "../post-job/schemas/post-job.schema";
import { useOrganizationEmployees } from "../team/hooks/use-organization-employees";
import { RecruiterPageBanner } from "../_components/RecruiterPageBanner";
import type { OrgTrendPeriod } from "./api/recruiter-dashboard.api";
import { useRecruiterOrgStats } from "./hooks/use-recruiter-org-stats";
import { useRecruiterOrgTrend } from "./hooks/use-recruiter-org-trend";

// Data for BarChart (Quality Distribution)
// Quality chart uses live data when the quality-distribution API ships.
// Until then, show an informative placeholder.

const PERIOD_OPTIONS: { value: OrgTrendPeriod; label: string }[] = [
    { value: "7d", label: "Last 7 days" },
    { value: "1m", label: "Last month" },
    { value: "3m", label: "Last 3 months" },
    { value: "6m", label: "Last 6 months" },
    { value: "1y", label: "Last year" },
];

function formatJobMeta(job: {
    is_remote?: boolean;
    location?: string | null;
    employment_type?: string;
    deadline?: string;
}): string {
    const location = job.is_remote ? "Remote" : (job.location?.trim() ?? "Location TBD");
    const type = (job.employment_type ?? "N/A").replace(/_/g, " ");
    return `${location} • ${type}`;
}

function DiffBadge({ diff, label }: { diff: number; label: string }) {
    if (diff === 0) {
        return <span className="text-[10px] font-bold text-gray-400">No change</span>;
    }
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

function greetingByTime(firstName: string): string {
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${firstName}.`;
    if (hour < 18) return `Good afternoon, ${firstName}.`;
    return `Good evening, ${firstName}.`;
}

export default function RecruiterDashboard() {
    const user = useAuthUser();
    const organizationId = useAuthOrganizationId();
    const displayName = user ? applicantDisplayName(user) : "Recruiter";
    const firstName = displayName.split(" ").filter(Boolean)[0] ?? "Recruiter";
    const [period, setPeriod] = useState<OrgTrendPeriod>("6m");

    const statsQuery = useRecruiterOrgStats();
    const trendQuery = useRecruiterOrgTrend(period);
    const jobsQuery = useRecruiterJobs();
    const employeesQuery = useOrganizationEmployees(organizationId);

    const topJobs = useMemo(
        () =>
            [...(jobsQuery.data ?? [])]
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 6),
        [jobsQuery.data],
    );

    const applicantCountsQueries = useQueries({
        queries: topJobs.map((job) => ({
            queryKey: ["recruiter", "dashboard", "job-app-count", job.id] as const,
            queryFn: () => recruiterApplicationsApi.getCount(job.id),
            staleTime: 30_000,
        })),
    });

    const applicantCountByJobId = useMemo(() => {
        const map: Record<string, number> = {};
        for (const [index, query] of applicantCountsQueries.entries()) {
            const job = topJobs[index];
            if (!job) continue;
            map[job.id] = query.data ?? 0;
        }
        return map;
    }, [applicantCountsQueries, topJobs]);

    const trendChartData = trendQuery.data?.data ?? [];
    const hrMembersCount = employeesQuery.data?.length ?? 0;
    const kpiCards = [
        {
            label: "TOTAL ACTIVE JOBS",
            value: statsQuery.data?.total_active_jobs ?? 0,
            delta: statsQuery.data?.active_jobs_diff ?? 0,
            icon: Briefcase,
            changeLabel: "active job",
        },
        {
            label: "TOTAL APPLICATIONS",
            value: statsQuery.data?.total_applications ?? 0,
            delta: statsQuery.data?.apps_diff ?? 0,
            icon: FileText,
            changeLabel: "application",
        },
        {
            label: "APPLICATIONS THIS MONTH",
            value: statsQuery.data?.apps_this_month ?? 0,
            delta: statsQuery.data?.apps_diff ?? 0,
            icon: Calendar,
            changeLabel: "application this month",
        },
        {
            label: "ACTIVE HR MEMBERS",
            value: hrMembersCount,
            delta: hrMembersCount > 0 ? 1 : 0,
            icon: Users,
            changeLabel: "team member",
        },
    ];

    return (
        <div className="w-full space-y-6 pb-12">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 text-white shadow-lg">
                <div className="absolute right-0 top-0 -mr-8 -mt-8 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
                <div className="absolute left-1/2 bottom-0 -mb-12 w-64 h-32 bg-white/5 rounded-full blur-3xl" />
                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight mb-1">
                            Welcome back, {firstName} 👋
                        </h1>
                        <p className="text-sm text-blue-100 font-medium">
                            Here&apos;s what&apos;s happening with your hiring funnel today.
                        </p>
                    </div>
                    <Link
                        href="/recruiter/post-job"
                        className="flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" strokeWidth={3} /> Post New Job
                    </Link>
                </div>
            </div>

            <RecruiterPageBanner
                title={`Welcome back, ${firstName}`}
                description={`${greetingByTime(firstName)} Here is what is happening with your hiring funnel today.`}
                metricLabel="Active roles"
                metricValue={`${statsQuery.data?.total_active_jobs ?? 0}`}
                Icon={Briefcase}
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.label}
                            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[140px]"
                        >
                            <div className="flex justify-between items-start">
                                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                    {card.label}
                                </h3>
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Icon className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="flex items-end justify-between gap-3">
                                <div className="flex flex-col">
                                    <span className="text-4xl font-black text-gray-900 tracking-tighter">
                                        {card.value}
                                    </span>
                                    {statsQuery.isLoading || employeesQuery.isLoading ? (
                                        <span className="text-[10px] font-bold text-gray-400">
                                            Loading...
                                        </span>
                                    ) : (
                                        <DiffBadge diff={card.delta} label={card.changeLabel} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
            <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-gray-900 tracking-tighter">
                    {statsQuery.data?.total_interviews_scheduled ?? 0}
                </span>
                <span className="text-xs font-medium text-gray-500 mb-1.5 leading-tight max-w-[80px]">
                    scheduled this week
                </span>
            </div>
        </div>

                {/* Card 4 */ }
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-[120px]">
        <div className="flex justify-between items-start">
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                AVG. TIME TO HIRE
            </h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Clock className="w-4 h-4" />
            </div>
        </div>
        <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-gray-900 tracking-tighter">
                {statsQuery.data?.avg_time_to_hire_days ?? "—"}
            </span>
            <span className="text-sm font-bold text-gray-900 mb-1.5">days</span>
            <span className="text-xs font-medium text-gray-500 mb-1.5 ml-2 leading-tight max-w-[80px]">
                average
            </span>
        </div>
    </div>
            </div >

        {/* Charts Row */ }
        < div className = "grid grid-cols-1 lg:grid-cols-2 gap-4" >
            {/* Trends Chart */ }
            < div className = "bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative col-span-1 min-h-[300px]" >
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-base font-bold text-gray-900">
                                Application Trends
                            </h3>
                            <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                                MONTHLY GROWTH OVERVIEW
                            </p>
                        </div>
                        <label className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                            <select
                                value={period}
                                onChange={(e) => setPeriod(e.target.value as OrgTrendPeriod)}
                                className="bg-transparent outline-none"
                                aria-label="Select trend period"
                            >
                                {PERIOD_OPTIONS.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="w-3.5 h-3.5" />
                        </label>
                    </div>
                    <div className="w-full h-48">
                        {trendQuery.isLoading ? (
                            <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading trend...
                            </div>
                        ) : trendQuery.isError ? (
                            <div className="h-full w-full flex items-center justify-center text-red-500 text-sm">
                                Could not load trend data.
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                    <XAxis
                                        dataKey="label"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 700 }}
                                        dy={8}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#9ca3af", fontSize: 10 }}
                                        width={28}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: "8px",
                                            border: "none",
                                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="applications"
                                        name="Applications"
                                        stroke="#2563eb"
                                        strokeWidth={2.5}
                                        dot={false}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="active_jobs"
                                        name="Active jobs"
                                        stroke="#22c55e"
                                        strokeWidth={2.5}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div >

        {/* AI Insights Summary */ }
        < div className = "bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative col-span-1 min-h-[300px]" >
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-base font-bold text-gray-900">
                                AI Scoring Overview
                            </h3>
                            <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                                POWERED BY AWTAR AI
                            </p>
                        </div>
                        <Sparkles className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex flex-col items-center justify-center h-48 text-center">
                        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                            <Sparkles className="w-7 h-7 text-blue-500" />
                        </div>
                        <p className="text-sm font-bold text-gray-700 mb-1">AI-Powered Insights</p>
                        <p className="text-xs text-gray-400 max-w-[220px]">
                            Candidate quality distribution and scoring insights will appear here as applications are processed.
                        </p>
                    </div>
                </div >
            </div >

        {/* Bottom Row */ }
        < div className = "grid grid-cols-1 lg:grid-cols-3 gap-4" >
            {/* Active Job Postings Table */ }
            < div className = "bg-white rounded-xl border border-gray-100 shadow-sm lg:col-span-2 overflow-hidden flex flex-col" >
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-base font-bold text-gray-900">Active Job Postings</h3>
                        <Link
                            href="/recruiter/job-listings"
                            className="text-sm font-bold text-blue-600 hover:text-blue-700"
                        >
                            View All Jobs
                        </Link>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left">
                            <thead className="bg-[#fbfcff]">
                                <tr>
                                    <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                        JOB TITLE
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                        DEPARTMENT
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">
                                        APPLICANTS
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">
                                        EXPERIENCE
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                        STATUS
                                    </th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {topJobs.map((job, idx) => (
                                    <tr
                                        key={job.id}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/recruiter/job-listings/${job.id}`}
                                                className="font-bold text-gray-900 text-sm hover:text-blue-600 transition-colors"
                                            >
                                                {job.title}
                                            </Link>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {formatJobMeta(job)}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-md">
                                                {job.is_remote ? "Remote" : "On-site / Hybrid"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-bold text-gray-900">
                                                {applicantCountsQueries[idx]?.isLoading
                                                    ? "..."
                                                    : (applicantCountByJobId[job.id] ?? 0)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                                                <Activity className="h-3 w-3" />
                                                {getJobExperienceLevel(job) || "N/A"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`text-[10px] font-bold tracking-widest uppercase ${
                                                    job.status === "active"
                                                        ? "text-green-600"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                title="button"
                                                type="button"
                                                className="text-gray-400 hover:text-gray-600 p-1"
                                            >
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {!jobsQuery.isLoading && topJobs.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-8 text-center text-sm text-gray-500"
                                        >
                                            No jobs yet. Post your first role to start tracking
                                            pipeline metrics.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div >

        {/* Recent Activity */ }
        < div className = "bg-white rounded-xl border border-gray-100 shadow-sm lg:col-span-1 p-6 flex flex-col h-full" >
                    <h3 className="text-base font-bold text-gray-900 mb-6">Recent Activity</h3>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <UserPlus className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 leading-snug">
                                    New applications will appear here as candidates apply to your job postings.
                                </p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    AWAITING ACTIVITY
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800 leading-snug">
                                    AI scoring results and shortlist recommendations will be logged here.
                                </p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    AWAITING DATA
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800 leading-snug">
                                    Status changes and interview updates will be tracked here.
                                </p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    AWAITING DATA
                                </p>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </div >
    );
}
