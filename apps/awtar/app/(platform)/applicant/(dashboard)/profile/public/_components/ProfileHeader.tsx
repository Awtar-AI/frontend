"use client";

import { Briefcase, MapPin, Pencil, Sparkles } from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "@/applicant/user-me/_components/UserAvatar";
import type { AppUser } from "@/applicant/user-me/models/app-user";

export function ProfileHeader({ user }: { user: AppUser }) {
    const jobTitle = user.candidate_profile?.current_job_title;
    const experience = user.candidate_profile?.years_of_experience;

    return (
        <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full">
                <div className="relative w-28 h-28 rounded-2xl border-4 border-white shadow-lg shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center">
                    <UserAvatar user={user} sizeClassName="w-full h-full text-3xl" />
                </div>

                <div className="flex-1 text-center md:text-left mt-2 md:mt-0">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                            {user.first_name} {user.last_name}
                        </h1>
                    </div>

                    {jobTitle && <p className="text-lg font-bold text-gray-600 mb-4">{jobTitle}</p>}

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-bold text-gray-500">
                        {experience != null && (
                            <div className="flex items-center gap-1.5">
                                <Briefcase className="w-4 h-4 text-gray-400" />
                                {experience} {experience === 1 ? "Year" : "Years"} Experience
                            </div>
                        )}
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {user.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                            <Sparkles className="w-4 h-4" /> Open to roles
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
                <Link
                    href="/applicant/profile/edit"
                    className="px-6 py-3 bg-white border-2 border-gray-100 hover:border-gray-900 text-gray-900 font-black rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                >
                    <Pencil className="w-4 h-4" /> Edit Profile
                </Link>
            </div>
        </div>
    );
}
