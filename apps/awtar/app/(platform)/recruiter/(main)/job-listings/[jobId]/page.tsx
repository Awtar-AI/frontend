"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, ExternalLink, Loader2, MapPin, Pencil, Save, Users, X } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthOrganizationId } from "@/lib/hooks/use-auth";
import { postJobApi } from "../../post-job/api/post-job.api";
import {
    createJobFormSchema,
    type CreateJobFormData,
    toCreateJobPayload,
    type JobPostResponse,
} from "../../post-job/schemas/post-job.schema";
import { useRecruiterJobApplications } from "../hooks/use-recruiter-job-applications";
import { useUpdateRecruiterJob } from "../hooks/use-update-recruiter-job";

function toDateTimeLocalInput(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const h = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${y}-${m}-${d}T${h}:${min}`;
}

function toFormDefaults(job: JobPostResponse): CreateJobFormData {
    const experienceLevel = (job.expirence_level ?? job.experience_level ?? "mid") as CreateJobFormData["experienceLevel"];
    const employmentType = job.employment_type as CreateJobFormData["employmentType"];
    const salaryType = job.salary_type as CreateJobFormData["salaryType"];

    return {
        title: job.title,
        description: job.description,
        location: job.location ?? "",
        isRemote: Boolean(job.is_remote),
        employmentType,
        experienceLevel,
        salaryType,
        minSalary: job.min_salary ?? null,
        maxSalary: job.max_salary ?? null,
        currency: job.currency,
        deadline: toDateTimeLocalInput(job.deadline),
        isResumeRequired: job.is_resume_required,
        isCoverLetterRequired: job.is_cover_letter_required,
        automaticResponse: job.automatic_response ?? "",
    };
}

function formatDateLabel(value: string): string {
    try {
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(value));
    } catch {
        return value;
    }
}

export default function RecruiterJobDetailPage({
    params,
}: {
    params: Promise<{ jobId: string }>;
}) {
    const { jobId } = use(params);
    const organizationId = useAuthOrganizationId();
    const updateJobMutation = useUpdateRecruiterJob(jobId);
    const applicationsQuery = useRecruiterJobApplications(jobId, Boolean(organizationId));
    const [isEditOpen, setIsEditOpen] = useState(false);

    const jobQuery = useQuery({
        queryKey: ["recruiter", "jobs", "detail", jobId] as const,
        queryFn: () => postJobApi.getOne(jobId),
        enabled: Boolean(jobId && organizationId),
        staleTime: 30_000,
    });

    const {
        register,
        handleSubmit,
        reset,
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

    useEffect(() => {
        if (jobQuery.data) {
            reset(toFormDefaults(jobQuery.data));
        }
    }, [jobQuery.data, reset]);

    useEffect(() => {
        if (updateJobMutation.isSuccess) {
            setIsEditOpen(false);
        }
    }, [updateJobMutation.isSuccess]);

    const isRemote = watch("isRemote");
    const salaryType = watch("salaryType");

    if (!organizationId) {
        return (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Your session does not currently have an active organization. Please sign in again to
                manage this job.
            </div>
        );
    }

    if (jobQuery.isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh] text-gray-500 gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading job details...
            </div>
        );
    }

    if (jobQuery.isError || !jobQuery.data) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Could not load this job listing.
            </div>
        );
    }

    const onSubmit = handleSubmit((values) => {
        updateJobMutation.mutate(toCreateJobPayload(values));
    });

    return (
        <>
            <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Job Detail</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Review the applicants list, then open any submission detail.
                    </p>
                </div>
                <Link
                    href="/recruiter/job-listings"
                    className="text-sm font-semibold text-blue-600 hover:underline"
                >
                    Back to all listings
                </Link>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-gray-800">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        {jobQuery.data.title}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-gray-600">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {jobQuery.data.is_remote ? "Remote" : jobQuery.data.location || "On-site"}
                    </span>
                    <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            jobQuery.data.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {jobQuery.data.status}
                    </span>
                    <span className="text-xs text-gray-500">
                        Posted {formatDateLabel(jobQuery.data.created_at)}
                    </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsEditOpen(true)}
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit Job
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-12 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-base font-bold text-gray-900 mb-4 inline-flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-600" />
                        Applicants ({applicationsQuery.data?.length ?? 0})
                    </h2>
                    {applicationsQuery.isLoading && (
                        <div className="text-sm text-gray-500 inline-flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading applicants...
                        </div>
                    )}
                    {applicationsQuery.isError && (
                        <p className="text-sm text-red-600">
                            Could not load applicants for this job. If you saw 404 in network, this
                            specific job id may not exist on the backend you are connected to.
                        </p>
                    )}
                    {!applicationsQuery.isLoading &&
                        !applicationsQuery.isError &&
                        (applicationsQuery.data?.length ?? 0) === 0 && (
                            <p className="text-sm text-gray-500">No applicants yet.</p>
                        )}

                    {(applicationsQuery.data?.length ?? 0) > 0 && (
                        <div className="overflow-x-auto rounded-lg border border-gray-100">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Candidate</th>
                                        <th className="px-4 py-3 text-left">Email</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                        <th className="px-4 py-3 text-left">Submitted</th>
                                        <th className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {(applicationsQuery.data ?? []).map((application) => (
                                    <tr
                                        key={application.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                            {application.applicant_first_name} {application.applicant_last_name}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-600">
                                            {application.applicant_email}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-[11px] font-semibold text-blue-700">
                                                {application.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-[11px] text-gray-500">
                                            {formatDateLabel(application.created_at)}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={`/recruiter/job-listings/${jobId}/applications/${application.id}`}
                                                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                                            >
                                                Open detail
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            </div>

            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
                    <div className="w-full max-w-3xl rounded-xl border border-gray-200 bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                            <h2 className="text-base font-bold text-gray-900">Edit job post</h2>
                            <button
                                type="button"
                                onClick={() => setIsEditOpen(false)}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                                aria-label="Close edit modal"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <form
                            className="space-y-4 p-6 max-h-[75vh] overflow-y-auto"
                            onSubmit={onSubmit}
                        >
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-600">Title</label>
                                <input
                                    type="text"
                                    {...register("title")}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-600">Description</label>
                                <textarea
                                    rows={6}
                                    {...register("description")}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.description && (
                                    <p className="text-xs text-red-600">{errors.description.message}</p>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-600">Location</label>
                                    <input
                                        type="text"
                                        {...register("location")}
                                        disabled={isRemote}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                    />
                                    {errors.location && (
                                        <p className="text-xs text-red-600">{errors.location.message}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-600">Deadline</label>
                                    <input
                                        type="datetime-local"
                                        {...register("deadline")}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.deadline && (
                                        <p className="text-xs text-red-600">{errors.deadline.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-600">Salary Type</label>
                                    <select
                                        {...register("salaryType")}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="fixed">Fixed</option>
                                        <option value="range">Range</option>
                                        <option value="undisclosed">Undisclosed</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-600">Min Salary</label>
                                    <input
                                        type="number"
                                        {...register("minSalary", {
                                            setValueAs: (value) => (value === "" ? null : Number(value)),
                                        })}
                                        disabled={salaryType === "undisclosed"}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-600">Max Salary</label>
                                    <input
                                        type="number"
                                        {...register("maxSalary", {
                                            setValueAs: (value) => (value === "" ? null : Number(value)),
                                        })}
                                        disabled={salaryType !== "range"}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditOpen(false)}
                                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateJobMutation.isPending}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                                >
                                    {updateJobMutation.isPending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            Save changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
