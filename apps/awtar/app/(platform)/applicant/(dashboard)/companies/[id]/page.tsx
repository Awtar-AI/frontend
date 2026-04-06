"use client";

import { ArrowRight, Calendar, ExternalLink, Globe, MapPin, Star, Users } from "lucide-react";
import Link from "next/link";
import { mockJobs } from "../../../lib/mockData";

export default function CompanyProfilePage({ params }: { params: { id: string } }) {
    // Mock company data (finding by company name in mockJobs for demo)
    const job = mockJobs.find((j) => j.id === params.id) || mockJobs[0];
    const companyName = job.company;

    return (
        <div className="animate-in fade-in duration-700 pb-20">
            {/* Cover Backdrop */}
            <div className="h-64 lg:h-80 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-blue-900/10"></div>
                {/* Floating abstract circles */}
                <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-50px] left-20 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl"></div>
            </div>

            <div className="max-w-6xl mx-auto px-6 lg:px-8 -mt-20 relative z-10">
                <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-2xl border border-gray-100">
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Logo Container */}
                        <div className="w-40 h-40 rounded-[32px] bg-white border-8 border-white shadow-xl flex items-center justify-center -mt-20 lg:-mt-24 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gray-50 flex items-center justify-center text-4xl font-black text-blue-600 transition-transform group-hover:scale-110 duration-500 uppercase">
                                {companyName.substring(0, 2)}
                            </div>
                        </div>

                        <div className="flex-1 space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-4">
                                        <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
                                            {companyName}
                                        </h1>
                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-100 flex items-center gap-1.5">
                                            <Star className="w-3 h-3 fill-blue-600" /> Top Employer
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-gray-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-blue-500" />{" "}
                                            {companyName.toLowerCase()}.co
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-blue-500" />{" "}
                                            {job.location}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-blue-500" /> 2,500+
                                            Employees
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="px-10 py-4 bg-blue-600 text-white text-sm font-black rounded-[20px] shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-3"
                                >
                                    Visit Website <ExternalLink className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: "Industry", val: "Technology", icon: Globe },
                                    { label: "Founded", val: "2015", icon: Calendar },
                                    { label: "Headquarters", val: job.location, icon: MapPin },
                                    {
                                        label: "Socials",
                                        val: "LinkedIn, Twitter",
                                        icon: ExternalLink,
                                    },
                                ].map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="bg-gray-50 p-4 rounded-2xl border border-gray-100 transition-colors hover:bg-white hover:border-blue-100 group"
                                    >
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                            {stat.label}
                                        </p>
                                        <p className="text-xs font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase">
                                            {stat.val}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
                        <div className="lg:col-span-2 space-y-12">
                            <section className="space-y-6">
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                                    <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                                    About {companyName}
                                </h2>
                                <div className="space-y-4 text-gray-500 leading-relaxed font-medium">
                                    <p>
                                        At {companyName}, we believe in pushing the boundaries of
                                        what&apos;s possible. Our mission is to democratize access to
                                        advanced solutions through innovation and design excellence.
                                        Over the last decade, we have transformed from a small
                                        startup into a global leader in the {job.tags[0]} sector.
                                    </p>
                                    <p>
                                        Our team is composed of visionaries, designers, and
                                        engineers who are passionate about creating seamless
                                        experiences. We foster a culture of transparency, continuous
                                        learning, and big thinking. Join us as we build the future
                                        of the industry together.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                        {[
                                            "Culture-first environment",
                                            "Remote-friendly policy",
                                            "Generous professional growth",
                                            "Inclusive & diverse team",
                                        ].map((p) => (
                                            <div
                                                key={p}
                                                className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/30"
                                            >
                                                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                                    <Star className="w-3 h-3 fill-white" />
                                                </div>
                                                <span className="text-xs font-black text-gray-900 uppercase tracking-tight">
                                                    {p}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-6">
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                                    <span className="w-2 h-8 bg-gray-900 rounded-full"></span>
                                    Open Positions
                                </h2>
                                <div className="space-y-4">
                                    {mockJobs.slice(0, 3).map((j) => (
                                        <div
                                            key={j.id}
                                            className="bg-white p-6 rounded-3xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                                        >
                                            <div className="space-y-1">
                                                <h4 className="text-lg font-black text-gray-900 uppercase group-hover:text-blue-600 transition-colors tracking-tight">
                                                    {j.title}
                                                </h4>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                    {j.type} • {j.salary}
                                                </p>
                                            </div>
                                            <Link
                                                href={`/applicant/jobs/${j.id}`}
                                                className="px-6 py-3 bg-gray-50 group-hover:bg-gray-900 group-hover:text-white text-gray-900 text-[10px] font-black rounded-xl uppercase tracking-widest transition-all shadow-sm"
                                            >
                                                View Role
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="space-y-8">
                            {/* Quick Application */}
                            <div className="bg-gray-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                <h4 className="text-xl font-black uppercase mb-4 relative z-10">
                                    Fast Application
                                </h4>
                                <p className="text-sm font-bold text-gray-400 mb-6 relative z-10">
                                    Don&apos;t see a matching role? Send us your resume for future
                                    opportunities.
                                </p>
                                <button
                                    type="button"
                                    className="w-full py-4 bg-white text-gray-900 text-sm font-black rounded-2xl shadow-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-3 relative z-10"
                                >
                                    General Application <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Company Stats */}
                            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-6">
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest text-center border-b border-gray-50 pb-4">
                                    Snapshot
                                </h4>
                                <div className="space-y-6">
                                    {[
                                        { label: "Diversity Score", val: "4.8/5" },
                                        { label: "Employee Retention", val: "92%" },
                                        { label: "Growth YoY", val: "+45%" },
                                    ].map((s) => (
                                        <div key={s.label} className="text-center">
                                            <p className="text-3xl font-black text-blue-600 mb-1">
                                                {s.val}
                                            </p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                {s.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
