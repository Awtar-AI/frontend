"use client";

import { AlertCircle, Check } from "lucide-react";
import Link from "next/link";
import { useAuthUser } from "@/lib/hooks/use-auth";

export function ProfileCompletionWidget() {
    const user = useAuthUser();

    const steps = [
        {
            label: "Basic Information",
            completed: Boolean(user?.first_name?.trim() && user?.last_name?.trim()),
        },
        {
            label: "Job Title",
            completed: Boolean(user?.candidate_profile?.current_job_title?.trim()),
        },
        {
            label: "Skills",
            completed: (user?.candidate_profile?.primary_skills?.length ?? 0) > 0,
        },
        {
            label: "Education",
            completed: Boolean(user?.candidate_profile?.education_level?.trim()),
        },
        {
            label: "Industry",
            completed: Boolean(user?.candidate_profile?.industry_interest?.trim()),
        },
        {
            label: "Profile Photo",
            completed: Boolean(user?.profile_pic_url),
        },
        {
            label: "Resume",
            completed: Boolean(user?.candidate_profile?.resume_url),
        },
    ];

    const completedCount = steps.filter((s) => s.completed).length;
    const pct = Math.round((completedCount / steps.length) * 100);

    return (
        <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                    Profile Completion
                </h3>
                <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-black rounded-lg">
                    {pct}%
                </span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-3 tracking-wide">
                <span>
                    {completedCount} of {steps.length} completed
                </span>
                <span className="text-gray-900">{pct}%</span>
            </div>

            <div className="h-2.5 bg-gray-100 rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full bg-gray-900 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                />
            </div>

            <div className="space-y-4 mb-8">
                {steps.map((step) => (
                    <div key={step.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-5 h-5 rounded-[6px] flex items-center justify-center shrink-0 ${
                                    step.completed
                                        ? "bg-green-500"
                                        : "border-2 border-gray-200 bg-white"
                                }`}
                            >
                                {step.completed && (
                                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3.5} />
                                )}
                            </div>
                            <span
                                className={`text-sm font-bold ${step.completed ? "text-gray-900" : "text-gray-400"}`}
                            >
                                {step.label}
                            </span>
                        </div>
                        {!step.completed && (
                            <Link
                                href="/applicant/profile/edit"
                                className="text-[10px] font-black text-blue-600 hover:text-blue-700 tracking-wide"
                            >
                                Add
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            {pct < 100 && (
                <div className="bg-orange-50/50 border border-orange-200/60 rounded-2xl p-5 flex gap-3 items-start mb-6">
                    <AlertCircle className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-orange-800 leading-relaxed">
                        Complete your profile to get better job matches and increase your visibility
                        to recruiters.
                    </p>
                </div>
            )}

            <Link
                href="/applicant/profile/edit"
                className="w-full py-3 border-2 border-gray-200 hover:border-gray-900 text-gray-900 font-black text-sm rounded-xl transition-colors text-center block"
            >
                {pct === 100 ? "View Profile" : "Complete Profile"}
            </Link>
        </div>
    );
}
