"use client";

import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { ProfileHeader } from "./_components/ProfileHeader";
import {
    EducationSection,
    JobPreferences,
    ProfessionalSummary,
    TechnicalSkills,
    WorkExperience,
} from "./_components/ProfileSections";
import { ContactInfoCard, SmartMatchCard } from "./_components/ProfileSidebar";

function ProfileSkeleton() {
    return (
        <div className="p-8 lg:p-10 max-w-[1600px] mx-auto space-y-8 animate-pulse">
            <div className="bg-white rounded-[24px] h-48 border border-gray-100" />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                    <div className="bg-white rounded-[24px] h-40 border border-gray-100" />
                    <div className="bg-white rounded-[24px] h-40 border border-gray-100" />
                </div>
                <div className="space-y-8">
                    <div className="bg-white rounded-[24px] h-40 border border-gray-100" />
                </div>
            </div>
        </div>
    );
}

export default function PublicProfilePage() {
    const { data: user, isLoading } = useCurrentUser();

    if (isLoading || !user) return <ProfileSkeleton />;

    return (
        <div className="p-8 lg:p-10 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <ProfileHeader user={user} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 flex flex-col gap-8">
                    <ProfessionalSummary user={user} />
                    <WorkExperience />
                    <TechnicalSkills user={user} />
                    <EducationSection user={user} />
                    <JobPreferences user={user} />
                </div>

                <div className="flex flex-col gap-8">
                    <SmartMatchCard user={user} />
                    <ContactInfoCard user={user} />
                </div>
            </div>
        </div>
    );
}
