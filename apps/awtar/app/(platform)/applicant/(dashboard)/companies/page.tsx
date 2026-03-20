"use client";

import { ArrowRight, Building2, MapPin, Search, Star, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { mockJobs } from "../../lib/mockData";

export default function CompaniesPage() {
    const [searchQuery, setSearchQuery] = useState("");

    // Extract unique companies from mockJobs
    const uniqueCompanies = Array.from(new Set(mockJobs.map((j) => j.company))).map((name) => {
        const job = mockJobs.find((j) => j.company === name);
        return {
            name,
            location: job?.location || "Remote",
            industry: job?.tags[0] || "Technology",
            jobsCount: mockJobs.filter((j) => j.company === name).length,
            id: job?.id || "1", // Using job ID for routing demo
        };
    });

    const filteredCompanies = uniqueCompanies.filter(
        (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.industry.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
                    Discover Companies
                </h1>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Deep dive into company cultures and find your next dream team
                </p>

                <div className="relative max-w-md mx-auto mt-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search companies by name or industry..."
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-[24px] text-sm font-bold shadow-xl shadow-blue-50 focus:border-blue-500 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCompanies.map((company) => (
                    <div
                        key={company.name}
                        className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:translate-y-[-4px] transition-all group"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xl uppercase border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                {company.name.substring(0, 2)}
                            </div>
                            <span className="px-4 py-1.5 bg-gray-50 text-gray-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-gray-100">
                                {company.jobsCount} Open Roles
                            </span>
                        </div>

                        <div className="space-y-1 mb-6">
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors uppercase">
                                {company.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-blue-500" />{" "}
                                    {company.location}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1.5 uppercase">
                                    {company.industry}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-black text-gray-900">4.9</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <Users className="w-4 h-4" /> 2k+ Employees
                            </div>
                        </div>

                        <Link
                            href={`/applicant/companies/${company.id}`}
                            className="w-full py-4 bg-gray-50 hover:bg-gray-900 hover:text-white text-gray-900 text-[10px] font-black rounded-2xl uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                            View Profile <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ))}
            </div>

            {filteredCompanies.length === 0 && (
                <div className="text-center py-20 space-y-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                        <Building2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 uppercase">
                        No companies found
                    </h3>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-tighter">
                        Try searching for something else.
                    </p>
                </div>
            )}
        </div>
    );
}
