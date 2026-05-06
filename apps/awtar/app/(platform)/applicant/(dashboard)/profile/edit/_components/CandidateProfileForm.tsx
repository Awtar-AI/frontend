"use client";

import { Briefcase, Save, X } from "lucide-react";
import { type KeyboardEvent, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { UpdateCandidateProfileFormData } from "../../schemas/profile.schema";
import { educationOptions, industryOptions, jobTypeOptions } from "../../schemas/profile.schema";

type Props = {
    form: UseFormReturn<UpdateCandidateProfileFormData>;
    onSubmit: () => void;
    isPending: boolean;
};

function SkillsInput({ form }: { form: UseFormReturn<UpdateCandidateProfileFormData> }) {
    const [input, setInput] = useState("");
    const skills = form.watch("skills");

    const addSkill = () => {
        const trimmed = input.trim();
        if (trimmed && !skills.includes(trimmed)) {
            form.setValue("skills", [...skills, trimmed], {
                shouldValidate: true,
            });
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
    };

    return (
        <div className="space-y-3">
            <label
                htmlFor="skill-input"
                className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1"
            >
                Skills
            </label>
            {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                        <span
                            key={skill}
                            className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
                        >
                            {skill}
                            <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="hover:text-blue-900"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
            <input
                id="skill-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                onBlur={addSkill}
                placeholder="Type a skill and press Enter"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
            />
        </div>
    );
}

export function CandidateProfileForm({ form, onSubmit, isPending }: Props) {
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
            className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm space-y-6"
        >
            <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-[18px] font-black text-gray-900 tracking-tight">
                    <Briefcase className="w-5 h-5 text-blue-600" /> Professional Profile
                </h3>
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black rounded-xl transition-colors disabled:opacity-60"
                >
                    <Save className="w-4 h-4" />
                    {isPending ? "Saving..." : "Save"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label
                        htmlFor="current_job_title"
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1"
                    >
                        Current Job Title
                    </label>
                    <input
                        id="current_job_title"
                        type="text"
                        {...register("current_job_title")}
                        placeholder="e.g. Software Engineer"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                    />
                </div>
                <div className="space-y-1.5">
                    <label
                        htmlFor="years_of_experience"
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1"
                    >
                        Years of Experience
                    </label>
                    <input
                        id="years_of_experience"
                        type="number"
                        min={0}
                        max={60}
                        {...register("years_of_experience", { valueAsNumber: true })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label
                        htmlFor="education_level"
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1"
                    >
                        Education Level
                    </label>
                    <select
                        id="education_level"
                        {...register("education_level")}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                    >
                        <option value="">Select...</option>
                        {educationOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label
                        htmlFor="industry_interest"
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1"
                    >
                        Industry Interest
                    </label>
                    <select
                        id="industry_interest"
                        {...register("industry_interest")}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                    >
                        <option value="">Select...</option>
                        {industryOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label
                        htmlFor="desired_annual_salary_min"
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1"
                    >
                        Min Annual Salary
                    </label>
                    <input
                        id="desired_annual_salary_min"
                        type="number"
                        min={0}
                        {...register("desired_annual_salary_min", { valueAsNumber: true })}
                        placeholder="e.g. 50000"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                    />
                </div>
                <div className="space-y-1.5">
                    <label
                        htmlFor="desired_annual_salary_max"
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1"
                    >
                        Max Annual Salary
                    </label>
                    <input
                        id="desired_annual_salary_max"
                        type="number"
                        min={0}
                        {...register("desired_annual_salary_max", { valueAsNumber: true })}
                        placeholder="e.g. 80000"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                    />
                    {errors.desired_annual_salary_max && (
                        <p className="text-xs text-red-600">
                            {errors.desired_annual_salary_max.message}
                        </p>
                    )}
                </div>
            </div>

            <SkillsInput form={form} />

            <fieldset className="space-y-3">
                <legend className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                    Preferred Job Types
                </legend>
                <div className="flex flex-wrap gap-2.5">
                    {jobTypeOptions.map((o) => {
                        const active = selectedJobTypes.includes(o.value);
                        return (
                            <button
                                key={o.value}
                                type="button"
                                onClick={() => toggleJobType(o.value)}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                                    active
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300"
                                }`}
                            >
                                {o.label}
                            </button>
                        );
                    })}
                </div>
            </fieldset>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                    <p className="text-sm font-black text-gray-900">Smart Match Notifications</p>
                    <p className="text-xs text-gray-400 font-bold">
                        Get notified when new roles match your profile
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setValue("match_smart_notification", !smartMatch)}
                    className={`relative w-12 h-7 rounded-full transition-colors ${
                        smartMatch ? "bg-blue-600" : "bg-gray-300"
                    }`}
                >
                    <span
                        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            smartMatch ? "translate-x-5" : ""
                        }`}
                    />
                </button>
            </div>
        </form>
    );
}
