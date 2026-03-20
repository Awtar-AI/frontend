"use client";

import {
    ArrowLeft,
    Bookmark,
    Briefcase,
    Building2,
    Calendar,
    CheckCircle2,
    ChevronRight,
    Clock,
    DollarSign,
    ExternalLink,
    MapPin,
    Share2,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { mockJobs } from "../../../lib/mockData";
import type { JobPost } from "../../../types";

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const job = mockJobs.find((j: JobPost) => j.id === resolvedParams.id) || mockJobs[0];

    return (
        <div className="p-8 lg:p-10 max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
            {/* Back Button & Breadcrumbs */}
            <div className="flex items-center justify-between">
                <Link
                    href="/applicant/jobs"
                    className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-blue-600 transition-colors group"
                >
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors shadow-sm">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    Back to Jobs
                </Link>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="p-2.5 bg-white border border-gray-100 text-gray-400 hover:text-blue-600 rounded-xl transition-all shadow-sm"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        className="p-2.5 bg-white border border-gray-100 text-gray-400 hover:text-orange-500 rounded-xl transition-all shadow-sm"
                    >
                        <Bookmark className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Header Card */}
            <div className="bg-white rounded-[32px] p-8 lg:p-10 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="w-24 h-24 rounded-3xl bg-blue-50 flex items-center justify-center p-4 shadow-inner border border-blue-100 shrink-0">
                        <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center text-white font-black text-xs uppercase tracking-tighter overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-400"></div>
                            TECH
                        </div>
                    </div>
                    <div className="text-center md:text-left space-y-3">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md uppercase tracking-wide">
                                10 min ago
                            </span>
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                            {job.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-6 text-sm font-bold text-gray-500">
                            <span className="flex items-center gap-2 tracking-tight">
                                <Building2 className="w-4 h-4 text-gray-400" /> {job.company}
                            </span>
                            <span className="flex items-center gap-2 tracking-tight">
                                <MapPin className="w-4 h-4 text-gray-400" /> {job.location}
                            </span>
                            <span className="flex items-center gap-2 tracking-tight">
                                <DollarSign className="w-4 h-4 text-gray-400" /> {job.salary}
                            </span>
                        </div>
                    </div>
                </div>
                <Link
                    href={`/applicant/apply/${job.id}`}
                    className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95 text-lg"
                >
                    Apply Now
                </Link>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Left Column: Job Content */}
                <div className="xl:col-span-8 space-y-10">
                    <div className="bg-white rounded-[32px] p-8 lg:p-10 border border-gray-100 shadow-sm space-y-10">
                        <section className="space-y-4">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">
                                Job Description
                            </h3>
                            <p className="text-sm text-gray-500 font-medium leading-[1.8] tracking-tight">
                                We are looking for a {job.title} to join our core platform team at{" "}
                                {job.company}. In this role, you will be responsible for designing
                                and implementing scalable backend services, optimizing our data
                                pipelines, and mentoring junior engineers. You will work closely
                                with product managers and designers to build features that empower
                                thousands of businesses globally.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">
                                Responsibilities
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    "Lead the architectural design of high-throughput distributed systems.",
                                    "Write clean, maintainable, and efficient code in Go and TypeScript.",
                                    "Optimize application performance and resolve complex production issues.",
                                    "Participate in code reviews and advocate for engineering best practices.",
                                    "Collaborate with cross-functional teams to define project scopes and roadmaps.",
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-3 group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0 group-hover:scale-150 transition-transform"></div>
                                        <span className="text-sm text-gray-500 font-medium leading-relaxed">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">
                                Requirements
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    "5+ years of experience building scalable web applications.",
                                    "Expertise in at least one modern backend language (Go, Node.js, or Java).",
                                    "Strong experience with SQL (PostgreSQL) and NoSQL databases.",
                                    "Familiarity with cloud platforms (AWS, GCP) and containerization (Docker, K8s).",
                                    "Bachelor's or Master's degree in Computer Science or related field.",
                                ].map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all"
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                                        <span className="text-sm text-gray-500 font-black tracking-tight leading-relaxed">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* Related Jobs Section */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                            Related Jobs
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {mockJobs.slice(0, 2).map((relatedJob: JobPost) => (
                                <div
                                    key={relatedJob.id}
                                    className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                                            10 min ago
                                        </span>
                                        <Bookmark className="w-4 h-4 text-gray-300" />
                                    </div>
                                    <h4 className="text-lg font-black text-gray-900 tracking-tight mb-2 hover:text-blue-600 cursor-pointer">
                                        {relatedJob.title}
                                    </h4>
                                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-6">
                                        <span>{relatedJob.salary}</span>
                                        <span>{relatedJob.type}</span>
                                    </div>
                                    <Link
                                        href={`/applicant/jobs/${relatedJob.id}`}
                                        className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        View Details <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar */}
                <div className="xl:col-span-4 space-y-8">
                    {/* Company Overview Card */}
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center text-white font-black text-xs">
                                TECH
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900">TechFlow Inc.</h4>
                                <p className="text-[11px] font-bold text-gray-400">
                                    Enterprise SaaS • 500-1000 employees
                                </p>
                            </div>
                        </div>
                        <p className="text-[13px] text-gray-500 font-medium leading-relaxed">
                            TechFlow is a leader in business automation software, helping companies
                            streamline their workflows and increase productivity.
                        </p>
                        <button
                            type="button"
                            className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            View Company Profile <ExternalLink className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Job Details Widget */}
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-6">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            Job Details
                        </h4>
                        <div className="space-y-6">
                            {[
                                { label: "Job Type", value: job.type, icon: Briefcase },
                                { label: "Experience Level", value: job.level, icon: Clock },
                                {
                                    label: "Application Deadline",
                                    value: "October 24, 2023",
                                    icon: Calendar,
                                    highlight: true,
                                },
                                { label: "Posted", value: "2 days ago", icon: Clock },
                            ].map((detail) => (
                                <div key={detail.label} className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                        <detail.icon className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                            {detail.label}
                                        </p>
                                        <p
                                            className={`text-sm font-black ${detail.highlight ? "text-blue-600" : "text-gray-900"}`}
                                        >
                                            {detail.value}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pt-6 space-y-3">
                            <Link
                                href={`/applicant/apply/${job.id}`}
                                className="block w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg transition-all text-center"
                            >
                                Apply Now
                            </Link>
                            <button
                                type="button"
                                className="w-full py-3.5 bg-white border border-gray-100 hover:border-gray-900 text-gray-900 font-black text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Share2 className="w-4 h-4" /> Share this Job
                            </button>
                        </div>
                    </div>

                    {/* Location Map Placeholder */}
                    <div className="bg-white rounded-[32px] p-4 border border-gray-100 shadow-sm overflow-hidden space-y-4">
                        <div className="h-48 rounded-2xl bg-[#F0F4F8] relative overflow-hidden flex items-center justify-center">
                            {/* Mock Map background grid */}
                            <div
                                className="absolute inset-0 opacity-10"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                                    backgroundSize: "40px 40px",
                                }}
                            ></div>
                            <div className="relative">
                                <MapPin className="w-10 h-10 text-blue-600 animate-bounce" />
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-blue-600/20 rounded-full blur-sm"></div>
                            </div>
                            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black shadow-sm flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-blue-600" /> {job.location}
                            </div>
                        </div>
                        <div className="px-2 pb-2">
                            <h4 className="text-sm font-black text-gray-900">Location</h4>
                            <p className="text-[11px] font-bold text-gray-500 mt-1 uppercase tracking-wider">
                                650 California St, San Francisco, CA 94108
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
