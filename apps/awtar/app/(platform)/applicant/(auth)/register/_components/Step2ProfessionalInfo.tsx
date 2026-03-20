import { Activity, Briefcase, X } from "lucide-react";
import { useState } from "react";
import type { RegisterFormData } from "../page";

export function Step2ProfessionalInfo({
    formData,
    setFormData,
    onNext,
    onBack,
}: {
    formData: RegisterFormData;
    setFormData: (data: RegisterFormData) => void;
    onNext: () => void;
    onBack: () => void;
}) {
    const [newSkill, setNewSkill] = useState("");

    const handleAddSkill = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && newSkill.trim()) {
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
        { id: "Bachelor's Degree", label: "Bachelor's Degree" },
        { id: "Master's Degree", label: "Master's Degree" },
        { id: "PhD / Doctorate", label: "PhD / Doctorate" },
        { id: "Self-Taught / Bootcamp", label: "Self-Taught / Bootcamp" },
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
            </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="experience"
                    className="text-sm font-bold text-gray-800 tracking-tight"
                >
                    Years of Experience
                </label>
                <div className="relative">
                    <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white font-medium text-gray-700"
                        required
                    >
                        <option value="">Select experience level</option>
                        <option value="0-2">0-2 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5-10">5-10 years</option>
                        <option value="10+">10+ years</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            ></path>
                        </svg>
                    </div>
                </div>
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
            </fieldset>

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
        </form>
    );
}
