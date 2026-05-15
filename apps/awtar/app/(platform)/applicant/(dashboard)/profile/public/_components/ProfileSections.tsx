"use client";

import {
    Briefcase,
    Building2,
    Code,
    DollarSign,
    FolderOpen,
    GraduationCap,
    User,
} from "lucide-react";
import type {
    AppUser,
    ResumeEducation,
    ResumeExperience,
    ResumeProject,
} from "@/applicant/user-me/models/app-user";
import { labelForEducation, labelForIndustry, labelForJobType } from "../../schemas/profile.schema";

const cardClass =
    "bg-white rounded-xl p-6 border border-gray-200 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)]";
const sectionTitleClass =
    "flex items-center gap-2 text-sm font-black text-slate-950 tracking-tight mb-5";
const iconTileClass =
    "w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600";

function formatMonthYear(date?: string | null): string {
    if (!date) return "";
    if (date.toLowerCase() === "present") return "Present";
    const [year, month] = date.split("-");
    if (!year) return date;
    if (!month) return year;
    try {
        return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(
            new Date(Number(year), Number(month) - 1),
        );
    } catch {
        return date;
    }
}

function dateRange(start?: string | null, end?: string | null): string {
    const s = formatMonthYear(start);
    const e = formatMonthYear(end);
    if (s && e) return `${s} – ${e}`;
    if (s) return `${s} – Present`;
    return "";
}

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

export function WorkExperience({ user }: { user: AppUser }) {
    const rawEntries: ResumeExperience[] =
        user.candidate_profile?.resume_candidate_data?.experience ?? [];
    const entries = rawEntries.filter((e) => e.title);

    return (
        <div className={cardClass}>
            <h3 className={sectionTitleClass}>
                <span className={iconTileClass}>
                    <Building2 className="w-4 h-4" />
                </span>
                Work Experience
            </h3>
            {entries.length > 0 ? (
                <div className="space-y-4">
                    {entries.map((entry) => (
                        <div
                            key={entry.raw}
                            className="flex gap-4 rounded-xl bg-slate-50/70 p-4 border border-slate-100"
                        >
                            <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                <Briefcase className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-black text-slate-900">{entry.title}</p>
                                {entry.company && (
                                    <p className="text-xs font-semibold text-blue-600 mt-0.5">
                                        {entry.company}
                                    </p>
                                )}
                                {(entry.start_date || entry.end_date) && (
                                    <p className="text-xs font-medium text-slate-400 mt-1">
                                        {dateRange(entry.start_date, entry.end_date)}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex gap-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-5">
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        <Briefcase className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-slate-800">
                            No work experience found.
                        </p>
                        <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                            Upload a resume to extract your experience automatically.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export function TechnicalSkills({ user }: { user: AppUser }) {
    const cp = user.candidate_profile;
    const primarySkills = cp?.primary_skills ?? [];
    const extractedSkills = cp?.extracted_skills ?? [];

    const hasAny = primarySkills.length > 0 || extractedSkills.length > 0;

    return (
        <div className={cardClass}>
            <h3 className={sectionTitleClass}>
                <span className={iconTileClass}>
                    <Code className="w-4 h-4" />
                </span>
                Technical Skills
            </h3>
            {hasAny ? (
                <div className="space-y-5">
                    {primarySkills.length > 0 && (
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                Primary Skills
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {primarySkills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-md"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {extractedSkills.length > 0 && (
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                From Resume
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {extractedSkills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold rounded-md"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-gray-400 text-sm italic">No skills added yet.</p>
            )}
        </div>
    );
}

export function EducationSection({ user }: { user: AppUser }) {
    const level = user.candidate_profile?.education_level;
    const rawEntries: ResumeEducation[] =
        user.candidate_profile?.resume_candidate_data?.education ?? [];
    const entries = rawEntries.filter(
        (e) => (e.degree && e.degree.length < 120) || (e.institution && e.institution.length < 80),
    );

    return (
        <div className={cardClass}>
            <h3 className={sectionTitleClass}>
                <span className={iconTileClass}>
                    <GraduationCap className="w-4 h-4" />
                </span>
                Education
            </h3>
            {entries.length > 0 ? (
                <div className="space-y-3">
                    {entries.map((entry) => (
                        <div
                            key={entry.raw}
                            className="flex gap-4 rounded-xl bg-slate-50/70 p-4 border border-slate-100"
                        >
                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                <GraduationCap className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                {entry.degree && (
                                    <h4 className="text-sm font-black text-slate-950 tracking-tight">
                                        {entry.degree}
                                    </h4>
                                )}
                                {entry.institution && (
                                    <p className="text-xs font-semibold text-blue-600 mt-0.5">
                                        {entry.institution}
                                    </p>
                                )}
                                {(entry.start_date || entry.end_date) && (
                                    <p className="text-xs font-medium text-slate-400 mt-1">
                                        {dateRange(entry.start_date, entry.end_date)}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : level ? (
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

export function ProjectsSection({ user }: { user: AppUser }) {
    const rawProjects: ResumeProject[] =
        user.candidate_profile?.resume_candidate_data?.projects ?? [];

    const datePattern = /^\w{3}\s+\d{4}/;
    const projects = rawProjects.filter(
        (p) =>
            p.name &&
            p.name.length > 5 &&
            p.name.length < 120 &&
            !datePattern.test(p.name) &&
            !p.name.startsWith("•") &&
            p.name.toUpperCase() !== p.name,
    );

    if (projects.length === 0) return null;

    return (
        <div className={cardClass}>
            <h3 className={sectionTitleClass}>
                <span className={iconTileClass}>
                    <FolderOpen className="w-4 h-4" />
                </span>
                Projects
            </h3>
            <div className="space-y-3">
                {projects.map((project) => (
                    <div key={project.raw} className="rounded-xl bg-slate-50/70 p-4 border border-slate-100">
                        <p className="text-sm font-black text-slate-900">{project.name}</p>
                        {project.description && (
                            <p className="mt-1 text-xs font-medium leading-5 text-slate-500 line-clamp-3">
                                {project.description}
                            </p>
                        )}
                    </div>
                ))}
            </div>
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
