"use client";

import { Briefcase, Building2, Code, DollarSign, GraduationCap, User } from "lucide-react";
import type { AppUser } from "@/applicant/user-me/models/app-user";
import { labelForEducation, labelForIndustry, labelForJobType } from "../../schemas/profile.schema";

const cardClass =
    "bg-white rounded-xl p-6 border border-gray-200 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)]";
const sectionTitleClass =
    "flex items-center gap-2 text-sm font-black text-slate-950 tracking-tight mb-5";
const iconTileClass =
    "w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600";

export function ProfessionalSummary({ user }: { user: AppUser }) {
    const cp = user.candidate_profile;
    const jobTitle = cp?.current_job_title;
    const industry = cp?.industry_interest;
    const experience = cp?.years_of_experience;

    return (
        <div className={cardClass}>
            <h3 className={sectionTitleClass}>
                <span className={iconTileClass}>
                    <User className="w-4 h-4" />
                </span>
                Professional Summary
            </h3>
            {jobTitle || industry || experience != null ? (
                <p className="text-slate-600 font-medium leading-7 text-sm">
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
        <div className={cardClass}>
            <h3 className={sectionTitleClass}>
                <span className={iconTileClass}>
                    <Building2 className="w-4 h-4" />
                </span>
                Work Experience
            </h3>
            <div className="flex gap-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-5">
                <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                    <p className="text-sm font-black text-slate-800">
                        Work experience will be available soon.
                    </p>
                    <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                        Add roles, companies, and achievements from the edit profile page.
                    </p>
                </div>
            </div>
        </div>
    );
}

export function TechnicalSkills({ user }: { user: AppUser }) {
    const skills = user.candidate_profile?.primary_skills ?? [];

    return (
        <div className={cardClass}>
            <h3 className={sectionTitleClass}>
                <span className={iconTileClass}>
                    <Code className="w-4 h-4" />
                </span>
                Technical Skills
            </h3>
            {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                        <span
                            key={skill}
                            className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold rounded-md"
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
        <div className={cardClass}>
            <h3 className={sectionTitleClass}>
                <span className={iconTileClass}>
                    <GraduationCap className="w-4 h-4" />
                </span>
                Education
            </h3>
            {level ? (
                <div className="flex gap-4 rounded-xl bg-slate-50/70 p-4 border border-slate-100">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-black text-slate-950 tracking-tight">
                            {labelForEducation(level)}
                        </h4>
                        <p className="mt-1 text-xs font-medium text-slate-500">
                            Highest education level
                        </p>
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
        <div className={cardClass}>
            <h3 className={sectionTitleClass}>
                <span className={iconTileClass}>
                    <Briefcase className="w-4 h-4" />
                </span>
                Job Preferences
            </h3>

            {jobTypes.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        Preferred Job Types
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {jobTypes.map((jt) => (
                            <span
                                key={jt}
                                className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold rounded-md"
                            >
                                {labelForJobType(jt)}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {hasSalary && (
                <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        Salary Expectation
                    </h4>
                    <div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 border border-slate-100">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        {minSalary?.toLocaleString() ?? "-"} - {maxSalary?.toLocaleString() ?? "-"}
                    </div>
                </div>
            )}

            {jobTypes.length === 0 && !hasSalary && (
                <p className="text-gray-400 text-sm italic">No preferences set yet.</p>
            )}
        </div>
    );
}
