"use client";

import { Briefcase, Calendar } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { UserAvatar, userAvatarAlt } from "@/applicant/user-me/_components/UserAvatar";
import { useAuthUser } from "@/lib/hooks/use-auth";

function greetingForNow(): string {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
}

export function DashboardHero() {
    const user = useAuthUser();

    const firstName = user?.first_name?.trim() || "there";
    const jobTitle = user?.candidate_profile?.current_job_title?.trim();
    const formattedDate = useMemo(
        () =>
            new Date().toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
        [],
    );

    return (
        <div
            className="relative overflow-hidden bg-[#475ca3] rounded-3xl p-8 lg:p-10 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 z-0"
            style={{ backgroundColor: "#8fa3c4" }}
        >
            <div className="absolute inset-0 z-[-1] mix-blend-overlay">
                <Image
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
                    alt="Office Background"
                    fill
                    className="object-cover opacity-30"
                />
            </div>
            <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-blue-900/90 to-blue-800/40"></div>

            <div className="z-10 w-full md:w-auto">
                <h1 className="text-3xl lg:text-[40px] font-black mb-3 tracking-tight text-white drop-shadow-md">
                    {greetingForNow()}, {firstName}!
                </h1>
                <p className="text-blue-50 font-bold mb-8 text-sm lg:text-base drop-shadow">
                    Ready to take the next step in your career? Here&apos;s what&apos;s happening
                    today.
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-white font-bold drop-shadow">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formattedDate}
                    </div>
                    {jobTitle ? (
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            {jobTitle}
                        </div>
                    ) : null}
                </div>
            </div>

            {user ? (
                <div className="relative w-32 h-32 rounded-full border-[6px] border-white/30 shadow-2xl shrink-0 overflow-hidden z-10 hidden md:flex items-center justify-center bg-blue-800/40">
                    <UserAvatar user={user} sizeClassName="w-full h-full text-4xl" />
                    <span className="sr-only">{userAvatarAlt(user)}</span>
                </div>
            ) : null}
        </div>
    );
}
