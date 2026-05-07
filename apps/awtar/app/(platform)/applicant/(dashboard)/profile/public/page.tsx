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
        <div className="p-8 lg:p-10 max-w-[1600px] mx-auto space-y-6 animate-pulse">
            <div className="bg-white rounded-xl h-[220px] border border-gray-200" />
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-8 space-y-6">
                    <div className="bg-white rounded-xl h-36 border border-gray-200" />
                    <div className="bg-white rounded-xl h-36 border border-gray-200" />
                </div>
                <div className="xl:col-span-4 space-y-6">
                    <div className="bg-white rounded-xl h-44 border border-gray-200" />
                </div>
            </div>
        </div>
    );
}

export default function PublicProfilePage() {
    const { data: user, isLoading } = useCurrentUser();

    if (isLoading || !user) return <ProfileSkeleton />;

    return (
        <div className="p-8 lg:p-10 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
            <ProfileHeader user={user} />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-8 flex flex-col gap-6">
                    <ProfessionalSummary user={user} />
                    <WorkExperience />
                    <TechnicalSkills user={user} />
                    <EducationSection user={user} />
                    <JobPreferences user={user} />
                </div>

                <div className="xl:col-span-4 flex flex-col gap-6">
                    <SmartMatchCard user={user} />
                    <ContactInfoCard user={user} />
                </div>
            </div>
        </div>
    );
}
