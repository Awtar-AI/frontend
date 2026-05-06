"use client";

import { Mail } from "lucide-react";
import type { AppUser } from "@/applicant/user-me/models/app-user";

export function ContactInfoCard({ user }: { user: AppUser }) {
    return (
        <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)]">
            <h3 className="text-lg font-black text-gray-900 tracking-tight mb-8">Contact Info</h3>
            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                        <Mail className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="pt-0.5">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">
                            Email
                        </p>
                        <p className="text-sm font-bold text-gray-900">{user.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SmartMatchCard({ user }: { user: AppUser }) {
    const enabled = user.candidate_profile?.match_smart_notification ?? false;

    return (
        <div className="bg-blue-50/50 rounded-[24px] p-8 border border-blue-100/60 shadow-sm border-t-[6px] border-t-blue-400">
            <h3 className="text-lg font-black text-blue-900 tracking-tight mb-4">Smart Match</h3>
            <p className="text-[13px] font-medium text-blue-800 leading-relaxed mb-4">
                {enabled
                    ? "Smart Match notifications are enabled. You'll be notified when new roles match your profile."
                    : "Smart Match notifications are disabled. Enable them to get notified about matching roles."}
            </p>
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                    enabled
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                }`}
            >
                {enabled ? "Enabled" : "Disabled"}
            </span>
        </div>
    );
}
