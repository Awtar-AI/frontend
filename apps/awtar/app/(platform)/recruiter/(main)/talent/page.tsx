"use client";

import {
    ChevronLeft,
    ChevronRight,
    DollarSign,
    Loader2,
    MapPin,
    Search,
    Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { RecruiterPageBanner } from "../_components/RecruiterPageBanner";
import { useTalentPool } from "./hooks/use-talent-pool";

const ITEMS_PER_PAGE = 8;

function candidateName(candidate: { first_name: string; last_name: string }): string {
    return `${candidate.first_name} ${candidate.last_name}`.trim();
}

function normalizeSkill(skill: string): string {
    return skill.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function initials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function averageSalary(min?: number, max?: number): string {
    if (min != null && max != null) {
        return `$${Math.round((min + max) / 2).toLocaleString()}/yr`;
    }
    if (min != null) return `$${Math.round(min).toLocaleString()}/yr`;
    if (max != null) return `$${Math.round(max).toLocaleString()}/yr`;
    return "Salary not set";
}

function workPreference(location?: string): string {
    const value = location?.trim().toLowerCase();
    if (!value) return "Flexible";
    if (value.includes("remote")) return "Remote";
    return "Onsite";
}

export default function TalentListPage() {
    const talentQuery = useTalentPool();
    const [search, setSearch] = useState("");
    const [industryFilter, setIndustryFilter] = useState("all");
    const [experienceFilter, setExperienceFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const candidates = talentQuery.data?.users ?? [];

    const industries = useMemo(() => {
        const values = new Set<string>();
        for (const candidate of candidates) {
            const industry = candidate.candidate_profile?.industry_interest?.trim();
            if (industry) values.add(industry);
        }
        return ["all", ...Array.from(values).sort((a, b) => a.localeCompare(b))];
    }, [candidates]);

    const filteredCandidates = useMemo(() => {
        const query = search.trim().toLowerCase();
        return candidates.filter((candidate) => {
            const profile = candidate.candidate_profile;
            const fullName = candidateName(candidate).toLowerCase();
            const title = (profile?.current_job_title ?? "").toLowerCase();
            const industry = (profile?.industry_interest ?? "").toLowerCase();
            const skills = profile?.primary_skills ?? [];

            const matchesSearch =
                query.length === 0 ||
                fullName.includes(query) ||
                candidate.email.toLowerCase().includes(query) ||
                title.includes(query) ||
                skills.some((skill) => skill.toLowerCase().includes(query));

            const matchesIndustry =
                industryFilter === "all" ||
                (profile?.industry_interest ?? "").toLowerCase() === industryFilter.toLowerCase();

            const experience = profile?.years_of_experience ?? 0;
            const matchesExperience =
                experienceFilter === "all" ||
                (experienceFilter === "junior" && experience < 3) ||
                (experienceFilter === "mid" && experience >= 3 && experience < 7) ||
                (experienceFilter === "senior" && experience >= 7);

            return matchesSearch && matchesIndustry && matchesExperience;
        });
    }, [candidates, experienceFilter, industryFilter, search]);

    const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageCandidates = filteredCandidates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const shouldShowEmpty = !talentQuery.isLoading && !talentQuery.isError && pageCandidates.length === 0;

    return (
        <div className="space-y-6 pb-8">
            <RecruiterPageBanner
                title="Explore Talent"
                description="Browse registered applicants across the platform and open detailed profiles."
                metricLabel="Candidate pool"
                metricValue={talentQuery.isLoading ? "Loading..." : `${filteredCandidates.length}`}
                Icon={Sparkles}
            />

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                    <label className="relative md:col-span-2">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search by name, email, title, or skill..."
                            className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-4 text-sm font-medium text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </label>

                    <select
                        value={industryFilter}
                        onChange={(event) => {
                            setIndustryFilter(event.target.value);
                            setCurrentPage(1);
                        }}
                        className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 outline-none focus:border-blue-500"
                    >
                        {industries.map((industry) => (
                            <option key={industry} value={industry}>
                                {industry === "all" ? "All industries" : industry}
                            </option>
                        ))}
                    </select>

                    <select
                        value={experienceFilter}
                        onChange={(event) => {
                            setExperienceFilter(event.target.value);
                            setCurrentPage(1);
                        }}
                        className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 outline-none focus:border-blue-500"
                    >
                        <option value="all">All experience levels</option>
                        <option value="junior">Junior (0-2 years)</option>
                        <option value="mid">Mid (3-6 years)</option>
                        <option value="senior">Senior (7+ years)</option>
                    </select>
                </div>
            </div>

            {talentQuery.isLoading ? (
                <div className="rounded-xl border border-gray-200 bg-white p-14 text-center text-gray-500">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        Loading candidate pool...
                    </div>
                </div>
            ) : talentQuery.isError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    We could not load the talent pool right now.
                </div>
            ) : shouldShowEmpty ? (
                <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50/40 p-10 text-center">
                    <Sparkles className="mx-auto h-7 w-7 text-blue-600" />
                    <h2 className="mt-3 text-base font-bold text-gray-900">No candidates found</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Try another search term or clear filters to see more applicants.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {pageCandidates.map((candidate) => {
                            const profile = candidate.candidate_profile;
                            const skills = profile?.primary_skills ?? [];
                            const summary =
                                profile?.professional_summary ||
                                (profile?.current_job_title
                                    ? `${profile.current_job_title} with ${profile?.years_of_experience ?? 0} years of experience.`
                                    : "Professional summary not added yet.");
                            const salaryLabel = averageSalary(
                                profile?.desired_annual_salary_min,
                                profile?.desired_annual_salary_max,
                            );
                            const workType = workPreference(profile?.location);
                            return (
                                <div
                                    key={candidate.id}
                                    className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <div className="flex items-start gap-3">
                                        {profile?.profile_pic_url ? (
                                            <Image
                                                src={profile.profile_pic_url}
                                                alt={candidateName(candidate)}
                                                width={44}
                                                height={44}
                                                className="h-11 w-11 shrink-0 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-black text-blue-600">
                                                {initials(candidate.first_name, candidate.last_name)}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <Link
                                                href={`/recruiter/candidates/${candidate.id}`}
                                                className="text-sm font-bold text-gray-900 transition-colors hover:text-blue-600"
                                            >
                                                {candidateName(candidate)}
                                            </Link>
                                            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[13px] font-semibold text-gray-600">
                                                <span>{profile?.current_job_title || "Applicant"}</span>
                                                <span className="text-gray-300">|</span>
                                                <span className="inline-flex items-center gap-1">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    {workType}
                                                </span>
                                                <span className="text-gray-300">|</span>
                                                <span className="inline-flex items-center gap-1 text-gray-800">
                                                    <DollarSign className="h-3.5 w-3.5 text-gray-500" />
                                                    {salaryLabel}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-xs leading-relaxed text-gray-600 line-clamp-2">
                                        {summary}
                                    </p>

                                    {skills.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {skills.slice(0, 6).map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-700"
                                                >
                                                    {normalizeSkill(skill)}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs font-medium text-gray-400">
                                            No skills listed yet.
                                        </p>
                                    )}

                                    <div className="pt-1">
                                        <Link
                                            href={`/recruiter/candidates/${candidate.id}`}
                                            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700"
                                        >
                                            View profile
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-1 py-2">
                            <button
                                type="button"
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 disabled:opacity-40"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => setCurrentPage(page)}
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                                        page === currentPage
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 disabled:opacity-40"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
