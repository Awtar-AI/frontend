"use client";

import { Check, CloudUpload, Info, Link2 } from "lucide-react";
import type { RecruiterRegisterFormData } from "../page";

interface Props {
    formData: RecruiterRegisterFormData;
    setFormData: React.Dispatch<React.SetStateAction<RecruiterRegisterFormData>>;
    onBack: () => void;
    onSubmit: () => void;
}

export function Step3Verification({ formData, setFormData, onBack, onSubmit }: Props) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Verification Active badge */}
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-blue-600" strokeWidth={3} />
                </div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Verification Active
                </span>
            </div>

            {/* Breadcrumb for step 3 */}
            <div className="flex items-center gap-1 text-[11px] font-semibold">
                {[
                    { label: "Personal Details", done: true, active: false },
                    { label: "Organization Info", done: true, active: false },
                    { label: "Verification", done: false, active: true },
                ].map((step, idx) => (
                    <div key={step.label} className="flex items-center gap-1">
                        {idx > 0 && <span className="text-gray-300 mx-0.5">/</span>}
                        <div
                            className={`flex items-center gap-1 ${
                                step.done
                                    ? "text-green-600"
                                    : step.active
                                      ? "text-blue-600"
                                      : "text-gray-400"
                            }`}
                        >
                            {step.done ? (
                                <div className="w-4 h-4 rounded-full border border-green-500 flex items-center justify-center shrink-0">
                                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                                </div>
                            ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center shrink-0">
                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                                </div>
                            )}
                            <span className="hidden sm:inline">{step.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Business Documentation card */}
                <div className="border border-gray-200 rounded-xl p-5 bg-white">
                    <h3 className="text-sm font-bold text-gray-900 mb-1">Business Documentation</h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                        To ensure the security of our community, please provide valid documentation
                        that verifies your organization's legal status.
                    </p>

                    {/* Upload area */}
                    <label
                        htmlFor="s3-doc-upload"
                        className="block text-xs font-semibold text-gray-700 mb-2"
                    >
                        Official Document (Business License or Tax ID)
                    </label>
                    <label
                        htmlFor="s3-doc-upload"
                        className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center py-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
                    >
                        <CloudUpload
                            className="w-6 h-6 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors"
                            aria-hidden="true"
                        />
                        <p className="text-sm font-bold text-gray-700">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-[10px] font-semibold text-gray-400 mt-0.5">
                            PDF, PNG, JPG (max. 10MB)
                        </p>
                        <input
                            id="s3-doc-upload"
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            className="sr-only"
                        />
                    </label>

                    <div className="mt-6 space-y-1.5">
                        <label
                            htmlFor="s3-linkedin"
                            className="text-sm font-semibold text-gray-700"
                        >
                            Organization LinkedIn Page URL
                        </label>
                        <div className="relative">
                            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="s3-linkedin"
                                type="url"
                                placeholder="https://linkedin.com/company/your-brand"
                                value={formData.linkedinUrl}
                                onChange={(e) =>
                                    setFormData({ ...formData, linkedinUrl: e.target.value })
                                }
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <p className="text-xs text-gray-500 font-medium ml-1">
                            We use this to cross-reference your organization's digital presence.
                        </p>
                    </div>

                    <div className="mt-6 flex gap-2.5 bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-700 font-medium leading-relaxed">
                            By submitting these documents, you authorize our verification team to
                            review the provided information. Verification typically takes 24-48
                            business hours.
                        </p>
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
                        Submit for Verification <span aria-hidden="true">▷</span>
                    </button>
                </div>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600">
                © 2024 Recruiter Portal. Secure document handling compliant with GDPR and CCPA.
            </p>
        </div>
    );
}
