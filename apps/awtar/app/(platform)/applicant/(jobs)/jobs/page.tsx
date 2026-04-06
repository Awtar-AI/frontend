"use client";

import {
    ArrowRight,
    Bookmark,
    CheckCircle2,
    ChevronDown,
    MapPin,
    Search,
    Star,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { mockJobs } from "../../lib/mockData";
import type { JobPost } from "../../types";

export default function JobsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    const JOBS_PER_PAGE = 3;

    const filteredJobs = mockJobs.filter((job) => {
        const matchesSearch =
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategories.length === 0 || selectedCategories.includes(job.tags[0]); // Mock category logic
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(job.type);

        return matchesSearch && matchesCategory && matchesType;
    });

    const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
    const displayedJobs = filteredJobs.slice(
        (currentPage - 1) * JOBS_PER_PAGE,
        currentPage * JOBS_PER_PAGE,
    );

    const toggleCategory = (cat: string) => {
        setSelectedCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
        );
        setCurrentPage(1);
    };

    const toggleType = (type: string) => {
        setSelectedTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
        );
        setCurrentPage(1);
    };

    return (
        <div className="p-8 lg:p-10 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
            {/* Top Illustration Banner */}
            <div className="bg-[#EBF1FA] rounded-[32px] overflow-hidden flex items-center justify-center p-12 relative min-h-[300px]">
                <div className="relative w-full max-w-2xl h-64">
                    {/* Placeholder for the illustration in screenshot 1 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-[500px] h-[250px] bg-white rounded-2xl shadow-xl flex items-center justify-center border-b-8 border-blue-500 overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-100"></div>
                            <div className="flex gap-4 items-center">
                                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <Search className="w-8 h-8" />
                                </div>
                                <div className="space-y-2">
                                    <div className="w-32 h-3 bg-gray-100 rounded-full"></div>
                                    <div className="w-24 h-2 bg-gray-50 rounded-full"></div>
                                </div>
                            </div>
                            {/* Abstract shapes to mimic the illustration */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-blue-50 opacity-50"></div>
                            <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-blue-100 opacity-30"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Left Sidebar: Filters */}
                <div className="xl:col-span-3 space-y-8">
                    <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-8">
                        {/* Search by Title */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-black text-gray-900 tracking-tight">
                                Search by Job Title
                            </h4>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    placeholder="Job title or company"
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-black text-gray-900 tracking-tight">
                                Location
                            </h4>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 appearance-none focus:bg-white focus:border-blue-500 outline-none transition-all cursor-pointer">
                                    <option>Choose city</option>
                                    <option>Addis Ababa</option>
                                    <option>Remote</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-gray-900 tracking-tight">
                                Category
                            </h4>
                            <div className="space-y-2.5">
                                {["marketing", "design", "engineering", "management"].map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => toggleCategory(cat)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                toggleCategory(cat);
                                            }
                                        }}
                                        className="w-full flex items-center justify-between group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-4 h-4 rounded border-2 transition-colors ${
                                                    selectedCategories.includes(cat)
                                                        ? "bg-blue-600 border-blue-600"
                                                        : "border-gray-200 group-hover:border-blue-500"
                                                }`}
                                            >
                                                {selectedCategories.includes(cat) && (
                                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                                )}
                                            </div>
                                            <span
                                                className={`text-xs font-bold transition-colors uppercase ${
                                                    selectedCategories.includes(cat)
                                                        ? "text-blue-600"
                                                        : "text-gray-600 group-hover:text-gray-900"
                                                }`}
                                            >
                                                {cat}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400">
                                            10
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                className="w-full py-2 bg-blue-600 text-white text-xs font-black rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                Show More
                            </button>
                        </div>

                        {/* Job Type */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-gray-900 tracking-tight">
                                Job Type
                            </h4>
                            <div className="space-y-2.5">
                                {["Full-time", "Part-time", "Freelance"].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => toggleType(type)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                toggleType(type);
                                            }
                                        }}
                                        className="w-full flex items-center justify-between group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-4 h-4 rounded border-2 transition-colors ${
                                                    selectedTypes.includes(type)
                                                        ? "bg-blue-600 border-blue-600"
                                                        : "border-gray-200 group-hover:border-blue-500"
                                                }`}
                                            >
                                                {selectedTypes.includes(type) && (
                                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                                )}
                                            </div>
                                            <span
                                                className={`text-xs font-bold transition-colors ${
                                                    selectedTypes.includes(type)
                                                        ? "text-blue-600"
                                                        : "text-gray-600 group-hover:text-gray-900"
                                                }`}
                                            >
                                                {type}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400">
                                            10
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Experience Level */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-gray-900 tracking-tight">
                                Experience Level
                            </h4>
                            <div className="space-y-2.5">
                                {["Fresher", "Intermediate", "Senior"].map((lvl) => (
                                    <label
                                        key={lvl}
                                        className="flex items-center justify-between group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" className="sr-only" />
                                            <div className="w-4 h-4 rounded border-2 border-gray-200 group-hover:border-blue-500 transition-colors"></div>
                                            <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900">
                                                {lvl}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400">
                                            10
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Salary Range */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-gray-900 tracking-tight">
                                Salary
                            </h4>
                            <div className="px-2">
                                <div className="h-1 bg-blue-100 rounded-full relative">
                                    <div className="absolute inset-0 right-1/4 bg-blue-600 rounded-full"></div>
                                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full cursor-pointer shadow-md"></div>
                                    <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full cursor-pointer shadow-md"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-gray-900">
                                    Salary: $0 - $9999
                                </span>
                                <button
                                    type="button"
                                    className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black rounded-md"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-4 pb-4">
                            <h4 className="text-sm font-black text-gray-900 tracking-tight">
                                Tags
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    "engineering",
                                    "design",
                                    "ui/ux",
                                    "marketing",
                                    "management",
                                    "soft",
                                ].map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => toggleCategory(tag)}
                                        className={`px-3 py-1.5 text-[10px] font-black rounded-lg cursor-pointer transition-all ${
                                            selectedCategories.includes(tag)
                                                ? "bg-blue-600 text-white shadow-md"
                                                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Listing */}
                <div className="xl:col-span-9 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <p className="text-sm font-bold text-gray-500 tracking-tight">
                            Showing {(currentPage - 1) * JOBS_PER_PAGE + 1}-
                            {Math.min(currentPage * JOBS_PER_PAGE, filteredJobs.length)} of{" "}
                            {filteredJobs.length} results
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-400">Sort by latest</span>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>

                    <div className="space-y-6 min-h-[600px]">
                        {displayedJobs.length > 0 ? (
                            displayedJobs.map((job: JobPost) => (
                                <div
                                    key={job.id}
                                    className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all group relative animate-in fade-in slide-in-from-bottom-2 duration-300"
                                >
                                    {/* Match Badge */}
                                    <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 bg-[#D1FAE5] text-[#065F46] text-[10px] font-black px-4 py-1 rounded-full shadow-sm border border-white">
                                        {job.matchScore}% match
                                    </div>

                                    <div className="flex items-start justify-between mb-4">
                                        <div className="space-y-2">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md">
                                                {job.datePosted}
                                            </span>
                                            <Link href={`/applicant/jobs/${job.id}`}>
                                                <h3 className="text-xl font-black text-gray-900 tracking-tight hover:text-blue-600 transition-colors uppercase">
                                                    {job.title}
                                                </h3>
                                            </Link>
                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-gray-400">
                                                <span className="flex items-center gap-1.5">
                                                    {job.salary}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    3 months
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    {job.type}
                                                </span>
                                                <span className="flex items-center gap-1.5 uppercase">
                                                    {job.level}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                                            >
                                                <Bookmark className="w-5 h-5 text-gray-400" />
                                            </button>
                                            <Link
                                                href={`/applicant/apply/${job.id}`}
                                                className="px-8 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-black rounded-xl transition-all shadow-lg flex items-center gap-2"
                                            >
                                                Apply <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6 line-clamp-2">
                                        Looking for a creative UI/UX Designer to enhance user
                                        experience for our mobile application. Must possess strong
                                        design skills and experience with prototyping tools.
                                    </p>

                                    <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                                        <div className="flex items-center gap-2">
                                            {job.tags.slice(0, 4).map((tag: string) => (
                                                <span
                                                    key={tag}
                                                    className="px-4 py-1.5 bg-gray-100 text-gray-600 text-[11px] font-black rounded-full uppercase tracking-wider"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1">
                                                <span className="text-[13px] font-black text-gray-900">
                                                    4.8
                                                </span>
                                                <div className="flex items-center">
                                                    {[1, 2, 3, 4, 5].map((starIdx) => (
                                                        <Star
                                                            key={starIdx}
                                                            className={`w-3.5 h-3.5 ${starIdx <= 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                                                <MapPin className="w-4 h-4" />
                                                {job.location}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-[32px] p-20 flex flex-col items-center justify-center text-center space-y-4 border border-gray-100 border-dashed">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                    <Search className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900">No jobs found</h3>
                                <p className="text-sm text-gray-400 font-medium max-w-xs">
                                    We couldn&apos;t find any jobs matching your current filters. Try
                                    adjusting your search.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedCategories([]);
                                        setSelectedTypes([]);
                                    }}
                                    className="px-6 py-2 bg-blue-600 text-white text-xs font-black rounded-xl shadow-md hover:bg-blue-700 transition-all"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-10 pb-4">
                            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                                (pageNumber) => (
                                    <button
                                        key={`page-${pageNumber}`}
                                        type="button"
                                        onClick={() => setCurrentPage(pageNumber)}
                                        className={`w-10 h-10 rounded-full text-sm font-black transition-all ${pageNumber === currentPage ? "bg-blue-600 text-white shadow-lg scale-110" : "hover:bg-gray-100 text-gray-500"}`}
                                    >
                                        {pageNumber}
                                    </button>
                                ),
                            )}
                            <button
                                type="button"
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                }
                                className={`w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all ${currentPage === totalPages ? "text-gray-200 cursor-not-allowed" : "text-gray-500 hover:scale-110"}`}
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
