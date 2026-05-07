"use client";

import { Briefcase, CheckCircle2, Download, Loader2, Mail, Pencil, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { UserAvatar } from "@/applicant/user-me/_components/UserAvatar";
import type { AppUser } from "@/applicant/user-me/models/app-user";
import { useUploadProfilePic } from "../../hooks/use-upload-profile-pic";

export function ProfileHeader({ user }: { user: AppUser }) {
    const jobTitle = user.candidate_profile?.current_job_title;
    const experience = user.candidate_profile?.years_of_experience;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { upload, isPending } = useUploadProfilePic();

    return (
        <div className="min-h-[220px] bg-white rounded-xl p-8 lg:p-10 border border-gray-200 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full">
                <div className="relative w-24 h-24 shrink-0">
                    <div className="w-24 h-24 rounded-full overflow-hidden">
                        <UserAvatar user={user} sizeClassName="w-full h-full text-2xl" />
                    </div>

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isPending}
                        className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md ring-4 ring-white flex items-center justify-center transition-colors disabled:opacity-60"
                        aria-label="Change profile picture"
                    >
                        {isPending ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Pencil className="w-3.5 h-3.5" />
                        )}
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) upload(file);
                            e.target.value = "";
                        }}
                    />
                </div>

                <div className="flex-1 text-center md:text-left mt-2 md:mt-0">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1.5">
                        <h1 className="text-2xl lg:text-[28px] font-black text-slate-950 tracking-tight">
                            {user.first_name} {user.last_name}
                        </h1>
                        <span className="inline-flex items-center justify-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                        </span>
                    </div>

                    {jobTitle && (
                        <p className="text-sm font-bold text-slate-600 mb-3">{jobTitle}</p>
                    )}

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 text-xs font-bold text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {user.email}
                        </div>
                        {experience != null && (
                            <div className="flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                                {experience} {experience === 1 ? "Year" : "Years"} Experience
                            </div>
                        )}
                        <div className="flex items-center gap-1.5 text-blue-600">
                            <Sparkles className="w-3.5 h-3.5" /> Open to roles
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
                {user.candidate_profile?.resume_url && (
                    <a
                        href={user.candidate_profile.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                        <Download className="w-4 h-4" /> Resume
                    </a>
                )}
                <Link
                    href="/applicant/profile/edit"
                    className="px-5 py-2.5 bg-white border border-gray-200 hover:border-slate-300 text-slate-900 text-sm font-black rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
                >
                    <Pencil className="w-4 h-4" /> Edit Profile
                </Link>
            </div>
        </div>
    );
}
