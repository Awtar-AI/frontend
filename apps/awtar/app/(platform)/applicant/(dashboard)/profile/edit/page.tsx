"use client";

import { CheckCircle2, Sparkles, Upload } from "lucide-react";
import { useState } from "react";
import {
    EducationForm,
    ProfessionalExperienceForm,
    SkillsForm,
    VisibilityCard,
} from "./_components/ProfileFormSections";
import { ResumeModals } from "./_components/ResumeModals";

export default function EditProfilePage() {
    const [modalState, setModalState] = useState<"IDLE" | "PROCESSING" | "SUCCESS" | "FAILURE">(
        "IDLE",
    );

    const startParsing = () => {
        setModalState("PROCESSING");
        // Simulate delay
        setTimeout(() => {
            // 90% chance of success for better UX
            const isSuccess = Math.random() > 0.1;
            setModalState(isSuccess ? "SUCCESS" : "FAILURE");
        }, 4500);
    };

    return (
        <div className="p-8 lg:p-10 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
            {/* Page Header */}
            <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                        Edit Profile
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Enhance your profile with AI-driven insights to match better roles.
                    </p>
                </div>

                <div className="flex items-center gap-6 bg-blue-50/50 p-6 rounded-3xl border border-blue-100 shadow-inner">
                    <div className="relative w-16 h-16 rounded-full border-[6px] border-blue-600 flex items-center justify-center font-black text-blue-800 text-sm shadow-md bg-white">
                        80%
                    </div>
                    <div>
                        <h4 className="font-black text-gray-900 text-sm">Profile Completeness</h4>
                        <p className="text-xs font-bold text-gray-400 mt-0.5">
                            Add your certifications to reach 100%
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Left Column: Resume Upload & AI Insight */}
                <div className="xl:col-span-4 space-y-8">
                    {/* Resume Upload Card */}
                    <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm">
                        <h3 className="flex items-center gap-2 text-[16px] font-black text-gray-900 tracking-tight mb-6">
                            <Upload className="w-5 h-5 text-blue-600" /> Resume Upload
                        </h3>
                        <p className="text-xs text-gray-500 font-bold mb-6 leading-relaxed">
                            Our AI will automatically parse your experience and update your profile
                            below.
                        </p>

                        <button
                            type="button"
                            className="w-full border-2 border-dashed border-gray-200 rounded-[20px] p-10 flex flex-col items-center justify-center text-center group hover:border-blue-400 hover:bg-blue-50/20 transition-all cursor-pointer"
                            onClick={startParsing}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    startParsing();
                                }
                            }}
                        >
                            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                                <Upload className="w-6 h-6" />
                            </div>
                            <p className="text-[15px] font-black text-gray-900 mb-1">
                                Drop your resume here
                            </p>
                            <p className="text-[11px] font-bold text-gray-400">
                                PDF or DOCX (Max 10MB)
                            </p>

                            <span className="mt-8 px-8 py-3 bg-white border-2 border-gray-100 group-hover:border-gray-900 text-gray-900 font-black text-sm rounded-xl transition-all shadow-sm inline-block">
                                Browse Files
                            </span>
                        </button>

                        <div className="mt-8 p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span className="text-[11px] font-bold text-green-800 uppercase tracking-wide">
                                Last parsed: Resume_JohnDoe_2024.pdf
                            </span>
                        </div>
                    </div>

                    {/* AI Insight Card */}
                    <div className="bg-blue-50/30 rounded-[24px] p-8 border border-blue-100 shadow-sm">
                        <h3 className="flex items-center gap-2 text-[14px] font-black text-blue-900 tracking-tight mb-4">
                            <Sparkles className="w-4 h-4" /> AI Insight
                        </h3>
                        <p className="text-[13px] font-medium text-blue-800 leading-relaxed mb-1">
                            Candidates with complete "Education" details are 4x more likely to be
                            shortlisted by Awtar's matching algorithm.
                        </p>
                    </div>
                </div>

                {/* Right Column: Forms */}
                <div className="xl:col-span-8 flex flex-col gap-8">
                    <ProfessionalExperienceForm />
                    <EducationForm />
                    <SkillsForm />
                </div>
            </div>

            {/* Visibility Toggle Card */}
            <VisibilityCard />

            {/* Modals Simulation */}
            <ResumeModals
                state={modalState}
                onClose={() => setModalState("IDLE")}
                onTryAgain={() => startParsing()}
                onReview={() => setModalState("IDLE")}
            />
        </div>
    );
}
