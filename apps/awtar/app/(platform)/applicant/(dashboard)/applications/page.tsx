"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { mockApplications } from "../../lib/mockData";
import type { Application } from "../../types";

export default function ApplicationsPage() {
    const [activeTab, setActiveTab] = useState("All");

    return (
        <div className="p-8 lg:p-10 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
                        My Applications
                    </h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        Track your progress and stay updated with top employers
                    </p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                        type="text"
                        placeholder="Search application..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-900 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                {["All", "Under Review", "Shortlisted", "Rejected"].map((tab) => (
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
                            <div className="absolute bottom-[-9px] left-0 w-full h-1 bg-blue-600 rounded-full"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Applications List */}
            <div className="space-y-6">
                {mockApplications.map((app: Application) => (
                    <div
                        key={app.id}
                        className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all group overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-lg uppercase border border-blue-100">
                                    {app.company.substring(0, 2)}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors uppercase">
                                        {app.jobTitle}
                                    </h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        {app.company} • Applied on {app.dateApplied}
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
                                            className={`w-2 h-2 rounded-full ${
                                                app.status === "Under Review"
                                                    ? "bg-blue-600"
                                                    : app.status === "Rejected"
                                                      ? "bg-red-500"
                                                      : "bg-green-500"
                                            }`}
                                        ></div>
                                        <span
                                            className={`text-[11px] font-black uppercase tracking-tight ${
                                                app.status === "Under Review"
                                                    ? "text-blue-600"
                                                    : app.status === "Rejected"
                                                      ? "text-red-600"
                                                      : "text-green-600"
                                            }`}
                                        >
                                            {app.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-1 text-center md:text-left">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Next Step
                                    </p>
                                    <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight">
                                        Technical Interview
                                    </p>
                                </div>

                                <Link
                                    href={`/applicant/jobs/${app.id}`}
                                    className="px-8 py-3 bg-gray-50 hover:bg-gray-900 hover:text-white text-gray-900 text-[10px] font-black rounded-[18px] uppercase tracking-widest transition-all shadow-sm border border-gray-100"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
