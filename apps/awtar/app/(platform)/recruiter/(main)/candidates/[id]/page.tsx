"use client";

import {
    AlertTriangle,
    Briefcase,
    Calendar,
    CheckCircle2,
    ChevronLeft,
    Code2,
    Download,
    Lightbulb,
    Mail,
    MapPin,
    Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const TRUST_DATA = [
    { name: "Score", value: 92 },
    { name: "Gap", value: 8 },
];
const COLORS = ["#2563eb", "#e5e7eb"]; // Blue and light gray

export default function CandidateDetailsPage() {
    return (
        <div className="w-full flex justify-center pb-12">
            <div className="w-full max-w-5xl space-y-6">
                {/* Upper Section */}
                <div className="grid lg:grid-cols-[1fr_2fr] gap-6">
                    {/* Left Column: Profile Card */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col items-center flex-shrink-0 relative overflow-hidden">
                        {/* Decorative BG */}
                        <div className="absolute top-0 inset-x-0 h-32 bg-gray-50/50 -z-0 border-b border-gray-100" />

                        <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden mb-6 relative z-10 bg-white">
                            <Image
                                src="https://i.pravatar.cc/500?img=1"
                                alt="Sarah Johnson"
                                fill
                                className="object-cover"
                            />
                        </div>

                        <h1 className="text-3xl font-black text-gray-900 tracking-tight text-center relative z-10">
                            Sarah Johnson
                        </h1>
                        <p className="text-blue-600 font-bold mb-6 text-sm">Mobile App UI/UX</p>

                        <div className="grid grid-cols-3 gap-2 w-full mb-8">
                            <button className="py-2.5 px-1 border-2 border-green-500 text-green-600 font-bold text-[10px] md:text-xs rounded-lg hover:bg-green-50 transition-colors shadow-sm text-center flex items-center justify-center">
                                Shortlist
                            </button>
                            <button className="py-2.5 px-1 border-2 border-blue-600 text-blue-600 font-bold text-[10px] md:text-xs rounded-lg hover:bg-blue-50 transition-colors shadow-sm text-center leading-tight flex items-center justify-center">
                                Schedule<br className="hidden lg:block xl:hidden"/> Interview
                            </button>
                            <button className="py-2.5 px-1 border-2 border-red-500 text-red-500 font-bold text-[10px] md:text-xs rounded-lg hover:bg-red-50 transition-colors shadow-sm text-center flex items-center justify-center">
                                Reject
                            </button>
                        </div>

                        <div className="w-full space-y-4 text-sm font-semibold text-gray-700 mb-8 border-t border-gray-100 pt-6">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-blue-500" /> New York
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-blue-500" /> sarahjohnson@gmail.com
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-blue-500" /> +251 912 345 678
                            </div>
                            <div className="flex items-center gap-3">
                                <Briefcase className="w-4 h-4 text-blue-500" />{" "}
                                linkedin.com/in/hannatadesse
                            </div>
                        </div>

                        <div className="w-full flex flex-wrap gap-2 pt-6 border-t border-gray-100">
                            {["Figma", "User Research", "Wireframing", "Prototyping"].map(
                                (skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-full"
                                    >
                                        {skill}
                                    </span>
                                ),
                            )}
                        </div>
                    </div>

                    {/* Right Column: Application Info */}
                    <div className="bg-[#fafafb] bg-opacity-50 rounded-xl border border-gray-100 p-8">
                        <div className="max-w-2xl">
                            {/* Application Overview */}
                            <div className="mb-10">
                                <h3 className="text-gray-900 font-black text-lg mb-6 tracking-tight">
                                    Application Overview
                                </h3>
                                <div className="grid grid-cols-2 gap-y-6">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                            Job Title
                                        </p>
                                        <p className="text-sm font-bold text-gray-900">
                                            UI/UX Designer for Mobile App
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                            Applied On
                                        </p>
                                        <p className="text-sm font-bold text-gray-900">
                                            May 5, 2025
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                            Application Status
                                        </p>
                                        <span className="inline-flex bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-md">
                                            New
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Professional Overview */}
                            <div className="mb-10">
                                <h3 className="text-gray-900 font-black text-lg mb-6 tracking-tight">
                                    Professional Overview
                                </h3>
                                <div className="grid grid-cols-2 gap-y-6 mb-6">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                            Expected Salary
                                        </p>
                                        <p className="text-sm font-bold text-gray-900">$45/hour</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                            Work Type
                                        </p>
                                        <p className="text-sm font-bold text-gray-900">
                                            Hybrid preferred
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 border-l-2 border-gray-200 pl-4">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                        Cover Letter
                                    </p>
                                    <p className="text-sm font-medium text-gray-700 leading-relaxed italic">
                                        I'm excited about the opportunity to design seamless mobile
                                        experiences. I bring 4+ years of experience working on
                                        fintech and e-commerce platforms.
                                    </p>
                                </div>
                            </div>

                            {/* Experience */}
                            <div className="mb-10">
                                <h3 className="text-gray-900 font-black text-lg mb-6 tracking-tight">
                                    Experience
                                </h3>
                                <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-1.5 before:w-0.5 before:bg-gray-200">
                                    <div className="relative pl-6">
                                        <div className="absolute left-0 top-1.5 w-3.5 h-3.5 bg-blue-600 rounded-full border-4 border-[#fafafb]" />
                                        <h4 className="text-sm font-bold text-gray-900 mb-1">
                                            UI Designer – EthioSoft Inc. (2022–Present)
                                        </h4>
                                        <p className="text-xs font-medium text-gray-500">
                                            Designed and tested user flows for a banking app used by
                                            over 500k customers.
                                        </p>
                                    </div>
                                    <div className="relative pl-6">
                                        <div className="absolute left-0 top-1.5 w-3 h-3 bg-gray-300 rounded-full border-2 border-[#fafafb]" />
                                        <h4 className="text-sm font-bold text-gray-900 mb-1">
                                            UX Intern – OrangeLab (2021)
                                        </h4>
                                        <p className="text-xs font-medium text-gray-500">
                                            Assisted in redesigning a travel booking app UI.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Resume & Attachments */}
                            <div>
                                <h3 className="text-gray-900 font-black text-lg mb-4 tracking-tight">
                                    Resume & Attachments
                                </h3>
                                <div className="flex flex-col gap-3">
                                    <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline w-fit">
                                        <Download className="w-4 h-4" strokeWidth={3} /> Resume.pdf
                                    </button>
                                    <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline w-fit">
                                        <Download className="w-4 h-4" strokeWidth={3} />{" "}
                                        Portfolio.zip
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: AI Generated Insights */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-[#fbfcff]">
                        <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <Lightbulb className="w-3.5 h-3.5 fill-blue-700/20" /> AI GENERATED
                            INSIGHTS
                        </div>
                        <span className="text-xs font-semibold text-gray-400">
                            Analyzed 2 mins ago
                        </span>
                    </div>

                    <div className="p-8 grid lg:grid-cols-[1fr_1fr] gap-6">
                        {/* Why this candidate? */}
                        <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100 self-start">
                            <h3 className="flex items-center gap-2 text-base font-black text-blue-900 mb-4">
                                <Lightbulb className="w-5 h-5 text-blue-600 fill-blue-600/20" /> Why
                                this candidate?
                            </h3>
                            <p className="text-sm font-medium text-gray-700 leading-relaxed">
                                John demonstrates a rare combination of deep technical expertise in{" "}
                                <span className="font-bold text-blue-700 bg-blue-100/50 px-1 rounded">
                                    AWS Architecture
                                </span>{" "}
                                and proven leadership experience. His tenure at TechStream shows
                                stability and growth, specifically managing teams of 10+, which
                                aligns perfectly with your &quot;Senior Engineering Manager&quot; trajectory.
                                His contribution to infrastructure cost reduction (35%) indicates a
                                high level of business acumen beyond just coding.
                            </p>
                        </div>

                        {/* Trust Score Breakdown */}
                        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center self-start h-full min-h-[220px]">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 w-full text-left">
                                TRUST SCORE BREAKDOWN
                            </h3>
                            <div className="relative w-32 h-32 flex items-center justify-center -mt-2 mb-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={TRUST_DATA}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={45}
                                            outerRadius={60}
                                            stroke="none"
                                            startAngle={90}
                                            endAngle={-270}
                                            dataKey="value"
                                        >
                                            {TRUST_DATA.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-2xl font-black text-gray-900 -mt-1 tracking-tighter">
                                        92%
                                    </span>
                                </div>
                            </div>
                            <p className="text-[11px] font-bold text-gray-500 text-center max-w-[200px]">
                                High confidence in credentials and verification
                            </p>
                        </div>

                        {/* Risk Flags */}
                        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm self-start">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 w-full">
                                RISK FLAGS
                            </h3>
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 bg-orange-50 text-orange-700 text-xs font-bold px-4 py-2.5 rounded-lg border border-orange-100">
                                    <AlertTriangle className="w-4 h-4" />
                                    Relocation required (SF based)
                                </div>
                                <div className="flex items-center gap-3 bg-green-50 text-green-700 text-xs font-bold px-4 py-2.5 rounded-lg border border-green-100">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Clearance potential: High
                                </div>
                            </div>
                            <p className="text-xs font-bold text-gray-400 italic">
                                No other major flags found
                            </p>
                        </div>

                        {/* Skill Gap Analysis */}
                        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm self-start">
                            <h3 className="flex items-center gap-2 text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-6">
                                <Code2 className="w-4 h-4 text-blue-600" /> SKILL GAP ANALYSIS
                            </h3>

                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-xs font-bold text-gray-700">
                                        Core Technical Stack Match
                                    </p>
                                    <span className="text-[10px] font-bold text-green-600">
                                        Matched (95%)
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {["REACT.JS", "AWS ARCHITECTURE", "NODE.JS", "TERRAFORM"].map(
                                        (skill) => (
                                            <span
                                                key={skill}
                                                className="px-2 py-1 bg-green-50 text-green-700 text-[9px] font-bold rounded tracking-wider border border-green-100"
                                            >
                                                {skill}
                                            </span>
                                        ),
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-xs font-bold text-gray-700">
                                        Missing/Amber Skills
                                    </p>
                                    <span className="text-[10px] font-bold text-orange-500">
                                        Needs Training
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-orange-50 text-orange-700 text-[9px] font-bold rounded tracking-wider border border-orange-100 flex items-center gap-1">
                                        GO / GOLANG <AlertTriangle className="w-2.5 h-2.5" />
                                    </span>
                                    <span className="px-2 py-1 bg-orange-50 text-orange-700 text-[9px] font-bold rounded tracking-wider border border-orange-100 flex items-center gap-1">
                                        KUBERNETES OPERATORS{" "}
                                        <AlertTriangle className="w-2.5 h-2.5" />
                                    </span>
                                    <span className="px-2 py-1 bg-gray-50 text-gray-500 text-[9px] font-bold rounded tracking-wider border border-gray-200">
                                        PYTHON (OPTIONAL)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
