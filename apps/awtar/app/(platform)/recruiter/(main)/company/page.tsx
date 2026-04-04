"use client";

import { Calendar, Edit2, Globe, MapPin, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function CompanyDetailsPage() {
    const [aboutText, setAboutText] = useState(
        "TechNest Innovations is a cutting-edge technology company delivering high-quality web and mobile solutions to clients worldwide. Our team of expert developers, designers, and strategists collaborate closely with businesses to build scalable, user-focused products. We value creativity, agility, and transparency.",
    );
    const [editingAbout, setEditingAbout] = useState(false);
    const [aboutDraft, setAboutDraft] = useState(aboutText);

    const [overview, setOverview] = useState({
        website: "www.companysite.com",
        size: "51–200 employees",
        founded: "2017",
    });
    const [editingOverview, setEditingOverview] = useState(false);
    const [overviewDraft, setOverviewDraft] = useState(overview);

    return (
        <div className="max-w-3xl mx-auto space-y-5">
            {/* Profile Header Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-start gap-5">
                    <div className="relative">
                        <Image
                            src="https://i.pravatar.cc/80?img=7"
                            alt="Company Logo"
                            width={64}
                            height={64}
                            className="rounded-xl object-cover border border-gray-200"
                        />
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                            <Edit2 className="w-2.5 h-2.5 text-white" />
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold text-gray-900">
                            TechNest Innovations Inc.
                        </h1>
                        <p className="text-sm text-gray-500 font-medium mt-0.5">
                            Information Technology & Services
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400 font-medium">
                            <MapPin className="w-3.5 h-3.5" />
                            New York, USA
                        </div>
                    </div>
                    <button className="flex-shrink-0 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* About Us */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold text-gray-900">About Us</h2>
                    <button
                        onClick={() => {
                            setAboutDraft(aboutText);
                            setEditingAbout(!editingAbout);
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-colors"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                </div>
                {editingAbout ? (
                    <div className="space-y-3">
                        <textarea
                            value={aboutDraft}
                            onChange={(e) => setAboutDraft(e.target.value)}
                            rows={4}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setEditingAbout(false)}
                                className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setAboutText(aboutDraft);
                                    setEditingAbout(false);
                                }}
                                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-600 leading-relaxed">{aboutText}</p>
                )}
            </div>

            {/* Company Overview */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-gray-900">Company Overview</h2>
                    <button
                        onClick={() => {
                            setOverviewDraft(overview);
                            setEditingOverview(!editingOverview);
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-colors"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                </div>

                {editingOverview ? (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
                                Website
                            </label>
                            <input
                                type="text"
                                value={overviewDraft.website}
                                onChange={(e) =>
                                    setOverviewDraft({ ...overviewDraft, website: e.target.value })
                                }
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
                                    Company Size
                                </label>
                                <select
                                    value={overviewDraft.size}
                                    onChange={(e) =>
                                        setOverviewDraft({ ...overviewDraft, size: e.target.value })
                                    }
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option>1–10 employees</option>
                                    <option>11–50 employees</option>
                                    <option>51–200 employees</option>
                                    <option>201–500 employees</option>
                                    <option>500+ employees</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
                                    Founded
                                </label>
                                <input
                                    type="text"
                                    value={overviewDraft.founded}
                                    onChange={(e) =>
                                        setOverviewDraft({
                                            ...overviewDraft,
                                            founded: e.target.value,
                                        })
                                    }
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setEditingOverview(false)}
                                className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setOverview(overviewDraft);
                                    setEditingOverview(false);
                                }}
                                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="font-semibold text-gray-600 w-28">Website</span>
                            <a
                                href={`https://${overview.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline font-semibold"
                            >
                                {overview.website}
                            </a>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="font-semibold text-gray-600 w-28">Company Size</span>
                            <span className="text-gray-800 font-semibold">
                                &quot;{overview.size}&quot;
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="font-semibold text-gray-600 w-28">Founded</span>
                            <span className="text-gray-800 font-semibold">{overview.founded}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 flex-shrink-0" />
                            <span className="font-semibold text-gray-600 w-28">Social Links</span>
                            <div className="flex items-center gap-2">
                                <a
                                    href="#"
                                    className="text-blue-600 hover:underline font-semibold text-sm"
                                >
                                    LinkedIn
                                </a>
                                <span className="text-gray-300">|</span>
                                <a
                                    href="#"
                                    className="text-gray-600 hover:underline font-semibold text-sm"
                                >
                                    X
                                </a>
                                <span className="text-gray-300">|</span>
                                <a
                                    href="#"
                                    className="text-blue-600 hover:underline font-semibold text-sm"
                                >
                                    Facebook
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
