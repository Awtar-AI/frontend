"use client";

import { CheckCircle2, Info, Mail, Sparkles } from "lucide-react";
import type { AppUser } from "@/applicant/user-me/models/app-user";

export function ContactInfoCard({ user }: { user: AppUser }) {
    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)]">
            <h3 className="text-sm font-black text-slate-950 tracking-tight mb-5">Contact Info</h3>
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                        <Mail className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="pt-0.5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">
                            Email
                        </p>
                        <p className="text-sm font-bold text-slate-900 break-all">{user.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SmartMatchCard({ user }: { user: AppUser }) {
    const enabled = user.candidate_profile?.match_smart_notification ?? false;
    const score = enabled ? 92 : 68;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)]">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-950 tracking-tight">
                        Trust Score
                    </h3>
                    <Info className="h-4 w-4 text-slate-400" />
                </div>

                <div className="flex flex-col items-center text-center">
                    <div
                        className="relative grid h-28 w-28 place-items-center rounded-full"
                        style={{
                            background: `conic-gradient(#2563eb ${score * 3.6}deg, #e8eefb 0deg)`,
                        }}
                    >
                        <div className="grid h-20 w-20 place-items-center rounded-full bg-white shadow-inner">
                            <div>
                                <div className="text-2xl font-black text-slate-950">{score}%</div>
                                <div className="text-[8px] font-black uppercase tracking-widest text-blue-600">
                                    Verified
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="mt-4 text-xs font-medium leading-5 text-slate-500">
                        Candidate background, identity, and employment history signals are ready for
                        review.
                    </p>
                </div>

                <div className="mt-5 space-y-2.5">
                    {["Identity", "Profile", "Preferences"].map((item) => (
                        <div
                            key={item}
                            className="flex items-center justify-between text-[11px] font-bold"
                        >
                            <span className="inline-flex items-center gap-1.5 text-slate-600">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                {item}
                            </span>
                            <span className="text-emerald-600">Passed</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-black tracking-tight text-blue-900">
                    <Sparkles className="h-4 w-4" />
                    AI Match Analysis
                </h3>
                <p className="text-xs font-medium leading-5 text-blue-900/80">
                    {enabled
                        ? "Smart Match notifications are enabled. You'll be notified when new roles match your profile."
                        : "Smart Match notifications are disabled. Enable them to get notified about matching roles."}
                </p>
                <div className="mt-4 space-y-3">
                    <div>
                        <div className="mb-1 flex justify-between text-[10px] font-black text-blue-950">
                            <span>Profile Strength</span>
                            <span>{score}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white">
                            <div
                                className="h-1.5 rounded-full bg-blue-600"
                                style={{ width: `${score}%` }}
                            />
                        </div>
                    </div>
                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                            enabled
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : "bg-white text-slate-500 border border-slate-200"
                        }`}
                    >
                        {enabled ? "Enabled" : "Disabled"}
                    </span>
                </div>
            </div>
        </div>
    );
}
