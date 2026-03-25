import { Activity, Briefcase, Minus, Plus, Upload, X } from "lucide-react";
import { useState } from "react";
import type { RegisterFormData } from "../schemas/register.schema";

export function Step2ProfessionalInfo({
    formData,
    setFormData,
    onNext,
    onBack,
    errors,
}: {
    formData: RegisterFormData;
    setFormData: (data: RegisterFormData) => void;
    onNext: () => void;
    onBack: () => void;
    errors?: Record<string, string>;
}) {
    const [newSkill, setNewSkill] = useState("");

    const handleAddSkill = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || (e.key === "," && newSkill.trim())) {
            e.preventDefault();
            setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
            setNewSkill("");
        }
    };

    const removeSkill = (index: number) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter((_, i) => i !== index),
        });
    };

    const educationOptions = [
        { id: "bachelor", label: "Bachelor's Degree" },
        { id: "master", label: "Master's Degree" },
        { id: "phd", label: "PhD / Doctorate" },
        { id: "self_taught", label: "Self-Taught / Bootcamp" },
        { id: "associate", label: "Associate Degree" },
        { id: "high_school", label: "High School" },
        { id: "other", label: "Other" },
    ];

    return (
        <form
            className="space-y-6 bg-white p-8 rounded-[20px] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] animate-in fade-in slide-in-from-right-4 duration-500"
            onSubmit={(e) => {
                e.preventDefault();
                onNext();
            }}
        >
            <div className="space-y-1.5">
                <label
                    htmlFor="jobTitle"
                    className="text-sm font-bold text-gray-800 tracking-tight"
                >
                    Current Job Title
                </label>
                <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        id="jobTitle"
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        placeholder="e.g. Senior Product Designer"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium"
                        required
                    />
                </div>
                {errors?.jobTitle && <p className="text-xs text-red-600">{errors.jobTitle}</p>}
            </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="experience"
                    className="text-sm font-bold text-gray-800 tracking-tight"
                >
                    Years of Experience
                </label>
                <div className="flex items-center rounded-xl border border-gray-200 bg-white px-2 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                    <Activity className="ml-1 mr-2 h-5 w-5 text-gray-400" />
                    <button
                        type="button"
                        onClick={() =>
                            setFormData({
                                ...formData,
                                experience: Math.max(0, formData.experience - 1),
                            })
                        }
                        className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                        aria-label="Decrease years of experience"
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <input
                        id="experience"
                        type="number"
                        min={0}
                        value={formData.experience}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                experience: Math.max(0, Number(e.target.value || 0)),
                            })
                        }
                        className="w-full bg-transparent px-2 py-1 text-center font-bold text-gray-700 outline-none"
                        required
                    />
                    <button
                        type="button"
                        onClick={() =>
                            setFormData({
                                ...formData,
                                experience: formData.experience + 1,
                            })
                        }
                        className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                        aria-label="Increase years of experience"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
                {errors?.experience && <p className="text-xs text-red-600">{errors.experience}</p>}
            </div>

            <div className="space-y-3">
                <label
                    htmlFor="skillInput"
                    className="text-sm font-bold text-gray-800 tracking-tight"
                >
                    Primary Skills
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {formData.skills.map((skill, index) => (
                        <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold"
                        >
                            {skill}
                            <button
                                type="button"
                                onClick={() => removeSkill(index)}
                                className="hover:text-blue-800 focus:outline-none"
                                aria-label={`Remove ${skill}`}
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    ))}
                </div>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </div>
                    <input
                        id="skillInput"
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={handleAddSkill}
                        placeholder="Type a skill and press enter"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium"
                    />
                </div>
                {errors?.skills && <p className="text-xs text-red-600">{errors.skills}</p>}
            </div>

            <fieldset className="space-y-3">
                <legend className="text-sm font-bold text-gray-800 tracking-tight">
                    Education Level
                </legend>
                <div className="grid grid-cols-2 gap-3">
                    {educationOptions.map((edu) => (
                        <button
                            key={edu.id}
                            type="button"
                            aria-pressed={formData.education === edu.id}
                            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all text-left ${formData.education === edu.id ? "border-blue-600 bg-blue-50 shadow-sm" : "border-gray-200 hover:border-blue-300"}`}
                            onClick={() => setFormData({ ...formData, education: edu.id })}
                        >
                            <div
                                className={`w-4 h-4 rounded-full border-[2px] flex items-center justify-center shrink-0 transition-colors ${formData.education === edu.id ? "border-blue-600" : "border-gray-300"}`}
                            >
                                {formData.education === edu.id && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                )}
                            </div>
                            <span
                                className={`text-sm font-bold ${formData.education === edu.id ? "text-blue-700" : "text-gray-600"}`}
                            >
                                {edu.label}
                            </span>
                        </button>
                    ))}
                </div>
                {errors?.education && <p className="text-xs text-red-600">{errors.education}</p>}
            </fieldset>

            <div className="space-y-2">
                <label htmlFor="resume" className="text-sm font-bold text-gray-800 tracking-tight">
                    Resume (PDF/DOC)
                </label>
                <label
                    htmlFor="resume"
                    className={`flex cursor-pointer items-center justify-between rounded-xl border border-dashed px-4 py-3 ${
                        formData.resume
                            ? "border-emerald-400 bg-emerald-50/50"
                            : "border-gray-300 hover:border-blue-400"
                    }`}
                >
                    <span
                        className={`text-sm ${
                            formData.resume ? "font-semibold text-emerald-700" : "text-gray-600"
                        }`}
                    >
                        {formData.resume ? formData.resume.name : "Upload your resume"}
                    </span>
                    <span
                        className={`inline-flex items-center gap-1 text-sm font-semibold ${
                            formData.resume ? "text-emerald-700" : "text-blue-600"
                        }`}
                    >
                        <Upload className="h-4 w-4" />
                        Browse
                    </span>
                </label>
                <input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            resume: e.target.files?.[0] ?? null,
                        })
                    }
                />
                {formData.resume && (
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, resume: null })}
                        className="text-xs font-medium text-gray-500 hover:text-gray-700"
                    >
                        Remove selected file
                    </button>
                )}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-2 px-2 py-2 font-bold text-gray-500 hover:text-gray-900 transition-colors"
                >
                    &larr; Back
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]"
                >
                    Next Step &rarr;
                </button>
            </div>
            {errors?._form && <p className="text-xs text-red-600">{errors._form}</p>}
        </form>
    );
}
