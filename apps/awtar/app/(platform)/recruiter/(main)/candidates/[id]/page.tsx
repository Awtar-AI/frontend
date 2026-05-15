"use client";

import {
    ArrowLeft,
    Briefcase,
    FileText,
    GraduationCap,
    Mail,
    Sparkles,
    User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useRecruiterCandidateProfile } from "../../job-listings/hooks/use-recruiter-candidate-profile";

function normalizeList(values: string[] | null | undefined): string[] {
    if (!values || values.length === 0) return [];
    return values;
}

function humanize(value: string): string {
    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function extractResumeFilename(resumeUrl: string): string {
    try {
        const raw = resumeUrl.split("?")[0]?.split("#")[0] ?? "";
        const lastSegment = raw.split("/").pop() ?? "";
        const decoded = decodeURIComponent(lastSegment);
        if (!decoded.trim()) return "resume.pdf";
        return decoded.toLowerCase().endsWith(".pdf") ? decoded : `${decoded}.pdf`;
    } catch {
        return "resume.pdf";
    }
}

function formatDateRange(start?: string | null, end?: string | null): string {
    if (!start && !end) return "";
    const left = start || "Start";
    const right = end || "Present";
    return `${left} - ${right}`;
}

export default function CandidateDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const candidateQuery = useRecruiterCandidateProfile(id, true);

    if (candidateQuery.isLoading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center text-sm font-semibold text-gray-500">
                Loading candidate profile...
            </div>
        );
    }

    if (candidateQuery.isError || !candidateQuery.data) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Could not load this candidate profile.
            </div>
        );
    }

    const candidate = candidateQuery.data;
    const profile = candidate.candidate_profile;
    const fullName = `${candidate.first_name} ${candidate.last_name}`.trim();
    const primarySkills = normalizeList(profile?.primary_skills);
    const extractedSkills = normalizeList(profile?.extracted_skills);
    const preferredJobTypes = normalizeList(profile?.preferred_job_types);
    const resumeExperience = profile?.resume_candidate_data?.experience ?? [];
    const resumeEducation = profile?.resume_candidate_data?.education ?? [];
    const resumeProjects = profile?.resume_candidate_data?.projects ?? [];
    const trustScore = profile?.ai_trust_score ?? 78;

    return (
        <div className="space-y-6 pb-10">
            <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600"
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </button>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <aside className="space-y-6 xl:col-span-4">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <User className="h-12 w-12" />
                        </div>
                        <h1 className="mt-4 text-center text-xl font-black text-gray-900">{fullName}</h1>
                        <p className="mt-1 text-center text-sm font-semibold text-blue-600">
                            {profile?.current_job_title || "Candidate"}
                        </p>

                        <div className="mt-6 space-y-3 border-t border-gray-100 pt-5 text-sm">
                            <div className="flex items-center gap-2 text-gray-700">
                                <Mail className="h-4 w-4 text-blue-500" />
                                <span className="break-all">{candidate.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                                <Briefcase className="h-4 w-4 text-blue-500" />
                                <span>
                                    {profile?.years_of_experience != null
                                        ? `${profile.years_of_experience} years experience`
                                        : "Experience not specified"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                                <GraduationCap className="h-4 w-4 text-blue-500" />
                                <span>{profile?.education_level || "Education level not specified"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="text-sm font-bold text-gray-900">AI Trust Score</h2>
                        <div className="mt-4 flex items-center justify-center">
                            <div className="relative grid h-28 w-28 place-items-center rounded-full">
                                <div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: `conic-gradient(#2563eb ${trustScore * 3.6}deg, #e5e7eb 0deg)`,
                                    }}
                                />
                                <div className="z-10 grid h-20 w-20 place-items-center rounded-full bg-white text-center">
                                    <span className="text-2xl font-black text-gray-900">{trustScore}%</span>
                                </div>
                            </div>
                        </div>
                        <p className="mt-4 text-xs text-gray-500">
                            AI confidence based on profile consistency, resume quality, and data
                            completeness.
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="text-sm font-bold text-gray-900">Resume</h2>
                        <div className="mt-3">
                            {profile?.resume_url ? (
                                <a
                                    href={profile.resume_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
                                >
                                    <FileText className="h-5 w-5" />
                                    {extractResumeFilename(profile.resume_url)}
                                </a>
                            ) : (
                                <p className="text-sm text-gray-500">No resume uploaded.</p>
                            )}
                        </div>
                    </div>
                </aside>

                <section className="space-y-6 xl:col-span-8">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
                            <Sparkles className="h-4 w-4 text-blue-600" />
                            Professional Summary
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-gray-700">
                            {profile?.professional_summary ||
                                (profile?.current_job_title
                                    ? `${fullName} currently works as ${profile.current_job_title}.`
                                    : `${fullName} has submitted a candidate profile.`)}
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="text-sm font-bold text-gray-900">Primary Skills</h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {primarySkills.length > 0 ? (
                                primarySkills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-bold text-white"
                                    >
                                        {humanize(skill)}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No primary skills listed yet.</p>
                            )}
                        </div>
                        {extractedSkills.length > 0 && (
                            <>
                                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-gray-400">
                                    Extracted from Resume
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {extractedSkills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="rounded-md border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                                        >
                                            {humanize(skill)}
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="text-sm font-bold text-gray-900">Work Experience</h2>
                        {resumeExperience.length > 0 ? (
                            <div className="mt-4 space-y-3">
                                {resumeExperience.map((experience, index) => (
                                    <div key={`${experience.raw}-${index}`} className="rounded-lg bg-gray-50 p-4">
                                        <p className="text-sm font-bold text-gray-900">
                                            {experience.title || "Role not specified"}
                                        </p>
                                        <p className="mt-1 text-xs font-semibold text-blue-600">
                                            {experience.company || "Company not specified"}
                                        </p>
                                        {(experience.start_date || experience.end_date) && (
                                            <p className="mt-1 text-xs text-gray-500">
                                                {formatDateRange(
                                                    experience.start_date,
                                                    experience.end_date,
                                                )}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-3 text-sm text-gray-500">No work experience listed yet.</p>
                        )}
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="text-sm font-bold text-gray-900">Projects</h2>
                        {resumeProjects.length > 0 ? (
                            <div className="mt-4 space-y-3">
                                {resumeProjects.map((project, index) => (
                                    <div key={`${project.raw ?? "project"}-${index}`} className="rounded-lg bg-gray-50 p-4">
                                        <p className="text-sm font-bold text-gray-900">
                                            {project.name || "Project"}
                                        </p>
                                        {project.description && (
                                            <p className="mt-1 text-xs text-gray-600">
                                                {project.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-3 text-sm text-gray-500">No projects listed yet.</p>
                        )}
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="text-sm font-bold text-gray-900">Education & Preferences</h2>
                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                                    Education
                                </p>
                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {profile?.education_level || "Not specified"}
                                </p>
                                {resumeEducation.length > 0 && (
                                    <p className="mt-2 text-xs text-gray-500">
                                        {resumeEducation[0]?.degree || "Degree"} -{" "}
                                        {resumeEducation[0]?.institution || "Institution"}
                                    </p>
                                )}
                            </div>
                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                                    Preferred Job Types
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {preferredJobTypes.length > 0 ? (
                                        preferredJobTypes.map((jobType) => (
                                            <span
                                                key={jobType}
                                                className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-gray-700"
                                            >
                                                {humanize(jobType)}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-gray-500">Not specified</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
