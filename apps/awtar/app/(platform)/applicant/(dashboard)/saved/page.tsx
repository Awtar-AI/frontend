"use client";

import { ArrowRight, Bookmark, MapPin, Search, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { mockJobs } from "../../lib/mockData";
import type { JobPost } from "../../types";

export default function SavedJobsPage() {
    const [savedJobs] = useState<JobPost[]>(mockJobs.slice(0, 2)); // Mock: first 2 are saved
    const [activeTab, setActiveTab] = useState("All Saved");

    return (
        <div className="p-8 lg:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Search and Tabs Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                    {["All Saved", "Full-time", "Remote"].map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-full text-xs font-black transition-all ${
                                activeTab === tab
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "bg-white text-gray-400 border border-gray-100 hover:bg-gray-50"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                        type="text"
                        placeholder="Search saved jobs..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-900 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                    />
                </div>
            </div>

            {/* Main Job List */}
            <div className="space-y-6">
                {savedJobs.map((job) => (
                    <div
                        key={job.id}
                        className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all group relative"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                                    10 min ago
                                </p>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors uppercase leading-none">
                                    {job.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-2">
                                    <span>{job.type}</span>
                                    <span>•</span>
                                    <span>{job.salary}</span>
                                    <span>•</span>
                                    <span>3 months</span>
                                    <span>•</span>
                                    <span>Hybrid</span>
                                    <span>•</span>
                                    <span className="uppercase">{job.level}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    className="p-2.5 bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                                    aria-label="Remove from saved"
                                >
                                    <Bookmark className="w-5 h-5 fill-gray-900 text-gray-900" />
                                </button>
                                <Link
                                    href={`/applicant/apply/${job.id}`}
                                    className="px-8 py-2.5 bg-gray-900 hover:bg-black text-white text-[11px] font-black rounded-xl transition-all shadow-lg flex items-center gap-2 uppercase tracking-widest"
                                >
                                    Apply <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                        <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6 line-clamp-2 max-w-4xl">
                            Looking for a creative UI/UX Designer to enhance user experience for our
                            mobile application. Must possess strong design skills and experience
                            with prototyping tools.
                        </p>

                        <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                            <div className="flex items-center gap-2">
                                {["Figma", "User Research", "Wireframing", "Prototyping"].map(
                                    (tag) => (
                                        <span
                                            key={tag}
                                            className="px-5 py-2 bg-gray-50 text-gray-500 text-[11px] font-black rounded-full border border-transparent hover:border-blue-100 transition-colors"
                                        >
                                            {tag}
                                        </span>
                                    ),
                                )}
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-[13px] font-black text-gray-900">
                                        4.8
                                    </span>
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((starIdx) => (
                                            <Star
                                                key={`star-${starIdx}`}
                                                className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                                                aria-hidden="true"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                                    <MapPin className="w-4 h-4" /> Addis Ababa
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 pt-10">
                <button
                    type="button"
                    className="w-10 h-10 rounded-full bg-blue-600 text-white shadow-lg text-sm font-black scale-110"
                >
                    1
                </button>
            </div>

            {/* Cleaning Banner */}
            <div className="bg-blue-50/50 rounded-[32px] p-8 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6 mt-20">
                <div className="flex items-center gap-6 text-center md:text-left">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                        <Trash2 className="w-6 h-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-sm font-black text-gray-900 uppercase">
                            Cleaning up your list?
                        </h4>
                        <p className="text-xs font-bold text-gray-400 max-w-md">
                            Removing jobs you&apos;re no longer interested in helps us improve your
                            match recommendations.
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    className="px-10 py-3 bg-white border border-blue-200 text-blue-600 text-[11px] font-black rounded-xl hover:bg-blue-50 transition-all uppercase tracking-widest shadow-sm"
                >
                    Manage List
                </button>
            </div>
        </div>
    );
}
