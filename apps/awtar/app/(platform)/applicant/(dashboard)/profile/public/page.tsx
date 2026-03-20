import { ProfileHeader } from "./_components/ProfileHeader";
import {
    EducationList,
    ProfessionalSummary,
    TechnicalSkills,
    WorkExperience,
} from "./_components/ProfileSections";
import { AIMatchAnalysis, ContactInfoCard, TrustScoreWidget } from "./_components/ProfileSidebar";

export default function PublicProfilePage() {
    return (
        <div className="p-8 lg:p-10 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <ProfileHeader />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 flex flex-col gap-8">
                    <ProfessionalSummary />
                    <WorkExperience />
                    <TechnicalSkills />
                    <EducationList />
                </div>

                <div className="flex flex-col gap-8">
                    <TrustScoreWidget />
                    <AIMatchAnalysis />
                    <ContactInfoCard />
                </div>
            </div>
        </div>
    );
}
