import { Building2, Code, EyeOff, GraduationCap, Plus, Search, X } from "lucide-react";

export function ProfessionalExperienceForm() {
    return (
        <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-[18px] font-black text-gray-900 tracking-tight">
                    <Building2 className="w-5 h-5 text-blue-600" /> Professional Experience
                </h3>
                <button
                    type="button"
                    className="text-blue-600 text-sm font-black hover:underline flex items-center gap-1"
                >
                    <Plus className="w-4 h-4" /> Add Role
                </button>
            </div>

            <div className="space-y-8 pl-1 border-l-2 border-blue-50">
                <div className="relative pl-6">
                    {/* Timeline dot */}
                    <div className="absolute left-[-9px] top-1.5 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-50"></div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="space-y-1.5">
                            <label
                                htmlFor="job-title"
                                className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1"
                            >
                                Job Title
                            </label>
                            <input
                                id="job-title"
                                type="text"
                                defaultValue="Senior Product Designer"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label
                                htmlFor="company-name"
                                className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1"
                            >
                                Company
                            </label>
                            <input
                                id="company-name"
                                type="text"
                                defaultValue="TechFlow Dynamics"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label
                            htmlFor="experience-desc"
                            className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1"
                        >
                            Description
                        </label>
                        <textarea
                            id="experience-desc"
                            rows={4}
                            defaultValue="Led the UI/UX redesign of the core dashboard, resulting in a 25% increase in user retention. Managed a team of 4 junior designers."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all resize-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function EducationForm() {
    return (
        <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm space-y-6">
            <h3 className="flex items-center gap-2 text-[18px] font-black text-gray-900 tracking-tight">
                <GraduationCap className="w-5 h-5 text-blue-600" /> Education
            </h3>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label
                        htmlFor="degree"
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1"
                    >
                        Degree
                    </label>
                    <input
                        id="degree"
                        type="text"
                        placeholder="e.g. B.S. Computer Science"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                    />
                </div>
                <div className="space-y-1.5">
                    <label
                        htmlFor="institution"
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1"
                    >
                        Institution
                    </label>
                    <input
                        id="institution"
                        type="text"
                        placeholder="e.g. Stanford University"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                    />
                </div>
            </div>
        </div>
    );
}

export function SkillsForm() {
    const currentSkills = ["Python", "React", "Figma", "UI Design", "AI/ML", "TailwindCSS"];

    return (
        <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm space-y-6">
            <h3 className="flex items-center gap-2 text-[18px] font-black text-gray-900 tracking-tight">
                <Code className="w-5 h-5 text-blue-600" /> Skills & Technologies
            </h3>

            <div className="flex flex-wrap gap-2.5">
                {currentSkills.map((skill) => (
                    <span
                        key={skill}
                        className="px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
                    >
                        {skill} <X className="w-3.5 h-3.5 cursor-pointer hover:text-blue-900" />
                    </span>
                ))}
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    id="add-skills"
                    type="text"
                    placeholder="Add more skills (e.g. JavaScript, AWS, Agile...)"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                />
            </div>
        </div>
    );
}

import Link from "next/link";

export function VisibilityCard() {
    return (
        <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                    <EyeOff className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h4 className="font-black text-gray-900 text-sm">Public Visibility</h4>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                        Your profile is currently hidden from recruiters.
                    </p>
                </div>
            </div>
            <Link href="/applicant/profile/public">
                <button
                    type="button"
                    className="px-6 py-2.5 bg-white border-2 border-gray-100 hover:border-gray-900 text-gray-900 text-sm font-black rounded-xl transition-all"
                >
                    View Public Profile
                </button>
            </Link>
        </div>
    );
}
