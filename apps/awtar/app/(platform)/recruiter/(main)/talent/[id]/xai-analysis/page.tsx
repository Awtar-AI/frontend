"use client";

import {
    AlertTriangle,
    ArrowLeft,
    BarChart2,
    CalendarCheck,
    CheckCircle2,
    Download,
    FileText,
    MessageSquare,
    Share2,
    XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const CANDIDATE = {
    name: "Marcus Thorne",
    avatar: "https://i.pravatar.cc/150?img=8",
    title: "Senior Architect Applicant",
    candidateId: "#8842",
    role: "Senior Architect",
    confidenceScore: 84,
    aiJustification:
        '"Marcus demonstrates a profound alignment with the Senior Architect role, specifically excelling in the transition from legacy monoliths to high-scale serverless architectures. His decision-making patterns in past projects suggest a high aptitude for our current technical challenges. The AI identifies a rare overlap in Kubernetes orchestration and executive-level stakeholder management."',
    tags: ["Culture Fit: Excellent", "Tech Aptitude: Top 5%", "Leadership: Strong"],
    matchedSkills: [
        "Cloud Infrastructure",
        "Microservices",
        "Node.js / Go",
        "Kubernetes",
        "CI/CD Architecture",
    ],
    missingSkills: ["Rust Language", "GraphQL Federation"],
    missingNote:
        "Note: Marcus has indicated high interest in learning Rust and has basic conceptual knowledge.",
    experience: [
        {
            role: "Senior Cloud Engineer @ TechNova",
            period: "2021 – Present",
            relevance: 88,
            detail: "Led transformation of AWS stack. Directly matches our target tech stack.",
        },
        {
            role: "Software Lead @ GlobalFin",
            period: "2019 – 2021",
            relevance: 75,
            detail: "Managed large distributed teams. Solid fundamental systems design.",
        },
        {
            role: "Full Stack Dev @ StartitUp",
            period: "2016 – 2019",
            relevance: 40,
            detail: "Building MVP from scratch. Shows grit and versatility.",
        },
    ],
    verdict: {
        label: "Strong Match — Proceed to Interview",
        detail: "Based on 142 data points across technical skills, leadership experience, and cultural alignment indicators, Marcus Thorne ranks in the 98th percentile for this specific opening.",
    },
};

const NAV_ITEMS = [
    { label: "AI Analysis", icon: BarChart2, active: true },
    { label: "Resume Details", icon: FileText, active: false },
    { label: "Interview Notes", icon: MessageSquare, active: false },
    { label: "Social Presence", icon: Share2, active: false },
];

export default function XAIAnalysisPage() {
    const params = useParams();
    const id = (params?.id as string) ?? "1";
    const [activeNav, setActiveNav] = useState("AI Analysis");

    return (
        <div className="space-y-4">
            <Link
                href={`/recruiter/talent/${id}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Talent Profile
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                {/* ── SIDEBAR ── */}
                <div className="space-y-4">
                    {/* Profile Card */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col items-center text-center">
                        <Image
                            src={CANDIDATE.avatar}
                            alt={CANDIDATE.name}
                            width={64}
                            height={64}
                            className="rounded-full object-cover border-2 border-blue-100 mb-3"
                        />
                        <p className="text-sm font-bold text-gray-900">{CANDIDATE.name}</p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                            {CANDIDATE.title}
                        </p>
                    </div>

                    {/* Nav */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        {NAV_ITEMS.map((item) => (
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
                </div>

                {/* ── MAIN CONTENT ── */}
                <div className="lg:col-span-3 space-y-5">
                    {/* Header */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-start justify-between gap-4 mb-1">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest flex items-center gap-1">
                                        ✦ EXPLAINABLE AI ACTIVE
                                    </span>
                                </div>
                                <h2 className="text-2xl font-black text-gray-900">
                                    AI Analysis for {CANDIDATE.name}
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">
                                    Detailed reasoning and data-driven insights for Candidate ID{" "}
                                    {CANDIDATE.candidateId}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button className="flex items-center gap-1.5 border border-gray-200 text-gray-700 text-xs font-bold px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    <Download className="w-3.5 h-3.5" /> Full Report
                                </button>
                                <button className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    <Share2 className="w-3.5 h-3.5" /> Share with Team
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Why this match */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                ✦ Why this match?
                            </h3>
                            <span className="text-xs font-semibold text-gray-500">
                                Confidence Score: {CANDIDATE.confidenceScore}%
                            </span>
                        </div>
                        <blockquote className="border-l-4 border-blue-500 pl-4 bg-blue-50/50 rounded-r-lg p-4 mb-3">
                            <p className="text-sm text-gray-700 leading-relaxed italic">
                                {CANDIDATE.aiJustification}
                            </p>
                        </blockquote>
                        <div className="flex flex-wrap gap-2">
                            {CANDIDATE.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-[11px] font-semibold rounded-full"
                                >
                                    <CheckCircle2 className="w-3 h-3 text-green-500" /> {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Skill Gap + Experience */}
                    <div className="grid grid-cols-2 gap-5">
                        {/* Skill Gap Analysis */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <BarChart2 className="w-4 h-4 text-blue-500" /> Skill Gap Analysis
                            </h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                Matched Skills
                            </p>
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {CANDIDATE.matchedSkills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-[11px] font-semibold rounded-full border border-green-100"
                                    >
                                        <CheckCircle2 className="w-3 h-3" /> {skill}
                                    </span>
                                ))}
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                Missing / Low Proficiency
                            </p>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {CANDIDATE.missingSkills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-[11px] font-semibold rounded-full border border-amber-100"
                                    >
                                        <AlertTriangle className="w-3 h-3" /> {skill}
                                    </span>
                                ))}
                            </div>
                            <p className="text-[11px] text-gray-400 leading-snug italic">
                                {CANDIDATE.missingNote}
                            </p>
                        </div>

                        {/* Experience Relevance */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                📈 Experience Relevance
                            </h3>
                            <div className="relative">
                                {/* Timeline line */}
                                <div className="absolute left-3.5 top-4 bottom-4 w-px bg-gray-100" />
                                <div className="space-y-5">
                                    {CANDIDATE.experience.map((exp, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div
                                                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 ${
                                                    i === 0
                                                        ? "border-blue-600 bg-blue-600"
                                                        : i === 1
                                                          ? "border-gray-300 bg-white"
                                                          : "border-gray-200 bg-white"
                                                }`}
                                            >
                                                {i === 0 && (
                                                    <div className="w-2 h-2 rounded-full bg-white" />
                                                )}
                                            </div>
                                            <div className="flex-1 -mt-0.5">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="text-xs font-bold text-gray-900 leading-tight">
                                                        {exp.role}
                                                    </p>
                                                    <span className="text-[10px] text-gray-400 font-semibold whitespace-nowrap">
                                                        {exp.period}
                                                    </span>
                                                </div>
                                                <p className="text-xs font-semibold text-blue-600 mt-0.5">
                                                    {exp.relevance}% Relevance
                                                </p>
                                                <p className="text-[11px] text-gray-500 leading-snug mt-1">
                                                    {exp.detail}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Final Verdict */}
                    <div className="bg-blue-600 rounded-xl p-6 text-white">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <BarChart2 className="w-4 h-4 opacity-70" />
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                                        AI Final Verdict
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black mb-2">
                                    {CANDIDATE.verdict.label}
                                </h3>
                                <p className="text-sm opacity-80 leading-relaxed max-w-xl">
                                    {CANDIDATE.verdict.detail}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 flex-shrink-0">
                                <button className="flex items-center gap-2 bg-white text-blue-700 text-xs font-black px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-colors uppercase tracking-wider whitespace-nowrap">
                                    <CalendarCheck className="w-4 h-4" /> Schedule Interview
                                </button>
                                <button className="flex items-center gap-2 border border-white/30 text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-white/10 transition-colors uppercase tracking-wider whitespace-nowrap">
                                    <XCircle className="w-4 h-4" /> Reject Candidate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
