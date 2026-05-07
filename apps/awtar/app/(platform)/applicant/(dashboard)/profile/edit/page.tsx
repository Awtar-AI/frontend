"use client";

import { ArrowLeft, Loader2, Save, User } from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "@/applicant/user-me/_components/UserAvatar";
import { normalizeError } from "@/lib/errors";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { toastService } from "@/lib/services/toast.service";
import { useUpdateCandidateProfile } from "../hooks/use-update-candidate-profile";
import { useUpdateUser } from "../hooks/use-update-user";
import { useUploadResume } from "../hooks/use-upload-resume";
import { BasicInfoForm } from "./_components/BasicInfoForm";
import { CandidateProfileForm } from "./_components/CandidateProfileForm";
import { ResumeUploadForm } from "./_components/ResumeUploadForm";

function EditSkeleton() {
    return (
        <div className="p-8 lg:p-10 max-w-[1600px] mx-auto space-y-6 animate-pulse">
            <div className="bg-white rounded-3xl h-28 border border-gray-100" />
            <div className="bg-white rounded-3xl h-64 border border-gray-100" />
            <div className="bg-white rounded-3xl h-[480px] border border-gray-100" />
            <div className="bg-white rounded-3xl h-52 border border-gray-100" />
        </div>
    );
}

export default function EditProfilePage() {
    const { data: user, isLoading } = useCurrentUser();
    const basicInfo = useUpdateUser(user);
    const candidateProfile = useUpdateCandidateProfile(user);
    const resumeUpload = useUploadResume();

    const isSaving = basicInfo.isPending || candidateProfile.isPending;

    if (isLoading || !user) return <EditSkeleton />;

    async function handleSaveAll() {
        try {
            await basicInfo.submit();
            await candidateProfile.submit();
            toastService.success("Profile saved successfully.");
        } catch (error) {
            toastService.error(normalizeError(error).message);
        }
    }

    return (
        <div className="p-8 lg:p-10 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 pb-28">
            {/* Page header card */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm">
                <div className="p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-white shadow-md">
                                <UserAvatar user={user} sizeClassName="w-full h-full text-xl" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center">
                                <User className="w-2.5 h-2.5 text-white" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Link
                                    href="/applicant/profile/public"
                                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
                                >
                                    <ArrowLeft className="w-3 h-3" /> Back to profile
                                </Link>
                            </div>
                            <h1 className="text-2xl font-black text-gray-950 tracking-tight">
                                {user.first_name} {user.last_name}
                            </h1>
                            <p className="text-xs font-medium text-slate-400 mt-0.5">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSaveAll}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black rounded-xl transition-all shadow-sm shadow-blue-200 disabled:opacity-60 shrink-0"
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {isSaving ? "Saving…" : "Save All Changes"}
                    </button>
                </div>
            </div>

            {/* Forms */}
            <BasicInfoForm form={basicInfo.form} onSubmit={basicInfo.submit} />
            <CandidateProfileForm form={candidateProfile.form} onSubmit={candidateProfile.submit} />
            <ResumeUploadForm
                onUpload={resumeUpload.upload}
                isPending={resumeUpload.isPending}
                currentResumeUrl={user.candidate_profile?.resume_url || undefined}
            />
        </div>
    );
}
