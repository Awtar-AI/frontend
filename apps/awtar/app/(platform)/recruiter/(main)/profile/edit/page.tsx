"use client";

import { ArrowLeft, Loader2, Save, Upload, User } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { UserAvatar } from "@/applicant/user-me/_components/UserAvatar";
import { BasicInfoForm } from "@/app/(platform)/applicant/(dashboard)/profile/edit/_components/BasicInfoForm";
import { useUpdateUser } from "@/app/(platform)/applicant/(dashboard)/profile/hooks/use-update-user";
import { useUploadProfilePic } from "@/app/(platform)/applicant/(dashboard)/profile/hooks/use-upload-profile-pic";
import { normalizeError } from "@/lib/errors";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { toastService } from "@/lib/services/toast.service";

function EditSkeleton() {
    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div className="h-28 animate-pulse rounded-3xl border border-gray-100 bg-white" />
            <div className="h-56 animate-pulse rounded-3xl border border-gray-100 bg-white" />
            <div className="h-64 animate-pulse rounded-3xl border border-gray-100 bg-white" />
        </div>
    );
}

export default function RecruiterEditProfilePage() {
    const { data: user, isLoading } = useCurrentUser();
    const basicInfo = useUpdateUser(user);
    const profilePic = useUploadProfilePic();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isSaving = basicInfo.isPending;

    if (isLoading || !user) return <EditSkeleton />;

    async function handleSave() {
        try {
            await basicInfo.submit();
            toastService.success("Profile updated successfully.");
        } catch (error) {
            toastService.error(normalizeError(error).message);
        }
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6 pb-20">
            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
                <div className="flex flex-col items-start justify-between gap-5 p-8 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="h-16 w-16 overflow-hidden rounded-2xl ring-4 ring-white shadow-md">
                                <UserAvatar user={user} sizeClassName="h-full w-full text-xl" />
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={profilePic.isPending}
                                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white"
                                aria-label="Upload profile picture"
                            >
                                {profilePic.isPending ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                    <Upload className="h-3 w-3" />
                                )}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                className="hidden"
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) profilePic.upload(file);
                                    event.target.value = "";
                                }}
                            />
                        </div>
                        <div>
                            <Link
                                href="/recruiter/profile"
                                className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 transition-colors hover:text-blue-600"
                            >
                                <ArrowLeft className="h-3 w-3" />
                                Back to profile
                            </Link>
                            <h1 className="mt-1 text-2xl font-black tracking-tight text-gray-950">
                                {user.first_name} {user.last_name}
                            </h1>
                            <p className="text-xs font-medium text-slate-400">{user.email}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-sm shadow-blue-200 transition-all hover:bg-blue-700 disabled:opacity-60"
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            <BasicInfoForm form={basicInfo.form} onSubmit={basicInfo.submit} />

            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50">
                        <User className="h-4 w-4 text-blue-600" />
                    </span>
                    <h3 className="text-base font-black tracking-tight text-gray-950">Profile Picture</h3>
                </div>
                <p className="text-sm text-gray-600">
                    Upload a clear PNG, JPG, or WebP image so your team can recognize you quickly.
                </p>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={profilePic.isPending}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 disabled:opacity-60"
                >
                    {profilePic.isPending ? (
                        <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="h-3.5 w-3.5" />
                            Upload New Photo
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
