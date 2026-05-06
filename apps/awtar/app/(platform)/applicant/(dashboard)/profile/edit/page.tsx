"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { useUpdateCandidateProfile } from "../hooks/use-update-candidate-profile";
import { useUpdateUser } from "../hooks/use-update-user";
import { useUploadResume } from "../hooks/use-upload-resume";
import { BasicInfoForm } from "./_components/BasicInfoForm";
import { CandidateProfileForm } from "./_components/CandidateProfileForm";
import { ResumeUploadForm } from "./_components/ResumeUploadForm";

function EditSkeleton() {
    return (
        <div className="p-8 lg:p-10 max-w-4xl mx-auto space-y-8 animate-pulse">
            <div className="bg-white rounded-[24px] h-20 border border-gray-100" />
            <div className="bg-white rounded-[24px] h-64 border border-gray-100" />
            <div className="bg-white rounded-[24px] h-96 border border-gray-100" />
        </div>
    );
}

export default function EditProfilePage() {
    const { data: user, isLoading } = useCurrentUser();
    const basicInfo = useUpdateUser(user);
    const candidateProfile = useUpdateCandidateProfile(user);
    const resumeUpload = useUploadResume();

    if (isLoading || !user) return <EditSkeleton />;

    return (
        <div className="p-8 lg:p-10 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <Link
                        href="/applicant/profile/public"
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 mb-3"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to profile
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        Edit Profile
                    </h1>
                </div>
            </div>

            <BasicInfoForm
                form={basicInfo.form}
                onSubmit={basicInfo.submit}
                isPending={basicInfo.isPending}
            />

            <CandidateProfileForm
                form={candidateProfile.form}
                onSubmit={candidateProfile.submit}
                isPending={candidateProfile.isPending}
            />

            <ResumeUploadForm
                onUpload={resumeUpload.upload}
                isPending={resumeUpload.isPending}
                currentResumeUrl={user.candidate_profile?.resume_url || undefined}
            />
        </div>
    );
}
