"use client";

import { Check, CloudUpload, FileText, Info, Link2, Trash2 } from "lucide-react";
import { useRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { RecruiterRegisterFormData } from "../schemas/recruiter-register.schema";

const ALLOWED_EXT = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"];
const MAX_SIZE = 5 * 1024 * 1024;

interface Props {
    form: UseFormReturn<RecruiterRegisterFormData>;
    onBack: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

export function Step3Verification({ form, onBack, onSubmit, isSubmitting }: Props) {
    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = form;
    const inputRef = useRef<HTMLInputElement>(null);
    const documents = watch("businessDocuments");

    const addFiles = (fileList: FileList | null) => {
        if (!fileList) return;
        const current = [...documents];
        for (const file of Array.from(fileList)) {
            const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
            if (!ALLOWED_EXT.includes(ext)) continue;
            if (file.size > MAX_SIZE) continue;
            if (current.length >= 3) break;
            if (current.some((f) => f.name === file.name && f.size === file.size)) continue;
            current.push(file);
        }
        setValue("businessDocuments", current, { shouldValidate: true });
    };

    const removeFile = (index: number) => {
        setValue(
            "businessDocuments",
            documents.filter((_, i) => i !== index),
            { shouldValidate: true },
        );
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-blue-600" strokeWidth={3} />
                </div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Verification
                </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-semibold">
                {[
                    { label: "Personal Details", done: true },
                    { label: "Organization Info", done: true },
                    { label: "Verification", done: false, active: true },
                ].map((s, idx) => (
                    <div key={s.label} className="flex items-center gap-1">
                        {idx > 0 && <span className="text-gray-300 mx-0.5">/</span>}
                        <div
                            className={`flex items-center gap-1 ${
                                s.done
                                    ? "text-green-600"
                                    : s.active
                                      ? "text-blue-600"
                                      : "text-gray-400"
                            }`}
                        >
                            {s.done ? (
                                <div className="w-4 h-4 rounded-full border border-green-500 flex items-center justify-center shrink-0">
                                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                                </div>
                            ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center shrink-0">
                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                                </div>
                            )}
                            <span className="hidden sm:inline">{s.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}
                className="flex flex-col gap-5"
            >
                <div className="border border-gray-200 rounded-xl p-5 bg-white">
                    <h3 className="text-sm font-bold text-gray-900 mb-1">Business Documentation</h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                        Upload 1–3 documents that verify your organization&apos;s legal status
                        (business license, tax ID, etc.).
                    </p>

                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        className="sr-only"
                        onChange={(e) => {
                            addFiles(e.target.files);
                            e.target.value = "";
                        }}
                    />

                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={documents.length >= 3}
                        className="w-full border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center py-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <CloudUpload className="w-6 h-6 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                        <p className="text-sm font-bold text-gray-700">Click to upload</p>
                        <p className="text-[10px] font-semibold text-gray-400 mt-0.5">
                            PDF, DOC, DOCX, PNG, JPG (max 5 MB each, up to 3 files)
                        </p>
                    </button>

                    {errors.businessDocuments && (
                        <p className="text-xs text-red-600 mt-2">
                            {errors.businessDocuments.message}
                        </p>
                    )}

                    {documents.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {documents.map((file, idx) => (
                                <div
                                    key={`${file.name}-${file.size}`}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                                >
                                    <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                                    <span className="text-xs font-bold text-gray-700 flex-1 truncate">
                                        {file.name}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-medium shrink-0">
                                        {(file.size / 1024).toFixed(0)} KB
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(idx)}
                                        className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-6 space-y-1.5">
                        <label
                            htmlFor="s3-linkedin"
                            className="text-sm font-semibold text-gray-700"
                        >
                            Organization LinkedIn URL{" "}
                            <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <div className="relative">
                            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="s3-linkedin"
                                type="url"
                                placeholder="https://linkedin.com/company/your-brand"
                                {...register("linkedinUrl")}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        {errors.linkedinUrl && (
                            <p className="text-xs text-red-600">{errors.linkedinUrl.message}</p>
                        )}
                    </div>

                    <div className="mt-6 flex gap-2.5 bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-700 font-medium leading-relaxed">
                            Verification typically takes 24–48 business hours. You&apos;ll receive
                            an email once approved.
                        </p>
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
                        disabled={isSubmitting}
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {isSubmitting ? "Submitting..." : "Submit for Verification"}
                    </button>
                </div>
            </form>
        </div>
    );
}
