"use client";

import { Building2, Globe, Users } from "lucide-react";
import Link from "next/link";
import type { UseFormReturn } from "react-hook-form";
import type { RecruiterRegisterFormData } from "../schemas/recruiter-register.schema";
import { recruiterIndustryOptions } from "../schemas/recruiter-register.schema";

interface Props {
    form: UseFormReturn<RecruiterRegisterFormData>;
    onNext: () => void;
    onBack: () => void;
}

export function Step2OrganizationInfo({ form, onNext, onBack }: Props) {
    const {
        register,
        formState: { errors },
    } = form;

    return (
        <div className="flex flex-col gap-5">
            <div>
                <h3 className="text-base font-bold text-gray-900">
                    Tell us about your organization
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                    This information helps us customize your workspace and recruitment tools.
                </p>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onNext();
                }}
                className="flex flex-col gap-4"
            >
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
                            {...register("organizationName")}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    {errors.organizationName && (
                        <p className="text-xs text-red-600">{errors.organizationName.message}</p>
                    )}
                </div>

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
                            {...register("websiteUrl")}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    {errors.websiteUrl && (
                        <p className="text-xs text-red-600">{errors.websiteUrl.message}</p>
                    )}
                </div>

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
                                {...register("industry")}
                                className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none transition-all"
                            >
                                <option value="" disabled>
                                    Select Industry
                                </option>
                                {recruiterIndustryOptions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
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
                        {errors.industry && (
                            <p className="text-xs text-red-600">{errors.industry.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="s2-size" className="text-sm font-semibold text-gray-700">
                            Organization Size
                        </label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                            <input
                                id="s2-size"
                                type="number"
                                min={1}
                                placeholder="e.g. 50"
                                {...register("organizationSize", {
                                    valueAsNumber: true,
                                })}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        {errors.organizationSize && (
                            <p className="text-xs text-red-600">
                                {errors.organizationSize.message}
                            </p>
                        )}
                    </div>
                </div>

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
                        Continue to Verification <span aria-hidden="true">→</span>
                    </button>
                </div>

                <p className="text-center text-xs text-gray-500 leading-relaxed mt-4">
                    By continuing, you agree to our{" "}
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
