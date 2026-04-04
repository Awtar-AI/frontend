"use client";

import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Bookmark,
    MessageSquare,
    MapPin,
    Briefcase,
    DollarSign,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const TALENTS = [
    {
        id: "1",
        name: "Samantha K. Brown",
        avatar: "https://i.pravatar.cc/100?img=1",
        title: "UI/UX Designer",
        workType: "Remote",
        rate: "$45/hr",
        summary: "Senior Software Engineer with 10 years experience in AI and Machine Learning",
        skills: ["Figma", "User Research", "Wireframing", "Prototyping"],
        saved: false,
    },
    {
        id: "2",
        name: "James T. Lee",
        avatar: "https://i.pravatar.cc/100?img=11",
        title: "Product Designer",
        workType: "Onsite",
        rate: "$50/hr",
        summary: "Creative Product Designer with a focus on mobile applications and user-centric design.",
        skills: ["Sketch", "Interaction Design", "Concept Development", "Visual Design"],
        saved: false,
    },
    {
        id: "3",
        name: "Olivia H. Carter",
        avatar: "https://i.pravatar.cc/100?img=5",
        title: "Web Developer",
        workType: "Remote",
        rate: "$55/hr",
        summary: "Front-end developer with expertise in React and responsive design",
        skills: ["HTML/CSS", "JavaScript", "Frameworks", "User Interfaces"],
        saved: false,
    },
    {
        id: "4",
        name: "David R. Johnson",
        avatar: "https://i.pravatar.cc/100?img=12",
        title: "Product Designer",
        workType: "Remote",
        rate: "$48/hr",
        summary: "Versatile designer skilled in user experience and interaction design",
        skills: ["Figma", "Wireframing", "User Testing", "Visual Prototyping"],
        saved: false,
    },
    {
        id: "5",
        name: "Sophia L. Zhang",
        avatar: "https://i.pravatar.cc/100?img=9",
        title: "Content Strategist",
        workType: "Freelance",
        rate: "$42/hr",
        summary: "Creative content strategist focusing on customer engagement and SEO",
        skills: ["ContentFul", "SEO", "Copywriting", "Editorial Planning"],
        saved: false,
    },
    {
        id: "6",
        name: "Liam A. Wilson",
        avatar: "https://i.pravatar.cc/100?img=15",
        title: "UX Researcher",
        workType: "Remote",
        rate: "$50/hr",
        summary: "UX researcher with a strong background in usability testing and analytics",
        skills: ["UserTesting", "Data Analysis", "Survey Design", "Persona Development"],
        saved: false,
    },
    {
        id: "7",
        name: "Ava M. Johnson",
        avatar: "https://i.pravatar.cc/100?img=33",
        title: "Visual Designer",
        workType: "Onsite",
        rate: "$52/hr",
        summary: "Visual designer specializing in branding and interactive experiences",
        skills: ["Adobe XD", "UI Design", "Graphic Arts", "Animation"],
        saved: false,
    },
    {
        id: "8",
        name: "Ethan C. Moore",
        avatar: "https://i.pravatar.cc/100?img=51",
        title: "Service Designer",
        workType: "Remote",
        rate: "$57/hr",
        summary: "Service designer focused on improving customer experiences across various touchpoints.",
        skills: ["Miro", "Journey Mapping", "Stakeholder Workshops", "Prototyping"],
        saved: false,
    },
    {
        id: "9",
        name: "Mia J. Taylor",
        avatar: "https://i.pravatar.cc/100?img=60",
        title: "Interaction Designer",
        workType: "Remote",
        rate: "$54/hr",
        summary: "Innovative interaction designer with expertise in user flow optimization and accessibility.",
        skills: ["InVision", "User Flows", "Accessibility Testing", "Visual Storytelling"],
        saved: false,
    },
    {
        id: "10",
        name: "Noah V. Smith",
        avatar: "https://i.pravatar.cc/100?img=68",
        title: "Graphic Designer",
        workType: "Freelance",
        rate: "$46/hr",
        summary: "Graphic designer known for creating eye-catching visuals and brand identities",
        skills: ["Canva", "Branding", "Print Design", "Digital Illustration"],
        saved: false,
    },
];

const ITEMS_PER_PAGE = 6;

export default function TalentListPage() {
    const [talents, setTalents] = useState(TALENTS);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(talents.length / ITEMS_PER_PAGE);
    const currentTalents = talents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const toggleSave = (id: string) => {
        setTalents(talents.map(t => t.id === id ? { ...t, saved: !t.saved } : t));
    };

    const filters = ["Location", "Industry", "Experience", "Skills", "Rate", "Availability"];

    return (
        <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                    {filters.map(f => (
                        <button key={f} className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors bg-white shadow-sm">
                            {f} <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                    ))}
                </div>
                <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">100+ Talents</span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {currentTalents.map(talent => (
                    <div key={talent.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col gap-3">
                        {/* Top */}
                        <div className="flex items-start gap-3">
                            <Link href={`/recruiter/talent/${talent.id}`}>
                                <Image
                                    src={talent.avatar}
                                    alt={talent.name}
                                    width={44}
                                    height={44}
                                    className="rounded-full object-cover flex-shrink-0 hover:ring-2 ring-blue-200 transition-all"
                                />
                            </Link>
                            <div className="min-w-0">
                                <Link href={`/recruiter/talent/${talent.id}`} className="font-bold text-sm text-gray-900 hover:text-blue-600 transition-colors leading-tight">
                                    {talent.name}
                                </Link>
                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                    <span className="text-xs text-gray-500 font-medium">{talent.title}</span>
                                    <span className="text-gray-300">|</span>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                                        <MapPin className="w-3 h-3" />
                                        {talent.workType}
                                    </div>
                                    <span className="text-gray-300">|</span>
                                    <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
                                        <DollarSign className="w-3 h-3 text-gray-400" />
                                        {talent.rate}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{talent.summary}</p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2">
                            {talent.skills.map(skill => (
                                <span key={skill} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[11px] font-semibold rounded-full">
                                    {skill}
                                </span>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-1">
                            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                                <MessageSquare className="w-3.5 h-3.5" /> Message
                            </button>
                            <button
                                onClick={() => toggleSave(talent.id)}
                                className={`flex items-center gap-2 border text-xs font-bold px-4 py-2 rounded-lg transition-colors ${
                                    talent.saved
                                        ? "border-blue-300 text-blue-600 bg-blue-50 hover:bg-blue-100"
                                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <Bookmark className={`w-3.5 h-3.5 ${talent.saved ? "fill-blue-600" : ""}`} />
                                {talent.saved ? "Saved" : "Save"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-1 py-2">
                <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-40"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                            p === currentPage ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        {p}
                    </button>
                ))}
                <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-40"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
