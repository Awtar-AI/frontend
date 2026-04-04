"use client";

import {
    MapPin,
    Briefcase,
    ExternalLink,
    CheckCircle2,
    Building2,
    GraduationCap,
    Code2,
    Globe,
    ArrowLeft,
    ShieldCheck,
    BarChart2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const TALENT_DATA: Record<string, {
    id: string;
    name: string;
    avatar: string;
    title: string;
    location: string;
    experience: string;
    openTo: string;
    trustScore: number;
    verified: { identity: boolean; employment: boolean; education: boolean };
    summary: string;
    workExperience: { company: string; role: string; period: string; bullets: string[] }[];
    skills: { category: string; items: string[] }[];
    education: { degree: string; school: string; year: string; note: string }[];
    contact: { email: string; portfolio: string; linkedin: string };
    aiMatch: { role: string; compatibility: number; score: number };
}> = {
    "1": {
        id: "1",
        name: "Alex Rivera",
        avatar: "https://i.pravatar.cc/150?img=3",
        title: "Senior Full Stack Engineer",
        location: "San Francisco, CA",
        experience: "9+ Years Experience",
        openTo: "Open to roles",
        trustScore: 92,
        verified: { identity: true, employment: true, education: true },
        summary: "Passionate Full Stack Engineer with 8+ years of experience building scalable web applications and distributed systems. Expert in React, Node.js, and cloud infrastructure. Proven track record of leading engineering teams and delivering high-impact features in fast-paced startup environments. Focused on clean code, performance optimization, and creating seamless user experiences.",
        workExperience: [
            {
                company: "TechFlow Solutions",
                role: "Senior Software Engineer",
                period: "2020 – Present",
                bullets: [
                    "Architected and migrated legacy monolith to microservices using Node.js and AWS Lambda, reducing latency by 40%.",
                    "Led a team of 8 engineers in developing a real-time collaborative dashboard using WebSockets and React.",
                    "Implemented CI/CD pipelines that reduced deployment time from 2 hours to 15 minutes.",
                ],
            },
            {
                company: "CloudState Inc.",
                role: "Full Stack Developer",
                period: "2017 – 2020",
                bullets: [
                    "Developed responsive web interfaces using Vue.js and integrated with Python/Django backend.",
                    "Optimized database queries in PostgreSQL, leading to a 30% improvement in page load speeds.",
                    "Mentored junior developers and conducted weekly code reviews to maintain high quality standards.",
                ],
            },
        ],
        skills: [
            { category: "Languages & Core", items: ["JavaScript (ES6+)", "TypeScript", "Python", "Go", "SQL"] },
            { category: "Frameworks & Libraries", items: ["React", "Next.js", "Node.js", "Express", "TailwindCSS"] },
            { category: "Tools & DevOps", items: ["Docker", "Kubernetes", "AWS", "Git", "GitHub Actions"] },
            { category: "Design & Others", items: ["Figma", "UI/UX Principles", "AgileScrum"] },
        ],
        education: [
            { degree: "B.S. in Computer Science", school: "Stanford University", year: "Class of 2016, Magna Cum Laude", note: "" },
        ],
        contact: {
            email: "alex.rivera@example.com",
            portfolio: "portfolio.alexrivera.dev",
            linkedin: "/in/alexrivera-tech",
        },
        aiMatch: { role: "Senior Frontend Architect", compatibility: 96, score: 94 },
    },
};

// Fallback for non-seeded IDs
const defaultTalent = TALENT_DATA["1"];

export default function TalentDetailPage() {
    const params = useParams();
    const id = (params?.id as string) ?? "1";
    const talent = TALENT_DATA[id] ?? { ...defaultTalent, id };

    return (
        <div className="space-y-4">
            {/* Back */}
            <Link href="/recruiter/talent" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Talent Pool
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* ── LEFT COLUMN ── */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Profile Header */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-start gap-4">
                            <Image
                                src={talent.avatar}
                                alt={talent.name}
                                width={72}
                                height={72}
                                className="rounded-xl object-cover flex-shrink-0 border border-gray-200"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-xl font-bold text-gray-900">{talent.name}</h1>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded tracking-widest uppercase">
                                        <CheckCircle2 className="w-3 h-3" /> Verified
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 font-medium mt-0.5">{talent.title}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 flex-wrap">
                                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {talent.location}</span>
                                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {talent.experience}</span>
                                    <span className="flex items-center gap-1 text-blue-600 font-semibold cursor-pointer"><ExternalLink className="w-3.5 h-3.5" /> {talent.openTo}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button className="px-4 py-2 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">
                                    Resume
                                </button>
                                <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                                    Invite to Interview
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Professional Summary */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">👤</span> Professional Summary
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed">{talent.summary}</p>
                    </div>

                    {/* Work Experience */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-blue-500" /> Work Experience
                        </h2>
                        <div className="space-y-6">
                            {talent.workExperience.map((exp, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                                            <Building2 className="w-4 h-4 text-blue-500" />
                                        </div>
                                        {i < talent.workExperience.length - 1 && (
                                            <div className="w-px flex-1 bg-gray-100 mt-2" />
                                        )}
                                    </div>
                                    <div className="pb-4 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{exp.role}</p>
                                                <p className="text-xs text-blue-600 font-semibold">{exp.company}</p>
                                            </div>
                                            <span className="text-[11px] font-semibold text-gray-400 whitespace-nowrap">{exp.period}</span>
                                        </div>
                                        <ul className="mt-2 space-y-1">
                                            {exp.bullets.map((b, j) => (
                                                <li key={j} className="text-xs text-gray-600 leading-relaxed flex gap-2">
                                                    <span className="text-gray-300 flex-shrink-0 mt-0.5">•</span>
                                                    {b}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Technical Skills */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Code2 className="w-4 h-4 text-blue-500" /> Technical Skills
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {talent.skills.map((group) => (
                                <div key={group.category}>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{group.category}</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {group.items.map(skill => (
                                            <span key={skill} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-[11px] font-semibold rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Education */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-blue-500" /> Education
                        </h2>
                        {talent.education.map((edu, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0">
                                    <GraduationCap className="w-4 h-4 text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{edu.degree}</p>
                                    <p className="text-xs text-blue-600 font-semibold">{edu.school}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{edu.year}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="space-y-5">
                    {/* Trust Score */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-gray-900">Trust Score</h3>
                            <ShieldCheck className="w-4 h-4 text-gray-400" />
                        </div>
                        {/* Circle Score */}
                        <div className="flex items-center justify-center mb-4">
                            <div className="relative w-24 h-24">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                                    <circle
                                        cx="18" cy="18" r="15.915" fill="none"
                                        stroke="#2563eb" strokeWidth="3"
                                        strokeDasharray={`${talent.trustScore} ${100 - talent.trustScore}`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-black text-gray-900">{talent.trustScore}%</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-[11px] text-center text-gray-500 mb-3">Candidate's background, identity, and employment history have been officially verified.</p>
                        <div className="space-y-2">
                            {[
                                { label: "Identity", passed: talent.verified.identity },
                                { label: "Employment", passed: talent.verified.employment },
                                { label: "Education", passed: talent.verified.education },
                            ].map(item => (
                                <div key={item.label} className="flex items-center justify-between text-xs font-semibold">
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                        <span className="text-gray-700">{item.label}</span>
                                    </div>
                                    <span className="text-green-600">Passed</span>
                                </div>
                            ))}
                        </div>
                        <Link href={`/recruiter/talent/${talent.id}/trust-score`} className="mt-4 w-full flex items-center justify-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 border border-blue-100 bg-blue-50 rounded-lg py-2 transition-colors">
                            <ShieldCheck className="w-3.5 h-3.5" /> View Full Trust Report
                        </Link>
                    </div>

                    {/* AI Match */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                        <h3 className="text-xs font-bold text-blue-700 mb-1">✦ AI Match Analysis</h3>
                        <p className="text-xs text-blue-600 mb-3 leading-snug">
                            Highly compatible with the <strong>Senior Frontend Architect</strong> role. Exhibits strong leadership potential and exceptional expertise in modern JS frameworks. Cultural fit score: 96%.
                        </p>
                        <div className="space-y-2">
                            {[
                                { label: "Role Compatibility", value: talent.aiMatch.compatibility },
                                { label: "Technical Depth", value: talent.aiMatch.score },
                            ].map(item => (
                                <div key={item.label}>
                                    <div className="flex justify-between text-[11px] font-semibold mb-1">
                                        <span className="text-blue-800">{item.label}</span>
                                        <span className="text-blue-700">{item.value}%</span>
                                    </div>
                                    <div className="w-full bg-blue-200 rounded-full h-1.5">
                                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${item.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link href={`/recruiter/talent/${talent.id}/xai-analysis`} className="mt-4 w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 underline">
                            <BarChart2 className="w-3.5 h-3.5" /> View Detailed AI Report
                        </Link>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                        <h3 className="text-sm font-bold text-gray-900 mb-3">Contact Info</h3>
                        <div className="space-y-2.5 text-xs">
                            <div className="flex items-start gap-2">
                                <span className="text-gray-400 font-semibold w-16 flex-shrink-0">EMAIL</span>
                                <a href={`mailto:${talent.contact.email}`} className="text-blue-600 font-semibold hover:underline break-all">{talent.contact.email}</a>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-gray-400 font-semibold w-16 flex-shrink-0">PORTFOLIO</span>
                                <a href="#" className="text-blue-600 font-semibold hover:underline break-all">{talent.contact.portfolio}</a>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-gray-400 font-semibold w-16 flex-shrink-0">LINKEDIN</span>
                                <a href="#" className="text-blue-600 font-semibold hover:underline break-all">{talent.contact.linkedin}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
