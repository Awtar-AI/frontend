"use client";

import {
    Briefcase,
    Calendar,
    ChevronDown,
    Clock,
    FileText,
    Info,
    MessageSquare,
    MoreHorizontal,
    Plus,
    Sparkles,
    UserPlus,
} from "lucide-react";
import Link from "next/link";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

// Data for LineChart
const TREND_DATA = [
    { name: "JAN", applications: 400 },
    { name: "FEB", applications: 700 },
    { name: "MAR", applications: 600 },
    { name: "APR", applications: 900 },
    { name: "MAY", applications: 800 },
    { name: "JUN", applications: 1200 },
];

// Data for BarChart (Quality Distribution)
const QUALITY_DATA = [
    { range: "80%+", count: 45 },
    { range: "70-80%", count: 32 },
    { range: "60-70%", count: 18 },
    { range: "<60%", count: 5 },
];

// Active Jobs Table Mock Data
const ACTIVE_JOBS = [
    {
        title: "Senior Software Engineer",
        details: "Remote • Full-time",
        department: "Engineering",
        applicants: 42,
        matchScore: 98,
        matchColor: "text-green-600",
        matchBg: "bg-green-50",
        status: "ACTIVE",
    },
    {
        title: "Product Designer (L4)",
        details: "SF / NYC • Hybrid",
        department: "Design",
        applicants: 18,
        matchScore: 89,
        matchColor: "text-orange-600",
        matchBg: "bg-orange-50",
        status: "ACTIVE",
    },
    {
        title: "Marketing Director",
        details: "London • Contract",
        department: "Growth",
        applicants: 5,
        matchText: "Analyzing...",
        matchColor: "text-gray-500",
        matchBg: "bg-gray-100",
        status: "DRAFT",
    },
];

export default function RecruiterDashboard() {
    return (
        <div className="w-full space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1">
                        Recruiter Dashboard
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">
                        Welcome back, Alex. Here&apos;s what&apos;s happening with your hiring
                        pipeline.
                    </p>
                </div>
                <Link
                    href="/recruiter/post-job"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" strokeWidth={3} /> Post New Job
                </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1 */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-[120px]">
                    <div className="flex justify-between items-start">
                        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                            TOTAL ACTIVE JOBS
                        </h3>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Briefcase className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-end gap-3">
                        <span className="text-4xl font-black text-gray-900 tracking-tighter">
                            12
                        </span>
                        <span className="text-xs font-bold text-green-600 mb-1.5">
                            +2 vs last month
                        </span>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-[120px]">
                    <div className="flex justify-between items-start">
                        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                            TOTAL APPLICATIONS
                        </h3>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <FileText className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-end gap-3">
                        <span className="text-4xl font-black text-gray-900 tracking-tighter">
                            1,248
                        </span>
                        <span className="text-xs font-bold text-green-600 mb-1.5">
                            ↑ 15% increase
                        </span>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-[120px]">
                    <div className="flex justify-between items-start">
                        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                            INTERVIEWS SCHEDULED
                        </h3>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Calendar className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-end gap-3">
                        <span className="text-4xl font-black text-gray-900 tracking-tighter">
                            24
                        </span>
                        <span className="text-xs font-medium text-gray-500 mb-1.5 leading-tight max-w-[80px]">
                            scheduled this week
                        </span>
                    </div>
                </div>

                {/* Card 4 */}
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
                            18
                        </span>
                        <span className="text-sm font-bold text-gray-900 mb-1.5">days</span>
                        <span className="text-xs font-bold text-green-600 mb-1.5 ml-2 leading-tight max-w-[80px]">
                            ↓ 2 days improvement
                        </span>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Trends Chart */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative col-span-1 min-h-[300px]">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-base font-bold text-gray-900">
                                Application Trends
                            </h3>
                            <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                                MONTHLY GROWTH OVERVIEW
                            </p>
                        </div>
                        <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                            Last 6 Months <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div className="w-full h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={TREND_DATA}>
                                <defs>
                                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 700 }}
                                    dy={10}
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
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{
                                        r: 6,
                                        fill: "#3b82f6",
                                        stroke: "#fff",
                                        strokeWidth: 2,
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quality Chart */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative col-span-1 min-h-[300px]">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-base font-bold text-gray-900">
                                Candidate Quality Distribution
                            </h3>
                            <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                                MATCH % VS TRUST SCORE
                            </p>
                        </div>
                        <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                    </div>
                    <div className="w-full h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={QUALITY_DATA} barSize={40}>
                                <XAxis
                                    dataKey="range"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#6b7280", fontSize: 11, fontWeight: 600 }}
                                    dy={10}
                                />
                                <Tooltip
                                    cursor={{ fill: "#f3f4f6" }}
                                    contentStyle={{
                                        borderRadius: "8px",
                                        border: "none",
                                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                    }}
                                />
                                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Active Job Postings Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm lg:col-span-2 overflow-hidden flex flex-col">
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
                                        AI TOP MATCH
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                        STATUS
                                    </th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {ACTIVE_JOBS.map((job, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/recruiter/job-listings/1/applicants`}
                                                className="font-bold text-gray-900 text-sm hover:text-blue-600 transition-colors"
                                            >
                                                {job.title}
                                            </Link>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {job.details}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-md">
                                                {job.department}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-bold text-gray-900">
                                                {job.applicants}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${job.matchBg} ${job.matchColor}`}
                                            >
                                                <div
                                                    className={`w-1.5 h-1.5 rounded-full bg-current`}
                                                />
                                                {job.matchScore
                                                    ? `${job.matchScore}% Match`
                                                    : job.matchText}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`text-[10px] font-bold tracking-widest uppercase ${
                                                    job.status === "ACTIVE"
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
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm lg:col-span-1 p-6 flex flex-col h-full">
                    <h3 className="text-base font-bold text-gray-900 mb-6">Recent Activity</h3>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                        {/* Item 1 */}
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <UserPlus className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 leading-snug">
                                    Marcus Thorne applied for Senior Architect
                                </p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    2 MINUTES AGO
                                </p>
                            </div>
                        </div>
                        {/* Item 2 */}
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800 leading-snug">
                                    AI analysis complete for Elena Rodriguez
                                </p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    1 HOUR AGO
                                </p>
                            </div>
                        </div>
                        {/* Item 3 */}
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800 leading-snug">
                                    New interview scheduled with David Chen
                                </p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    3 HOURS AGO
                                </p>
                            </div>
                        </div>
                        {/* Item 4 */}
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800 leading-snug">
                                    Sarah Jenkins reviewed Lead Designer candidates
                                </p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    5 HOURS AGO
                                </p>
                            </div>
                        </div>
                    </div>

                    <button className="w-full mt-6 py-3 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-50 transition-colors">
                        LOAD MORE ACTIVITY
                    </button>
                </div>
            </div>
        </div>
    );
}
