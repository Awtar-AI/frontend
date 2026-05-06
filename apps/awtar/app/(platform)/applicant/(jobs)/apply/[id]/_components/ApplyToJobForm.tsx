"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Briefcase, Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { useAuthStore } from "@/lib/store/auth";
import { useApplyToJob } from "../../../applications/hooks/use-apply-to-job";
import {
    type ApplyFormInput,
    buildApplyFormSchema,
} from "../../../applications/schemas/apply-form.schema";
import {
    formatEmploymentTypeLabel,
    formatExperienceLevelLabel,
    formatPublicJobLocation,
    formatPublicJobSalary,
} from "../../../public-jobs/lib/format-job";
import type { PublicJob } from "../../../public-jobs/schemas/public-jobs.schema";

type Props = {
    job: PublicJob;
};

export function ApplyToJobForm({ job }: Props) {
    const role = useAuthStore((s) => s.role);
    const { data: user, isLoading: userLoading } = useCurrentUser();
    const applyMutation = useApplyToJob(job.id);

    const resumeUrl = user?.candidate_profile?.resume_url?.trim();
    const hasResume = Boolean(resumeUrl);

    const schema = useMemo(
        () => buildApplyFormSchema({ coverLetterRequired: job.is_cover_letter_required }),
        [job.is_cover_letter_required],
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ApplyFormInput>({
        resolver: zodResolver(schema),
        defaultValues: { cover_letter: "" },
    });

    const onSubmit = handleSubmit((data) => {
        if (job.is_resume_required && !hasResume) {
            return;
        }
        applyMutation.mutate({
            cover_letter: data.cover_letter?.trim() || undefined,
            resume_url: resumeUrl || undefined,
        });
    });

    if (role && role !== "candidate") {
        return (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 text-sm text-amber-900">
                Only accounts with the candidate role can apply to jobs. You are signed in as{" "}
                <span className="font-semibold">{role}</span>.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
            <div className="xl:col-span-8">
                <form
                    onSubmit={onSubmit}
                    className="bg-white rounded-[32px] p-8 lg:p-10 border border-gray-100 shadow-sm space-y-8"
                >
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            Apply for this role
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 font-medium">
                            Your profile data is sent with this application. Fields marked required
                            by the employer must be provided.
                        </p>
                    </div>

                    {job.is_resume_required && !userLoading && !hasResume && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                            This job requires a resume.{" "}
                            <Link
                                href="/applicant/profile/edit"
                                className="font-bold underline hover:text-red-900"
                            >
                                Upload a resume on your profile
                            </Link>{" "}
                            before applying.
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="cover_letter" className="text-sm font-black text-gray-900">
                            Cover letter
                            {job.is_cover_letter_required ? (
                                <span className="text-red-500"> *</span>
                            ) : (
                                <span className="text-gray-400 font-medium"> (optional)</span>
                            )}
                        </label>
                        <textarea
                            id="cover_letter"
                            rows={10}
                            {...register("cover_letter")}
                            placeholder="Introduce yourself and explain why you are a strong fit…"
                            className="w-full p-6 bg-white border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none hover:border-gray-200 transition-all font-medium text-sm text-gray-700 resize-y min-h-[200px]"
                        />
                        {errors.cover_letter && (
                            <p className="text-xs text-red-600">{errors.cover_letter.message}</p>
                        )}
                    </div>

                    {hasResume && (
                        <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-sm text-gray-700">
                            <span className="font-bold text-gray-900">Resume on file: </span>
                            <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 font-semibold underline break-all"
                            >
                                {resumeUrl}
                            </a>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-50">
                        <button
                            type="submit"
                            disabled={
                                applyMutation.isPending ||
                                userLoading ||
                                (job.is_resume_required && !hasResume)
                            }
                            className="px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-60"
                        >
                            {applyMutation.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Submitting…
                                </>
                            ) : (
                                "Submit application"
                            )}
                        </button>
                        <Link
                            href={`/applicant/jobs/${job.id}`}
                            className="text-sm font-bold text-gray-500 hover:text-gray-800"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>

            <div className="xl:col-span-4">
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden sticky top-8">
                    <div className="p-8 space-y-6">
                        <Link
                            href={`/applicant/jobs/${job.id}`}
                            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to job
                        </Link>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 leading-tight">
                                {job.title}
                            </h3>
                            <p className="text-sm font-bold text-gray-500 mt-2 flex items-center gap-2">
                                <Briefcase className="w-4 h-4" />
                                {formatEmploymentTypeLabel(job.employment_type)} ·{" "}
                                {formatExperienceLevelLabel(job)}
                            </p>
                        </div>
                        <div className="space-y-2 text-sm font-bold text-gray-600">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                {formatPublicJobLocation(job)}
                            </div>
                            <div>{formatPublicJobSalary(job)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
