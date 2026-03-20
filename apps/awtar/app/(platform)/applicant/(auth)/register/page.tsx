"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthSplitLayout } from "../../_components/AuthSplitLayout";
import { RegisterProgress } from "./_components/RegisterProgress";
import { Step1AccountDetails } from "./_components/Step1AccountDetails";
import { Step2ProfessionalInfo } from "./_components/Step2ProfessionalInfo";
import { Step3Interests } from "./_components/Step3Interests";

export interface RegisterFormData {
    fullName: string;
    email: string;
    jobTitle: string;
    experience: string;
    skills: string[];
    education: string;
    jobTypes: string[];
    minSalary: string;
    maxSalary: string;
    industries: string[];
    smartMatch: boolean;
}

export default function RegisterPage() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const router = useRouter();

    const [formData, setFormData] = useState<RegisterFormData>({
        fullName: "",
        email: "",
        jobTitle: "",
        experience: "",
        skills: ["UI/UX Design", "React.js", "Tailwind CSS"],
        education: "Master's Degree",
        jobTypes: ["Full-time", "Remote"],
        minSalary: "60,000",
        maxSalary: "120,000",
        industries: ["Technology", "Fintech"],
        smartMatch: true,
    });

    const handleComplete = () => {
        // Submit form data out to the backend in real app.
        console.log("Submitting:", formData);
        router.push("/applicant/login");
    };

    return (
        <AuthSplitLayout>
            <div className="flex-1 flex flex-col w-full max-w-lg mx-auto">
                <RegisterProgress currentStep={step} />

                <div className="mt-8 flex-1">
                    {step === 1 && (
                        <Step1AccountDetails
                            formData={formData}
                            setFormData={setFormData}
                            onNext={() => setStep(2)}
                        />
                    )}
                    {step === 2 && (
                        <Step2ProfessionalInfo
                            formData={formData}
                            setFormData={setFormData}
                            onNext={() => setStep(3)}
                            onBack={() => setStep(1)}
                        />
                    )}
                    {step === 3 && (
                        <Step3Interests
                            formData={formData}
                            setFormData={setFormData}
                            onBack={() => setStep(2)}
                            onSubmit={handleComplete}
                        />
                    )}
                </div>
            </div>
        </AuthSplitLayout>
    );
}
