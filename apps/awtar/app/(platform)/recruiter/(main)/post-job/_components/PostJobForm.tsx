"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BriefcaseBusiness, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAuthOrganizationId } from "@/lib/hooks/use-auth";
import { AIGenerateModal } from "../../../_components/modals/AIGenerateModal";
import { DeadlineWarningModal } from "../../../_components/modals/DeadlineWarningModal";
import { JobLiveModal } from "../../../_components/modals/JobLiveModal";
import { useCreateJob } from "../hooks/use-create-job";
import {
    createJobFormSchema,
    employmentTypeOptions,
    experienceLevelOptions,
    salaryTypeOptions,
    type CreateJobFormData,
} from "../schemas/post-job.schema";

export function PostJobForm() {
    const router = useRouter();
    const organizationId = useAuthOrganizationId();
    const createJobMutation = useCreateJob();
    const [showAIGenerate, setShowAIGenerate] = useState(false);
    const [showJobLive, setShowJobLive] = useState(false);
    const [showDeadlineWarning, setShowDeadlineWarning] = useState(false);
    const [liveJobTitle, setLiveJobTitle] = useState("");

    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<CreateJobFormData>({
        resolver: zodResolver(createJobFormSchema),
        defaultValues: {
            title: "",
            description: "",
            location: "",
            isRemote: false,
            employmentType: "full_time",
            experienceLevel: "mid",
            salaryType: "range",
            minSalary: null,
            maxSalary: null,
            currency: "USD",
            deadline: "",
            isResumeRequired: true,
            isCoverLetterRequired: false,
            automaticResponse: "",
        },
    });

    const isRemote = watch("isRemote");
    const salaryType = watch("salaryType");

    const onSubmit = handleSubmit((data) => {
        if (new Date(data.deadline).getTime() <= Date.now()) {
            setShowDeadlineWarning(true);
            return;
        }

        createJobMutation.mutate(data, {
            onSuccess: (job) => {
                setLiveJobTitle(job.title);
                setShowJobLive(true);
            },
        });
    });

    return (
        <>
            {!organizationId && (
                <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    Your session does not currently have an active organization. The jobs API reads
                    `organization_id` from the JWT, so please sign in again before posting.
                </div>
            )}

            <form
                onSubmit={onSubmit}
                className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm"
            >
                <div className="flex flex-col gap-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-xs font-bold text-gray-900">
                            Job Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            {...register("title")}
                            placeholder='e.g., "Senior Backend Engineer"'
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none transition-all placeholder:text-gray-400"
                        />
                        {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-xs font-bold text-gray-900">
                            Job Description
                        </label>
                        <div className="relative">
                            <textarea
                                id="description"
                                {...register("description")}
                                className="w-full min-h-[180px] resize-y rounded-lg border border-gray-200 p-4 pr-36 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                placeholder="Describe the role, daily responsibilities, and qualifications."
                            />
                            <button
                                type="button"
                                onClick={() => setShowAIGenerate(true)}
                                className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 transition-colors hover:bg-blue-100"
                            >
                                <Sparkles className="h-4 w-4" />
                                AI Generate
                            </button>
                        </div>
                        {errors.description && (
                            <p className="text-xs text-red-600">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label
                                htmlFor="employmentType"
                                className="text-xs font-bold text-gray-900"
                            >
                                Employment Type
                            </label>
                            <select
                                id="employmentType"
                                {...register("employmentType")}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none text-gray-700 bg-white appearance-none"
                            >
                                {employmentTypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="experienceLevel"
                                className="text-xs font-bold text-gray-900"
                            >
                                Experience Level
                            </label>
                            <select
                                id="experienceLevel"
                                {...register("experienceLevel")}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none text-gray-700 bg-white appearance-none"
                            >
                                {experienceLevelOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-900">Work Type</label>
                            <Controller
                                name="isRemote"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex items-center gap-6 h-10">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={!field.value}
                                                onChange={() => field.onChange(false)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-600 font-medium">
                                                On-site
                                            </span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={field.value}
                                                onChange={() => field.onChange(true)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-600 font-medium">
                                                Remote
                                            </span>
                                        </label>
                                    </div>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="location" className="text-xs font-bold text-gray-900">
                                Location
                            </label>
                            <input
                                id="location"
                                type="text"
                                {...register("location")}
                                disabled={isRemote}
                                placeholder={isRemote ? "Remote role" : "e.g., Addis Ababa, Ethiopia"}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none placeholder:text-gray-400 disabled:bg-gray-50"
                            />
                            {errors.location && (
                                <p className="text-xs text-red-600">{errors.location.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="salaryType" className="text-xs font-bold text-gray-900">
                                Salary Type
                            </label>
                            <select
                                id="salaryType"
                                {...register("salaryType")}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none text-gray-700 bg-white appearance-none"
                            >
                                {salaryTypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="currency" className="text-xs font-bold text-gray-900">
                                Currency
                            </label>
                            <input
                                id="currency"
                                type="text"
                                {...register("currency")}
                                placeholder="USD"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none placeholder:text-gray-400"
                            />
                            {errors.currency && (
                                <p className="text-xs text-red-600">{errors.currency.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="minSalary" className="text-xs font-bold text-gray-900">
                                Minimum Salary
                            </label>
                            <input
                                id="minSalary"
                                type="number"
                                {...register("minSalary", {
                                    setValueAs: (value) => (value === "" ? null : Number(value)),
                                })}
                                disabled={salaryType === "undisclosed"}
                                placeholder={salaryType === "undisclosed" ? "Not required" : "e.g., 50000"}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none placeholder:text-gray-400 disabled:bg-gray-50"
                            />
                            {errors.minSalary && (
                                <p className="text-xs text-red-600">{errors.minSalary.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="maxSalary" className="text-xs font-bold text-gray-900">
                                Maximum Salary
                            </label>
                            <input
                                id="maxSalary"
                                type="number"
                                {...register("maxSalary", {
                                    setValueAs: (value) => (value === "" ? null : Number(value)),
                                })}
                                disabled={salaryType !== "range"}
                                placeholder={
                                    salaryType === "range" ? "e.g., 70000" : "Only used for ranges"
                                }
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none placeholder:text-gray-400 disabled:bg-gray-50"
                            />
                            {errors.maxSalary && (
                                <p className="text-xs text-red-600">{errors.maxSalary.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 items-start">
                        <div className="space-y-2">
                            <label htmlFor="deadline" className="text-xs font-bold text-gray-900">
                                Application Deadline
                            </label>
                            <input
                                id="deadline"
                                type="datetime-local"
                                {...register("deadline")}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none"
                            />
                            {errors.deadline && (
                                <p className="text-xs text-red-600">{errors.deadline.message}</p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-900">
                                Application Requirements
                            </label>
                            <label className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register("isResumeRequired")}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Resume is required
                                </span>
                            </label>
                            <label className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register("isCoverLetterRequired")}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Cover letter is required
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="automaticResponse"
                            className="text-xs font-bold text-gray-900"
                        >
                            Automatic Response Message
                        </label>
                        <textarea
                            id="automaticResponse"
                            {...register("automaticResponse")}
                            placeholder="Thanks for applying. We have received your application and our hiring team will review it shortly..."
                            className="w-full min-h-[120px] p-4 text-sm border border-gray-200 rounded-lg outline-none resize-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-400">
                            Optional. If included, it must be between 50 and 200 characters.
                        </p>
                        {errors.automaticResponse && (
                            <p className="text-xs text-red-600">{errors.automaticResponse.message}</p>
                        )}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={!organizationId || createJobMutation.isPending}
                        className="inline-flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-sm transition-colors disabled:opacity-60"
                    >
                        {createJobMutation.isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Posting...
                            </>
                        ) : (
                            <>
                                <BriefcaseBusiness className="h-4 w-4" />
                                Post Job
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push("/recruiter/dashboard")}
                        className="px-6 py-2.5 bg-white border border-red-200 text-red-500 font-bold text-sm rounded-lg hover:bg-red-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>

            <AIGenerateModal isOpen={showAIGenerate} onClose={() => setShowAIGenerate(false)} />
            <JobLiveModal
                isOpen={showJobLive}
                onClose={() => setShowJobLive(false)}
                jobTitle={liveJobTitle}
            />
            <DeadlineWarningModal
                isOpen={showDeadlineWarning}
                onClose={() => setShowDeadlineWarning(false)}
            />
        </>
    );
}
