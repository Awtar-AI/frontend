"use client";

import {
    Download,
    CheckCircle2,
    AlertTriangle,
    Info,
    ShieldCheck,
    ArrowLeft,
    TrendingUp,
    FileText,
    Database,
    Clock,
    LayoutGrid,
    ChevronRight,
    MapPin,
    ArrowUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const CANDIDATE = {
    name: "Johnathan Doe",
    avatar: "https://i.pravatar.cc/150?img=7",
    title: "Senior Software Engineer",
    trustScore: 88,
    badge: "HIGH INTEGRITY",
    analysisSummary:
        "Based on automated resume parsing and cross-referencing with official sources, this candidate demonstrates a highly consistent professional history with minimal verification risks.",
    socialMatched: true,
    identityConfirmed: true,
    verification: [
        {
            label: "Education",
            tag: "VERIFIED",
            tagColor: "text-green-700 bg-green-50",
            details: "Confirmed degree with University records.",
            progress: 96,
            progressColor: "bg-green-500",
        },
        {
            label: "Employment History",
            tag: "HIGH CONFIDENCE",
            tagColor: "text-blue-700 bg-blue-50",
            details: "LinkedIn & Tax records match CV dates.",
            progress: 82,
            progressColor: "bg-blue-500",
        },
        {
            label: "Skills Growth",
            tag: "REALISTIC",
            tagColor: "text-purple-700 bg-purple-50",
            details: "Progression matches industry standards.",
            progress: 74,
            progressColor: "bg-purple-500",
        },
    ],
    riskFlags: [
        {
            icon: "location",
            label: "Relocation Required",
            detail: "Candidate currently resides in San Francisco, CA.",
            severity: "amber",
        },
        {
            icon: "gap",
            label: "Gap in Employment",
            detail: "6 month gap between June 2021 and Jan 2022.",
            severity: "info",
        },
        {
            icon: "regional",
            label: "Regional Discrepancy",
            detail: "None detected. Profile matches local market.",
            severity: "clear",
        },
    ],
    resumeSource: {
        filename: "Doe_Resume_2024.pdf",
        engine: "NeuraParser v4.2.0",
        latency: "1.42s",
        confidence: "Excellent",
    },
};

const NAV_ITEMS = [
    { label: "Overview", icon: LayoutGrid, active: false },
    { label: "Verification", icon: ShieldCheck, active: true },
    { label: "Risk Assessment", icon: AlertTriangle, active: false },
    { label: "Source Data", icon: Database, active: false },
    { label: "History", icon: Clock, active: false },
];

const severityStyles: Record<string, string> = {
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    info: "text-blue-600 bg-blue-50 border-blue-100",
    clear: "text-green-600 bg-green-50 border-green-100",
};

const severityLabels: Record<string, string> = {
    amber: "AMBER",
    info: "INFO",
    clear: "CLEAR",
};

export default function TrustScorePage() {
    const params = useParams();
    const id = (params?.id as string) ?? "1";
    const [activeNav, setActiveNav] = useState("Verification");

    return (
        <div className="space-y-4">
            <Link href={`/recruiter/talent/${id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Talent Profile
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                {/* ── SIDEBAR ── */}
                <div className="space-y-4">
                    {/* Profile Card */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col items-center text-center">
                        <div className="relative mb-3">
                            <Image
                                src={CANDIDATE.avatar}
                                alt={CANDIDATE.name}
                                width={64}
                                height={64}
                                className="rounded-full object-cover border-2 border-blue-100"
                            />
                            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <p className="text-sm font-bold text-gray-900">{CANDIDATE.name}</p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">{CANDIDATE.title}</p>
                    </div>

                    {/* Nav */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.label}
                                onClick={() => setActiveNav(item.label)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors text-left ${
                                    activeNav === item.label
                                        ? "bg-blue-50 text-blue-700 border-l-2 border-blue-600"
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Quick Export */}
                    <div className="bg-blue-600 rounded-xl p-5 text-white">
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Quick Export</p>
                        <p className="text-xs mb-4 opacity-80">Generate a full compliance report for legal and HR records.</p>
                        <button className="w-full flex items-center justify-center gap-2 bg-white text-blue-700 text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-blue-50 transition-colors">
                            <Download className="w-4 h-4" /> Download PDF
                        </button>
                    </div>
                </div>

                {/* ── MAIN SECTION ── */}
                <div className="lg:col-span-3 space-y-5">
                    {/* Trust Analysis Header */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-start gap-6">
                            {/* Circle Score */}
                            <div className="relative w-28 h-28 flex-shrink-0">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e5e7eb" strokeWidth="3.5" />
                                    <circle
                                        cx="18" cy="18" r="15.915" fill="none"
                                        stroke="#2563eb" strokeWidth="3.5"
                                        strokeDasharray={`${CANDIDATE.trustScore} ${100 - CANDIDATE.trustScore}`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-black text-gray-900">{CANDIDATE.trustScore}%</span>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Trust Score</span>
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-lg font-bold text-gray-900">Candidate Trust Analysis</h2>
                                    <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded">
                                        {CANDIDATE.badge}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">{CANDIDATE.analysisSummary}</p>
                                <div className="flex items-center gap-4 mt-3">
                                    {CANDIDATE.identityConfirmed && (
                                        <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Identity Confirmed
                                        </span>
                                    )}
                                    {CANDIDATE.socialMatched && (
                                        <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Social Matched
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Verification Breakdown */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-blue-500" /> Verification Breakdown
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            {CANDIDATE.verification.map(v => (
                                <div key={v.label} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-gray-700">{v.label}</span>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${v.tagColor}`}>
                                            {v.tag}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 mb-3">{v.details}</p>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div className={`h-1.5 rounded-full ${v.progressColor}`} style={{ width: `${v.progress}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-2 gap-5">
                        {/* Risk Flags */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-500" /> Risk Flags
                            </h3>
                            <div className="space-y-3">
                                {CANDIDATE.riskFlags.map((flag, i) => (
                                    <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${severityStyles[flag.severity]}`}>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold mb-0.5">{flag.label}</p>
                                            <p className="text-[11px] opacity-80 leading-snug">{flag.detail}</p>
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest flex-shrink-0 mt-0.5`}>
                                            {severityLabels[flag.severity]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Resume Parsing Source */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-500" /> Resume Parsing Source
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { label: "FILE ORIGIN", value: CANDIDATE.resumeSource.filename },
                                    { label: "PARSING ENGINE", value: CANDIDATE.resumeSource.engine },
                                    { label: "ANALYSIS LATENCY", value: CANDIDATE.resumeSource.latency },
                                    { label: "CONFIDENCE LEVEL", value: `✦ ${CANDIDATE.resumeSource.confidence}` },
                                ].map(item => (
                                    <div key={item.label} className="flex items-center justify-between">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.label}</span>
                                        <span className="text-xs font-semibold text-gray-800">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-4 text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                                View Raw JSON Payload <Info className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
