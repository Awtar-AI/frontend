"use client";

import { Briefcase, Building2, Code, DollarSign, GraduationCap, User } from "lucide-react";
import type { AppUser } from "@/applicant/user-me/models/app-user";
import { labelForEducation, labelForIndustry, labelForJobType } from "../../schemas/profile.schema";

export function ProfessionalSummary({ user }: { user: AppUser }) {
    const cp = user.candidate_profile;
    const jobTitle = cp?.current_job_title;
    const industry = cp?.industry_interest;
    const experience = cp?.years_of_experience;

    return (
        <div className="bg-white rounded-[24px] p-8 lg:p-10 border border-gray-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)]">
            <h3 className="flex items-center gap-2 text-[18px] font-black text-gray-900 tracking-tight mb-5">
                <User className="w-5 h-5 text-blue-600" /> About
            </h3>
            {jobTitle || industry || experience != null ? (
                <p className="text-gray-600 font-medium leading-relaxed text-sm">
                    {jobTitle && (
                        <>
                            Currently working as a{" "}
                            <span className="font-bold text-gray-900">{jobTitle}</span>
                        </>
                    )}
                    {experience != null && (
                        <>
                            {jobTitle ? " with " : ""}
                            <span className="font-bold text-gray-900">
                                {experience} {experience === 1 ? "year" : "years"}
                            </span>{" "}
                            of experience
                        </>
                    )}
                    {industry && (
                        <>
                            {" "}
                            in the{" "}
                            <span className="font-bold text-gray-900">
                                {labelForIndustry(industry)}
                            </span>{" "}
                            industry
                        </>
                    )}
                    .
                </p>
            ) : (
                <p className="text-gray-400 text-sm italic">No professional summary yet.</p>
            )}
        </div>
    );
}

export function WorkExperience() {
    return (
        <div className="bg-white rounded-[24px] p-8 lg:p-10 border border-gray-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)]">
            <h3 className="flex items-center gap-2 text-[18px] font-black text-gray-900 tracking-tight mb-6">
                <Building2 className="w-5 h-5 text-blue-600" /> Work Experience
            </h3>
            <p className="text-gray-400 text-sm italic">Work experience will be available soon.</p>
        </div>
    );
}

export function TechnicalSkills({ user }: { user: AppUser }) {
    const skills = user.candidate_profile?.primary_skills ?? [];

    return (
        <div className="bg-white rounded-[24px] p-8 lg:p-10 border border-gray-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)]">
            <h3 className="flex items-center gap-2 text-[18px] font-black text-gray-900 tracking-tight mb-8">
                <Code className="w-5 h-5 text-blue-600" /> Skills
            </h3>
            {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                    {skills.map((skill) => (
                        <span
                            key={skill}
                            className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-[10px] shadow-sm"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 text-sm italic">No skills added yet.</p>
            )}
        </div>
    );
}

export function EducationSection({ user }: { user: AppUser }) {
    const level = user.candidate_profile?.education_level;

    return (
        <div className="bg-white rounded-[24px] p-8 lg:p-10 border border-gray-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)]">
            <h3 className="flex items-center gap-2 text-[18px] font-black text-gray-900 tracking-tight mb-6">
                <GraduationCap className="w-5 h-5 text-blue-600" /> Education
            </h3>
            {level ? (
                <div className="flex gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1 pt-1">
                        <h4 className="text-lg font-black text-gray-900 tracking-tight">
                            {labelForEducation(level)}
                        </h4>
                    </div>
                </div>
            ) : (
                <p className="text-gray-400 text-sm italic">No education info added yet.</p>
            )}
        </div>
    );
}

export function JobPreferences({ user }: { user: AppUser }) {
    const cp = user.candidate_profile;
    const jobTypes = cp?.preferred_job_types ?? [];
    const minSalary = cp?.desired_annual_salary_min;
    const maxSalary = cp?.desired_annual_salary_max;

    const hasSalary = minSalary != null || maxSalary != null;

    return (
        <div className="bg-white rounded-[24px] p-8 lg:p-10 border border-gray-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)]">
            <h3 className="flex items-center gap-2 text-[18px] font-black text-gray-900 tracking-tight mb-6">
                <Briefcase className="w-5 h-5 text-blue-600" /> Job Preferences
            </h3>

            {jobTypes.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                        Preferred Job Types
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {jobTypes.map((jt) => (
                            <span
                                key={jt}
                                className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold rounded-lg"
                            >
                                {labelForJobType(jt)}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {hasSalary && (
                <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                        Salary Expectation
                    </h4>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        {minSalary?.toLocaleString() ?? "—"} – {maxSalary?.toLocaleString() ?? "—"}
                    </div>
                </div>
            )}

            {jobTypes.length === 0 && !hasSalary && (
                <p className="text-gray-400 text-sm italic">No preferences set yet.</p>
            )}
        </div>
    );
}
