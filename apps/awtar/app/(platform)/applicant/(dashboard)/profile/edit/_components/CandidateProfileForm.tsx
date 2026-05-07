"use client";

import { Bell, Briefcase, X } from "lucide-react";
import { type KeyboardEvent, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { UpdateCandidateProfileFormData } from "../../schemas/profile.schema";
import { educationOptions, industryOptions, jobTypeOptions } from "../../schemas/profile.schema";

type Props = {
    form: UseFormReturn<UpdateCandidateProfileFormData>;
    onSubmit: () => void;
};

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
    return (
        <label
            htmlFor={htmlFor}
            className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-0.5"
        >
            {children}
        </label>
    );
}

const inputClass =
    "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-gray-900 placeholder:text-slate-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all";

function SkillsInput({ form }: { form: UseFormReturn<UpdateCandidateProfileFormData> }) {
    const [input, setInput] = useState("");
    const skills = form.watch("skills");

    const addSkill = () => {
        const trimmed = input.trim();
        if (trimmed && !skills.includes(trimmed)) {
            form.setValue("skills", [...skills, trimmed], { shouldValidate: true });
        }
        setInput("");
    };

    const removeSkill = (skill: string) => {
        form.setValue(
            "skills",
            skills.filter((s) => s !== skill),
            { shouldValidate: true },
        );
    };

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addSkill();
        }
        if (e.key === "Backspace" && input === "" && skills.length > 0) {
            removeSkill(skills[skills.length - 1]);
        }
    };

    return (
        <div>
            <FieldLabel htmlFor="skill-input">Skills</FieldLabel>
            <div className="min-h-[52px] flex flex-wrap gap-2 items-center px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
                {skills.map((skill) => (
                    <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold rounded-xl"
                    >
                        {skill}
                        <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="hover:text-blue-900 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </span>
                ))}
                <input
                    id="skill-input"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    onBlur={addSkill}
                    placeholder={
                        skills.length === 0 ? "Type a skill and press Enter…" : "Add more…"
                    }
                    className="flex-1 min-w-[120px] bg-transparent text-sm font-bold text-gray-900 placeholder:text-slate-300 outline-none"
                />
            </div>
            <p className="mt-1.5 text-[10px] font-medium text-slate-400 pl-0.5">
                Press Enter or comma to add a skill
            </p>
        </div>
    );
}

export function CandidateProfileForm({ form, onSubmit }: Props) {
    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = form;

    const selectedJobTypes = watch("preferred_job_types");
    const smartMatch = watch("match_smart_notification");

    const toggleJobType = (value: string) => {
        const updated = selectedJobTypes.includes(value)
            ? selectedJobTypes.filter((v) => v !== value)
            : [...selectedJobTypes, value];
        setValue("preferred_job_types", updated, { shouldValidate: true });
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden"
        >
            <div className="px-8 py-6 border-b border-gray-100 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                </span>
                <h3 className="text-base font-black text-gray-950 tracking-tight">
                    Professional Profile
                </h3>
            </div>

            <div className="p-8 space-y-7">
                {/* Job title + years */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <FieldLabel htmlFor="current_job_title">Current Job Title</FieldLabel>
                        <input
                            id="current_job_title"
                            type="text"
                            placeholder="e.g. Software Engineer"
                            {...register("current_job_title")}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <FieldLabel htmlFor="years_of_experience">Years of Experience</FieldLabel>
                        <input
                            id="years_of_experience"
                            type="number"
                            min={0}
                            max={60}
                            placeholder="0"
                            {...register("years_of_experience", { valueAsNumber: true })}
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Education + Industry */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <FieldLabel htmlFor="education_level">Education Level</FieldLabel>
                        <select
                            id="education_level"
                            {...register("education_level")}
                            className={inputClass}
                        >
                            <option value="">Select…</option>
                            {educationOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <FieldLabel htmlFor="industry_interest">Industry Interest</FieldLabel>
                        <select
                            id="industry_interest"
                            {...register("industry_interest")}
                            className={inputClass}
                        >
                            <option value="">Select…</option>
                            {industryOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Salary range */}
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-0.5">
                        Desired Annual Salary
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <FieldLabel htmlFor="desired_annual_salary_min">Minimum</FieldLabel>
                            <input
                                id="desired_annual_salary_min"
                                type="number"
                                min={0}
                                placeholder="e.g. 50,000"
                                {...register("desired_annual_salary_min", { valueAsNumber: true })}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <FieldLabel htmlFor="desired_annual_salary_max">Maximum</FieldLabel>
                            <input
                                id="desired_annual_salary_max"
                                type="number"
                                min={0}
                                placeholder="e.g. 80,000"
                                {...register("desired_annual_salary_max", { valueAsNumber: true })}
                                className={inputClass}
                            />
                            {errors.desired_annual_salary_max && (
                                <p className="mt-1.5 text-xs font-bold text-red-500">
                                    {errors.desired_annual_salary_max.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <SkillsInput form={form} />

                {/* Job types */}
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-0.5">
                        Preferred Job Types
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {jobTypeOptions.map((o) => {
                            const active = selectedJobTypes.includes(o.value);
                            return (
                                <button
                                    key={o.value}
                                    type="button"
                                    onClick={() => toggleJobType(o.value)}
                                    className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                                        active
                                            ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200"
                                            : "bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                                    }`}
                                >
                                    {o.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Smart match toggle */}
                <div className="flex items-center justify-between gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${smartMatch ? "bg-blue-600" : "bg-slate-200"}`}
                        >
                            <Bell
                                className={`w-4 h-4 ${smartMatch ? "text-white" : "text-slate-400"}`}
                            />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900">
                                Smart Match Notifications
                            </p>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                Get notified when new roles match your profile
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setValue("match_smart_notification", !smartMatch)}
                        className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${
                            smartMatch ? "bg-blue-600" : "bg-slate-300"
                        }`}
                        role="switch"
                        aria-checked={smartMatch}
                    >
                        <span
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                                smartMatch ? "translate-x-6" : ""
                            }`}
                        />
                    </button>
                </div>
            </div>
        </form>
    );
}
