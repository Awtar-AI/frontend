"use client";

import { Building2, Check, Globe, Shield, Users } from "lucide-react";
import Link from "next/link";
import type { RecruiterRegisterFormData } from "../page";

interface Props {
    formData: RecruiterRegisterFormData;
    setFormData: React.Dispatch<React.SetStateAction<RecruiterRegisterFormData>>;
    onNext: () => void;
    onBack: () => void;
}

const INDUSTRIES = [
    "Technology",
    "Finance & Banking",
    "Healthcare",
    "Retail & E-commerce",
    "Manufacturing",
    "Education",
    "Media & Entertainment",
    "Real Estate",
    "Other",
];

const ORG_SIZES = ["1–10", "11–50", "51–200", "201–500", "501–1,000", "1,000+"];

const STEPS = [
    { id: "personal", label: "Personal Details", sub: "Completed" },
    { id: "org", label: "Organization Info", sub: "In Progress" },
    { id: "verify", label: "Verification", sub: "Upcoming" },
];

export function Step2OrganizationInfo({ formData, setFormData, onNext, onBack }: Props) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext();
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Vertical step list — unique to Step 2 */}
            <div className="flex flex-col gap-2 mb-1">
                {STEPS.map((step, idx) => {
                    const isCompleted = idx === 0;
                    const isActive = idx === 1;
                    return (
                        <div key={step.label} className="flex items-center gap-3">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                    isCompleted
                                        ? "bg-green-500 text-white"
                                        : isActive
                                          ? "bg-blue-600 text-white"
                                          : "border-2 border-gray-200 bg-white text-gray-400"
                                }`}
                            >
                                {isCompleted ? (
                                    <Check className="w-4 h-4" strokeWidth={3} />
                                ) : isActive ? (
                                    <Building2 className="w-4 h-4" />
                                ) : (
                                    <Shield className="w-4 h-4" />
                                )}
                            </div>
                            <div>
                                <p
                                    className={`text-xs font-bold leading-none ${
                                        isCompleted
                                            ? "text-gray-800"
                                            : isActive
                                              ? "text-gray-900"
                                              : "text-gray-400"
                                    }`}
                                >
                                    {step.label}
                                </p>
                                <p
                                    className={`text-[10px] font-semibold mt-0.5 ${
                                        isCompleted
                                            ? "text-green-600"
                                            : isActive
                                              ? "text-blue-600"
                                              : "text-gray-400"
                                    }`}
                                >
                                    {step.sub}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div>
                <h3 className="text-base font-bold text-gray-900">
                    Tell us about your organization
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                    This information helps us customize your workspace and recruitment tools.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Organization Name */}
                <div className="space-y-1.5">
                    <label htmlFor="s2-orgname" className="text-sm font-semibold text-gray-700">
                        Organization Name
                    </label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            id="s2-orgname"
                            type="text"
                            placeholder="Acme Inc."
                            value={formData.organizationName}
                            onChange={(e) =>
                                setFormData({ ...formData, organizationName: e.target.value })
                            }
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                    </div>
                </div>

                {/* Website URL */}
                <div className="space-y-1.5">
                    <label htmlFor="s2-website" className="text-sm font-semibold text-gray-700">
                        Website URL
                    </label>
                    <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            id="s2-website"
                            type="url"
                            placeholder="https://example.com"
                            value={formData.websiteUrl}
                            onChange={(e) =>
                                setFormData({ ...formData, websiteUrl: e.target.value })
                            }
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                    </div>
                </div>

                {/* Industry + Size */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <label
                            htmlFor="s2-industry"
                            className="text-sm font-semibold text-gray-700"
                        >
                            Industry
                        </label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                            <select
                                id="s2-industry"
                                value={formData.industry}
                                onChange={(e) =>
                                    setFormData({ ...formData, industry: e.target.value })
                                }
                                className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none transition-all"
                                required
                            >
                                <option value="" disabled>
                                    Select Industry
                                </option>
                                {INDUSTRIES.map((ind) => (
                                    <option key={ind} value={ind}>
                                        {ind}
                                    </option>
                                ))}
                            </select>
                            <svg
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="s2-size" className="text-sm font-semibold text-gray-700">
                            Organization Size
                        </label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                            <select
                                id="s2-size"
                                value={formData.organizationSize}
                                onChange={(e) =>
                                    setFormData({ ...formData, organizationSize: e.target.value })
                                }
                                className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none transition-all"
                                required
                            >
                                <option value="" disabled>
                                    Select Size
                                </option>
                                {ORG_SIZES.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                            <svg
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-4">
                    <button
                        type="button"
                        onClick={onBack}
                        className="w-1/3 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-lg transition-colors shadow-sm"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] flex items-center justify-center gap-2"
                    >
                        Create Organization Workspace <span aria-hidden="true">→</span>
                    </button>
                </div>

                <p className="text-center text-xs text-gray-500 leading-relaxed mt-4">
                    By clicking &apos;Create Organization Workspace&apos;, you agree to our{" "}
                    <Link href="/terms" className="underline hover:text-gray-700">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline hover:text-gray-600 text-blue-600">
                        Privacy Policy
                    </Link>
                    .
                </p>
            </form>
        </div>
    );
}
