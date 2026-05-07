"use client";

import Link from "next/link";
import { DashboardHero } from "./_components/DashboardHero";
import { JobRecommendations } from "./_components/JobRecommendations";
import { ProfileCompletionWidget } from "./_components/ProfileCompletionWidget";
import { StatCards } from "./_components/StatCards";
import { useDashboardStats } from "./hooks/use-dashboard-stats";

export default function ApplicantDashboard() {
    const { data: stats } = useDashboardStats();

    return (
        <div className="p-8 lg:p-10 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <DashboardHero />
            <StatCards />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                    <JobRecommendations />
                </div>

                <div className="space-y-8">
                    <ProfileCompletionWidget />

                    <Link
                        href="/applicant/saved"
                        className="w-full bg-white rounded-[24px] p-6 border border-gray-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] flex items-center justify-between transition-transform hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                            Saved Jobs
                        </h3>
                        <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                            {stats?.saved_jobs ?? 0} Saved
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
